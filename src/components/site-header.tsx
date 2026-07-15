import Link from "next/link";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";

interface SiteHeaderProps {
  variant?: "landing" | "app";
}

export function SiteHeader({ variant = "landing" }: SiteHeaderProps) {
  return (
    <header className={`site-header ${variant === "app" ? "site-header-app" : ""}`}>
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {variant === "landing" ? (
            <>
              <a href="#how-it-works">How it works</a>
              <a href="#consent">Mutual consent</a>
              <Link href="/research">Research view</Link>
            </>
          ) : (
            <>
              <Link href="/journey">Experience</Link>
              <Link href="/research">Research view</Link>
            </>
          )}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          {variant === "landing" && (
            <Link className="button button-small button-primary" href="/journey">
              Start anonymously
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
