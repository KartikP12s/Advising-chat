"use client";

import Link from "next/link";
import { ArrowLeft, Check, FlaskConical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CandidatePreview } from "@/components/journey/candidate-preview";
import { ChatRoom } from "@/components/journey/chat-room";
import { ConsentFlow } from "@/components/journey/consent-flow";
import { MatchingLobby } from "@/components/journey/matching-lobby";
import { OnboardingStep, type JourneyProfile } from "@/components/journey/onboarding-step";
import { ReflectionFlow } from "@/components/journey/reflection-flow";
import { SanitizationReview } from "@/components/journey/sanitization-review";

type JourneyStep = "onboarding" | "matching" | "chat" | "reflection" | "consent" | "sanitization" | "candidate" | "private-complete";

const steps: { id: JourneyStep; label: string }[] = [
  { id: "onboarding", label: "Start" },
  { id: "matching", label: "Match" },
  { id: "chat", label: "Talk" },
  { id: "reflection", label: "Reflect" },
  { id: "consent", label: "Choose" },
  { id: "sanitization", label: "Review" },
  { id: "candidate", label: "Candidate" },
];

interface JourneyShellProps {
  initialRole: JourneyProfile["role"];
  initialTopic?: string;
}

export function JourneyShell({ initialRole, initialTopic }: JourneyShellProps) {
  const [step, setStep] = useState<JourneyStep>("onboarding");
  const [profile, setProfile] = useState<JourneyProfile | null>(null);
  const [withdrawn, setWithdrawn] = useState(false);
  const [candidateVersion, setCandidateVersion] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const currentIndex = Math.max(0, steps.findIndex((item) => item.id === step));

  useEffect(() => {
    contentRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const completeOnboarding = (nextProfile: JourneyProfile) => {
    setProfile(nextProfile);
    setStep("matching");
  };

  return (
    <main className="journey-shell" id="main-content">
      <div className="journey-progress" aria-label={`Prototype journey: ${steps[currentIndex]?.label ?? "Complete"}`}>
        <div className="journey-progress-inner">
          <Link className="journey-back" href="/"><ArrowLeft size={15} /> Home</Link>
          <ol>
            {steps.map((item, index) => (
              <li className={index < currentIndex ? "complete" : index === currentIndex ? "current" : ""} key={item.id}>
                <span>{index < currentIndex ? <Check size={11} /> : index + 1}</span>
                <small>{item.label}</small>
              </li>
            ))}
          </ol>
          <span className="prototype-badge"><FlaskConical size={13} /> Local demo</span>
        </div>
      </div>

      <div className="journey-content" ref={contentRef} tabIndex={-1}>
        {step === "onboarding" && <OnboardingStep initialRole={initialRole} initialTopic={initialTopic} onComplete={completeOnboarding} />}
        {step === "matching" && profile && (
          <MatchingLobby profile={profile} onCancel={() => setStep("onboarding")} onAccept={() => setStep("chat")} />
        )}
        {step === "chat" && profile && <ChatRoom alias={profile.alias} topicId={profile.topicId} onEnd={() => setStep("reflection")} />}
        {step === "reflection" && (
          <ReflectionFlow
            onComplete={(optedIn) => setStep(optedIn ? "consent" : "private-complete")}
          />
        )}
        {step === "consent" && (
          <ConsentFlow onDecision={(approved) => setStep(approved ? "sanitization" : "private-complete")} />
        )}
        {step === "sanitization" && (
          <SanitizationReview
            onApprove={(version) => {
              setCandidateVersion(version);
              setStep("candidate");
            }}
            onReject={() => setStep("private-complete")}
          />
        )}
        {step === "candidate" && (
          <CandidatePreview version={candidateVersion} withdrawn={withdrawn} onWithdraw={() => setWithdrawn(true)} />
        )}
        {step === "private-complete" && (
          <section className="journey-card private-complete-card">
            <span className="private-complete-icon"><Check size={24} /></span>
            <span className="step-label">Your choice is recorded</span>
            <h1>The conversation stays private.</h1>
            <p>Declining content transformation changes nothing about your access or reputation. The other participant only sees that the conversation is not eligible—not how you answered.</p>
            <div className="private-complete-actions">
              <button className="button button-secondary" type="button" onClick={() => setStep("onboarding")}>Start another demo</button>
              <Link className="button button-primary" href="/research">View research dashboard</Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
