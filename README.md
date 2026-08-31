# Looped Presentation Systems — V7

V7 keeps the three recurring presentation formats from V6 and adds a shared Supabase-backed content state so Sam / the team do not have to remember which episodes were already recorded or which wording was edited on another device.

## Shared backend state

When a user is signed in, these items sync across devices:

- **Operator Call** recorded / unrecorded library status
- **Operator Call** per-case copy overrides
- **Patient Journey Replay** recorded / unrecorded library status
- **Patient Journey Replay** per-journey copy overrides
- **Clinic Signal** copy overrides shared across all four visual interfaces

The tools retain local browser storage as a fallback. If the backend is not configured, Supabase is temporarily unavailable, or the user is signed out, the presentations still run normally.

See `BACKEND_SETUP.md` and `supabase/schema.sql` for the one-time setup.

## Authentication

V7 uses Supabase email magic-link authentication. The recommended internal setup is invite-only: disable open signups and invite only Sam / internal users.

The frontend uses only the browser-safe Supabase publishable/anon key. Never expose a `service_role` key in this repository.

## 1. Clinic Signal

One shared retention-lift presentation engine with four switchable visual interfaces:

- Signal Room
- Founder Board
- Field Notes
- Diagnostic Scan

The inputs, calculations, beat sequence, and takeaway remain identical while the interface changes. Sam can press 1–4 or C during presentation to change the visual treatment without changing the story.

9:16 is a true vertical composition. Typography, graphics, patient tokens, metric cards, bars, and spacing use the 9:16 stage width rather than the browser viewport.

## 2. Patient Journey Replay

Recurring journey-story format: baseline journey → break → replay → patient-facing view → operator takeaway.

### Preloaded library: 13 journeys

- Treatment → Rebook
- Lead → Consult
- Booking → Arrival
- Treatment → Aftercare
- Consult → Treatment Decision
- Treatment Series → Completion
- First Visit → Second Visit
- Lapsed → Reactivated
- No-show → Recovered
- Treatment A → Relevant Treatment B
- Membership → Continued Value
- Great Result → Referral
- Great Experience → Review

The sidebar supports category filtering, Next Unused, Mark Recorded, and per-slide copy editing. When signed in, status and copy edits are shared through Supabase.

## 3. The Operator Call

Recurring founder/operator decision format: scenario → facts → A/B/C decision → Sam's call → reasoning → operator principle / optional product bridge.

### Preloaded library: 14 cases

Cases span acquisition, conversion, retention, reactivation, capacity, patient growth, advocacy, and operational problems. Product bridges are intentionally omitted where a Looped connection would feel forced.

The sidebar supports category filtering, Next Unused, Mark Recorded, A/B/C interaction, and per-slide copy editing. When signed in, status and copy edits are shared through Supabase.

## Controls

- Right arrow / Space: next beat
- Left arrow: previous beat
- Escape: leave presentation
- Clinic Signal: 1–4 switch styles; C cycles styles
- Operator Call decision beat: A/B/C selects the answer

All three support Studio → Presentation → Fullscreen and 16:9 / 9:16 / 1:1.

## Hosting

The project still deploys as a static Vercel site. No npm build step is required. The shared database lives in Supabase and is accessed from the browser using authenticated Row Level Security.
