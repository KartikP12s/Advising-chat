"use client";

import { EyeOff, LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { topics } from "@/data/seed";
import type { AvailabilityWindow, ConversationFormat, UserRole } from "@/lib/domain";

export interface JourneyProfile {
  role: Extract<UserRole, "seeker" | "advisor">;
  alias: string;
  topicId: string;
  description: string;
  format: ConversationFormat;
  availability: AvailabilityWindow;
  preferences: string[];
  language: string;
}

interface OnboardingStepProps {
  initialRole: JourneyProfile["role"];
  initialTopic?: string;
  onComplete: (profile: JourneyProfile) => void;
}

const aliases = ["Moss 28", "Cedar 64", "Orbit 17", "Pebble 53", "Lumen 31", "Wren 86"];

export function OnboardingStep({ initialRole, initialTopic, onComplete }: OnboardingStepProps) {
  const [aliasIndex, setAliasIndex] = useState(0);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JourneyProfile>({
    defaultValues: {
      role: initialRole,
      alias: aliases[0],
      topicId: initialTopic && topics.some((topic) => topic.id === initialTopic) ? initialTopic : "career-change",
      description: "I’m considering a move into a different kind of role, but I don’t know how to test it without risking the stability I have now.",
      format: "text",
      availability: "now",
      preferences: ["gentle-pace"],
      language: "English",
    },
  });
  const role = useWatch({ control, name: "role" });
  const description = useWatch({ control, name: "description" });

  const rotateAlias = () => setAliasIndex((value) => (value + 1) % aliases.length);

  return (
    <div className="journey-card onboarding-card">
      <div className="journey-card-heading">
        <span className="step-label">01 · A small beginning</span>
        <h1>Come as you are.<br />Leave your identity out of it.</h1>
        <p>We only ask for what improves the match. Your real name, employer, school, exact location, and social profiles are not part of this flow.</p>
      </div>

      <form className="onboarding-form" onSubmit={handleSubmit(onComplete)}>
        <fieldset className="form-section">
          <legend>How would you like to participate?</legend>
          <div className="choice-grid choice-grid-two">
            <label className={`choice-card ${role === "seeker" ? "selected" : ""}`}>
              <input type="radio" value="seeker" {...register("role")} />
              <span><strong>I’m looking for perspective</strong><small>Share what feels stuck and meet a relevant peer.</small></span>
            </label>
            <label className={`choice-card ${role === "advisor" ? "selected" : ""}`}>
              <input type="radio" value="advisor" {...register("role")} />
              <span><strong>I can share experience</strong><small>Offer perspective from something you have navigated.</small></span>
            </label>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Your session identity</legend>
          <div className="alias-field">
            <div className="generated-alias" aria-live="polite">
              <span className="alias-orb" aria-hidden="true" />
              <div><small>Generated for this session</small><strong>{aliases[aliasIndex]}</strong></div>
            </div>
            <button className="button button-secondary button-small" type="button" onClick={rotateAlias}>
              <RefreshCw size={14} /> New alias
            </button>
            <input type="hidden" value={aliases[aliasIndex]} {...register("alias")} readOnly />
          </div>
          <p className="field-note"><EyeOff size={13} /> This alias is separate from any future internal account identifier.</p>
        </fieldset>

        <fieldset className="form-section">
          <legend>{role === "advisor" ? "Where does your experience fit?" : "What would you like perspective on?"}</legend>
          <div className="topic-choice-grid">
            {topics.map((topic) => (
              <label className="compact-choice" key={topic.id}>
                <input type="radio" value={topic.id} {...register("topicId", { required: true })} />
                <span>{topic.label}</span>
              </label>
            ))}
          </div>
          {errors.topicId && <p className="field-error" role="alert">Choose one topic to continue.</p>}
        </fieldset>

        <div className="form-section">
          <label className="field-label" htmlFor="description">
            {role === "advisor" ? "What kinds of questions can you help with?" : "What do you hope to leave with?"}
          </label>
          <textarea
            id="description"
            rows={5}
            maxLength={500}
            aria-describedby="description-help"
            {...register("description", { required: "Add a little context so we can make a relevant match.", minLength: 20 })}
          />
          <div className="field-meta" id="description-help"><span>Keep names, companies, and precise locations out.</span><span>{description?.length ?? 0}/500</span></div>
          {errors.description && <p className="field-error" role="alert">{errors.description.message ?? "Please add at least 20 characters."}</p>}
        </div>

        <div className="form-row">
          <div className="form-section form-section-compact">
            <label className="field-label" htmlFor="format">Conversation format</label>
            <select id="format" {...register("format")}>
              <option value="text">Text chat · available now</option>
              <option value="audio-future">Text now, open to audio later</option>
              <option value="video-future">Text now, open to video later</option>
            </select>
            <p className="field-note">Recording is always off and requires separate agreement.</p>
          </div>
          <div className="form-section form-section-compact">
            <label className="field-label" htmlFor="availability">Availability</label>
            <select id="availability" {...register("availability")}>
              <option value="now">I’m ready now</option>
              <option value="today">Sometime today</option>
              <option value="this-week">Sometime this week</option>
            </select>
          </div>
        </div>

        <fieldset className="form-section">
          <legend>Optional comfort preferences</legend>
          <p className="legend-note">These improve fit when possible. They do not rank or exclude people.</p>
          <div className="preference-row">
            {[
              ["gentle-pace", "Gentle pace"],
              ["direct-feedback", "Direct feedback"],
              ["questions-first", "Questions first"],
              ["shared-experience", "Shared experience"],
            ].map(([value, label]) => (
              <label className="check-chip" key={value}>
                <input type="checkbox" value={value} {...register("preferences")} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="privacy-summary">
          <div><LockKeyhole size={18} /><span><strong>Temporarily stored</strong><small>Topic, request, alias, and conversation data for this prototype session.</small></span></div>
          <div><ShieldCheck size={18} /><span><strong>Never automatic</strong><small>Nothing becomes public without later, separate approval from both people.</small></span></div>
        </div>

        <div className="form-submit-row">
          <p>By continuing, you acknowledge this is peer guidance—not professional advice.</p>
          <button className="button button-primary" type="submit">
            {role === "advisor" ? "Enter advisor matching" : "Find a peer advisor"}
          </button>
        </div>
      </form>
    </div>
  );
}
