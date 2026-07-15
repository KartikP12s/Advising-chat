"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  EyeOff,
  FileCheck2,
  FlaskConical,
  Gauge,
  LockKeyhole,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { StatusPill } from "@/components/status-pill";
import { candidates, prototypeMetrics } from "@/data/seed";
import { costScenarios, currency, projectCosts } from "@/lib/costs";
import type { CandidateStatus } from "@/lib/domain";

const metrics = [
  { label: "Matching attempts", value: prototypeMetrics.matchingAttempts.toString(), note: "seeded prototype data", icon: UsersRound },
  { label: "Match acceptance", value: `${Math.round(prototypeMetrics.matchAcceptanceRate * 100)}%`, note: "assumption · not measured", icon: Check },
  { label: "Completed sessions", value: prototypeMetrics.completedConversations.toString(), note: "seeded prototype data", icon: MessageCircleMore },
  { label: "Avg. session", value: `${prototypeMetrics.averageSessionMinutes}m`, note: "assumption", icon: Clock3 },
  { label: "Mutually valuable", value: `${Math.round(prototypeMetrics.mutuallyValuableRate * 100)}%`, note: "assumption", icon: Sparkles },
  { label: "Mutual opt-in", value: `${Math.round(prototypeMetrics.mutualOptInRate * 100)}%`, note: "assumption", icon: FileCheck2 },
  { label: "Sanitization approval", value: `${Math.round(prototypeMetrics.sanitizationApprovalRate * 100)}%`, note: "assumption", icon: ShieldCheck },
  { label: "Consent withdrawal", value: `${Math.round(prototypeMetrics.withdrawalRate * 100)}%`, note: "assumption", icon: LockKeyhole },
];

