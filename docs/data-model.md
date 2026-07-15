# Data model and lifecycle

The prototype keeps its data in memory, but the canonical production-shaped contracts live in `src/lib/domain.ts`. IDs are opaque strings and all timestamps are ISO 8601 UTC values.

## Access domains

| Domain | Main records | Default readers | Design intent |
| --- | --- | --- | --- |
| Identity | `User` | Identity service, exceptional safety role | Keep the stable internal subject away from product-facing aliases. |
| Anonymous product | `AnonymousProfile`, `AdvisorProfile`, `MatchRequest`, `Match` | The subject and matching service | Expose only the session alias and matching inputs needed for the task. |
| Private conversation | `Conversation`, participants, messages, reactions, helpful moments, feedback | Conversation participants | Never grant content or analytics roles default raw-message access. |
| Consent and audit | Recording/transformation consent, publication approval, consent/audit events | Participant, restricted compliance service | Append history; do not overwrite the evidence trail. |
| Sanitized content | Versions, redactions, candidates, estimates | Participants for review, then content operators after approval | Operate on an immutable sanitized version, not a pointer to changing raw text. |
| Safety | Reports and moderation reviews | Dedicated safety role | Separate exceptional access from ordinary content operations. |

## Entity relationships

```text
User ──1:1── AnonymousProfile
                   │
                   ├──0:1── AdvisorProfile
                   └──1:n── MatchRequest ──1:n── Match
                                               │
                                               └──1:1── Conversation
                                                        ├──1:n── ConversationParticipant ──n:1── User
                                                        ├──1:n── Message ──1:n── Reaction
                                                        │                └──1:n── HelpfulMoment
                                                        ├──1:n── SessionFeedback
                                                        ├──1:n── ConsentEvent
                                                        └──1:n── SanitizedContentVersion
                                                                     ├──1:n── Redaction
                                                                     ├──1:n── PublicationApproval
                                                                     └──0:1── ContentCandidate
                                                                                  └──1:n── MediaProductionEstimate
```

## Conversation lifecycle

```text
draft → matching → matched → active → ended → feedback-pending → evaluated
                                                                  │
                                                                  ▼
transformation-eligible → consent-pending → sanitizing → participant-review
                                                              │          │
                                                              │          └── rejected
                                                              ▼
approved-candidate → production-review → publication-ready → published
```

`withdrawn` and `safety-hold` are interrupting states. A withdrawal immediately blocks transformation and publication commands. A safety hold blocks ordinary access until a dedicated reviewer records an outcome. Re-entering the happy path must be an explicit audited command; it must not happen because a page reloads.

## Consent and version invariants

- Recording, transformation, and publication are distinct purposes and records.
- Transformation consent records source scope, whether AI processing is allowed, a policy version, comprehension, actor, and time.
- Publication approval references a specific `SanitizedContentVersion.id`.
- Any changed word, requested redaction, title, takeaway, or framing produces a new immutable version.
- Creating version N+1 invalidates all approvals on version N; both participants must review N+1.
- Consent history is append-only through `ConsentEvent`; a current-state projection may be cached but is not the source of truth.
- A content candidate requires both publication approvals for the same version and a clear safety state.
- A published asset keeps its source version ID and withdrawal status so operations can trace and remove it.

## Production constraints

- Enforce foreign keys, unique participant/version approval constraints, and monotonic version numbers in the database.
- Authorize every read and command server-side. A realtime channel or route parameter is not proof of membership.
- Encrypt sensitive fields, rotate keys, and keep database/backups/logs within the declared retention policy.
- Use idempotency keys for message sends, consent commands, and deletion/withdrawal jobs.
- Store aggregate analytics without message bodies or free-text feedback where possible.
- Treat deletion as a workflow spanning the primary database, replicas, backups, search, media vendors, and exported files.

The seed data is synthetic and exists only to exercise these contracts. It must never be mixed with real pilot records.
