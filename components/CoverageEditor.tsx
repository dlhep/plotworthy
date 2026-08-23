"use client";

import { useMemo, useState } from "react";
import { CoverageMap } from "./CoverageMap";
import { toDistrict } from "@/lib/postcodes";
import { gbp, PRICING } from "@/lib/pricing";

type SaveState = "idle" | "saving" | "saved" | "error";

export function CoverageEditor({
  area,
  seed,
  includedBase,
  packs,
  coverageLabel,
}: {
  area: string;
  seed: string[];
  includedBase: number;
  packs: number;
  coverageLabel: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(seed));
  const [available, setAvailable] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState("");

  const allowance = includedBase + Math.max(0, packs) * 5;
  const list = useMemo(() => Array.from(selected).sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ""), 10);
    const nb = parseInt(b.replace(/\D/g, ""), 10);
    return na - nb || a.localeCompare(b);
  }), [selected]);
  const over = Math.max(0, selected.size - allowance);
  const packsNeeded = Math.ceil(over / 5);

  const toggle = (code: string) => {
    const c = toDistrict(code);
    if (!c) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
    setState("idle");
  };

  const add = () => {
    const c = toDistrict(draft);
    if (c) {
      setSelected((prev) => new Set(prev).add(c));
      setDraft("");
      setState("idle");
    }
  };

  const suggestions = available.filter((c) => !selected.has(c)).slice(0, 12);

  async function save() {
    setState("saving");
    setError("");
    try {
      const res = await fetch("/api/professional/coverage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ districts: Array.from(selected) }),
      });
      const json = await res.json();
      if (json.ok) setState("saved");
      else {
        setError(json.error || "Couldn’t save.");
        setState("error");
      }
    } catch {
      setError("Couldn’t reach the server.");
      setState("error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start">
      {/* Controls */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-clay-600">Lead preferences</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${over > 0 ? "bg-clay-50 text-clay-700" : "bg-sage-50 text-sage-700"}`}>
            {selected.size}/{allowance} covered
          </span>
        </div>
        <h2 className="mt-2 font-serif text-2xl font-medium text-ink">Choose your districts</h2>
        <p className="mt-1 text-sm text-muted">
          Pick the {area} districts where you want first access to new projects — type them in or click them on the map. Only you can see these.
        </p>

        <div className="mt-4 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
            placeholder={`For example ${area}7`}
            className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm uppercase focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200"
          />
          <button onClick={add} className="btn-primary text-sm">+ Add</button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-clay-600">Your districts</span>
          {selected.size > 0 && (
            <button onClick={() => { setSelected(new Set()); setState("idle"); }} className="text-xs font-semibold text-sage-700">Clear all</button>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {list.length ? (
            list.map((d) => (
              <span key={d} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas py-1 pl-2.5 pr-1.5 text-sm font-semibold text-ink">
                {d}
                <button onClick={() => toggle(d)} className="text-muted hover:text-clay-600" aria-label={`Remove ${d}`}>×</button>
              </span>
            ))
          ) : (
            <span className="text-sm text-muted">No districts selected yet.</span>
          )}
        </div>

        {suggestions.length > 0 && (
          <>
            <p className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-clay-600">Nearby in {area}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {suggestions.map((d) => (
                <button
                  key={d}
                  onClick={() => toggle(d)}
                  className="inline-flex h-9 min-w-[2.75rem] items-center justify-center rounded-full border border-line bg-white px-2 text-xs text-ink hover:border-sage-300"
                >
                  {d}
                </button>
              ))}
            </div>
          </>
        )}

        {over > 0 && (
          <p className="mt-3 rounded-lg bg-clay-50 px-3 py-2 text-xs text-clay-700">
            You’ve chosen {over} more than your plan covers. Add {packsNeeded} district pack{packsNeeded > 1 ? "s" : ""} below to make {over > 1 ? "them" : "it"} live.
          </p>
        )}

        <button onClick={save} disabled={state === "saving"} className="btn-primary mt-4 w-full disabled:opacity-60">
          {state === "saving" ? "Saving…" : state === "saved" ? "✓ Saved" : "Save coverage"}
        </button>
        {state === "error" && <p className="mt-2 text-center text-xs text-clay-700">{error}</p>}
        {state === "saved" && <p className="mt-2 text-center text-xs text-sage-700">Your coverage is saved. Only you can see it.</p>}
      </div>

      {/* Map + pricing */}
      <div className="grid gap-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-ink">Your coverage map</h2>
            <span className="text-xs font-semibold text-sage-700">{selected.size} selected</span>
          </div>
          <CoverageMap area={area} selected={selected} onToggle={toggle} onDistrictsLoaded={setAvailable} />
          <p className="mt-2 text-xs text-muted">
            Boundaries follow postcode districts (MapLibre · OpenFreeMap). Click a district on the map, or use the field and pills, to add or remove it.
          </p>
        </div>

        {/* Pricing structure */}
        <div className="rounded-2xl border border-clay-200 bg-clay-50/60 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-clay-700">
            🔒 {includedBase} districts included with Professional membership
          </div>
          <p className="mt-0.5 text-xs text-clay-700">
            Need more? Add district packs — {gbp(PRICING.postcodePack)}/mo for every 5 districts.
            You currently have {packs} pack{packs === 1 ? "" : "s"} ({allowance} districts total).
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <PackCard label="+1 pack" districts="5 districts" amt={gbp(PRICING.postcodePack)} />
            <PackCard label="+2 packs" districts="10 districts" amt={gbp(PRICING.postcodePack * 2)} best />
            <PackCard label="+4 packs" districts="20 districts" amt={gbp(PRICING.postcodePack * 4)} />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-sage-200 bg-white/70 px-3.5 py-2.5">
            <div>
              <strong className="text-sm text-ink">Enhanced profile</strong>
              <p className="text-xs text-muted">Featured placement, bigger gallery, verified badge.</p>
            </div>
            <span className="font-serif text-ink">{gbp(PRICING.enhanced)}<span className="text-xs text-muted">/mo</span></span>
          </div>
          <p className="mt-3 text-[0.7rem] text-muted">
            To change your packs or add Enhanced,{" "}
            <a href="mailto:hello@plotworthy.co.uk?subject=Coverage%20packs" className="font-medium text-sage-700 hover:underline">email us</a>{" "}
            and we’ll update your plan. Prices exclude VAT.
          </p>
        </div>
      </div>
    </div>
  );
}

function PackCard({ label, districts, amt, best }: { label: string; districts: string; amt: string; best?: boolean }) {
  return (
    <div className={`relative rounded-lg border bg-white px-2 py-3 text-center ${best ? "border-clay-300 ring-1 ring-clay-200" : "border-line"}`}>
      {best && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-clay-400 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wide text-sage-900">
          Popular
        </span>
      )}
      <div className="text-[0.72rem] font-semibold text-ink">{label}</div>
      <div className="mt-0.5 font-serif text-xl text-ink">{amt}<span className="text-[0.65rem] text-muted">/mo</span></div>
      <div className="mt-1 text-[0.62rem] text-muted">{districts}</div>
    </div>
  );
}
