import type { CostScenario } from "@/lib/domain";

export interface CostProjection {
  fixedMonthly: number;
  variableMonthly: number;
  totalMonthly: number;
  completedConversation: number;
  mutuallyValuableConversation: number;
  contentCandidate: number;
  publishedAsset: number;
  uncertaintyLow: number;
  uncertaintyHigh: number;
  bottleneck: string;
}

export const costScenarios: CostScenario[] = [
  {
    id: "baseline",
    label: "One conversation",
    monthlySessions: 1,
    peakConcurrentUsers: 2,
    averageConversationMinutes: 25,
    mutualValueRate: 0.6,
    contentConversionRate: 0,
    averageTranscriptKb: 12,
    averageVideoMinutes: 0,
  },
  {
    id: "prototype",
    label: "100 concurrent",
    monthlySessions: 500,
    peakConcurrentUsers: 100,
    averageConversationMinutes: 24,
    mutualValueRate: 0.6,
    contentConversionRate: 0.05,
    averageTranscriptKb: 18,
    averageVideoMinutes: 2,
  },
  {
    id: "early-scale",
    label: "1,000 sessions / month",
    monthlySessions: 1000,
    peakConcurrentUsers: 150,
    averageConversationMinutes: 28,
    mutualValueRate: 0.62,
    contentConversionRate: 0.08,
    averageTranscriptKb: 22,
    averageVideoMinutes: 2.5,
  },
  {
    id: "growth",
    label: "10,000 sessions / month",
    monthlySessions: 10000,
    peakConcurrentUsers: 800,
    averageConversationMinutes: 30,
    mutualValueRate: 0.64,
    contentConversionRate: 0.1,
    averageTranscriptKb: 26,
    averageVideoMinutes: 3,
  },
];

export interface ProjectionOptions {
  scenario: CostScenario;
  hostingFixedUsd?: number;
  databaseFixedUsd?: number;
  realtimePerMillionMessagesUsd?: number;
  averageMessagesPerSession?: number;
  sanitizationUsdPerSession?: number;
  humanReviewHourlyUsd?: number;
  reviewMinutesPerCandidate?: number;
  mediaVendorUsdPerMinute?: number;
  publicationRate?: number;
}

export function projectCosts(options: ProjectionOptions): CostProjection {
  const {
    scenario,
    hostingFixedUsd = scenario.monthlySessions <= 1000 ? 0 : 20,
    databaseFixedUsd = scenario.monthlySessions <= 1000 ? 0 : 25,
    realtimePerMillionMessagesUsd = 2.5,
    averageMessagesPerSession = Math.round(scenario.averageConversationMinutes * 1.5),
    sanitizationUsdPerSession = 0.015,
    humanReviewHourlyUsd = 35,
    reviewMinutesPerCandidate = 35,
    mediaVendorUsdPerMinute = 1,
    publicationRate = 0.7,
  } = options;

  const fixedMonthly = hostingFixedUsd + databaseFixedUsd;
  const messages = scenario.monthlySessions * averageMessagesPerSession * 3;
  const realtime = Math.max(0, messages - 2_000_000) * (realtimePerMillionMessagesUsd / 1_000_000);
  const candidates = scenario.monthlySessions * scenario.contentConversionRate;
  const sanitization = scenario.monthlySessions * sanitizationUsdPerSession * (scenario.averageTranscriptKb / 22);
  const review = candidates * (reviewMinutesPerCandidate / 60) * humanReviewHourlyUsd;
  const media = candidates * publicationRate * scenario.averageVideoMinutes * mediaVendorUsdPerMinute;
  const variableMonthly = realtime + sanitization + review + media;
  const totalMonthly = fixedMonthly + variableMonthly;
  const mutuallyValuable = scenario.monthlySessions * scenario.mutualValueRate;
  const published = candidates * publicationRate;
  const divide = (value: number, count: number) => (count > 0 ? value / count : 0);

  return {
    fixedMonthly,
    variableMonthly,
    totalMonthly,
    completedConversation: divide(totalMonthly, scenario.monthlySessions),
    mutuallyValuableConversation: divide(totalMonthly, mutuallyValuable),
    contentCandidate: divide(totalMonthly, candidates),
    publishedAsset: divide(totalMonthly, published),
    uncertaintyLow: totalMonthly * 0.7,
    uncertaintyHigh: totalMonthly * 1.55,
    bottleneck: candidates > 0 ? "Human privacy and editorial review" : "No material cost in local demo mode",
  };
}

export function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 10 ? 2 : 0,
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);
}
