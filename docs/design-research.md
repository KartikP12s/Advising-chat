# Design research

Research was reviewed on July 14, 2026. It informed the prototype’s interaction patterns; it does not imply endorsement or visual copying.

## Reference set

| Reference | Pattern considered | Decision for Common Ground |
| --- | --- | --- |
| [ADPList mentor discovery](https://adplist.org/find-a-mentor) | Topic- and experience-led discovery, mentor context before commitment | Preserve understandable matching reasons, but avoid public identity and popularity signals. |
| [Circle community platform](https://circle.so/platform) | Community conversations organized around useful spaces | Keep a calm sense of belonging without adding a feed, follower counts, or engagement pressure. |
| [Whereby security](https://whereby.com/information/security/) | Plain-language explanation of communication boundaries and trust | Put safety/privacy expectations beside the action they govern, not only in policy text. |
| [W3C form guidance](https://www.w3.org/WAI/tutorials/forms/) | Labels, instructions, feedback, and logical form grouping | Use short staged forms, persistent labels, focus states, and recoverable validation. |
| [ICO consent guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/consent/what-is-valid-consent/) | Specific, informed, freely given choices and active opt-in | Separate purposes, avoid preselection, make decline neutral, and keep withdrawal available. |

## Experience direction

The visual system is intentionally warm and editorial rather than clinical or “AI futuristic.” Cream/ink surfaces, restrained coral and teal accents, serif display type, abstract avatars, generous spacing, and slow ambient motion make the product feel human without implying a real identity. Dark mode preserves the same hierarchy.

The primary journey is linear because each state changes what the person can safely decide next:

1. Describe the need with minimal identifying detail.
2. Understand why a peer was suggested.
3. Converse privately with visible reliability and safety controls.
4. Reflect privately before any reuse language appears.
5. Review specific consent boundaries.
6. Inspect and edit a sanitized version before approval.

This staged approach reduces the amount of explanation shown at once and prevents publication language from influencing the original private exchange.

## Patterns intentionally rejected

- Public profiles, headshots, follower counts, ratings, streaks, or leaderboards.
- “Perfect match” language or a hidden compatibility score.
- A single “I agree” checkbox covering recording, AI processing, and publication.
- Prechecked AI consent or visually muted decline actions.
- Confetti or social proof after agreeing to content reuse.
- Automatically generated talking-head footage presented as the participant.
- An admin dashboard that visually suggests raw-message access is ordinary.

## Accessibility and responsive behavior

- Semantic headings, landmarks, buttons, labels, and live status text.
- Keyboard-visible focus and a skip link.
- Color choices designed for readable foreground/background contrast.
- Text alternatives for icon-only controls and abstract avatars.
- Motion disabled or reduced under `prefers-reduced-motion`.
- Single-column progression on small screens, large touch targets, and no essential hover-only state.
- Error states preserve entered data and explain recovery.

Formal WCAG conformance, screen-reader testing, contrast audit across all states, localization expansion, and user testing with disabled participants remain pre-pilot work.

## Questions for the first study

- Does the generated alias feel protective or impersonal?
- Can people explain why they were matched without interpreting the score as a promise?
- Do they understand that private feedback is sealed?
- Can they distinguish transformation consent from exact-version publication approval?
- Are indirect identifiers recognizable during review?
- Does the content possibility change how candidly they speak?

Observe behavior and comprehension rather than asking only whether the interface “feels clear.”
