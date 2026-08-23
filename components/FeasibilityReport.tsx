"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { JOURNEYS, getJourney } from "@/lib/journeys";
import type { IntelResult } from "@/lib/intelLive";

const PROJECT_NOTES: Record<string, string[]> = {
  hmo: [
    "Check whether an HMO licence is required (mandatory for 5+ occupants; many areas add additional licensing).",
    "An Article 4 direction removes permitted-development rights to convert C3→C4, so planning permission is usually needed.",
    "Councils often resist new HMOs where saturation within 100m is already high — check the register early.",
  ],
  extension: [
    "Many extensions fall under permitted development — confirm size, height and position limits for the property.",
    "Article 4, conservation-area or listed status can remove PD rights and require full planning permission.",
    "A lawful development certificate is worth having even when permission isn't needed.",
  ],
  "house-to-flats": [
    "Converting a house to flats needs planning permission and must meet space, amenity and (often) parking standards.",
    "Building Regulations for sound, fire and means of escape are a major cost driver — budget for them early.",
    "Check any Article 4 or licensing implications for the resulting units.",
  ],
  "office-to-residential": [
    "Office (Class E) to residential can use the prior-approval route, but eligibility conditions apply (and Article 4 can remove it).",
    "New homes must meet nationally described space standards and natural-light requirements.",
    "Confirm the building's existing use class and any flooding/contamination constraints.",
  ],
  care: [
    "Supported or care use is usually Class C2 (or sui generis) — expect full planning permission and stakeholder engagement.",
    "Registration and standards (e.g. CQC) sit alongside planning — factor both timelines in.",
    "Parking, amenity and neighbour impact are common decision points.",
  ],
  "new-build": [
    "A new dwelling needs full (or outline) planning permission — pre-application advice is usually worthwhile.",
    "Access, drainage, ecology and design/context are common make-or-break issues.",
    "Check the plot for covenants, rights of way and existing use restrictions.",
  ],
};

function Chip({ tone, children }: { tone: "good" | "warn"; children: React.ReactNode }) {
  return (
    <li className={`flex gap-2 text-sm ${tone === "good" ? "text-ink/85" : "text-ink/85"}`}>
      <span className={tone === "good" ? "text-sage-600" : "text-clay-600"}>{tone === "good" ? "✓" : "▲"}</span>
      <span>{children}</span>
    </li>
  );
}

