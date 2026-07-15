import type { ReactNode } from "react";

interface StatusPillProps {
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  children: ReactNode;
}

export function StatusPill({ tone = "neutral", children }: StatusPillProps) {
  return <span className={`status-pill status-${tone}`}>{children}</span>;
}
