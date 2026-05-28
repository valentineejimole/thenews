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

## Schema updates and storage

- The schema file is additive. Re-run [supabase/schema.sql](./supabase/schema.sql) after pulling CMS updates to add the richer article metadata fields and refresh RLS/storage policies.
- The schema also provisions a public Supabase Storage bucket named `article-covers`.
- If you prefer to create the bucket manually in the Supabase dashboard, use:
  - Bucket name: `article-covers`
  - Public bucket: enabled
- Cover uploads in the CMS use the authenticated user session and store the returned public URL in `articles.cover_image_url`.

The `public.articles` table now persists:

- `seo_title`
- `seo_description`
- `is_featured`
- `is_trending`
- `scheduled_at`
- `cover_alt`
- `reading_time`
- `editor_note`

## Admin publishing

- Visit `/admin/login`
- Sign in with a Supabase Auth email/password user
- Open `/admin/dashboard`
- Create a draft at `/admin/articles/new`
- Publish it by setting status to `published`
- Upload a cover image to the `article-covers` bucket or paste a direct image URL
- Use the scheduler to hold a published story until `scheduled_at`
- Mark stories as featured or trending to influence the homepage lead modules and sidebar

Published articles appear on the public site automatically once they are both:

- `status = published`
- `scheduled_at` is empty or in the past

If the `articles` table has no published rows yet, the site falls back to the bundled mock editorial dataset so the homepage and desk pages stay populated.

## Publishing flow

- `is_featured` prioritizes articles for the homepage lead/editorial modules.
- `is_trending` boosts stories in trending lists and newsroom priority ordering.
- `scheduled_at` lets an article remain hidden publicly until the scheduled time arrives.
- `seo_title` and `seo_description` are used on article metadata when present.
- `cover_alt` overrides the image alt text for public article rendering.
- `reading_time` overrides the automatic read-time estimate when provided.
- `editor_note` is stored for newsroom workflow context inside the CMS.

## Newsletter

Newsletter signups post to `/api/newsletter` and insert into `public.newsletter_subscribers`. Duplicate emails are handled by the table unique constraint and surfaced as a friendly API response.

## Notes

- Admin protection uses Supabase SSR cookies and middleware on `/admin/*`.
- Public article reads query only published rows that are ready to go live.
- Cover uploads use Supabase Storage and do not require any service role key in the browser.
