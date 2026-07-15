# Architecture

## Prototype stack

- Next.js 16 App Router, React 19, strict TypeScript
- Tailwind CSS 4 processing plus a tokenized custom accessible component system
- Zod validation for the match API
- React Hook Form for onboarding
- Lucide icons; CSS-only abstract avatars and motion
- Vitest, Testing Library, and Playwright
- Seeded in-memory state; no required external service

## Runtime boundaries

| Boundary | Prototype | Replaceable production path |
| --- | --- | --- |
| Identity | Generated local alias | Anonymous Supabase/Auth.js session plus separate internal subject |
| Matching | Deterministic pure function | Queue worker/service implementing `MatchingProvider` |
| Messaging | Browser simulation | Private Supabase Realtime broadcast/channel or WebSocket service |
| Persistence | Seed objects and React state | PostgreSQL with row-level security and encrypted sensitive fields |
| Sanitization | Local deterministic rules | Local/private model plus human review behind `SanitizationProvider` |
| Media | Static animated storyboard | Human editor first; vendor only receives approved sanitized script |
| Analytics | Seeded aggregates | Event pipeline that excludes message bodies |

## Code map

```text
src/app/
  api/health, api/match   Route handlers
  journey/                Complete interactive state machine
  privacy/                Protection and risk disclosure
  research/               Internal operations prototype
src/components/
  journey/                One component per major journey stage
  research-dashboard.tsx  Scenario modeling and operations queue
src/data/seed.ts          Realistic, explicitly synthetic scenarios
src/lib/
  domain.ts               Canonical typed domain model
  matching.ts             Validated transparent scoring
  sanitization.ts         Local privacy detectors/replacements
  costs.ts                Editable scenario projection
  providers.ts            Integration interfaces and local policy
```

## Production reference architecture

```text
Browser
  │ TLS
  ▼
Next.js application / API
  ├── server-side session authorization
  ├── rate limit + bot protection
  ├── matching service
  ├── private realtime channel authorization
  └── consent/version commands
          │
          ▼
PostgreSQL
  ├── identity/auth schema
  ├── anonymous product schema
  ├── private conversation schema
  ├── consent + audit append-only events
  └── sanitized content schema (no raw FK access for content role)

Separate workers
  ├── retention/deletion jobs
  ├── safety triage hooks
  └── sanitization workspace → human/participant review
```

## Key invariants

- Server routes re-check authorization; proxy/middleware is never the sole gate.
- A participant can read only conversations in which their internal subject participates.
- Content reviewers cannot join private-conversation tables by default.
- Publication approval references `sanitized_content_version.id`, not `conversation.id`.
- Updating sanitized content creates a new immutable version and invalidates older active approvals.
- Withdrawal is an append-only event that immediately blocks forward state changes.
- Analytics events store lifecycle IDs and classifications, not message bodies.
- External media providers receive only an approved sanitized script and synthetic/representative assets.

## Realtime production sketch

1. Authenticate an anonymous internal subject server-side.
2. Issue a short-lived token scoped to `conversation:{id}` after participant authorization.
3. Use a private channel for message broadcast and presence.
4. Persist messages through an authorized server command; never trust channel identity alone.
5. Retry with idempotency keys; show local sending/failed state.
6. Apply payload limits, per-subject rate limits, and abuse heuristics.

Supabase currently documents 200 peak realtime connections and 2 million messages on its Free plan. Those limits are useful for a small pilot but are not architecture guarantees; see the cost document for dated sources.

## Deployment

The prototype builds as a normal Next.js application. Local production verification:

```bash
npm run build
npm start
```

Online deployment can use any Next.js-compatible host. Vercel Hobby is a convenient $0 option for an eligible personal/non-commercial demo. Production pilots should select a plan based on commercial terms, security controls, log retention, and budget protection—not just headline price.
