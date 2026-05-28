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

alter table public.articles add column if not exists seo_title text;
alter table public.articles add column if not exists seo_description text;
alter table public.articles add column if not exists is_featured boolean default false;
alter table public.articles add column if not exists is_trending boolean default false;
alter table public.articles add column if not exists show_on_homepage boolean default false;
alter table public.articles add column if not exists homepage_priority integer default 100;
alter table public.articles add column if not exists homepage_placement text default 'none';
alter table public.articles add column if not exists scheduled_at timestamptz;
alter table public.articles add column if not exists cover_alt text;
alter table public.articles add column if not exists reading_time integer;
alter table public.articles add column if not exists editor_note text;
alter table public.articles drop constraint if exists articles_homepage_placement_check;
alter table public.articles
  add constraint articles_homepage_placement_check
  check (homepage_placement in ('none', 'lead', 'top_story', 'latest', 'trending', 'editor_pick'));

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

insert into storage.buckets (id, name, public)
values ('article-covers', 'article-covers', true)
on conflict (id) do update
set public = excluded.public;

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

drop policy if exists "profiles readable by authenticated users" on public.profiles;
create policy "profiles readable by authenticated users"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "users manage own profile" on public.profiles;
create policy "users manage own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "published articles are public" on public.articles;
create policy "published articles are public"
on public.articles
for select
to anon, authenticated
using (
  (
    status = 'published'
    and (scheduled_at is null or scheduled_at <= now())
  )
  or (
    auth.uid() is not null
    and (
      public.current_profile_role() in ('admin', 'editor')
      or author_id = auth.uid()
      or (status = 'draft' and public.current_profile_role() = 'author')
    )
  )
);

drop policy if exists "authenticated users can create articles" on public.articles;
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

drop policy if exists "authors update own articles and editors manage all" on public.articles;
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

drop policy if exists "authors delete own articles and editors manage all" on public.articles;
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

drop policy if exists "newsletter insert is public" on public.newsletter_subscribers;
create policy "newsletter insert is public"
on public.newsletter_subscribers
for insert
to anon, authenticated
with check (email is not null);

drop policy if exists "newsletter read is admin editor only" on public.newsletter_subscribers;
create policy "newsletter read is admin editor only"
on public.newsletter_subscribers
for select
to authenticated
using (public.current_profile_role() in ('admin', 'editor'));

drop policy if exists "article cover images are public" on storage.objects;
create policy "article cover images are public"
on storage.objects
for select
to public
using (bucket_id = 'article-covers');

drop policy if exists "authenticated newsroom users upload article covers" on storage.objects;
create policy "authenticated newsroom users upload article covers"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'article-covers'
  and auth.uid() is not null
  and public.current_profile_role() in ('admin', 'editor', 'author')
);

drop policy if exists "owners and editors update article covers" on storage.objects;
create policy "owners and editors update article covers"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'article-covers'
  and (
    owner = auth.uid()
    or public.current_profile_role() in ('admin', 'editor')
  )
)
with check (
  bucket_id = 'article-covers'
  and (
    owner = auth.uid()
    or public.current_profile_role() in ('admin', 'editor')
  )
);

drop policy if exists "owners and editors delete article covers" on storage.objects;
create policy "owners and editors delete article covers"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'article-covers'
  and (
    owner = auth.uid()
    or public.current_profile_role() in ('admin', 'editor')
  )
);

-- Re-run this schema after pulling CMS updates to add new article columns and storage policies.
-- Public reads only return published rows that are scheduled for now or earlier.