export function FeasibilityReport({ initialPc = "", initialSlug = "" }: { initialPc?: string; initialSlug?: string }) {
  const [pc, setPc] = useState(initialPc);
  const [slug, setSlug] = useState(initialSlug || "hmo");
  const [data, setData] = useState<IntelResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const run = useCallback(async (postcode: string, s: string) => {
    if (!postcode.trim()) return;
    setStatus("loading");
    setData(null);
    try {
      const res = await fetch(`/api/intel?postcode=${encodeURIComponent(postcode)}&slug=${encodeURIComponent(s)}`);
      const json = (await res.json()) as IntelResult;
      setData(json);
      setStatus(json.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (initialPc && initialSlug) run(initialPc, initialSlug);
  }, [initialPc, initialSlug, run]);

  const journey = getJourney(slug);

  // Build the positives / watch-outs from live data.
  const good: React.ReactNode[] = [];
  const watch: React.ReactNode[] = [];
  if (data?.ok) {
    if (slug === "hmo" && data.hmoArticle4) watch.push("An HMO Article 4 direction applies here — planning permission is needed to create an HMO.");
    else if (data.article4.length) watch.push(<>In an Article 4 area ({data.article4.map((a) => a.name).join(", ")}) — permitted-development rights may be restricted.</>);
    else good.push("No Article 4 direction found at this point.");

    if (data.conservation.length) watch.push(<>In a conservation area ({data.conservation[0].name}) — expect extra design scrutiny.</>);
    else good.push("Not in a conservation area at this point.");

    if (data.listed.length) watch.push("Listed building(s) within ~100m — works may need listed-building consent.");
    if (data.flood.zones.length) watch.push("A flood zone is present here — check the EA flood map and design accordingly.");
    else good.push("No flood zone returned for this point.");

    const c = data.apps.counts;
    if (c.decided >= 3) {
      const rate = Math.round((c.approved / c.decided) * 100);
      if (rate >= 60) good.push(<>Local approval signal looks positive: {c.approved} of {c.decided} recent similar decisions nearby were approved ({rate}%).</>);
      else watch.push(<>Local approval signal is mixed: only {c.approved} of {c.decided} recent similar decisions nearby were approved ({rate}%).</>);
    }
  }

  const verdict =
    watch.length === 0 ? { label: "Looks promising", cls: "bg-sage-50 text-sage-700" }
    : watch.length <= 2 ? { label: "Worth exploring — with care", cls: "bg-clay-50 text-clay-700" }
    : { label: "Notable hurdles to weigh up", cls: "bg-clay-50 text-clay-700" };

  return (
    <div>
      {/* Controls */}
      <div className="card p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="block">
            <span className="text-sm font-medium text-ink">Project type</span>
            <select value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm">
              {JOURNEYS.map((j) => <option key={j.slug} value={j.slug}>{j.shortName}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Postcode</span>
            <input
              value={pc}
              onChange={(e) => setPc(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && run(pc, slug)}
              placeholder="e.g. B14 4AA"
              className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm uppercase"
            />
          </label>
          <button onClick={() => run(pc, slug)} className="btn-primary self-end text-sm">Get report</button>
        </div>
      </div>

      {status === "loading" && <p className="mt-6 text-sm text-muted">Checking official records…</p>}
      {status === "error" && (
        <p className="mt-6 rounded-xl border border-clay-200 bg-clay-50 px-4 py-3 text-sm text-clay-700">
          Couldn&apos;t generate a report for that postcode. Check it&apos;s a valid UK postcode and try again.
        </p>
      )}

      {status === "done" && data?.ok && (
        <div className="mt-6 space-y-6">
          <div className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-clay-600">Feasibility summary</p>
                <h2 className="mt-1 font-serif text-2xl text-ink">{journey?.shortName} · {data.geo.council}</h2>
                <p className="text-sm text-muted">{pc.toUpperCase()}{data.geo.ward ? ` · ${data.geo.ward}` : ""}</p>
              </div>
              <span className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${verdict.cls}`}>{verdict.label}</span>
            </div>

            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-sage-700">In your favour</h3>
                <ul className="mt-2 space-y-1.5">
                  {good.length ? good.map((g, i) => <Chip key={i} tone="good">{g}</Chip>) : <li className="text-sm text-muted">—</li>}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-clay-700">Watch out for</h3>
                <ul className="mt-2 space-y-1.5">
                  {watch.length ? watch.map((w, i) => <Chip key={i} tone="warn">{w}</Chip>) : <li className="text-sm text-muted">Nothing flagged from the data at this point.</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Project-specific considerations */}
          <div className="card p-6">
            <h3 className="display text-lg">Key considerations for {journey?.shortName.toLowerCase()}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {(PROJECT_NOTES[slug] || []).map((t, i) => (
                <li key={i} className="flex gap-2"><span className="text-sage-600">·</span>{t}</li>
              ))}
            </ul>
            {journey && (
              <p className="mt-4 text-sm text-muted">
                Typical team for this project:{" "}
                <span className="text-ink">{Array.from(new Set(journey.stages.flatMap((s) => s.professionals))).slice(0, 5).join(", ")}</span>.
              </p>
            )}
          </div>

          <p className="text-[0.7rem] leading-relaxed text-muted">
            Sources: {data.sources.join(" · ")}. This is an automated summary for general guidance, not
            professional or planning advice — public records can be incomplete and must be confirmed with
            {data.geo.council ? ` ${data.geo.council}` : " the local authority"}.
          </p>

          {/* Upsell to expert-reviewed */}
          <div className="rounded-2xl border border-sage-200 bg-sage-50/40 px-6 py-6">
            <h3 className="font-serif text-lg text-ink">Want a professional to review this?</h3>
            <p className="mt-1.5 max-w-2xl text-sm text-muted">
              The full expert-reviewed feasibility report adds a vetted professional&apos;s judgement on your
              specific scheme, a planning-strategy view and the likely route to consent.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/upgrade" className="btn-primary text-sm">See project reports →</Link>
              <Link href={`/journeys/${slug}?pc=${encodeURIComponent(pc)}`} className="btn-outline text-sm">Open the full journey</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
