import { describe, expect, it } from "vitest";
import { rawSanitizationDemo } from "@/data/seed";
import { sanitizeTranscript } from "@/lib/sanitization";

describe("local transcript sanitization", () => {
  it("removes direct identifiers and replaces aliases", () => {
    const result = sanitizeTranscript(rawSanitizationDemo, ["Maya", "Maria"]);
    expect(result.sanitized).toContain("Speaker A:");
    expect(result.sanitized).toContain("Speaker B:");
    expect(result.sanitized).not.toContain("Maya");
    expect(result.sanitized).not.toContain("maria@example.com");
    expect(result.sanitized).not.toContain("(518) 555-0142");
    expect(result.redactions.map((item) => item.category)).toEqual(
      expect.arrayContaining(["name", "email", "phone", "employer-school", "indirect-identifier"]),
    );
  });

  it("returns no false risk count for plain text", () => {
    const result = sanitizeTranscript("Speaker A: I found a smaller next step.\n\nSpeaker B: What will it teach you?");
    expect(result.riskCount).toBe(0);
  });
});
