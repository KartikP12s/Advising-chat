import { describe, expect, it } from "vitest";
import { costScenarios, projectCosts } from "@/lib/costs";

describe("cost projections", () => {
  it("keeps the no-content baseline effectively free", () => {
    const result = projectCosts({ scenario: costScenarios[0], sanitizationUsdPerSession: 0 });
    expect(result.totalMonthly).toBe(0);
    expect(result.publishedAsset).toBe(0);
  });

  it("makes human review the primary candidate cost", () => {
    const result = projectCosts({ scenario: costScenarios[2] });
    expect(result.totalMonthly).toBeGreaterThan(1000);
    expect(result.contentCandidate).toBeGreaterThan(result.completedConversation);
    expect(result.bottleneck).toContain("Human privacy");
    expect(result.uncertaintyHigh).toBeGreaterThan(result.totalMonthly);
  });
});
