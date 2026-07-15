"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Check, Clock3, FileCheck2, Film, LockKeyhole, Pause, Play, RotateCcw, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/avatar";
import { StatusPill } from "@/components/status-pill";

interface CandidatePreviewProps {
  version: number;
  withdrawn: boolean;
  onWithdraw: () => void;
}

const scenes = [
  { label: "The tension", title: "A decision that feels permanent", copy: "When every option feels irreversible, clarity gets harder—not easier.", accent: "coral" },
  { label: "The shift", title: "Treat the next move as evidence", copy: "A useful experiment can create clarity without requiring a leap.", accent: "sage" },
  { label: "The practice", title: "Reversible. Specific. Useful.", copy: "Choose one small action that teaches you something even when the answer is no.", accent: "lavender" },
];

export function CandidatePreview({ version, withdrawn, onWithdraw }: CandidatePreviewProps) {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const withdrawDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing || withdrawn) return;
    const interval = window.setInterval(() => setScene((value) => (value + 1) % scenes.length), 2300);
    return () => window.clearInterval(interval);
  }, [playing, withdrawn]);

  useEffect(() => {
    if (!withdrawOpen) return;
    withdrawDialogRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWithdrawOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [withdrawOpen]);

  const currentScene = scenes[scene];

  return (
    <section className="journey-card candidate-card">
      <header className="candidate-header">
        <div>
          <StatusPill tone={withdrawn ? "danger" : "success"}>{withdrawn ? <AlertTriangle size={11} /> : <Check size={11} />}{withdrawn ? "Consent withdrawn" : "Approved content candidate"}</StatusPill>
          <h1>One conversation.<br />One carefully held idea.</h1>
          <p>This is a believable storyboard and production handoff—not a generated video. It uses neutral representative visuals and never imitates either participant.</p>
        </div>
        <div className="candidate-id"><small>Candidate</small><strong>CG–014</strong><span>Sanitized v{version}</span></div>
      </header>

      {withdrawn && (
        <div className="withdrawal-banner" role="alert"><AlertTriangle size={18} /><span><strong>Publication and production are on hold.</strong> Withdrawal event recorded. The candidate remains visible only for audit and deletion workflow; it cannot advance.</span></div>
      )}

      <div className="candidate-layout">
        <div className="storyboard-panel">
          <div className={`storyboard-stage scene-${currentScene.accent}`}>
            <div className="storyboard-chrome"><span>Representative motion storyboard</span><span>00:0{scene * 4 + 1} / 02:24</span></div>
            <div className="storyboard-content">
              <div className="presenter-pair" aria-label="Two abstract representative presenters">
                <Avatar seed="moss" size="large" />
                <span className="dialogue-wave" aria-hidden="true"><i /><i /><i /><i /><i /></span>
                <Avatar seed="ember" size="large" />
              </div>
              <span className="storyboard-scene-label">0{scene + 1} · {currentScene.label}</span>
              <h2>{currentScene.title}</h2>
              <p>{currentScene.copy}</p>
            </div>
            <button className="storyboard-play" type="button" disabled={withdrawn} onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause storyboard" : "Play storyboard"}>{playing ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}</button>
            <div className="storyboard-progress" aria-hidden="true"><span style={{ width: `${((scene + 1) / scenes.length) * 100}%` }} /></div>
          </div>
          <div className="scene-selector">
            {scenes.map((item, index) => <button className={index === scene ? "active" : ""} type="button" onClick={() => { setScene(index); setPlaying(false); }} key={item.label}><span>0{index + 1}</span><strong>{item.label}</strong><small>{item.title}</small></button>)}
          </div>
          <p className="synthetic-disclosure"><Sparkles size={14} /> Final media must clearly disclose that presenters are synthetic or representative and are not the original participants.</p>
        </div>

        <aside className="candidate-spec">
          <div className="candidate-spec-head"><span className="step-label">Editorial brief</span><StatusPill tone={withdrawn ? "danger" : "success"}>{withdrawn ? "Blocked" : "Safety clear"}</StatusPill></div>
          <h2>Turn a high-stakes decision into a small experiment</h2>
          <div className="candidate-narrative">
            <div><span>Problem</span><p>A career choice feels like a permanent verdict, making it difficult to gather useful evidence.</p></div>
            <div><span>Breakthrough</span><p>Reframe the next move as a small, reversible experiment.</p></div>
            <div><span>Takeaways</span><ul><li>Remove identity pressure</li><li>Define evidence first</li><li>Prefer reversible next steps</li></ul></div>
          </div>
          <blockquote>“Make the next step reversible, specific, and useful even if the answer turns out to be no.”<cite>— Sanitized dialogue excerpt</cite></blockquote>
          <div className="tag-row"><span>career change</span><span>decision-making</span><span>experiments</span></div>
        </aside>
      </div>

      <div className="candidate-gates">
        <div><ShieldCheck size={18} /><span><small>Content safety</small><strong>Clear · one indirect detail generalized</strong></span></div>
        <div><UsersRound size={18} /><span><small>Consent state</small><strong>{withdrawn ? "Withdrawal supersedes approvals" : `2 of 2 approved sanitized v${version}`}</strong></span></div>
        <div><Clock3 size={18} /><span><small>Estimated duration</small><strong>2 min 24 sec</strong></span></div>
        <div><FileCheck2 size={18} /><span><small>Final approval</small><strong>{withdrawn ? "Invalidated" : "Ready for production review"}</strong></span></div>
      </div>

      <div className="production-estimates">
        <div className="estimate-heading"><span className="step-label">Production estimate · editable assumptions</span><h2>Start human. Automate only what earns trust.</h2></div>
        <article><span className="estimate-icon"><UsersRound size={18} /></span><div><strong>Manual pilot</strong><small>Privacy review, script, motion edit, QA</small></div><dl><div><dt>Human time</dt><dd>2.5–4 hr</dd></div><div><dt>Cash cost</dt><dd>$0–$35</dd></div></dl></article>
        <article><span className="estimate-icon"><Sparkles size={18} /></span><div><strong>AI-assisted</strong><small>Human review with synthetic storyboard</small></div><dl><div><dt>Human time</dt><dd>50–90 min</dd></div><div><dt>Vendor cost</dt><dd>$1–$10</dd></div></dl></article>
        <article><span className="estimate-icon"><Film size={18} /></span><div><strong>Mostly automated</strong><small>Not recommended for first 20</small></div><dl><div><dt>Human QA</dt><dd>25–45 min</dd></div><div><dt>Vendor cost</dt><dd>$3–$18</dd></div></dl></article>
      </div>

      <div className="candidate-footer-actions">
        <div><LockKeyhole size={15} /><p><strong>You still have control.</strong> Before publication, either person can withdraw. After publication, removal is best-effort because copies may exist elsewhere.</p></div>
        <button className="button button-secondary" type="button" disabled={withdrawn} onClick={() => setWithdrawOpen(true)}><RotateCcw size={15} /> Withdraw consent</button>
        <Link className="button button-primary" href="/research">Open research dashboard <ArrowRight size={16} /></Link>
      </div>

      {withdrawOpen && (
        <div className="dialog-backdrop" role="presentation">
          <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="withdraw-title" aria-describedby="withdraw-description" ref={withdrawDialogRef} tabIndex={-1}>
            <span className="dialog-icon"><RotateCcw size={22} /></span>
            <h2 id="withdraw-title">Withdraw transformation and publication approval?</h2>
            <p id="withdraw-description">This immediately blocks production and publication. It does not affect your account, reputation, or ability to use Common Ground.</p>
            <div className="dialog-actions">
              <button className="button button-secondary" type="button" onClick={() => setWithdrawOpen(false)}>Keep approval</button>
              <button className="button button-danger" type="button" onClick={() => { onWithdraw(); setWithdrawOpen(false); }}>Withdraw now</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
