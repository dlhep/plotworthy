import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Compass, FileSearch, Hammer, HomeIcon, MapPinned, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" }
};

const evidence = [
  ["Planning history", "Applications matched to the right address", FileSearch],
  ["Local restrictions", "Article 4 and mapped constraints called out", MapPinned],
  ["HMO context", "Licensed records shown with source dates", Building2],
  ["A practical route", "The evidence a professional should verify next", Compass]
] as const;

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={14} /> Property potential, without the guesswork</p>
            <h1>Know what a property <em>could become</em> before you commit.</h1>
            <p className="hero-lead">PlotWorthy brings scattered planning, licensing and property evidence into one clear starting point — then helps you find the right local professional.</p>
            <div className="button-row">
              <Link className="button" href="/check">Check a property <ArrowRight size={18} /></Link>
              <Link className="button button-ghost" href="/professionals">Find a professional</Link>
            </div>
            <div className="trust-line"><span><CheckCircle2 /> No planning jargon</span><span><ShieldCheck /> Sources made visible</span><span><HomeIcon /> Built for UK property</span></div>
          </div>
          <div className="hero-visual" aria-label="Example feasibility evidence card">
            <div className="mini-report">
              <div className="mini-top"><span>EARLY FEASIBILITY</span><strong>24 Ashfield Road</strong><small>Manchester · HMO review</small></div>
              <div className="mini-body">
                <div><span>Postcode geography</span><b className="positive">Verified</b></div>
                <div><span>Planning history</span><b className="neutral">Source check</b></div>
                <div><span>Article 4 direction</span><b className="neutral">Boundary check</b></div>
                <div><span>Licensed HMOs nearby</span><b className="neutral">Register check</b></div>
              </div>
              <p><ShieldCheck /> Unknown evidence stays unknown until it is verified.</p>
            </div>
            <span className="floating-note note-one">Source dates, not mystery scores</span>
            <span className="floating-note note-two">One address. One clear record.</span>
          </div>
        </div>
      </section>

      <section className="proof-strip">
        <div className="shell"><span>Designed for real early decisions</span><b>HMO conversion</b><b>Flats</b><b>Extensions</b><b>Land</b><b>Change of use</b></div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading split-heading"><div><p className="eyebrow">One useful starting point</p><h2>See the evidence before the sales pitch.</h2></div><p>Property feasibility is rarely one yes-or-no answer. PlotWorthy shows what is verified, what is indicative and what still needs a professional check.</p></div>
          <div className="feature-grid">
            {evidence.map(([title, description, Icon]) => <article className="feature-card" key={title}><span><Icon /></span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section section-ink">
        <div className="shell process-grid">
          <div className="section-heading"><p className="eyebrow">How it works</p><h2>From idea to an informed next move.</h2><p>A calm, traceable route through the messy first stage of a property project.</p></div>
          <ol className="process-list">
            <li><span>01</span><div><h3>Tell us the address and idea</h3><p>Start free. A verified postcode puts the property in the right local authority context.</p></div></li>
            <li><span>02</span><div><h3>Review the evidence checklist</h3><p>See the known facts, the unknowns and the checks that matter for your proposal.</p></div></li>
            <li><span>03</span><div><h3>Move forward with the right help</h3><p>Save the record and request a review from relevant local architects or builders when ready.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section audience-section">
        <div className="shell">
          <div className="section-heading"><p className="eyebrow">Made for both sides</p><h2>Better briefs. Better-fit professionals.</h2></div>
          <div className="audience-grid">
            <article><span className="audience-icon"><HomeIcon /></span><p className="eyebrow">Owners & developers</p><h3>Understand the opportunity</h3><p>Turn an address and an idea into a clearer brief before commissioning expensive work.</p><Link href="/check">Start a property check <ArrowRight size={17} /></Link></article>
            <article><span className="audience-icon"><Hammer /></span><p className="eyebrow">Architects & builders</p><h3>Meet prepared clients</h3><p>Build a profile around your locations and specialisms, then receive enquiries with useful project context.</p><Link href="/professionals/join">Join the professional network <ArrowRight size={17} /></Link></article>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="shell"><div><p className="eyebrow">Have an address in mind?</p><h2>Make the first decision a well-informed one.</h2></div><Link className="button button-light" href="/check">Check its potential <ArrowRight size={18} /></Link></div>
      </section>
    </>
  );
}
