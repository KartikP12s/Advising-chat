"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="system-page">
      <AlertTriangle size={25} />
      <span className="step-label">The prototype hit an error</span>
      <h1>Your private draft has not been sent.</h1>
      <p>Try rendering this screen again. If it repeats, return home and restart the local demo.</p>
      <button className="button button-primary" type="button" onClick={reset}><RotateCcw size={15} /> Try again</button>
    </main>
  );
}
