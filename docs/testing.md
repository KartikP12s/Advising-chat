# Testing and verification

## Local checks

Activate the requested Python environment if desired, then install JavaScript dependencies:

```bash
source .venv/bin/activate
npm install
```

Run the deterministic checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Run browser tests with a locally installed Chrome:

```bash
npm run test:e2e
```

Playwright starts its own development server using `playwright.config.ts`. Screenshots and traces created by failed tests stay under `test-results/`, which is ignored by Git.

## Covered behaviors

- Deterministic matching gates, ranking, and understandable reasons.
- Identifier sanitization and possible indirect-identifier flags.
- Cost projections, including a genuinely zero-provider baseline.
- Interactive landing preview behavior.
- Seeker onboarding through chat and sealed reflection at desktop and mobile widths.
- Full mutual-consent path through additional redaction, exact-version reapproval, candidate creation, and withdrawal.
- Neutral private/decline path.
- Advisor onboarding/match variant.
- Report and block controls.
- Research dashboard controls and local candidate-operation recording.
- Landing/research visual smoke checks with framework-overlay detection.

## Manual accessibility pass

Before a pilot, test the complete journey using only a keyboard, VoiceOver and NVDA (or equivalent), 200% zoom, reduced motion, dark/light color schemes, forced colors, and common mobile screen sizes. Verify focus entry/return for dialogs, live announcements without repetition, descriptive control names, chart/table alternatives, text resizing, touch target size, and error recovery.

Automated tests and semantic code review reduce regressions but do not establish WCAG conformance. Test with disabled participants and include accessibility issues in the pilot stop/repair process.

## Production test additions

- Database row-level authorization and cross-user negative tests.
- Realtime channel membership, token expiry, reconnect/idempotency, and load tests.
- Consent state-machine/property tests and immutable-version database constraints.
- Retention, export, deletion, withdrawal, backup, and vendor takedown integration tests.
- Rate-limit, spam, harassment, high-risk escalation, and audited break-glass tests.
- Privacy/log scanning to ensure message bodies never enter analytics or ordinary logs.
- Dated cost smoke tests against provider usage exports and budget alerts.
