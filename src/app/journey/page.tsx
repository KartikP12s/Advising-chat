import type { Metadata } from "next";
import { JourneyShell } from "@/components/journey/journey-shell";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Private conversation prototype",
};

interface JourneyPageProps {
  searchParams: Promise<{ role?: string; topic?: string }>;
}

export default async function JourneyPage({ searchParams }: JourneyPageProps) {
  const params = await searchParams;
  const initialRole = params.role === "advisor" ? "advisor" : "seeker";

  return (
    <>
      <SiteHeader variant="app" />
      <JourneyShell initialRole={initialRole} initialTopic={params.topic} />
    </>
  );
}
