# PlotWorthy

Evidence-led UK property feasibility and a professional marketplace foundation.

This rebuild replaces the original static prototype with a Next.js App Router application. The previous site is preserved in [`legacy-static/`](./legacy-static/) for reference.

## What is included

- Responsive, accessible marketing site using the existing PlotWorthy brand direction
- A two-step property feasibility journey with labelled inputs and clear evidence states
- Server-side UK postcode verification through postcodes.io
- Honest preliminary results: verified, indicative and unknown evidence are separated
- Passwordless Supabase email sign-in and callback routes
- Supabase-ready dashboard, professional network, guides and legal pages
- Dynamic sitemap, robots and web manifest
- Security headers and a Supabase session-refresh proxy
- A reviewed-but-not-applied migration for geospatial HMO evidence, saved feasibility requests and professional applications

## Local development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The public pages and preliminary checker UI build without Supabase environment variables. Sign-in and account-backed features need:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Use a Supabase publishable key, not a service-role secret. Configure the production site URL and allowed redirect URLs in Supabase Auth before testing email links.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Data model

The existing PlotWorthy Supabase project already contains profiles, properties, planning applications, HMO records, precedents, professional profiles, report runs, saved properties, alerts, leads and live-data cache tables.

The migration in [`supabase/migrations/`](./supabase/migrations/) extends that model. It is intentionally not applied automatically. Review it against the live schema, take a backup and approve a production release before running it.

Key safeguards in the migration:

- PostGIS geography points and a GiST index for real radius searches
- Source URL, source date and verification fields for HMO evidence
- Explicit grants instead of relying on automatic Data API exposure
- Row-level security policies scoped to `authenticated`
- Indexed ownership columns and `(select auth.uid())` policies

## Production checklist

1. Add the Vercel environment variables for Preview and Production.
2. Configure Supabase Auth site URL, redirect URLs and custom SMTP.
3. Review and apply the database migration separately.
4. Connect council planning, Article 4, HMO register and constraints ingestion with source dates.
5. Run an end-to-end check in a Vercel preview before promoting it.
6. Review the commercial terms, privacy notice and professional verification wording before accepting payments or claiming profiles are vetted.

No migration, commit, push or deployment is performed by this working copy.
