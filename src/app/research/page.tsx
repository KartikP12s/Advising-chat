import type { Metadata } from "next";
import { ResearchDashboard } from "@/components/research-dashboard";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Research and operations" };

export default function ResearchPage() {
  return (
    <>
      <SiteHeader variant="app" />
      <main id="main-content">
        <ResearchDashboard />
      </main>
    </>
  );
}
