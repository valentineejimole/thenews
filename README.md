# NewsPressal

NewsPressal is a Next.js newsroom prototype with a public editorial site, a protected Supabase-backed admin publishing area, and a newsletter signup flow.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres

## Environment

Create `.env.local` from `.env.local.example` and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Do not expose a service role key in the browser. This app uses the public anon key with Supabase Auth, SSR cookies, and RLS policies.

## Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run [supabase/schema.sql](./supabase/schema.sql).
3. In Supabase Auth, create the first user with email/password.
4. Promote that user to admin with SQL like:

```sql
update public.profiles
set role = 'admin', full_name = 'Your Name'
where email = 'editor@newspressal.example';
```

5. Install dependencies and start the app:

```bash
npm install
npm run dev
```

## Admin publishing

- Visit `/admin/login`
- Sign in with a Supabase Auth email/password user
- Open `/admin/dashboard`
- Create a draft at `/admin/articles/new`
- Publish it by setting status to `published`

Published articles appear on the public site automatically. If the `articles` table has no published rows yet, the site falls back to the bundled mock editorial dataset so the homepage and desk pages stay populated.

## Newsletter

Newsletter signups post to `/api/newsletter` and insert into `public.newsletter_subscribers`. Duplicate emails are handled by the table unique constraint and surfaced as a friendly API response.

## Notes

- Admin protection uses Supabase SSR cookies and middleware on `/admin/*`.
- Public article reads query only published rows.
- The admin editor includes TODO markers for future Supabase Storage uploads and richer workflow states.
