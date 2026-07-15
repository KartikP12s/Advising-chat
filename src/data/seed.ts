import type { ContentCandidate, Message, Topic } from "@/lib/domain";
import type { MatchableAdvisor } from "@/lib/matching";

export const topics: Topic[] = [
  { id: "career-change", label: "Career change", description: "Make a thoughtful move without losing your footing.", accent: "coral" },
  { id: "first-manager", label: "First-time manager", description: "Lead former peers with clarity and care.", accent: "sage" },
  { id: "creative-block", label: "Creative block", description: "Find momentum when the work feels stuck.", accent: "lavender" },
  { id: "moving-city", label: "Moving somewhere new", description: "Build a life and community from scratch.", accent: "sky" },
  { id: "caregiving", label: "Caregiving balance", description: "Protect energy while showing up for someone.", accent: "amber" },
  { id: "starting-over", label: "Starting over", description: "Turn an uncertain chapter into practical next steps.", accent: "rose" },
];

export const advisors: MatchableAdvisor[] = [
  {
    id: "advisor-ember",
    anonymousProfileId: "profile-ember",
    alias: "Ember 42",
    language: "English",
    experienceTopicIds: ["career-change", "first-manager", "starting-over"],
    experienceSummary: "Has navigated two industry changes and now helps people turn uncertainty into small experiments.",
    formats: ["text"],
    availability: ["now", "today"],
    capacity: 1,
    safetyEligible: true,
    preferenceTags: ["gentle-pace", "direct-feedback", "shared-experience"],
  },
  {
    id: "advisor-sage",
    anonymousProfileId: "profile-sage",
    alias: "Sage 19",
    language: "English",
    experienceTopicIds: ["caregiving", "starting-over", "moving-city"],
    experienceSummary: "Offers grounded, practical perspective from rebuilding routines during a demanding life transition.",
    formats: ["text", "audio-future"],
    availability: ["today", "this-week"],
    capacity: 2,
    safetyEligible: true,
    preferenceTags: ["gentle-pace", "questions-first"],
  },
  {
    id: "advisor-vale",
    anonymousProfileId: "profile-vale",
    alias: "Vale 73",
    language: "Spanish",
    experienceTopicIds: ["creative-block", "career-change"],
    experienceSummary: "A bilingual creative lead who has mentored people through stalled projects and role changes.",
    formats: ["text"],
    availability: ["now"],
    capacity: 1,
    safetyEligible: true,
    preferenceTags: ["direct-feedback", "questions-first"],
  },
];

export const seededMessages: Message[] = [
  {
    id: "msg-1",
    conversationId: "conversation-demo",
    participantId: "participant-seeker",
    body: "I keep treating this career decision like it has one perfect answer. I’m afraid that one wrong move will set me back.",
    sentAt: "2026-07-14T18:04:00.000Z",
    deliveryState: "read",
  },
  {
    id: "msg-2",
    conversationId: "conversation-demo",
    participantId: "participant-advisor",
    body: "That pressure makes sense. What if the next move didn’t have to be a verdict—just a small experiment that gives you better information?",
    sentAt: "2026-07-14T18:05:00.000Z",
    deliveryState: "read",
  },
  {
    id: "msg-3",
    conversationId: "conversation-demo",
    participantId: "participant-seeker",
    body: "That changes it. I could ask for one project in the new area before deciding whether to leave.",
    sentAt: "2026-07-14T18:06:00.000Z",
    deliveryState: "read",
  },
  {
    id: "msg-4",
    conversationId: "conversation-demo",
    participantId: "participant-advisor",
    body: "Exactly. Make the next step reversible, specific, and useful even if the answer turns out to be no.",
    sentAt: "2026-07-14T18:07:00.000Z",
    deliveryState: "read",
  },
];

export const rawSanitizationDemo = `Moss 28: My manager Maya at Northstar Labs said I should decide by Friday. I can send the job description from maria@example.com.\n\nEmber 42: Keep the company and names out of the decision. What evidence would make a one-month experiment useful?\n\nMoss 28: I am the only designer on the launch in our tiny Albany office, so even asking feels risky. Call me at (518) 555-0142 if the chat closes.`;

export const candidates: ContentCandidate[] = [
  {
    id: "candidate-1",
    conversationId: "conversation-demo",
    versionId: "version-2",
    title: "Turn a high-stakes decision into a small experiment",
    status: "approved",
    safetyStatus: "clear",
    format: "motion-storyboard",
    estimatedDurationMinutes: 2.4,
  },
  {
    id: "candidate-2",
    conversationId: "conversation-care",
    versionId: "version-1",
    title: "A kinder way to protect your caregiving energy",
    status: "under-review",
    safetyStatus: "review-needed",
    format: "human-edited",
    estimatedDurationMinutes: 3.1,
  },
  {
    id: "candidate-3",
    conversationId: "conversation-move",
    versionId: "version-3",
    title: "Building belonging one repeatable ritual at a time",
    status: "withdrawn",
    safetyStatus: "clear",
    format: "synthetic-presenters",
    estimatedDurationMinutes: 1.8,
  },
];

export const prototypeMetrics = {
  matchingAttempts: 184,
  matchAcceptanceRate: 0.72,
  completedConversations: 96,
  averageSessionMinutes: 24,
  mutuallyValuableRate: 0.61,
  mutualOptInRate: 0.18,
  sanitizationApprovalRate: 0.74,
  withdrawalRate: 0.04,
  contentCandidates: 13,
};
