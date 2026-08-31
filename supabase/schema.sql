-- Looped Presentation Systems shared state
-- Run this in Supabase SQL Editor.

create table if not exists public.presentation_state (
  workspace_id text not null,
  namespace text not null,
  state_key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid null references auth.users(id) on delete set null,
  primary key (workspace_id, namespace, state_key)
);

alter table public.presentation_state enable row level security;

-- Only authenticated users should touch this internal content workspace.
revoke all on table public.presentation_state from anon, authenticated;
grant select, insert, update, delete on table public.presentation_state to authenticated;

-- This project is intended to be invite-only. If you later host multiple
-- organizations in one Supabase project, replace these policies with a
-- workspace_members table and membership checks.
drop policy if exists "presentation_state_select_authenticated" on public.presentation_state;
create policy "presentation_state_select_authenticated"
on public.presentation_state for select
to authenticated
using (true);

drop policy if exists "presentation_state_insert_authenticated" on public.presentation_state;
create policy "presentation_state_insert_authenticated"
on public.presentation_state for insert
to authenticated
with check ((select auth.uid()) is not null);

drop policy if exists "presentation_state_update_authenticated" on public.presentation_state;
create policy "presentation_state_update_authenticated"
on public.presentation_state for update
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

drop policy if exists "presentation_state_delete_authenticated" on public.presentation_state;
create policy "presentation_state_delete_authenticated"
on public.presentation_state for delete
to authenticated
using ((select auth.uid()) is not null);
