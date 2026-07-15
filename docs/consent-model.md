# Consent model

Consent is a lifecycle, not one checkbox. Common Ground separates permission to record, permission to transform, and approval to publish because each has a different purpose, data flow, and risk.

## Purpose matrix

| Purpose | Asked when | Required disclosure | Stored evidence | Effect of decline |
| --- | --- | --- | --- | --- |
| Recording | Before any future audio/video capture | What is captured, why, retention, who can access it | Participant, policy version, status, time | Continue text-only or leave; no recording |
| Transformation | Only after both privately report value and interest | Selected excerpts vs full transcript, people/tools involved, AI boundary, likely outputs | Source scope, AI choice, comprehension, policy version, status, time | Conversation stays private; counterpart does not learn who declined |
| Publication | After each participant reviews a sanitized version | Exact title/script/takeaways, format, channel, withdrawal limits | Participant, immutable version ID, policy version, status, time | No candidate/publishing transition |

The prototype does not record anything. The recording contract exists so a later audio/video feature cannot silently inherit transformation permission.

## Valid interaction requirements

- No preselected approval, AI permission, or source-scope choice.
- Accept and decline have comparable prominence and plain language.
- Choices are specific; “improve the community” is not enough to describe publication.
- A short comprehension check confirms that useful feedback is not permission to reuse content.
- Withholding or withdrawing permission does not reduce access to the private advising experience.
- Consent events include the policy version shown at the time.
- The participant can return to the disclosure before deciding.

## Mutual gate

```text
both submit private feedback
  └── both found the session useful?
        └── both independently interested in possible reuse?
              └── both grant transformation consent for compatible source scope?
                    └── sanitize and review
                          └── both approve the exact same version?
                                └── content candidate, still not automatic publication
```

At every gate, a single no closes the reuse path. The interface shares only the resulting state, never a participant’s score, written reflection, or identity as the person who declined.

## Revisions and withdrawal

Changing the sanitized transcript, title, summary, takeaway, or framing creates a new version. Previous publication approvals become invalid even when the edit appears minor. Both participants review the new complete version.

Withdrawal creates an append-only consent event and stops pending work immediately. Before publication, it permanently closes the candidate unless the person later begins a new explicit consent flow. After publication, it triggers the documented takedown process across the first-party site, CDN, renderer, vendor workspace, scheduled posts, and known exports. The product must disclose that it cannot guarantee deletion of third-party copies or screenshots already made.

## Proof and audit

For each decision, retain only the evidence necessary to show: who acted, which purpose, the prior and new status, which policy and content version they saw, when the action happened, and how it was authenticated. Do not use a consent log as a reason to retain the underlying raw conversation indefinitely.

This model follows the practical consent principles of a freely made, specific, informed, unambiguous choice with easy withdrawal. Jurisdiction-specific legal review is still required before launch.
