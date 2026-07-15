import type { MatchInput, MatchableAdvisor, ScoredMatch } from "@/lib/matching";
import type { SanitizationResult } from "@/lib/sanitization";

export interface MatchingProvider {
  find(input: MatchInput, advisors: MatchableAdvisor[]): Promise<ScoredMatch[]>;
}

export interface MessageTransport {
  connect(conversationId: string): Promise<void>;
  send(body: string): Promise<{ id: string; sentAt: string }>;
  disconnect(): Promise<void>;
}

export interface SanitizationProvider {
  sanitize(rawTranscript: string): Promise<SanitizationResult>;
  sendsRawContentToThirdParty: boolean;
}

export interface MediaProductionProvider {
  estimate(script: string, minutes: number): Promise<{ vendorCostUsd: number; renderMinutes: number }>;
  render?: never;
}

export interface PrototypeProviderPolicy {
  mode: "local-prototype";
  rawTranscriptLeavesDevice: false;
  paidProviderRequired: false;
  recordingEnabled: false;
}

export const prototypeProviderPolicy: PrototypeProviderPolicy = {
  mode: "local-prototype",
  rawTranscriptLeavesDevice: false,
  paidProviderRequired: false,
  recordingEnabled: false,
};
