import { NextResponse } from "next/server";
import { advisors } from "@/data/seed";
import { findBestMatches, matchInputSchema } from "@/lib/matching";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = matchInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid match request", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const matches = findBestMatches(parsed.data, advisors).map((match) => ({
    advisor: {
      id: match.advisor.id,
      alias: match.advisor.alias,
      experienceSummary: match.advisor.experienceSummary,
      experienceTopicIds: match.advisor.experienceTopicIds,
      availability: match.advisor.availability,
      preferenceTags: match.advisor.preferenceTags,
    },
    score: match.score,
    reasons: match.reasons,
    breakdown: match.breakdown,
  }));

  return NextResponse.json({ matches, algorithmVersion: "transparent-v1", generatedAt: new Date().toISOString() });
}
