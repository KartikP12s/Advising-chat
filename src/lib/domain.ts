export type Id = string;
export type ISODateTime = string;

export type UserRole = "seeker" | "advisor" | "administrator";
export type ConsentStatus = "not-asked" | "pending" | "granted" | "declined" | "withdrawn";
export type LifecycleStatus =
  | "draft"
  | "matching"
  | "matched"
  | "active"
  | "ended"
  | "feedback-pending"
  | "evaluated"
  | "transformation-eligible"
  | "consent-pending"
  | "sanitizing"
  | "participant-review"
  | "approved-candidate"
  | "production-review"
  | "publication-ready"
  | "published"
  | "rejected"
  | "withdrawn"
  | "safety-hold";

export interface User {
  id: Id;
  internalSubject: string;
  role: UserRole;
  createdAt: ISODateTime;
  deletionRequestedAt?: ISODateTime;
}

export interface AnonymousProfile {
  id: Id;
  userId: Id;
  sessionAlias: string;
  avatarSeed: string;
  language: string;
  comfortPreferences: string[];
}

export interface AdvisorProfile {
  id: Id;
  anonymousProfileId: Id;
  experienceTopicIds: Id[];
  experienceSummary: string;
  formats: ConversationFormat[];
  availability: AvailabilityWindow[];
  capacity: number;
  safetyEligible: boolean;
}

export interface Topic {
  id: Id;
  label: string;
  description: string;
  accent: string;
}

export type ConversationFormat = "text" | "audio-future" | "video-future";
export type AvailabilityWindow = "now" | "today" | "this-week";

export interface MatchRequest {
  id: Id;
  seekerProfileId: Id;
  topicId: Id;
  description: string;
  preferredFormat: ConversationFormat;
  availability: AvailabilityWindow;
  language: string;
  preferences: string[];
  status: "queued" | "matched" | "cancelled" | "expired";
  createdAt: ISODateTime;
}

export interface Match {
  id: Id;
  requestId: Id;
  advisorProfileId: Id;
  score: number;
  reasons: string[];
  seekerDecision: "pending" | "accepted" | "skipped" | "reported";
  advisorDecision: "pending" | "accepted" | "declined";
  createdAt: ISODateTime;
}

export interface Conversation {
  id: Id;
  matchId: Id;
  topicId: Id;
  status: LifecycleStatus;
  startedAt?: ISODateTime;
  endedAt?: ISODateTime;
  safetyHoldAt?: ISODateTime;
}

export interface ConversationParticipant {
  id: Id;
  conversationId: Id;
  userId: Id;
  anonymousProfileId: Id;
  role: "seeker" | "advisor";
  blockedAt?: ISODateTime;
}

export interface Message {
  id: Id;
  conversationId: Id;
  participantId: Id;
  body: string;
  sentAt: ISODateTime;
  deliveryState: "sending" | "delivered" | "read" | "failed";
  flaggedPrivately?: boolean;
}

export interface MessageReaction {
  id: Id;
  messageId: Id;
  participantId: Id;
  emoji: "heart" | "thanks" | "thinking";
}

export interface HelpfulMoment {
  id: Id;
  messageId: Id;
  participantId: Id;
  markedAt: ISODateTime;
}

export interface SessionFeedback {
  id: Id;
  conversationId: Id;
  participantId: Id;
  helped: boolean;
  valueScore: 1 | 2 | 3 | 4 | 5;
  usefulPart: string;
  couldHelpOthers: boolean;
  submittedAt: ISODateTime;
}

export interface RecordingConsent {
  id: Id;
  conversationId: Id;
  participantId: Id;
  status: ConsentStatus;
  policyVersion: string;
  recordedAt: ISODateTime;
}

export interface TransformationConsent {
  id: Id;
  conversationId: Id;
  participantId: Id;
  status: ConsentStatus;
  sourceScope: "selected-excerpts" | "full-transcript";
  aiProcessingAllowed: boolean;
  policyVersion: string;
  comprehensionConfirmed: boolean;
  recordedAt: ISODateTime;
}

export interface SanitizedContentVersion {
  id: Id;
  conversationId: Id;
  version: number;
  sanitizedTranscript: string;
  summary: string;
  takeaways: string[];
  title: string;
  tags: string[];
  createdAt: ISODateTime;
  invalidatesVersionId?: Id;
}

export interface Redaction {
  id: Id;
  versionId: Id;
  category: PrivacyRiskCategory;
  original: string;
  replacement: string;
  reason: string;
  requestedByParticipantId?: Id;
  confidence: "automatic" | "review-needed" | "participant-requested";
}

export interface PublicationApproval {
  id: Id;
  versionId: Id;
  participantId: Id;
  status: "pending" | "approved" | "rejected" | "withdrawn";
  policyVersion: string;
  recordedAt: ISODateTime;
}

export interface ConsentEvent {
  id: Id;
  conversationId: Id;
  participantId: Id;
  purpose: "recording" | "transformation" | "publication";
  previousStatus: ConsentStatus;
  nextStatus: ConsentStatus;
  policyVersion: string;
  versionId?: Id;
  occurredAt: ISODateTime;
}

export type SafetyReportReason = "harassment" | "spam" | "privacy" | "high-risk" | "other";

export interface SafetyReport {
  id: Id;
  conversationId: Id;
  reporterParticipantId: Id;
  messageId?: Id;
  reason: SafetyReportReason;
  status: "open" | "triaged" | "closed";
  createdAt: ISODateTime;
}

export interface ModerationReview {
  id: Id;
  reportId: Id;
  reviewerUserId: Id;
  outcome: "no-action" | "warning" | "block" | "escalate";
  reviewedAt: ISODateTime;
}

export type CandidateStatus = "rejected" | "under-review" | "approved" | "published" | "withdrawn";

export interface ContentCandidate {
  id: Id;
  conversationId: Id;
  versionId: Id;
  title: string;
  status: CandidateStatus;
  safetyStatus: "clear" | "review-needed" | "blocked";
  format: "motion-storyboard" | "synthetic-presenters" | "human-edited";
  estimatedDurationMinutes: number;
}

export interface MediaProductionEstimate {
  id: Id;
  candidateId: Id;
  approach: "manual" | "ai-assisted" | "mostly-automated";
  humanMinutes: number;
  vendorCostUsd: number;
  laborCostUsd: number;
  uncertaintyPercent: number;
  assumptionVersion: string;
}

export interface CostAssumption {
  id: Id;
  label: string;
  unit: string;
  valueUsd: number;
  sourceUrl?: string;
  retrievedAt: ISODateTime;
  evidenceType: "official-pricing" | "prototype-assumption" | "measured";
}

export interface CostScenario {
  id: Id;
  label: string;
  monthlySessions: number;
  peakConcurrentUsers: number;
  averageConversationMinutes: number;
  mutualValueRate: number;
  contentConversionRate: number;
  averageTranscriptKb: number;
  averageVideoMinutes: number;
}

export interface AuditEvent {
  id: Id;
  actorId: Id;
  action: string;
  resourceType: string;
  resourceId: Id;
  occurredAt: ISODateTime;
  metadata: Record<string, string | number | boolean>;
}

export type PrivacyRiskCategory =
  | "name"
  | "email"
  | "phone"
  | "address"
  | "precise-location"
  | "employer-school"
  | "username"
  | "account-number"
  | "indirect-identifier";