export function ResearchDashboard() {
  const [scenarioId, setScenarioId] = useState("early-scale");
  const [conversionRate, setConversionRate] = useState(8);
  const [conversationMinutes, setConversationMinutes] = useState(28);
  const [transcriptKb, setTranscriptKb] = useState(22);
  const [videoMinutes, setVideoMinutes] = useState(2.5);
  const [candidateRows, setCandidateRows] = useState(() => candidates.map((candidate, index) => ({
    ...candidate,
    manualMinutes: [145, 78, 42][index] ?? 0,
    productionCostUsd: [18, 9, 4][index] ?? 0,
  })));
  const [opsNotice, setOpsNotice] = useState("Edits are held on this device for the prototype session.");
  const baseScenario = costScenarios.find((scenario) => scenario.id === scenarioId) ?? costScenarios[2];
  const scenario = useMemo(
    () => ({ ...baseScenario, averageConversationMinutes: conversationMinutes, contentConversionRate: conversionRate / 100, averageTranscriptKb: transcriptKb, averageVideoMinutes: videoMinutes }),
    [baseScenario, conversationMinutes, conversionRate, transcriptKb, videoMinutes],
  );
  const projection = useMemo(() => projectCosts({ scenario }), [scenario]);
  const candidatesCount = Math.round(scenario.monthlySessions * scenario.contentConversionRate);

  const exportAggregateCsv = () => {
    const rows = [
      ["candidate_id", "status", "safety_status", "format", "duration_minutes", "manual_edit_minutes", "production_cost_usd"],
      ...candidateRows.map((candidate) => [
        candidate.id,
        candidate.status,
        candidate.safetyStatus,
        candidate.format,
        candidate.estimatedDurationMinutes.toString(),
        candidate.manualMinutes.toString(),
        candidate.productionCostUsd.toString(),
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "common-ground-aggregate-candidates.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateCandidate = (id: string, values: Partial<{ status: CandidateStatus; manualMinutes: number; productionCostUsd: number }>) => {
    setCandidateRows((current) => current.map((candidate) => candidate.id === id ? { ...candidate, ...values } : candidate));
    setOpsNotice("Prototype operation recorded locally. Production would persist an authorized audit event.");
  };

  const selectScenario = (id: string) => {
    const next = costScenarios.find((item) => item.id === id);
    if (!next) return;
    setScenarioId(id);
    setConversionRate(Math.round(next.contentConversionRate * 100));
    setConversationMinutes(next.averageConversationMinutes);
    setTranscriptKb(next.averageTranscriptKb);
    setVideoMinutes(next.averageVideoMinutes || 1);
  };

  return (
    <div className="research-dashboard">
      <section className="research-hero">
        <div>
          <span className="step-label"><FlaskConical size={13} /> Internal research prototype · seeded data</span>
          <h1>Trust operations,<br />without the raw transcript.</h1>
          <p>Track whether the model creates useful conversations and safe, mutually approved insights. Normal content review never exposes private source text.</p>
        </div>
        <div className="research-access-note"><LockKeyhole size={17} /><span><strong>Authorized reviewer preview</strong><small>Production requires server-side RBAC, audit logging, and separate exceptional safety access.</small></span></div>
      </section>

      <section className="metric-grid" aria-label="Prototype research metrics">
        {metrics.map(({ label, value, note, icon: Icon }) => (
          <article key={label}>
            <div><Icon size={16} /><span>{label}</span></div>
            <strong>{value}</strong>
            <small>{note}</small>
          </article>
        ))}
      </section>

      <section className="research-section flow-research">
        <div className="research-section-heading">
          <div><span className="step-label">Core hypothesis</span><h2>Does useful conversation survive every trust gate?</h2></div>
          <p>Counts below are seeded demonstration data. A production dashboard should calculate them from consent and lifecycle events—not message content.</p>
        </div>
        <div className="funnel-grid" aria-label="Conversation to content funnel">
          {[
            ["Matched", 133, "72% accepted"],
            ["Completed", 96, "72% of matches"],
            ["Mutual value", 59, "61% of completions"],
            ["Mutual opt-in", 17, "18% of completions"],
            ["Sanitized approved", 13, "74% of candidates"],
            ["Published", 4, "manual pilot"],
          ].map(([label, value, note], index) => (
            <div key={String(label)}>
              <span className="funnel-index">0{index + 1}</span>
              <strong>{value}</strong>
              <span>{label}</span>
              <small>{note}</small>
              {index < 5 && <ChevronRight size={14} />}
            </div>
          ))}
        </div>
        <div className="consent-state-strip">
          <div><span className="state-dot state-granted" /><strong>Mutual grant</strong><small>17 sessions</small></div>
          <div><span className="state-dot state-declined" /><strong>One or both declined</strong><small>39 sessions</small></div>
          <div><span className="state-dot state-pending" /><strong>Response pending</strong><small>31 sessions</small></div>
          <div><span className="state-dot state-withdrawn" /><strong>Later withdrawal</strong><small>4 sessions</small></div>
        </div>
      </section>

      <section className="research-section cost-lab">
        <div className="research-section-heading">
          <div><span className="step-label"><CircleDollarSign size={13} /> Editable feasibility model</span><h2>Cost lab</h2></div>
          <p>USD estimates, retrieved or reviewed July 14, 2026. Inputs are deliberately visible; prices are not hard-coded as facts without a source and date.</p>
        </div>

        <div className="scenario-tabs" role="tablist" aria-label="Cost scenarios">
          {costScenarios.map((item) => <button className={item.id === scenarioId ? "active" : ""} role="tab" aria-selected={item.id === scenarioId} type="button" onClick={() => selectScenario(item.id)} key={item.id}><strong>{item.label}</strong><small>{item.monthlySessions.toLocaleString()} sessions · {item.peakConcurrentUsers} peak users</small></button>)}
        </div>

        <div className="cost-lab-grid">
          <div className="scenario-controls">
            <div className="scenario-fact-row"><span>Monthly completed sessions</span><strong>{scenario.monthlySessions.toLocaleString()}</strong></div>
            <div className="scenario-fact-row"><span>Peak concurrent users</span><strong>{scenario.peakConcurrentUsers.toLocaleString()}</strong></div>
            <label className="range-control">
              <span><strong>Content conversion</strong><output>{conversionRate}% · {candidatesCount} candidates</output></span>
              <input type="range" min="0" max="30" step="1" value={conversionRate} onChange={(event) => setConversionRate(Number(event.target.value))} />
            </label>
            <label className="range-control">
              <span><strong>Average conversation</strong><output>{conversationMinutes} min · ~{Math.round(conversationMinutes * 1.5)} messages</output></span>
              <input type="range" min="10" max="90" step="5" value={conversationMinutes} onChange={(event) => setConversationMinutes(Number(event.target.value))} />
            </label>
            <label className="range-control">
              <span><strong>Average transcript size</strong><output>{transcriptKb} KB</output></span>
              <input type="range" min="5" max="80" step="1" value={transcriptKb} onChange={(event) => setTranscriptKb(Number(event.target.value))} />
            </label>
            <label className="range-control">
              <span><strong>Average media duration</strong><output>{videoMinutes.toFixed(1)} min</output></span>
              <input type="range" min="1" max="10" step="0.5" value={videoMinutes} onChange={(event) => setVideoMinutes(Number(event.target.value))} />
            </label>
            <div className="free-prototype-note"><Check size={15} /><span><strong>Current local prototype: $0 required</strong><small>No database, auth, realtime, AI, email, recording, or video provider is called.</small></span></div>
          </div>

          <div className="cost-output" aria-live="polite">
            <div className="monthly-estimate"><span>Estimated monthly operating cost</span><strong>{currency(projection.totalMonthly)}</strong><small>Range {currency(projection.uncertaintyLow)}–{currency(projection.uncertaintyHigh)}</small></div>
            <div className="cost-breakdown-bar" aria-label={`Fixed ${currency(projection.fixedMonthly)}, variable ${currency(projection.variableMonthly)}`}>
              <span style={{ width: `${projection.totalMonthly ? (projection.fixedMonthly / projection.totalMonthly) * 100 : 0}%` }} />
            </div>
            <div className="cost-split"><span><i className="fixed" /> Fixed {currency(projection.fixedMonthly)}</span><span><i /> Variable {currency(projection.variableMonthly)}</span></div>
            <dl className="unit-costs">
              <div><dt>Per completed conversation</dt><dd>{currency(projection.completedConversation)}</dd></div>
              <div><dt>Per mutually valuable conversation</dt><dd>{currency(projection.mutuallyValuableConversation)}</dd></div>
              <div><dt>Per content candidate</dt><dd>{candidatesCount ? currency(projection.contentCandidate) : "N/A"}</dd></div>
              <div><dt>Per published media asset</dt><dd>{candidatesCount ? currency(projection.publishedAsset) : "N/A"}</dd></div>
            </dl>
            <div className="bottleneck-note"><Gauge size={15} /><span><strong>Primary bottleneck</strong><small>{projection.bottleneck}</small></span></div>
          </div>
        </div>

        <div className="assumption-table-wrap">
          <table className="data-table assumption-table">
            <caption>Current cost assumptions and evidence</caption>
            <thead><tr><th>Cost area</th><th>Prototype assumption</th><th>Evidence label</th><th>Source / note</th></tr></thead>
            <tbody>
              <tr><td>App hosting</td><td>$0 Hobby, $20 paid baseline</td><td><StatusPill tone="info">Official pricing</StatusPill></td><td><a href="https://vercel.com/pricing" rel="noreferrer" target="_blank">Vercel · retrieved Jul 14, 2026</a></td></tr>
              <tr><td>Database + auth</td><td>$0 Free, $25 Pro baseline</td><td><StatusPill tone="info">Official pricing</StatusPill></td><td><a href="https://supabase.com/pricing" rel="noreferrer" target="_blank">Supabase · retrieved Jul 14, 2026</a></td></tr>
              <tr><td>Realtime</td><td>2M messages + 200 peak connections free; then modeled at $2.50 / 1M</td><td><StatusPill tone="info">Official docs</StatusPill></td><td><a href="https://supabase.com/docs/guides/realtime/pricing" rel="noreferrer" target="_blank">Supabase Realtime pricing</a></td></tr>
              <tr><td>Email</td><td>3,000 / month free</td><td><StatusPill tone="info">Official pricing</StatusPill></td><td><a href="https://resend.com/pricing" rel="noreferrer" target="_blank">Resend · retrieved Jul 14, 2026</a></td></tr>
              <tr><td>Local sanitization</td><td>$0 provider cost; human review remains</td><td><StatusPill>Prototype assumption</StatusPill></td><td>Deterministic local rules in this repository</td></tr>
              <tr><td>Conversation volume</td><td>~1.5 messages per minute; sanitization proxy scales from 22 KB</td><td><StatusPill>Editable assumption</StatusPill></td><td>Validate with privacy-safe aggregate pilot data</td></tr>
              <tr><td>Human review</td><td>$35/hr; 35 minutes per candidate</td><td><StatusPill>Editable assumption</StatusPill></td><td>Validate during first 20 manual cases</td></tr>
              <tr><td>Media render</td><td>$1/min neutral baseline</td><td><StatusPill tone="warning">Conservative proxy</StatusPill></td><td>Vendor range varies; see media feasibility report</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="research-section candidate-ops">
        <div className="research-section-heading">
          <div><span className="step-label">Content operations · sanitized only</span><h2>Candidate queue</h2></div>
          <button className="button button-secondary button-small" type="button" onClick={exportAggregateCsv}>Export aggregate CSV</button>
        </div>
        <div className="candidate-table-wrap">
          <table className="data-table">
            <caption>Seeded sanitized content candidates</caption>
            <thead><tr><th>Candidate</th><th>Status</th><th>Safety</th><th>Mutual consent</th><th>Format</th><th>Duration</th><th>Manual edit</th><th>Production cost</th></tr></thead>
            <tbody>
              {candidateRows.map((candidate) => (
                <tr key={candidate.id}>
                  <td><strong>{candidate.title}</strong><small>{candidate.id} · {candidate.versionId}</small></td>
                  <td>
                    <select
                      aria-label={`Status for ${candidate.title}`}
                      value={candidate.status}
                      disabled={candidate.status === "withdrawn"}
                      onChange={(event) => updateCandidate(candidate.id, { status: event.target.value as CandidateStatus })}
                    >
                      {(["rejected", "under-review", "approved", "published", "withdrawn"] satisfies CandidateStatus[]).map((status) => <option value={status} key={status}>{status.replace("-", " ")}</option>)}
                    </select>
                  </td>
                  <td><StatusPill tone={candidate.safetyStatus === "clear" ? "success" : "warning"}>{candidate.safetyStatus.replace("-", " ")}</StatusPill></td>
                  <td>{candidate.status === "withdrawn" ? "Withdrawn after 2/2" : "2 / 2 exact version"}</td>
                  <td>{candidate.format.replace("-", " ")}</td>
                  <td>{candidate.estimatedDurationMinutes.toFixed(1)} min <ArrowRight size={12} /></td>
                  <td><label className="table-number-field"><span className="sr-only">Manual editing minutes for {candidate.title}</span><input type="number" min="0" step="1" value={candidate.manualMinutes} onChange={(event) => updateCandidate(candidate.id, { manualMinutes: Number(event.target.value) })} /><small>minutes</small></label></td>
                  <td><label className="table-number-field"><span className="sr-only">Production cost for {candidate.title}</span><span>$</span><input type="number" min="0" step="0.01" value={candidate.productionCostUsd} onChange={(event) => updateCandidate(candidate.id, { productionCostUsd: Number(event.target.value) })} /></label></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ops-edit-note" role="status"><FileCheck2 size={13} /> {opsNotice}</p>
      </section>

      <section className="research-section ops-grid-section">
        <div className="ops-panel">
          <div className="panel-heading"><span className="step-label"><AlertTriangle size={12} /> Privacy review queue</span><StatusPill tone="warning">3 need review</StatusPill></div>
          {[
            ["CG–018", "Unique workplace event", "Indirect identifier", "High"],
            ["CG–021", "Small-city role combination", "Precise context", "Medium"],
            ["CG–024", "Participant requested extra redaction", "User request", "Required"],
          ].map(([id, detail, category, level]) => <div className="risk-row" key={id}><span>{id}</span><div><strong>{detail}</strong><small>{category}</small></div><StatusPill tone={level === "High" ? "danger" : "warning"}>{level}</StatusPill><ChevronRight size={14} /></div>)}
          <div className="raw-access-warning"><EyeOff size={15} /><p><strong>Raw transcript unavailable here.</strong> Exceptional safety access is a separate role, reason-coded, time-limited, and audited workflow.</p></div>
        </div>

        <div className="ops-panel media-comparison">
          <div className="panel-heading"><span className="step-label"><BarChart3 size={12} /> First-20 production decision</span><StatusPill tone="success">Recommended</StatusPill></div>
          <div className="approach-row recommended"><div><strong>Manual + motion template</strong><small>Human privacy, editorial, and quality review</small></div><span>Safest learning</span><strong>$0–$35 cash</strong></div>
          <div className="approach-row"><div><strong>AI-assisted edit</strong><small>Sanitized script only; human approval</small></div><span>Second experiment</span><strong>$1–$10 / asset</strong></div>
          <div className="approach-row"><div><strong>Mostly automated avatar</strong><small>Higher privacy, quality, and vendor risk</small></div><span>Defer</span><strong>$3–$18 / asset</strong></div>
          <p className="panel-footnote">Recommendation: produce the first 1–20 with a reusable motion-graphics template and human review. Do not make sensitive stories appear to be spoken by participants.</p>
        </div>
      </section>

      <section className="research-section evidence-footer">
        <Activity size={18} />
        <div><strong>Model health</strong><span>Deterministic matcher v1 · local sanitizer v1 · seeded analytics</span></div>
        <div><strong>Infrastructure state</strong><span>Local only · no paid services connected</span></div>
        <div><strong>Next measurement</strong><span>Time and revision count for first five manual reviews</span></div>
      </section>
    </div>
  );
}
