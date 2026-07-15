import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, EyeOff, KeyRound, LockKeyhole, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Privacy model" };

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader variant="app" />
      <main className="privacy-page" id="main-content">
        <section className="privacy-hero">
          <span className="step-label"><ShieldCheck size={13} /> Prototype privacy model · not legal advice</span>
          <h1>Anonymous by design.<br />Honest about the limits.</h1>
          <p>Common Ground minimizes identifying information, separates identities, and makes every reuse purpose explicit. It does not promise absolute anonymity or hide the safeguards a production system still needs.</p>
        </section>

        <section className="privacy-principles">
          <article><EyeOff size={20} /><span>01</span><h2>Collect less</h2><p>No real name, employer, school, social profile, phone, or precise location is needed for matching.</p></article>
          <article><KeyRound size={20} /><span>02</span><h2>Separate identity</h2><p>Session alias and avatar are distinct from a future internal abuse-prevention subject identifier.</p></article>
          <article><LockKeyhole size={20} /><span>03</span><h2>Purpose-specific consent</h2><p>Recording, transformation, and publication each have their own status, version, timestamp, and history.</p></article>
          <article><Trash2 size={20} /><span>04</span><h2>Delete on purpose</h2><p>Prototype policy assumes raw source deletion 30 days after review closes and documented deletion events.</p></article>
        </section>

        <section className="privacy-section">
          <div className="privacy-section-heading"><span className="step-label">Data path</span><h2>Private source and public candidate never share a lane.</h2></div>
          <div className="privacy-data-flow">
            <div><span className="privacy-flow-icon"><Database size={18} /></span><strong>Private conversation store</strong><small>Encrypted source, participants only, audited exceptional safety access</small></div>
            <ArrowRight size={16} />
            <div><span className="privacy-flow-icon"><ShieldCheck size={18} /></span><strong>Sanitization workspace</strong><small>Temporary scoped copy, automatic flags, participant redactions</small></div>
            <ArrowRight size={16} />
            <div><span className="privacy-flow-icon"><EyeOff size={18} /></span><strong>Content candidate store</strong><small>Neutral speakers, exact version approvals, no direct identifiers</small></div>
          </div>
        </section>

        <section className="privacy-section privacy-two-column">
          <div>
            <span className="step-label">What this prototype protects</span>
            <ul className="privacy-list positive">
              <li><ShieldCheck size={15} /> Generated session alias and abstract avatar</li>
              <li><ShieldCheck size={15} /> Minimal onboarding fields</li>
              <li><ShieldCheck size={15} /> Deterministic local sanitization; no raw transcript sent to AI</li>
              <li><ShieldCheck size={15} /> Independent, private feedback and consent choices</li>
              <li><ShieldCheck size={15} /> Exact sanitized-version publication approval</li>
              <li><ShieldCheck size={15} /> Withdrawal and safety-hold states</li>
            </ul>
          </div>
          <div>
            <span className="step-label">What remains risky</span>
            <ul className="privacy-list risk">
              <li><ShieldAlert size={15} /> Writing style and rare life events can re-identify someone</li>
              <li><ShieldAlert size={15} /> Network and device metadata are not hidden by an alias</li>
              <li><ShieldAlert size={15} /> A participant can copy or screenshot a conversation</li>
              <li><ShieldAlert size={15} /> Published content may be copied beyond later removal</li>
              <li><ShieldAlert size={15} /> This frontend demo has no production auth or encrypted database</li>
              <li><ShieldAlert size={15} /> Safety review may require controlled exceptional access</li>
            </ul>
          </div>
        </section>

        <section className="privacy-section">
          <div className="privacy-section-heading"><span className="step-label">Role separation</span><h2>Access follows purpose.</h2></div>
          <div className="privacy-table-wrap">
            <table className="data-table">
              <caption>Prototype access control model</caption>
              <thead><tr><th>Role</th><th>Raw message access</th><th>Sanitized candidate</th><th>Consent metadata</th><th>Required audit</th></tr></thead>
              <tbody>
                <tr><td>Participant</td><td>Own active conversation</td><td>Exact versions for own session</td><td>Own events; aggregate gate outcome</td><td>Session log</td></tr>
                <tr><td>Content reviewer</td><td>None by default</td><td>Assigned candidates</td><td>Gate status, not private answers</td><td>Every view and edit</td></tr>
                <tr><td>Safety reviewer</td><td>Reason-coded excerpt or scoped session</td><td>Only when relevant</td><td>Safety-relevant events</td><td>Actor, reason, scope, duration</td></tr>
                <tr><td>Research analyst</td><td>None</td><td>Aggregate / de-identified</td><td>Aggregate lifecycle counts</td><td>Export audit</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="privacy-cta">
          <div><span className="step-label">See it in practice</span><h2>Make the trust decisions yourself.</h2></div>
          <Link className="button button-primary" href="/journey">Open the private journey <ArrowRight size={16} /></Link>
        </section>
      </main>
    </>
  );
}
