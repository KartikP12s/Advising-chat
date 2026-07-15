import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="system-page">
      <span className="step-label">404 · This path is quiet</span>
      <h1>There is no conversation here.</h1>
      <p>The page may have moved, or the link may be incomplete.</p>
      <Link className="button button-primary" href="/"><ArrowLeft size={15} /> Return home</Link>
    </main>
  );
}
