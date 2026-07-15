# Media feasibility

## Recommendation

Do not generate talking-head video for the first 20 conversations. Use a human-edited, text-led motion storyboard with synthetic illustration, captions, and optional neutral narration. It is cheaper to change, reduces biometric/likeness risk, and makes it harder to imply that a participant personally spoke an edited line.

Only an approved sanitized script may enter production. Raw transcripts, real names, participant photos, and participant voice samples stay out of media tools.

## Three operating approaches

### 1. Manual text-led motion — recommended first

An editor works from the approved script using the app’s storyboard language: abstract figures, kinetic type, simple scenes, captions, and licensed music if any. No synthetic identity is necessary.

- Best for: first 20 assets, sensitive stories, learning editorial effort.
- Cash cost: $0 with existing tools/skills; labor is the main cost.
- Main risk: operator accidentally reintroduces identifying detail.
- Control: two-person privacy/editorial check against the approved version.

### 2. AI-assisted render, human-controlled

Use a template renderer such as Shotstack or Creatomate for composition and optionally ElevenLabs for neutral narration. A human chooses the script, visuals, timing, and final export.

- Best for: repeatable motion templates after the style is proven.
- Cash signal: [Shotstack](https://shotstack.io/pricing/) lists pay-as-you-go rendering around $0.30/minute with a minimum credit pack; [Creatomate](https://creatomate.com/pricing) lists trial credits and monthly plans; [ElevenLabs API](https://elevenlabs.io/pricing/api) lists model-dependent character rates.
- Main risk: vendor retention/training terms, licensing, pronunciation errors, and over-automation.
- Control: send the minimum sanitized script, use synthetic stock voices, review every frame/caption, and delete vendor artifacts.

### 3. Synthetic presenter/avatar

Use a clearly fictional presenter to narrate a sanitized composite—not a clone or visual proxy for either participant. Never phrase it as “this is their story in their voice.”

- Best for: only after user research shows a presenter materially improves comprehension.
- Cash signal: [HeyGen API](https://developers.heygen.com/docs/pricing), [Synthesia](https://www.synthesia.io/pricing), [Tavus](https://www.tavus.io/pricing), [D-ID](https://www.d-id.com/pricing/api), and [Colossyan](https://www.colossyan.com/pricing/) all publish different credit/minute and plan structures.
- Main risk: likeness/voice rights, biometric data, emotional misrepresentation, vendor lock-in, and audience confusion about who spoke.
- Control: fictional stock avatar, neutral voice, permanent disclosure, no participant biometrics, DPA/subprocessor review, script/version traceability, and human release.

## Vendor comparison

Pricing below is a directional snapshot from official pages reviewed July 14, 2026; tiers, credits, resolution, API eligibility, and annual billing differ, so compare a real sample job before purchase.

| Provider | Relevant role | Public starting signal | Suitability now | Main diligence question |
| --- | --- | --- | --- | --- |
| HeyGen | API avatar video | API pay-as-you-go; documentation lists per-minute Avatar IV pricing | Later experiment | Does the plan/DPA meet retention, training-use, deletion, and commercial-rights requirements? |
| Synthesia | Script-to-presenter video | Free/basic entry plus paid creator tiers; API availability is plan-dependent | Later experiment | Can output remain clearly fictional and accessible without implying participant likeness? |
| Tavus | Conversational/digital replicas | Basic free allowance and paid starter/API usage | Poor fit for first assets | Replica/biometric scope is broader than the current need. |
| D-ID | Talking portrait/API video | Trial and paid API plans | Later experiment | What watermark, deletion, biometric, and commercial-use terms apply to the exact plan? |
| Colossyan | Training/presenter video | Paid creator/pro tiers | Possible editorial tool later | Is its workflow economical for short, individually approved assets? |
| ElevenLabs | Narration/TTS and STT | Usage pricing by characters/minutes/model | Useful only for neutral narration | Which voice license, regional processing, opt-out, and deletion controls apply? |
| Shotstack | Template video rendering | Per-minute credits and subscriptions | Strong automation candidate | Can templates, fonts, music, and output be fully licensed and reproducible? |
| Creatomate | Template video rendering | Trial credits and monthly credit plans | Strong automation candidate | How many credits does the final resolution/codec actually consume? |
| Descript | Human-led editing/transcription | Paid editor tiers | Good manual editing option | Disable unnecessary transcription/cloud ingestion for sensitive source material. |

## Additional longlist triage

| Provider | Current signal | Decision for this pilot |
| --- | --- | --- |
| [Hour One](https://helpcenter.hourone.ai/knowledge/api) | Presenter workflow; API is documented for Enterprise, with custom assets and multilingual voices | Defer: enterprise/API dependency and presenter risk add no value before the format is proven. |
| [Captions / Mirage API](https://captions.ai/help/docs/api/pricing) | Styled captions at $0.15/input minute; human-video generation at $0.175/output second, billed in six-second increments | Consider caption rendering later; avoid synthetic human generation for sensitive stories. |
| [Runway](https://runwayml.com/pricing) | Creative video/image generation, one-time free credits, paid credit plans, and API models priced by credits/second | Useful for abstract B-roll experiments, not identity/presenter generation; model variability makes template rendering easier to govern. |
| [VEED](https://www.veed.io/pricing) | Human-oriented cloud editor with emerging subtitle/render APIs | Possible manual editor; cloud ingestion and deletion terms need review before any approved script is uploaded. |

Across the entire longlist, rendering speed, realism, language count, two-speaker support, watermarking, API access, moderation, and concurrency are plan/model-specific and can change independently of price. Custom avatars commonly require identity/likeness capture—the initial product prohibits that. Do not rely on marketing pages for commercial rights, training-use exclusions, or deletion: confirm the executed terms for the exact account and feature.

Any selected provider needs a current contract, DPA, subprocessor, data-location, training-use, deletion, output-rights, accessibility, SLA, moderation, watermark, commercial-use, and incident-response review. A provider that cannot contractually answer those questions is not suitable for this workflow.

## Media pipeline

```text
both approve sanitized version
  → operator verifies consent + safety state
  → create locked production script/hash
  → render draft from sanitized script only
  → privacy, editorial, caption, and disclosure review
  → both participants review again if meaning/framing changed
  → authorized human release
  → publish with source version and asset inventory
  → monitor withdrawal/takedown queue
```

No provider should be able to publish automatically. Rendering and publication use different credentials and approvals.

## Pilot measurement

For each candidate, record human editing minutes, vendor/render minutes, failed renders, caption corrections, privacy edits, participant revision cycles, final duration, cash cost, and takedown time. Revisit automation only after manual evidence identifies a stable, low-risk repeated step.
