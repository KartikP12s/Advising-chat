"use client";

import { ArrowLeft, ArrowRight, Bot, Check, Clock3, FileText, Globe2, LockKeyhole, RotateCcw, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { useState } from "react";

interface ConsentFlowProps {
  onDecision: (approved: boolean) => void;
}

type SourceScope = "selected-excerpts" | "full-transcript";

export function ConsentFlow({ onDecision }: ConsentFlowProps) {
  const [stage, setStage] = useState(0);
  const [scope, setScope] = useState<SourceScope | null>(null);
  const [aiAllowed, setAiAllowed] = useState<boolean | null>(null);
  const [understood, setUnderstood] = useState(false);

  return (
    <section className="journey-card consent-flow-card">
      <header className="consent-flow-header">
        <div>
          <span className="step-label">Separate transformation consent · policy v1.0</span>
          <h1>Understand it first.<br />Choose second.</h1>
        </div>
        <div className="consent-version"><LockKeyhole size={16} /><span><strong>Not publication approval</strong><small>Recorded only after your final choice</small></span></div>
      </header>

      <div className="consent-stage-tabs" aria-label={`Consent information step ${stage + 1} of 3`}>
        {["What would happen", "Set boundaries", "Confirm understanding"].map((label, index) => <span className={index === stage ? "active" : index < stage ? "complete" : ""} key={label}><i>{index < stage ? <Check size={11} /> : index + 1}</i>{label}</span>)}
      </div>

      {stage === 0 && (
        <div className="consent-stage">
          <div className="consent-stage-intro">
            <span className="question-number">Step 1 · What would happen</span>
            <h2>A private chat would become a reviewable draft—not a public post.</h2>
            <p>Both people must separately grant this transformation consent. Then both review and approve the exact same sanitized version. A material edit invalidates those approvals.</p>
          </div>
          <div className="consent-detail-grid">
            <article><FileText size={19} /><h3>Source material</h3><p>Either selected excerpts or the full text transcript, depending on the boundary you choose next. No audio or recording exists.</p></article>
            <article><ShieldCheck size={19} /><h3>Privacy treatment</h3><p>Direct identifiers are removed; possible indirect identifiers are highlighted for participant and human review.</p></article>
            <article><Bot size={19} /><h3>Possible AI use</h3><p>Optional summarization behind a provider interface. In this prototype, deterministic rules run locally and raw text goes to no third party.</p></article>
            <article><Sparkles size={19} /><h3>Possible format</h3><p>A neutral written insight, motion storyboard, or clearly synthetic representative presenter—never your face or voice.</p></article>
            <article><Globe2 size={19} /><h3>Who may see it</h3><p>First you, the other participant, and a content reviewer. Only a later approved asset could become publicly viewable.</p></article>
            <article><Clock3 size={19} /><h3>Retention & withdrawal</h3><p>Prototype assumption: raw source deleted 30 days after review closes. You can withdraw before publication; post-publication removal is best-effort.</p></article>
          </div>
          <div className="consent-stage-actions">
            <button className="button button-secondary" type="button" onClick={() => onDecision(false)}>No, keep it private</button>
            <button className="button button-primary" type="button" onClick={() => setStage(1)}>Set my boundaries <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {stage === 1 && (
        <div className="consent-stage consent-boundaries">
          <div className="consent-stage-intro">
            <span className="question-number">Step 2 · Set boundaries</span>
            <h2>Your permission should be specific.</h2>
            <p>Neither option is selected for you. Recording consent and final publication approval remain separate.</p>
          </div>

          <fieldset className="boundary-group">
            <legend>What source may be considered?</legend>
            <div className="equal-consent-row">
              <button type="button" aria-pressed={scope === "selected-excerpts"} className={scope === "selected-excerpts" ? "selected" : ""} onClick={() => setScope("selected-excerpts")}><FileText size={18} /><span><strong>Selected helpful moments</strong><small>Only marked excerpts and nearby context</small></span></button>
              <button type="button" aria-pressed={scope === "full-transcript"} className={scope === "full-transcript" ? "selected" : ""} onClick={() => setScope("full-transcript")}><UsersRound size={18} /><span><strong>Full text transcript</strong><small>Available only to the sanitization process</small></span></button>
            </div>
          </fieldset>

          <fieldset className="boundary-group">
            <legend>May an approved privacy-preserving AI provider assist?</legend>
            <p>Production would show the selected provider, region, retention, and training policy before this choice.</p>
            <div className="equal-consent-row">
              <button type="button" aria-pressed={aiAllowed === false} className={aiAllowed === false ? "selected" : ""} onClick={() => setAiAllowed(false)}><ShieldCheck size={18} /><span><strong>Human/rules only</strong><small>No generative AI transformation</small></span></button>
              <button type="button" aria-pressed={aiAllowed === true} className={aiAllowed === true ? "selected" : ""} onClick={() => setAiAllowed(true)}><Bot size={18} /><span><strong>AI may assist</strong><small>Sanitize first; no training use allowed</small></span></button>
            </div>
          </fieldset>

          <div className="boundary-facts">
            <div><Clock3 size={15} /><span><strong>Source retention</strong><small>30 days after review closes (prototype assumption)</small></span></div>
            <div><RotateCcw size={15} /><span><strong>Withdrawal</strong><small>Any time before publication, with no penalty</small></span></div>
          </div>

          <div className="consent-stage-actions">
            <button className="button button-secondary" type="button" onClick={() => setStage(0)}><ArrowLeft size={15} /> Back</button>
            <button className="button button-primary" type="button" disabled={scope === null || aiAllowed === null} onClick={() => setStage(2)}>Check my understanding <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {stage === 2 && (
        <div className="consent-stage comprehension-stage">
          <div className="consent-stage-intro">
            <span className="question-number">Step 3 · Confirm understanding</span>
            <h2>One last check—in plain language.</h2>
            <p>You are considering transformation, not approving publication. You will review the sanitized draft and may request more redaction or reject it.</p>
          </div>

          <div className="consent-receipt">
            <h3>Your current boundaries</h3>
            <dl>
              <div><dt>Source</dt><dd>{scope === "selected-excerpts" ? "Selected helpful moments" : "Full text transcript"}</dd></div>
              <div><dt>AI assistance</dt><dd>{aiAllowed ? "Allowed only under disclosed privacy terms" : "Not allowed"}</dd></div>
              <div><dt>Recording</dt><dd>Not permitted · no recording exists</dd></div>
              <div><dt>Public release</dt><dd>Not approved · separate exact-version approval required</dd></div>
              <div><dt>Withdrawal</dt><dd>Available before publication without penalty</dd></div>
            </dl>
          </div>

          <label className="comprehension-check">
            <input type="checkbox" checked={understood} onChange={(event) => setUnderstood(event.target.checked)} />
            <span><strong>I understand this does not publish anything.</strong><small>I will see a sanitized version before any final approval, and either person can decline or request changes.</small></span>
          </label>

          <div className="final-consent-actions">
            <button className="final-decision" type="button" onClick={() => onDecision(false)}><span>Decline transformation</span><small>Keep the conversation private</small></button>
            <button className="final-decision" type="button" disabled={!understood} onClick={() => onDecision(true)}><span>Grant transformation consent</span><small>Continue to a private sanitized review</small></button>
          </div>
          <p className="consent-record-note"><LockKeyhole size={13} /> If granted, record: purpose “transformation,” policy v1.0, scope, AI choice, comprehension, and timestamp. No generic consent boolean.</p>
          <button className="reflection-back" type="button" onClick={() => setStage(1)}><ArrowLeft size={14} /> Back to boundaries</button>
        </div>
      )}
    </section>
  );
}
