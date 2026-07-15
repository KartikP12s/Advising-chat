"use client";

import { ArrowLeft, ArrowRight, BadgeCheck, Check, EyeOff, Heart, LockKeyhole, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface ReflectionFlowProps {
  onComplete: (optedIn: boolean) => void;
}

const reflectionSteps = ["Helped?", "Value", "Useful part", "Could help others?", "Consider sharing?"];

export function ReflectionFlow({ onComplete }: ReflectionFlowProps) {
  const [stage, setStage] = useState(0);
  const [helped, setHelped] = useState<boolean | null>(null);
  const [value, setValue] = useState<number | null>(null);
  const [usefulPart, setUsefulPart] = useState("Turning the decision into a small, reversible experiment instead of one permanent choice.");
  const [couldHelp, setCouldHelp] = useState<boolean | null>(null);
  const [optIn, setOptIn] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [otherResponded, setOtherResponded] = useState(false);
  const transformationEligible = helped === true && couldHelp === true && optIn === true;

  useEffect(() => {
    if (!submitted) return;
    const timer = window.setTimeout(() => setOtherResponded(true), 900);
    return () => window.clearTimeout(timer);
  }, [submitted]);

  const answerBoolean = (setter: (answer: boolean) => void, answer: boolean) => {
    setter(answer);
    setStage((current) => current + 1);
  };

  if (submitted) {
    return (
      <section className="journey-card reflection-card sealed-response" aria-live="polite">
        <span className="reflection-seal"><BadgeCheck size={26} /></span>
        <span className="step-label">Your reflection is sealed</span>
        <h1>{otherResponded ? "Both people have responded." : "Waiting without pressure."}</h1>
        <p>
          {otherResponded
            ? transformationEligible
              ? "The mutual value and interest conditions were met. Individual ratings and written reflections remain private."
              : "The reuse gate is closed and the conversation will stay private. Individual answers and who closed the gate remain private."
            : "Ember 42 cannot see how you answered, and you cannot see theirs. There is no deadline or reminder designed to pressure a response."}
        </p>
        <div className="sealed-status-grid">
          <div><span className="consent-monogram consent-monogram-one">M</span><div><strong>Your reflection</strong><small>Submitted privately</small></div><Check size={16} /></div>
          <div><span className="consent-monogram consent-monogram-two">E</span><div><strong>Ember 42</strong><small>{otherResponded ? "Submitted privately" : "Not yet responded"}</small></div>{otherResponded ? <Check size={16} /> : <span className="waiting-dot" />}</div>
        </div>
        <div className="privacy-explanation"><EyeOff size={16} /><span><strong>What gets compared</strong><small>Only eligibility conditions: both found value, both see possible broader value, and both independently chose to consider transformation.</small></span></div>
        <button className="button button-primary" type="button" disabled={!otherResponded} onClick={() => onComplete(transformationEligible)}>
          {transformationEligible ? "Review the separate consent details" : "Finish privately"} <ArrowRight size={16} />
        </button>
      </section>
    );
  }

  return (
    <section className="journey-card reflection-card">
      <header className="reflection-header">
        <div><span className="step-label">Private reflection</span><h1>Keep the signal.<br />Leave the pressure.</h1></div>
        <div className="reflection-lock"><LockKeyhole size={16} /><span><strong>Only you see this form</strong><small>Answers stay hidden until both submit</small></span></div>
      </header>

      <div className="reflection-progress" aria-label={`Question ${stage + 1} of ${reflectionSteps.length}`}>
        {reflectionSteps.map((label, index) => <span className={index <= stage ? "active" : ""} key={label}><i />{label}</span>)}
      </div>

      <div className="reflection-question" aria-live="polite">
        {stage === 0 && (
          <>
            <span className="question-number">Question 1 of 5</span>
            <h2>Did this conversation help you?</h2>
            <p>There is no “right” answer. Honest feedback improves the experience and never affects either person’s reputation.</p>
            <div className="large-choice-row">
              <button type="button" onClick={() => answerBoolean(setHelped, false)}><span>No</span><small>It did not help this time</small></button>
              <button type="button" onClick={() => answerBoolean(setHelped, true)}><span>Yes</span><small>I’m leaving with something useful</small></button>
            </div>
          </>
        )}

        {stage === 1 && (
          <>
            <span className="question-number">Question 2 of 5</span>
            <h2>How valuable was it?</h2>
            <p>Think about clarity, emotional relief, or one concrete next step—not whether every question was solved.</p>
            <div className="value-scale" role="radiogroup" aria-label="Conversation value from one to five">
              {[1, 2, 3, 4, 5].map((score) => (
                <button className={value === score ? "selected" : ""} type="button" role="radio" aria-checked={value === score} key={score} onClick={() => setValue(score)}><strong>{score}</strong><small>{["Not useful", "A little", "Useful", "Very useful", "A turning point"][score - 1]}</small></button>
              ))}
            </div>
            <button className="button button-primary reflection-next" type="button" disabled={value === null} onClick={() => setStage(2)}>Continue <ArrowRight size={16} /></button>
          </>
        )}

        {stage === 2 && (
          <>
            <span className="question-number">Question 3 of 5</span>
            <h2>What part was most useful?</h2>
            <p>This private note helps identify the insight—not a publishable quote. You can paraphrase and leave personal details out.</p>
            <label className="sr-only" htmlFor="useful-part">Most useful part</label>
            <textarea id="useful-part" rows={5} maxLength={400} value={usefulPart} onChange={(event) => setUsefulPart(event.target.value)} />
            <div className="field-meta"><span>Private reflection</span><span>{usefulPart.length}/400</span></div>
            <button className="button button-primary reflection-next" type="button" disabled={usefulPart.trim().length < 10} onClick={() => setStage(3)}>Continue <ArrowRight size={16} /></button>
          </>
        )}

        {stage === 3 && (
          <>
            <span className="question-number">Question 4 of 5</span>
            <h2>Could the core insight help someone else?</h2>
            <p>This is only a value signal. Choosing yes does not grant permission to use the transcript or create content.</p>
            <div className="large-choice-row">
              <button type="button" onClick={() => answerBoolean(setCouldHelp, false)}><span>Probably not</span><small>It felt specific to me</small></button>
              <button type="button" onClick={() => answerBoolean(setCouldHelp, true)}><span>Possibly</span><small>The takeaway may travel</small></button>
            </div>
          </>
        )}

        {stage === 4 && (
          <>
            <span className="question-number">Question 5 of 5</span>
            <h2>Would you consider a separate, anonymous content review?</h2>
            <p>This is not final consent. If both people are open, you will next see exactly what source material, AI use, retention, review, and withdrawal would mean.</p>
            <div className="equal-consent-row">
              <button type="button" aria-pressed={optIn === false} onClick={() => setOptIn(false)} className={optIn === false ? "selected" : ""}><Heart size={18} /><span><strong>Keep it private</strong><small>A complete and welcome choice</small></span></button>
              <button type="button" aria-pressed={optIn === true} onClick={() => setOptIn(true)} className={optIn === true ? "selected" : ""}><Sparkles size={18} /><span><strong>Show me the details</strong><small>I may consider a sanitized version</small></span></button>
            </div>
            <p className="decline-note">Declining is easy, neutral, and has no effect on platform access.</p>
            <button className="button button-primary reflection-next" type="button" disabled={optIn === null} onClick={() => setSubmitted(true)}>Seal my reflection <LockKeyhole size={15} /></button>
          </>
        )}
      </div>

      {stage > 0 && <button className="reflection-back" type="button" onClick={() => setStage((current) => current - 1)}><ArrowLeft size={14} /> Back</button>}

      <span className="sr-only" aria-live="polite">Helped answer: {String(helped)}. Could help others: {String(couldHelp)}.</span>
    </section>
  );
}
