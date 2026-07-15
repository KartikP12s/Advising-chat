# Privacy and threat model

## Privacy position

Common Ground offers pseudonymous sessions, not guaranteed anonymity. Session aliases reduce casual exposure, but IP/device metadata, writing style, rare events, copied text, screenshots, and a participant who already knows the story can still identify someone. The product should say this plainly.

The prototype stores no submitted state after refresh and sends no conversation content to an external provider. That makes it useful for interaction testing, not production-ready for sensitive conversations.

## Assets and adversaries

High-value assets are raw messages, identity-to-alias links, consent history, safety reports, sanitized drafts, and unpublished media. Relevant adversaries include an abusive participant, a curious staff member, a compromised browser/session, an attacker enumerating IDs or channels, a third-party vendor, and a well-intentioned operator making a privacy mistake.

| Threat | Likely harm | Required mitigation before a live pilot |
| --- | --- | --- |
| Guessable conversation or realtime channel | Stranger reads a private exchange | Opaque IDs, server-side membership checks, short-lived channel tokens, negative authorization tests |
| Alias linked to stable identity | Re-identification or targeting | Separate identity/product schemas, minimal join capability, restricted audited break-glass role |
| Rare detail survives sanitization | Participant identified in a public asset | Deterministic detectors plus human review, participant review, indirect-identifier checklist, conservative rejection |
| Staff browse raw conversations | Internal privacy breach | Deny-by-default roles, purpose-limited safety access, reason codes, expiry, immutable audit alerts |
| Vendor receives raw transcript | Unbounded reuse, retention, or breach exposure | Do not send raw text; use approved sanitized scripts only; complete DPA, retention, training-use, subprocessor, and deletion review |
| Consent is bundled or coerced | Invalid or harmful reuse | Separate purposes, equal accept/decline prominence, no preselection, comprehension check, no penalty for declining |
| Sanitized draft changes after approval | Publication beyond what was reviewed | Immutable versions, content hash, approval bound to version, automatic invalidation |
| Withdrawal misses an exported/rendered copy | Continued unwanted publication | Asset inventory, takedown runbook, vendor deletion jobs, status propagation, verified completion |
| Sensitive text reaches logs/analytics | Secondary data leak | Structured events without bodies, request-body redaction, short log retention, no session replay on private routes |
| Harassment or high-risk advice | Personal or physical harm | Block/report, rate limits, advisor boundaries, safety queue, crisis and professional-help routing appropriate to launch region |

## Data minimization and retention

Collect only a topic, a short need, availability, language, and optional comfort preferences for matching. Do not request legal names. Never place message bodies in product analytics.

Before a pilot, choose and publish explicit retention periods with counsel and operators. A conservative starting proposal—not a legal conclusion—is:

- Unmatched requests: delete within 7 days.
- Private raw conversations: delete 30 days after the session unless a participant chooses a shorter window or a narrow documented safety/legal hold applies.
- Declined/rejected sanitized drafts: delete within 7 days of workflow closure.
- Approved sanitized source: retain only while the asset is active plus a short takedown verification window.
- Consent/audit evidence: retain only for the period justified by the operating and legal basis, access-restricted and detached from message content.
- Logs: security-minimum fields, no content, 7–30 days depending on need.

Validate these proposals against jurisdiction, participant expectations, incident-response needs, backup behavior, and vendor deletion guarantees. Surface the final periods before collection.

## Authorization model

- `participant`: only their own profile, matches, conversations, consent, and reviewed versions.
- `matching-service`: minimum profile/match inputs; no raw conversation access.
- `content-reviewer`: approved sanitized versions and editorial metadata only.
- `safety-reviewer`: time-bounded, reason-coded access to the minimum necessary private context.
- `administrator`: service operations, not automatically message content.
- `analytics`: aggregate events only.

Every privileged read should record actor, reason, resource, timestamp, and outcome. Alert on bulk access, repeated failed authorization, or safety-role access without an open report.

## Participant controls

- Leave a match, block future pairing, report privately, or end a session.
- See what source scope and AI use are being requested.
- Decline transformation without revealing which participant declined.
- Review and redact the exact sanitized version.
- Withdraw before publication and request takedown after publication, subject to clearly disclosed practical limits for already copied material.
- Request access, deletion, or export through a verified channel.

## Production privacy gate

Do not invite real users until threat-model review, data-flow mapping, authorization tests, encryption/key management, retention/deletion jobs, incident response, abuse controls, vendor assessments, and region-appropriate policy/legal review are complete. Sanitization can reduce risk; it cannot prove de-identification.
