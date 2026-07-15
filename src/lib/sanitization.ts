import type { PrivacyRiskCategory, Redaction } from "@/lib/domain";

interface SanitizationRule {
  category: PrivacyRiskCategory;
  pattern: RegExp;
  replacement: string;
  reason: string;
  confidence: Redaction["confidence"];
}

export interface SanitizationResult {
  sanitized: string;
  redactions: Omit<Redaction, "id" | "versionId">[];
  riskCount: number;
}

const baseRules: SanitizationRule[] = [
  {
    category: "email",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    replacement: "[email removed]",
    reason: "Direct contact information",
    confidence: "automatic",
  },
  {
    category: "phone",
    pattern: /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
    replacement: "[phone removed]",
    reason: "Direct contact information",
    confidence: "automatic",
  },
  {
    category: "username",
    pattern: /@[a-zA-Z0-9_]{3,30}\b/g,
    replacement: "[username removed]",
    reason: "Potentially linkable public account",
    confidence: "automatic",
  },
  {
    category: "account-number",
    pattern: /\b(?:account|acct)\s*(?:number|no\.?|#)?\s*[:#-]?\s*\d{6,16}\b/gi,
    replacement: "[account number removed]",
    reason: "Sensitive financial identifier",
    confidence: "automatic",
  },
  {
    category: "address",
    pattern: /\b\d{1,5}\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}\s+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr)\b\.?/g,
    replacement: "[address removed]",
    reason: "Precise address",
    confidence: "automatic",
  },
  {
    category: "employer-school",
    pattern: /\b(?:at|for|from)\s+(?:Northstar Labs|Redwood University|Harbor & Co\.?|Acme Corp)\b/gi,
    replacement: "at [organization removed]",
    reason: "Employer or school may enable re-identification",
    confidence: "review-needed",
  },
  {
    category: "indirect-identifier",
    pattern: /\b(?:the only|one of only(?:\s+\d{1,3})?)\s+[^,.!?]{3,70}/gi,
    replacement: "[unique event generalized]",
    reason: "Unusual detail may identify a participant when combined with other facts",
    confidence: "review-needed",
  },
];

export function sanitizeTranscript(raw: string, knownNames: string[] = []): SanitizationResult {
  let sanitized = raw.replace(/\b(?:Moss|Ember|Vale|Sage)\s+\d{2}\b/g, (alias) =>
    alias.startsWith("Moss") || alias.startsWith("Vale") ? "Speaker A" : "Speaker B",
  );
  const redactions: SanitizationResult["redactions"] = [];
  const rules = [...baseRules];

  for (const name of knownNames.filter((item) => item.trim().length > 1)) {
    rules.push({
      category: "name",
      pattern: new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"),
      replacement: "[name removed]",
      reason: "Direct personal name",
      confidence: "automatic",
    });
  }

  for (const rule of rules) {
    sanitized = sanitized.replace(rule.pattern, (original) => {
      redactions.push({
        category: rule.category,
        original,
        replacement: rule.replacement,
        reason: rule.reason,
        confidence: rule.confidence,
      });
      return rule.replacement;
    });
  }

  return { sanitized, redactions, riskCount: redactions.length };
}

export const localSanitizationNotice =
  "Prototype sanitization runs locally with deterministic rules. No raw transcript is sent to an AI provider.";
