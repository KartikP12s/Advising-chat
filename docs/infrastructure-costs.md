# Infrastructure and unit economics

Prices and plan descriptions were reviewed from official vendor pages on July 14, 2026. They change frequently and are not quotes. Taxes, support, participant/advisor compensation, legal work, and internal overhead are excluded.

## Default demo: $0

The repository requires no hosted service, model key, email provider, database, or media API. Seed data, matching, sanitization, realtime behavior, and the storyboard run locally. The only unavoidable inputs are a computer, electricity, and internet already available to the operator.

An eligible personal/non-commercial demo can use [Vercel Hobby](https://vercel.com/pricing), currently listed at $0 with limits. Hobby eligibility and included usage must be checked before commercial use. A small hosted pilot could use [Supabase Free](https://supabase.com/pricing), currently listing 500 MB database size, 50,000 monthly active users, 1 GB storage, and 5 GB egress; free projects may pause for inactivity. These are optional production paths, not runtime dependencies.

## Dated planning inputs

| Category | Free/low-cost starting point | Scale signal | Model treatment |
| --- | --- | --- | --- |
| App/API hosting | Vercel Hobby $0 for eligible use | Pro is listed at $20 per user/month plus usage | $0 through 1,000 sessions; $20 at 10,000 |
| Postgres/auth/storage | Supabase Free $0 within plan limits | Pro is listed at $25/month | $0 through 1,000 sessions; $25 at 10,000 |
| Realtime | Supabase Free includes 2M messages and 200 peak connections | [Realtime overage](https://supabase.com/docs/guides/realtime/pricing) is documented from $2.50/M messages and $10/1,000 peak connections on paid plans | Three realtime events per 38-message session; charge only above 2M |
| Transactional email | [Resend Free](https://resend.com/pricing) lists 3,000 emails/month and 100/day | Paid plan required above caps | $0 in model; notifications are out of prototype scope |
| Moderation | Local report controls and human review | A model API can be added behind a provider boundary | $0 in demo; estimate after measuring payloads |
| Sanitization | Local rules | Private model/human review for live data | Optional assumption: $0.015 per completed session |
| Logs/analytics | Local dev logs and aggregate seeded metrics | Privacy-safe hosted telemetry | $0 in model; no session replay/private text capture |
| Media | CSS storyboard only | Human edit plus optional renderer/avatar vendor | Optional assumption: $1 per published minute |

## Optional capabilities kept out of the default total

| Capability | Current official planning signal | Prototype / scale estimate |
| --- | --- | --- |
| Serverless compute | Included within the selected hosting plan before overages | $0 locally; validate function duration and bandwidth from a load test |
| Authentication | Included in the cited Supabase Free/Pro allowances | $0 in the modeled ranges; SMS/identity verification would be separate |
| Object storage and CDN | Supabase Free includes limited storage/egress; [Cloudflare R2](https://developers.cloudflare.com/r2/pricing/) lists 10 GB-month storage and operation allowances with free direct egress, then $0.015/GB-month Standard storage | $0 for a text pilot; media delivery must be recalculated from actual file size/views |
| Logging/monitoring | Local structured logs; no private-route replay | $0 in prototype; select after establishing redaction and retention requirements |
| Moderation | Report/block hooks plus human safety queue | $0 software in prototype; reviewer labor must be measured separately |
| Audio/video calling | [Daily](https://www.daily.co/pricing/video-sdk/) lists 10,000 free participant-minutes/month, then $0.004/video and $0.00099/audio participant-minute before volume discounts | Disabled and $0; a 25-minute two-person video session would consume 50 participant-minutes |
| Recording | Daily lists $0.01349/cloud-video recorded minute plus $0.003/min storage, or $0.005/audio recorded minute | Off by default and $0; requires separate bilateral recording consent |
| Speech-to-text | [ElevenLabs API](https://elevenlabs.io/pricing/api) lists batch Scribe at $0.22/hour and realtime at $0.39/hour | $0 because there is no audio; about $0.09 batch STT for one 25-minute recording before add-ons |
| LLM summary/sanitization assist | No provider is selected; input/output tokens and private deployment terms vary | $0 in the app; the model uses an editable $0.015/session proxy solely for scenario comparison |
| Text-to-speech | ElevenLabs lists $0.05/1K characters for Flash/Turbo and $0.10/1K for Multilingual v2/v3 | $0 in the app; price the final approved script, not the raw transcript |
| Avatar generation | [HeyGen API](https://developers.heygen.com/docs/pricing) currently documents pay-as-you-go per generated minute | $0 in the app; defer until the manual visual format is validated |
| Final render | [Shotstack](https://shotstack.io/pricing/) lists pay-as-you-go around $0.30/rendered minute with a minimum credit purchase | $0 in the app; modeled conservatively at $1/published minute |
| Human privacy/editorial review | No universal market price | 35 minutes/candidate at $35/hour in the dashboard; the first 20 must replace this assumption |

Storage, egress, logs, and realtime costs depend more on retention, payload size, reconnection behavior, and media delivery than on account count alone. Put budget alerts and hard usage limits in place before connecting any provider.

## Editable scenario model

`src/lib/costs.ts` exposes every assumption used by the research dashboard. The default values are about 1.5 messages per conversation minute, three realtime events/message, a $0.015 sanitization proxy per 22 KB transcript, 35 minutes human review/candidate at $35/hour, $1 media vendor/published minute, and a 70% candidate publication rate. Conversation length, transcript size, conversion, and media length are editable in the interface.

| Scenario | Sessions / peak | Candidate rate | Estimated monthly cash cost | Cost/completed | Cost/mutually valuable | Primary driver |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| One local conversation | 1 / 2 | 0% | $0.01 modeled; actual demo $0 | $0.01 | $0.01 | Optional sanitization assumption |
| Prototype | 500 / 100 | 5% | $552 | $1.10 | $1.84 | ~$510 human review |
| Early scale | 1,000 / 150 | 8% | $1,788 | $1.79 | $2.88 | ~$1,633 human review |
| Growth | 10,000 / 800 | 10% | $22,739 | $2.27 | $3.55 | ~$20,417 human review |

The uncertainty display is deliberately broad: 70%–155% of the point estimate. The 100-concurrent scenario is near enough to Supabase Free’s currently documented 200-connection ceiling that reconnects, tabs, and operator connections must be load-tested; the 10,000-session scenario explicitly needs plan and load validation.

## Content economics

At the defaults, candidates cost about $22–$23 each and published assets about $32 each across the scaled scenarios. This apparent stability is an artifact of fixed review minutes and publication rate, not measured efficiency. Rework, legal review, takedowns, accessibility captions, localization, and editorial quality can make content materially more expensive.

The right optimization target is not “videos per dollar.” Track:

- Cost per completed conversation.
- Cost per mutually valuable conversation.
- Review minutes and revision cycles per candidate.
- Cost per approved candidate and published asset.
- Withdrawal/takedown workload.
- Participant comprehension and privacy incident rate.

## Controls before spending

1. Set every optional provider variable blank by default.
2. Use separate development and production accounts with least-privilege keys.
3. Configure monthly hard caps, budget alerts, and a kill switch for model/media jobs.
4. Queue media work only after exact-version approval and human release.
5. Measure the first 20 conversations manually before committing to an annual vendor contract.
6. Recalculate with measured transcript size, review time, conversion, and retention rather than dashboard seed rates.
