# User flows

## Seeker

```text
Landing
  → choose anonymous help
  → generated session alias
  → topic + short need + format/availability + optional comfort choices
  → matching lobby
  → understand match reasons
  → accept / skip / report
  → private text session
  → mark helpful moments / react / flag / block / report
  → end session
  → private staged reflection
  → keep private OR request consent details
  → set source and AI boundaries
  → comprehension confirmation
  → decline OR grant transformation consent
  → review sanitized version
  → request redaction (creates new version) OR approve exact version
  → content candidate
  → withdraw before publication OR continue to manual production review
```

## Advisor

Advisor onboarding uses the same minimal shell but asks where the person has relevant experience and what questions they can help with. In production, availability and capacity enter a queue. The prototype shows the matching and conversation interface with the advisor role selected, while the second participant is simulated.

## Independent feedback states

- Neither responded: `feedback-pending`
- One responded: their answer remains sealed
- Both responded, one or neither found value: `evaluated`, not transformation eligible
- Both found value but one declined future reuse: stays private
- Both found value and both expressed interest: show detailed transformation consent
- One later withdraws: `withdrawn`; production/publication blocked

Only the minimum gate result is shared. Written reflections, individual value scores, and which party declined are not shown to the counterpart.

## Sanitization/version states

```text
consent granted by both
  → sanitizing
  → participant review v1
      ├── reject → rejected/private
      ├── request redaction → v2, invalidate all v1 approvals
      └── approve v1
            → wait for other participant's v1 approval
            → approved candidate
```

## Safety branches

- Report match before accepting: remove the pairing and open a report record.
- Flag message: private signal; counterpart is not notified.
- Block participant: terminate reconnect and prevent future pairing.
- High-risk content hook: place conversation on safety hold; normal content operations cannot access it.
- Exceptional safety access: separate role, reason code, smallest necessary excerpt/scope, expiration, and audit event.

## Empty/error/reconnection behavior

- Empty chat shows starters and a calm invitation.
- Reconnecting and offline states preserve the local draft and disable send.
- Send/service errors show recovery rather than discarding the request.
- A cancelled lobby returns to editable onboarding without publishing or submitting the need.
