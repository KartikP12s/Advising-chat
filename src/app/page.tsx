import Link from "next/link";
import { ArrowRight, Check, EyeOff, Fingerprint, LockKeyhole, ShieldCheck, UserRoundCheck } from "lucide-react";
import { LandingPreview } from "@/components/landing-preview";
import { SiteHeader } from "@/components/site-header";
import { TrustLoop } from "@/components/trust-loop";
import { topics } from "@/data/seed";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="hero section-shell">
          <div className="hero-copy">
            <span className="eyebrow"><span className="live-dot" /> Human guidance, without the performance</span>
            <h1>Real conversations first.<br /><em>Shared wisdom second.</em></h1>
            <p className="hero-lede">
              Ask for perspective anonymously, meet someone who has been there, and keep the useful part private unless you both choose to share it.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/journey">
                Find common ground <ArrowRight size={17} />
              </Link>
              <Link className="button button-secondary" href="/journey?role=advisor">
                Offer perspective
              </Link>
            </div>
            <div className="hero-assurance">
              <span><EyeOff size={15} /> No real name required</span>
              <span><LockKeyhole size={15} /> Nothing auto-publishes</span>
            </div>
          </div>
          <LandingPreview />
        </section>

        <section className="trust-strip section-shell" aria-label="Prototype safeguards">
          <p>Designed around a simple promise</p>
          <div>
            <span><Fingerprint size={17} /> Session-scoped identity</span>
            <span><ShieldCheck size={17} /> Separate consent at every step</span>
            <span><UserRoundCheck size={17} /> Peer experience, clearly labeled</span>
          </div>
        </section>

        <section className="section-block section-shell" id="how-it-works">
          <div className="section-heading section-heading-split">
            <div>
              <span className="kicker">The trust loop</span>
              <h2>Wisdom earns its way into public.</h2>
            </div>
            <p>Public content is an outcome of a valuable human exchange—not the reason the exchange exists.</p>
          </div>
          <TrustLoop />
        </section>

        <section className="section-block section-shell topics-section">
          <div className="section-heading">
            <span className="kicker">Start where you are</span>
            <h2>Some decisions need a person,<br />not another search result.</h2>
          </div>
          <div className="topic-grid">
            {topics.map((topic, index) => (
              <Link className={`topic-card topic-${topic.accent}`} href={`/journey?topic=${topic.id}`} key={topic.id}>
                <span className="topic-number">0{index + 1}</span>
                <div>
                  <h3>{topic.label}</h3>
                  <p>{topic.description}</p>
                </div>
                <ArrowRight size={18} />
              </Link>
            ))}
          </div>
        </section>

        <section className="section-block section-shell consent-section" id="consent">
          <div className="consent-copy">
            <span className="kicker">Mutual means mutual</span>
            <h2>One yes is never enough.</h2>
            <p>
              Your private reflection stays private. If a conversation helped, each person makes an independent choice about a sanitized educational version.
            </p>
            <ul className="check-list">
              <li><Check size={16} /> Declining never affects access or reputation</li>
              <li><Check size={16} /> Both review the exact same sanitized version</li>
              <li><Check size={16} /> Material edits require fresh approval</li>
              <li><Check size={16} /> Consent can be withdrawn before publication</li>
            </ul>
          </div>
          <div className="dual-consent-card">
            <div className="consent-card-head">
              <span>Content eligibility</span>
              <small>private until both respond</small>
            </div>
            <div className="consent-person-row">
              <span className="consent-monogram consent-monogram-one">M</span>
              <div><strong>Moss 28</strong><small>Seeker</small></div>
              <span className="status-choice status-choice-yes">Approved privately</span>
            </div>
            <div className="consent-connector" aria-hidden="true"><span /></div>
            <div className="consent-person-row">
              <span className="consent-monogram consent-monogram-two">E</span>
              <div><strong>Ember 42</strong><small>Peer advisor</small></div>
              <span className="status-choice">Waiting privately</span>
            </div>
            <div className="consent-gate"><LockKeyhole size={16} /> Still private. No one is being nudged.</div>
          </div>
        </section>

        <section className="safety-panel section-shell">
          <div className="safety-symbol" aria-hidden="true"><ShieldCheck size={34} /></div>
          <div>
            <span className="kicker">Built for honest limits</span>
            <h2>Anonymous—not invisible.</h2>
            <p>
              Common Ground minimizes identifying information and separates public aliases from internal records. It does not promise absolute anonymity. Safety reports, abuse prevention, and exceptional-access auditing remain part of a responsible production system.
            </p>
          </div>
          <Link className="text-link" href="/privacy">Read the privacy model <ArrowRight size={16} /></Link>
        </section>

        <section className="final-cta section-shell">
          <span className="kicker">A calmer way to ask</span>
          <h2>You don’t need an audience.<br />You might just need one person.</h2>
          <Link className="button button-primary button-light" href="/journey">
            Start a private conversation <ArrowRight size={17} />
          </Link>
          <p>Peer guidance is not a substitute for professional medical, legal, mental-health, or financial advice.</p>
        </section>
      </main>
      <footer className="site-footer section-shell">
        <span>Common Ground · Prototype 0.1</span>
        <nav aria-label="Footer navigation">
          <Link href="/privacy">Privacy</Link>
          <Link href="/research">Research view</Link>
          <a href="https://github.com" rel="noreferrer">GitHub-ready</a>
        </nav>
      </footer>
    </>
  );
}
