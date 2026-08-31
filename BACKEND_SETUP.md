# Shared Backend Setup — Supabase

V7 keeps the presentation site static, but moves durable content state into Supabase when a user is signed in.

## What syncs

- Operator Call recorded/unrecorded status
- Operator Call copy overrides
- Patient Journey Replay recorded/unrecorded status
- Patient Journey Replay copy overrides
- Clinic Signal copy overrides

If Supabase is unavailable or the user is signed out, the tools continue to use local browser storage as a fallback.

## 1. Create a Supabase project

Create a project in Supabase.

For this internal tool, the cleanest setup is **invite-only authentication**:

1. Disable open user signups in Supabase Auth settings.
2. Invite only the people who should use the content system (for example, Sam and the internal team).
3. Enable email magic-link authentication.

## 2. Create the shared state table

Open Supabase → SQL Editor and run:

`supabase/schema.sql`

The table is protected by Row Level Security and only the `authenticated` role receives CRUD grants.

## 3. Configure browser-safe credentials

Open `backend-config.js` and replace:

- `https://YOUR_PROJECT.supabase.co`
- `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY`

Use Supabase's browser-safe **publishable/anon key**. Never paste the `service_role` key into a frontend file.

The default workspace is:

`looped-content-studio`

You can change that value if desired.

## 4. Add allowed redirect URLs

In Supabase Auth URL configuration, add the deployed Vercel domain, for example:

`https://your-project.vercel.app/**`

Also set the Site URL to the production Vercel URL once known.

## 5. Deploy

The project remains a static site. Push the V7 folder contents to GitHub and import the repo into Vercel. There is no npm build step required.

## How it behaves

- Signed out / backend not configured: local browser storage only.
- Signed in: shared Supabase state becomes the source of truth.
- If an authenticated user has local state but no shared row exists yet, V7 migrates that local state into Supabase automatically on first load.
- Copy saves are debounced so typing does not fire a database write on every keystroke.

## Security note

The included policies allow any authenticated user in this Supabase project to access this one shared workspace. That is appropriate for a small invite-only internal project. If the Supabase project later serves multiple organizations, replace the simple authenticated policies with explicit workspace membership policies.
