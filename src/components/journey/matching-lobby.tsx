"use client";

import { AlertTriangle, ArrowRight, Ban, Check, Info, Radar, RotateCcw, ShieldCheck, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Avatar } from "@/components/avatar";
import type { JourneyProfile } from "@/components/journey/onboarding-step";
import { StatusPill } from "@/components/status-pill";
import { topics } from "@/data/seed";

interface ApiMatch {
  advisor: {
    id: string;
    alias: string;
    experienceSummary: string;
    experienceTopicIds: string[];
    availability: string[];
    preferenceTags: string[];
  };
  score: number;
  reasons: string[];
  breakdown: Record<string, number>;
}

interface MatchingLobbyProps {
  profile: JourneyProfile;
  onCancel: () => void;
  onAccept: () => void;
}

type LobbyState = "searching" | "found" | "error" | "reported";

export function MatchingLobby({ profile, onCancel, onAccept }: MatchingLobbyProps) {
  const [state, setState] = useState<LobbyState>("searching");
  const [matches, setMatches] = useState<ApiMatch[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const topic = topics.find((item) => item.id === profile.topicId) ?? topics[0];

  const findMatch = useCallback(async (signal?: AbortSignal) => {
    setState("searching");
    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: profile.topicId,
          preferredFormat: profile.format,
          availability: profile.availability,
          language: profile.language,
          preferences: profile.preferences,
        }),
        signal,
      });
      if (!response.ok) throw new Error("Match service unavailable");
      const data = (await response.json()) as { matches: ApiMatch[] };
      setMatches(data.matches);
      setMatchIndex(0);
      setState("found");
    } catch (error) {
      if ((error as Error).name !== "AbortError") setState("error");
    }
  }, [profile]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void findMatch(controller.signal), 800);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [findMatch]);

  const current = matches[matchIndex];
  const counterpart = profile.role === "advisor"
    ? {
        alias: "Moss 28",
        summary: "Wants a grounded way to test a career change without making an irreversible leap.",
        score: 91,
        reasons: ["Your experience directly matches", "Both available now", "Text-first preference aligns"],
      }
    : current
      ? { alias: current.advisor.alias, summary: current.advisor.experienceSummary, score: current.score, reasons: current.reasons }
      : null;

  const skip = () => {
    if (matches.length > 1 && matchIndex < matches.length - 1) {
      setMatchIndex((index) => index + 1);
    } else {
      void findMatch();
    }
  };

  if (state === "error") {
    return (
      <section className="journey-card matching-card matching-error" aria-live="polite">
        <span className="matching-state-icon"><AlertTriangle size={24} /></span>
        <span className="step-label">Connection interrupted</span>
        <h1>The lobby lost its place.</h1>
        <p>Your request is still on this device. Try the deterministic matcher again or return to edit your request.</p>
        <div className="centered-actions">
          <button className="button button-secondary" type="button" onClick={onCancel}>Edit request</button>
          <button className="button button-primary" type="button" onClick={() => void findMatch()}><RotateCcw size={15} /> Try again</button>
        </div>
      </section>
    );
  }

  if (state === "reported") {
    return (
      <section className="journey-card matching-card matching-error" aria-live="polite">
        <span className="matching-state-icon"><ShieldCheck size={24} /></span>
        <span className="step-label">Report received privately</span>
        <h1>We removed that match.</h1>
        <p>The other person is not told who reported them. This prototype records the safety state without exposing your request.</p>
        <div className="centered-actions">
          <button className="button button-secondary" type="button" onClick={onCancel}>Leave matching</button>
          <button className="button button-primary" type="button" onClick={() => { setState("searching"); void findMatch(); }}>Find another match</button>
        </div>
      </section>
    );
  }

  if (state === "searching" || !counterpart) {
    return (
      <section className="journey-card matching-card" aria-live="polite">
        <div className="radar-visual" aria-hidden="true">
          <span className="radar-ring radar-ring-one" />
          <span className="radar-ring radar-ring-two" />
          <span className="radar-sweep" />
          <span className="radar-center"><Radar size={24} /></span>
          <span className="radar-node radar-node-one" />
          <span className="radar-node radar-node-two" />
          <span className="radar-node radar-node-three" />
        </div>
        <span className="step-label">Matching on {topic.label.toLowerCase()}</span>
        <h1>Looking for useful overlap.</h1>
        <p>We’re comparing topic experience, availability, language, and the preferences you chose. We do not claim to predict human chemistry.</p>
        <div className="matching-factors">
          <span className="active"><Check size={13} /> Topic relevance</span>
          <span className="active"><Check size={13} /> Available now</span>
          <span><span className="tiny-spinner" /> Comfort fit</span>
        </div>
        <p className="estimated-status">Checking a small pool of seeded peers · no fake wait-time estimate</p>
        <button className="button button-secondary" type="button" onClick={onCancel}><X size={15} /> Cancel safely</button>
        <div className="safety-reminder"><ShieldCheck size={15} /> Keep names, workplaces, and contact details out of the conversation.</div>
      </section>
    );
  }

  return (
    <section className="journey-card match-found-card" aria-live="polite">
      <div className="match-found-heading">
        <div>
          <StatusPill tone="success"><Check size={11} /> Match found</StatusPill>
          <h1>There may be common ground here.</h1>
          <p>Review only the experience relevant to your request. No real name, workplace, precise location, reviews, or popularity score is shown.</p>
        </div>
        <div className="compatibility-ring" aria-label={`${counterpart.score} out of 100 transparent match score`}>
          <span>{counterpart.score}</span><small>/100</small>
        </div>
      </div>

      <div className="anonymous-match-card">
        <div className="match-person">
          <Avatar seed={profile.role === "advisor" ? "moss" : matchIndex === 0 ? "ember" : "sage"} size="large" pulse />
          <div>
            <span className="step-label">Anonymous {profile.role === "advisor" ? "seeker" : "peer advisor"}</span>
            <h2>{counterpart.alias}</h2>
            <StatusPill tone="info">Text · available now</StatusPill>
          </div>
        </div>
        <p className="match-summary">{counterpart.summary}</p>
        <div className="match-reasons">
          <h3>Why this match is shown</h3>
          <ul>
            {counterpart.reasons.slice(0, 3).map((reason) => <li key={reason}><Check size={14} /> {reason}</li>)}
          </ul>
        </div>
        <div className="score-explanation"><Info size={15} /><p><strong>Transparent prototype scoring</strong> Topic 35%, experience 20%, format 15%, availability 10%, language 10%, preferences 10%. Safety eligibility and capacity are gates.</p></div>
      </div>

      <div className="match-actions">
        <button className="button button-secondary" type="button" onClick={skip}>Skip quietly</button>
        <button className="button button-primary" type="button" onClick={onAccept}>Accept private match <ArrowRight size={16} /></button>
      </div>
      <button className="report-link" type="button" onClick={() => setState("reported")}><Ban size={13} /> Report this match</button>
    </section>
  );
}
