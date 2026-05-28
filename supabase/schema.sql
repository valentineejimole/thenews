create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text default 'author',
  full_name text,
  created_at timestamptz default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null,
  excerpt text,
  cover_image_url text,
  content text not null,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
before update on public.articles
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.newsletter_subscribers enable row level security;

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create policy "profiles readable by authenticated users"
on public.profiles
for select
to authenticated
using (true);

create policy "users manage own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "published articles are public"
on public.articles
for select
to anon, authenticated
using (
  status = 'published'
  or (
    auth.uid() is not null
    and (
      public.current_profile_role() in ('admin', 'editor')
      or author_id = auth.uid()
      or (status = 'draft' and public.current_profile_role() = 'author')
    )
  )
);

create policy "authenticated users can create articles"
on public.articles
for insert
to authenticated
with check (
  auth.uid() is not null
  and (
    public.current_profile_role() in ('admin', 'editor', 'author')
  )
  and (author_id = auth.uid() or public.current_profile_role() in ('admin', 'editor'))
);

create policy "authors update own articles and editors manage all"
on public.articles
for update
to authenticated
using (
  auth.uid() is not null
  and (
    public.current_profile_role() in ('admin', 'editor')
    or author_id = auth.uid()
  )
)
with check (
  auth.uid() is not null
  and (
    public.current_profile_role() in ('admin', 'editor')
    or author_id = auth.uid()
  )
);

create policy "authors delete own articles and editors manage all"
on public.articles
for delete
to authenticated
using (
  auth.uid() is not null
  and (
    public.current_profile_role() in ('admin', 'editor')
    or author_id = auth.uid()
  )
);

create policy "newsletter insert is public"
on public.newsletter_subscribers
for insert
to anon, authenticated
with check (email is not null);

create policy "newsletter read is admin editor only"
on public.newsletter_subscribers
for select
to authenticated
using (public.current_profile_role() in ('admin', 'editor'));

-- TODO: add additional policies for moderation workflows, image storage access,
-- and richer author role separation if the newsroom expands beyond the initial admin/editor/author roles.
