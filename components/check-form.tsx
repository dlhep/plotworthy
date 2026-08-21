"use client";

import { ArrowLeft, ArrowRight, BookmarkCheck, Check, LoaderCircle, LockKeyhole, MapPin, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { EvidenceCard } from "@/components/evidence-card";
import type { FeasibilityResult } from "@/lib/types";

type Fields = {
  address: string;
  postcode: string;
  projectType: "hmo" | "flats" | "extension" | "land" | "other";
  propertyType: "house" | "flat" | "commercial" | "land" | "other";
  bedrooms: string;
  notes: string;
};

const initial: Fields = {
  address: "",
  postcode: "",
  projectType: "hmo",
  propertyType: "house",
  bedrooms: "3",
  notes: ""
};

export function CheckForm() {
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState(initial);
  const [result, setResult] = useState<FeasibilityResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function continueFromLocation(event: FormEvent) {
    event.preventDefault();
    if (!fields.address.trim() || !fields.postcode.trim()) {
      setError("Enter the property address and postcode.");
      return;
    }
    setError("");
    setStep(2);
  }

  async function runCheck(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/feasibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, bedrooms: Number(fields.bedrooms) })
      });
      const body = await response.json() as FeasibilityResult & { error?: string };
      if (!response.ok) throw new Error(body.error ?? "The check could not be completed.");
      setResult(body);
      setStep(3);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The check could not be completed.");
    } finally {
      setLoading(false);
    }
  }

  if (step === 3 && result) {
    return (
      <div className="result-panel" aria-live="polite">
        <div className="result-heading">
          <div>
            <p className="eyebrow">Preliminary snapshot</p>
            <h2>{result.property.address}</h2>
            <p><MapPin size={16} /> {result.property.postcode} · {result.property.district}</p>
          </div>
          <span className="report-id">Ref {result.requestId.slice(0, 8).toUpperCase()}</span>
        </div>
        <p className="result-summary">{result.summary}</p>
        <div className="evidence-grid">
          {result.evidence.map((item) => <EvidenceCard item={item} key={item.label} />)}
        </div>
        <div className="result-next">
          <div>
            <p className="eyebrow">Before you proceed</p>
            <h3>Evidence still to collect</h3>
            <ol>{result.nextSteps.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ol>
          </div>
          <aside className="unlock-card">
            {result.saved ? <BookmarkCheck /> : <LockKeyhole />}
            <h3>{result.saved ? "Saved to your dashboard" : "Build the full property record"}</h3>
            <p>{result.saved ? "This snapshot is now part of your private PlotWorthy workspace." : "Verify your email to save this address, keep source updates together and request a professional review."}</p>
            <a className="button" href={result.saved ? `/dashboard/reports/${result.requestId}` : "/login"}>{result.saved ? "Invite professionals to quote" : "Verify email and continue"}</a>
            <small>No invented scores. Unknown evidence stays clearly marked.</small>
          </aside>
        </div>
        <p className="disclaimer"><ShieldCheck size={17} /> {result.disclaimer}</p>
        <button className="button button-ghost" type="button" onClick={() => { setStep(1); setResult(null); }}>Check another property</button>
      </div>
    );
  }

  return (
    <div className="check-shell">
      <div className="progress" aria-label={`Step ${step} of 2`}>
        <span className="active" />
        <span className={step >= 2 ? "active" : ""} />
      </div>
      <div className="step-label"><span>Step {step} of 2</span><span>{step === 1 ? "Property" : "Your idea"}</span></div>

      {step === 1 ? (
        <form onSubmit={continueFromLocation} className="check-form">
          <div className="form-heading">
            <span className="form-icon"><MapPin /></span>
            <div><p className="eyebrow">Start with the facts</p><h2>Which property are you considering?</h2></div>
          </div>
          <label>Property address<input autoComplete="street-address" value={fields.address} onChange={(e) => update("address", e.target.value)} placeholder="14 Example Street" required /></label>
          <label>UK postcode<input autoComplete="postal-code" value={fields.postcode} onChange={(e) => update("postcode", e.target.value.toUpperCase())} placeholder="M20 2AB" required /></label>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button className="button button-wide" type="submit">Continue <ArrowRight size={18} /></button>
          <p className="form-note">We use the postcode to identify the council area. No account is needed for this first check.</p>
        </form>
      ) : (
        <form onSubmit={runCheck} className="check-form">
          <div className="form-heading">
            <span className="form-icon"><ShieldCheck /></span>
            <div><p className="eyebrow">Shape the check</p><h2>What could the property become?</h2></div>
          </div>
          <div className="form-grid">
            <label>Project idea<select value={fields.projectType} onChange={(e) => update("projectType", e.target.value as Fields["projectType"])}><option value="hmo">HMO conversion</option><option value="flats">Convert into flats</option><option value="extension">Extension or loft</option><option value="land">Develop land</option><option value="other">Something else</option></select></label>
            <label>Existing property<select value={fields.propertyType} onChange={(e) => update("propertyType", e.target.value as Fields["propertyType"])}><option value="house">House</option><option value="flat">Flat</option><option value="commercial">Commercial</option><option value="land">Land</option><option value="other">Other</option></select></label>
            <label>Current bedrooms<input type="number" min="0" max="30" value={fields.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} /></label>
            <label className="full">Anything useful to know? <span>(optional)</span><textarea value={fields.notes} onChange={(e) => update("notes", e.target.value)} placeholder="For example: corner plot, existing rear extension, vacant shop…" rows={4} /></label>
          </div>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <div className="form-actions">
            <button className="button button-ghost" type="button" onClick={() => setStep(1)}><ArrowLeft size={18} /> Back</button>
            <button className="button" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={18} /> Checking location…</> : <>Build my snapshot <ArrowRight size={18} /></>}</button>
          </div>
        </form>
      )}
    </div>
  );
}
