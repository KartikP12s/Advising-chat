import { describe, expect, it } from "vitest";
import { advisors } from "@/data/seed";
import { findBestMatches, scoreAdvisor } from "@/lib/matching";

const input = {
  topicId: "career-change",
  preferredFormat: "text" as const,
  availability: "now" as const,
  language: "English",
  preferences: ["gentle-pace", "shared-experience"],
};

describe("transparent matching", () => {
  it("ranks relevant, available advisors deterministically", () => {
    const matches = findBestMatches(input, advisors);
    expect(matches[0].advisor.alias).toBe("Ember 42");
    expect(matches[0].score).toBeGreaterThan(matches[1].score);
    expect(matches[0].reasons).toContain("Relevant lived experience");
  });

  it("uses safety eligibility and capacity as gates", () => {
    const unsafe = { ...advisors[0], id: "unsafe", safetyEligible: false };
    const unavailable = { ...advisors[1], id: "full", capacity: 0 };
    expect(findBestMatches(input, [unsafe, unavailable])).toEqual([]);
  });

  it("exposes an understandable scoring breakdown", () => {
    const match = scoreAdvisor(input, advisors[0]);
    expect(match.breakdown).toEqual({
      topic: 35,
      experience: 17,
      format: 15,
      availability: 10,
      language: 10,
      preferences: 10,
    });
  });
});
