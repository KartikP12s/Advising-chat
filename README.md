# Common Ground

> Real conversations first. Shared wisdom second.

Common Ground is a polished, consent-first prototype for anonymous peer advising. A seeker describes what they need, a transparent local matcher finds a relevant peer, the pair have a private text conversation, and both privately evaluate its value. A conversation can move toward a reusable educational asset only after independent, purpose-specific consent and approval of the same sanitized version.

The repository is intentionally runnable without a database, paid infrastructure, or provider key. All prototype data is seeded, matching and sanitization are deterministic, realtime behavior is simulated in the browser, and the media preview is explicitly a storyboard—not a fake integration.

## What works

- Premium responsive landing page with interactive conversation preview and trust loop
- Anonymous seeker and advisor onboarding with session aliases
- Validated `/api/match` endpoint and documented transparent scoring
- Simulated private chat with sending, replies, typing, delivery state, reactions, helpful markers, reporting, blocking, reconnect states, and staged session progress
- Five-step private reflection with sealed responses
- Neutral decline path and mutual value/opt-in gate
- Versioned transformation consent with source scope, AI boundary, comprehension check, and equal-weight accept/decline choices
- Local rules-based sanitization for names, email, phone, usernames, addresses, organizations, account numbers, and possible indirect identifiers
- Additional participant redaction, new-version creation, and approval invalidation
- Exact-version mutual approval and a reversible content-candidate workflow
- Media storyboard, cost assumptions, candidate queue, privacy review queue, and operations dashboard
- Light/dark themes, reduced-motion handling, keyboard focus, semantic forms, and mobile layouts

## Zero-cost local setup

Requirements:

- Node.js 20.9 or newer (Node 24 is recorded in `.nvmrc`)
- npm 11+
- Python 3 only if you want the requested local virtual environment; no Python packages are required

```bash
git clone <your-repository-url>
cd Advising-chat

# Create and activate the requested local environment
python3 -m venv .venv
source .venv/bin/activate

# Create local configuration (contains no secrets by default)
cp .env.example .env.local

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The checked-out workspace already has `.venv` and `.env.local` created. Shell activation cannot persist across separate terminal processes, so run `source .venv/bin/activate` in each terminal where you want the prompt activated.

### Cost guarantee for the default prototype

The default application makes no calls to Supabase, OpenAI, email, video, audio, storage, or realtime vendors. Running it locally costs **$0** aside from your own machine and internet connection. Optional provider variables are blank and no code path requires them.

For a personal/non-commercial online demo, Vercel currently lists a $0 Hobby tier with usage caps. Confirm plan eligibility before deploying a business or commercial pilot. The app can always be demonstrated locally at no cost.

## Commands

```bash
npm run dev        # development server
npm run build      # production build
npm start          # serve the production build
npm run lint       # ESLint
npm run typecheck  # strict TypeScript
npm test           # Vitest unit and component tests
npm run test:e2e   # Playwright desktop + mobile flows using installed Chrome
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page, trust loop, topics, mutual-consent explanation |
| `/journey` | Complete seeker prototype journey |
| `/journey?role=advisor` | Advisor onboarding variant |
| `/journey?topic=caregiving` | Topic-prefilled onboarding |
| `/research` | Internal research, cost, safety, and content-operations dashboard |
| `/privacy` | Exact protections, remaining risks, data separation, access model |
| `/api/health` | Local health and provider-cost state |
| `/api/match` | Validated deterministic match scoring |

## Architecture at a glance

```text
Next.js App Router
├── Server-rendered pages and route handlers
├── Client interaction islands
│   ├── onboarding → matching → chat → reflection
│   └── consent → sanitization → candidate → withdrawal
├── Replaceable provider interfaces
│   ├── MatchingProvider
│   ├── MessageTransport
│   ├── SanitizationProvider
│   └── MediaProductionProvider (estimate only)
└── Seeded local services
    ├── deterministic scoring
    ├── deterministic privacy rules
    └── editable cost projection
```

The canonical typed model is in [`src/lib/domain.ts`](src/lib/domain.ts). Matching, sanitization, and costs live in independent pure modules with tests. Production provider integrations should remain behind the interfaces in [`src/lib/providers.ts`](src/lib/providers.ts).

## Privacy position

Common Ground does **not** claim absolute anonymity. Session aliases reduce casual identity exposure, but network/device metadata, writing style, rare life events, participant screenshots, and copied public assets remain risks. Production requires encrypted persistence, server-side authorization, row-level access controls, abuse prevention, reason-coded exceptional safety access, retention jobs, deletion/export workflows, and audited consent history.

Peer advisors are not automatically licensed professionals. The interface clearly states that peer guidance is not a substitute for professional medical, legal, mental-health, or financial advice.

## Documentation

- [Product scope](docs/product-scope.md)
- [User flows](docs/user-flows.md)
- [Architecture](docs/architecture.md)
- [Data model and lifecycle](docs/data-model.md)
- [Privacy and threat model](docs/privacy-and-threat-model.md)
- [Consent model](docs/consent-model.md)
- [Design research](docs/design-research.md)
- [Infrastructure costs](docs/infrastructure-costs.md)
- [Media feasibility](docs/media-feasibility.md)
- [Manual pilot playbook](docs/manual-pilot-playbook.md)
- [Future roadmap](docs/future-roadmap.md)
- [Testing and verification](docs/testing.md)

## Current verification

Validated on July 14, 2026 with Node 24.1.0:

- ESLint: pass, zero warnings
- Strict TypeScript: pass
- Vitest: 8/8 tests pass
- Next.js production build: pass
- Playwright: 12 pass, 6 intentional project-specific skips; complete consent, redaction, exact-version approval, candidate, and withdrawal flow runs on desktop and mobile Chrome profiles
- Visual checks: landing, chat, reflection, and research dashboard captured at desktop and mobile widths with no Next.js error overlay
- `npm audit`: 0 known vulnerabilities after a patched PostCSS override

## Known prototype limits

- State resets on refresh and is not shared between two real devices.
- Chat replies, presence, advisor decisions, and the second participant’s approvals are simulated.
- Authentication, database persistence, encryption at rest, rate limiting, moderation, and notification delivery are documented boundaries, not production integrations.
- Sanitization is useful for interaction testing but cannot guarantee de-identification.
- The admin route is visibly marked as an authorization preview; it is not a real security boundary.
- No audio/video recording or media generation is implemented.

## Recommended next experiment

Run five moderated text sessions with real consenting pilot participants. Measure match acceptance, session completion, mutual value, review time, redaction categories, revision cycles, and whether participants understand the distinction between transformation consent and publication approval. Do not buy an avatar/video platform before this manual evidence exists.

## License

MIT — see [LICENSE](LICENSE).
