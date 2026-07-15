import { z } from "zod";
import type { AdvisorProfile, AvailabilityWindow, ConversationFormat } from "@/lib/domain";

export const matchInputSchema = z.object({
  topicId: z.string().min(1),
  preferredFormat: z.enum(["text", "audio-future", "video-future"]),
  availability: z.enum(["now", "today", "this-week"]),
  language: z.string().min(2),
  preferences: z.array(z.string()).max(8).default([]),
});

export type MatchInput = z.infer<typeof matchInputSchema>;

export interface MatchableAdvisor extends AdvisorProfile {
  alias: string;
  language: string;
  preferenceTags: string[];
}

export interface ScoredMatch {
  advisor: MatchableAdvisor;
  score: number;
  reasons: string[];
  breakdown: {
    topic: number;
    experience: number;
    format: number;
    availability: number;
    language: number;
    preferences: number;
  };
}

const availabilityMatches = (requested: AvailabilityWindow, offered: AvailabilityWindow[]) => {
  if (offered.includes(requested)) return true;
  if (requested === "now") return false;
  return offered.includes("now") || (requested === "this-week" && offered.includes("today"));
};

const formatMatches = (requested: ConversationFormat, offered: ConversationFormat[]) =>
  offered.includes(requested) || (requested !== "text" && offered.includes("text"));

export function scoreAdvisor(input: MatchInput, advisor: MatchableAdvisor): ScoredMatch {
  const topic = advisor.experienceTopicIds.includes(input.topicId) ? 35 : 0;
  const experience = topic > 0 ? Math.min(20, 8 + advisor.experienceTopicIds.length * 3) : 4;
  const format = formatMatches(input.preferredFormat, advisor.formats) ? 15 : 0;
  const availability = availabilityMatches(input.availability, advisor.availability) ? 10 : 0;
  const language = advisor.language.toLowerCase() === input.language.toLowerCase() ? 10 : 0;
  const sharedPreferences = input.preferences.filter((item) => advisor.preferenceTags.includes(item));
  const preferences = Math.min(10, sharedPreferences.length * 5);
  const capacityPenalty = advisor.capacity <= 0 ? 20 : 0;
  const safetyPenalty = advisor.safetyEligible ? 0 : 100;
  const score = Math.max(
    0,
    Math.min(100, topic + experience + format + availability + language + preferences - capacityPenalty - safetyPenalty),
  );

  const reasons = [
    topic ? "Relevant lived experience" : "Adjacent topic experience",
    availability ? "Available in your window" : "Availability may need coordination",
    language ? `Speaks ${input.language}` : "Language preference differs",
    sharedPreferences.length ? `Matches ${sharedPreferences.join(" and ")}` : "No optional preference match used",
  ];

  return {
    advisor,
    score,
    reasons,
    breakdown: { topic, experience, format, availability, language, preferences },
  };
}

export function findBestMatches(input: MatchInput, advisors: MatchableAdvisor[]): ScoredMatch[] {
  const parsed = matchInputSchema.parse(input);
  return advisors
    .map((advisor) => scoreAdvisor(parsed, advisor))
    .filter((match) => match.advisor.safetyEligible && match.advisor.capacity > 0)
    .sort((a, b) => b.score - a.score || a.advisor.id.localeCompare(b.advisor.id));
}
