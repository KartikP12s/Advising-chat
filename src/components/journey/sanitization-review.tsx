"use client";

import { ArrowRight, Bot, Check, Eye, EyeOff, FileCheck2, Flag, LockKeyhole, RefreshCw, Scissors, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Avatar } from "@/components/avatar";
import { rawSanitizationDemo } from "@/data/seed";
import { localSanitizationNotice, sanitizeTranscript } from "@/lib/sanitization";

interface SanitizationReviewProps {
  onApprove: (version: number) => void;
  onReject: () => void;
}

type ReviewTab = "changes" | "preview" | "summary";

export function SanitizationReview({ onApprove, onReject }: SanitizationReviewProps) {
  const automaticResult = useMemo(() => sanitizeTranscript(rawSanitizationDemo, ["Maya", "Maria"]), []);
  const [tab, setTab] = useState<ReviewTab>("changes");
  const [sanitized, setSanitized] = useState(automaticResult.sanitized);
  const [version, setVersion] = useState(1);
  const [redactionText, setRedactionText] = useState("decide by Friday");
  const [requestMessage, setRequestMessage] = useState("");
  const [yourApproval, setYourApproval] = useState(false);
  const [otherApproval, setOtherApproval] = useState(false);

  useEffect(() => {
    if (!yourApproval) return;
    const timer = window.setTimeout(() => setOtherApproval(true), 750);
    return () => window.clearTimeout(timer);
  }, [yourApproval, version]);

  const requestRedaction = () => {
    const text = redactionText.trim();
    if (!text) return;
    const index = sanitized.toLowerCase().indexOf(text.toLowerCase());
    if (index < 0) {
      setRequestMessage("That exact text is not in the sanitized preview. Copy a shorter phrase and try again.");
      return;
    }
    setSanitized(`${sanitized.slice(0, index)}[participant redaction]${sanitized.slice(index + text.length)}`);
    setVersion((current) => current + 1);
    setYourApproval(false);
    setOtherApproval(false);
    setRedactionText("");
    setRequestMessage("A new version was created. Any earlier approval was invalidated.");
    setTab("preview");
  };

  return (
    <section className="journey-card sanitization-card">
      <header className="sanitization-header">
        <div>
          <span className="step-label">Participant review · sanitized version {version}</span>
          <h1>Private detail out.<br />Useful meaning intact.</h1>
          <p>Review every change, request more redaction, or reject the result. A content reviewer sees only this sanitized candidate—not the raw conversation.</p>
        </div>
        <div className="privacy-score" aria-label={`${automaticResult.riskCount} privacy risks addressed`}><span>{automaticResult.riskCount}</span><small>risks addressed</small></div>
      </header>

      <div className="local-processing-note"><ShieldCheck size={15} /><span><strong>Local prototype process</strong>{localSanitizationNotice}</span></div>

      <div className="review-tabs" role="tablist" aria-label="Sanitization review views">
        <button className={tab === "changes" ? "active" : ""} type="button" role="tab" aria-selected={tab === "changes"} onClick={() => setTab("changes")}><Scissors size={15} /> Changes</button>
        <button className={tab === "preview" ? "active" : ""} type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")}><Eye size={15} /> Safe preview</button>
        <button className={tab === "summary" ? "active" : ""} type="button" role="tab" aria-selected={tab === "summary"} onClick={() => setTab("summary")}><Sparkles size={15} /> Educational summary</button>
      </div>

      {tab === "changes" && (
        <div className="changes-view" role="tabpanel">
          <div className="transcript-column raw-column">
            <div className="transcript-column-head"><span><EyeOff size={14} /> Private source</span><small>visible to participants only</small></div>
            <div className="transcript-paper">
              {rawSanitizationDemo.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <div className="change-divider" aria-hidden="true"><ArrowRight size={18} /></div>
          <div className="transcript-column safe-column">
            <div className="transcript-column-head"><span><ShieldCheck size={14} /> Sanitized version {version}</span><small>eligible for content review</small></div>
            <div className="transcript-paper">
              {sanitized.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <div className="redaction-log">
            <h2>Why these changes were made</h2>
            <div className="redaction-list">
              {automaticResult.redactions.map((redaction, index) => (
                <div key={`${redaction.original}-${index}`}>
                  <span className={`risk-level ${redaction.confidence === "review-needed" ? "review" : "removed"}`}>{redaction.confidence === "review-needed" ? <Flag size={11} /> : <Check size={11} />}{redaction.category.replace("-", " ")}</span>
                  <code>{redaction.original}</code>
                  <ArrowRight size={12} />
                  <code>{redaction.replacement}</code>
                  <p>{redaction.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "preview" && (
        <div className="safe-preview" role="tabpanel">
          <div className="safe-preview-document">
            <div className="document-label"><FileCheck2 size={15} /> Candidate draft · version {version}</div>
            <h2>Testing a career change without making it irreversible</h2>
            {sanitized.split("\n\n").map((paragraph) => {
              const [speaker, ...body] = paragraph.split(":");
              const speakerA = speaker.includes("Speaker A");
              return (
                <div className="safe-dialogue" key={paragraph}>
                  <Avatar seed={speakerA ? "moss" : "ember"} size="small" />
                  <div><strong>{speaker}</strong><p>{body.join(":")}</p></div>
                </div>
              );
            })}
          </div>
          <aside className="participant-redaction-panel">
            <span className="step-label">You are the final privacy check</span>
            <h2>See something too specific?</h2>
            <p>Paste the exact phrase you want removed. This creates a new version and invalidates previous approvals.</p>
            <label htmlFor="additional-redaction">Text to redact</label>
            <textarea id="additional-redaction" rows={3} value={redactionText} onChange={(event) => setRedactionText(event.target.value)} placeholder="Copy a phrase from the preview" />
            <button className="button button-secondary" type="button" onClick={requestRedaction}><Scissors size={15} /> Request this redaction</button>
            {requestMessage && <p className="request-message" role="status">{requestMessage}</p>}
          </aside>
        </div>
      )}

      {tab === "summary" && (
        <div className="summary-view" role="tabpanel">
          <div className="summary-main">
            <span className="step-label"><Bot size={12} /> Deterministic prototype output · not sent to AI</span>
            <h2>Turn an irreversible decision into a reversible experiment</h2>
            <p className="summary-lede">When a career decision feels like a verdict, shrink it into a time-boxed experiment designed to produce useful evidence.</p>
            <h3>Reusable takeaways</h3>
            <ol>
              <li><span>01</span><p><strong>Separate identity from evidence.</strong> Remove company names and social pressure from the decision you are actually testing.</p></li>
              <li><span>02</span><p><strong>Make the next step reversible.</strong> Choose a small trial that creates information even if the answer becomes “no.”</p></li>
              <li><span>03</span><p><strong>Define useful evidence first.</strong> Decide what you need to learn before starting the experiment.</p></li>
            </ol>
          </div>
          <aside className="summary-metadata">
            <dl>
              <div><dt>Suggested title</dt><dd>Turn a high-stakes decision into a small experiment</dd></div>
              <div><dt>Topic tags</dt><dd><span>career change</span><span>decision-making</span><span>experiments</span></dd></div>
              <div><dt>Indirect risk</dt><dd>One phrase generalized; participant review required</dd></div>
              <div><dt>Presenter rule</dt><dd>Representative synthetic narrator only</dd></div>
            </dl>
          </aside>
        </div>
      )}

      <div className="version-approval-bar">
        <div>
          <span className="step-label">Exact-version approval gate</span>
          <h2>Both people must approve version {version}</h2>
        </div>
        <div className="mini-approval-states">
          <span className={yourApproval ? "approved" : ""}><i>M</i><small>You</small>{yourApproval ? <Check size={13} /> : "Pending"}</span>
          <span className={otherApproval ? "approved" : ""}><i>E</i><small>Ember 42</small>{otherApproval ? <Check size={13} /> : yourApproval ? "Reviewing" : "Pending"}</span>
        </div>
        <div className="version-approval-actions">
          <button className="button button-secondary" type="button" onClick={onReject}>Reject &amp; keep private</button>
          {!yourApproval ? (
            <button className="button button-primary" type="button" onClick={() => setYourApproval(true)}>Approve version {version}</button>
          ) : otherApproval ? (
            <button className="button button-primary" type="button" onClick={() => onApprove(version)}>Create content candidate <ArrowRight size={16} /></button>
          ) : (
            <button className="button button-secondary" type="button" disabled><RefreshCw size={15} /> Waiting for private review</button>
          )}
        </div>
      </div>
      <p className="approval-fineprint"><LockKeyhole size={13} /> Approval is timestamped against version {version}. Any material revision creates version {version + 1} and resets both approvals.</p>
    </section>
  );
}
