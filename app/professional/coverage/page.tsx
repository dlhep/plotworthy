"use client";

import { useState } from "react";
import { CoverageMap } from "@/components/CoverageMap";

const SUGGEST = ["B1","B2","B3","B4","B5","B13","B14","B15","B16","B17","B18","B23","B24","B29","B30","B31","B32","B42","B43","B44"];
const INCLUDED = 5;

export default function CoveragePage() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["B13", "B14", "B15", "B16", "B17"])
  );
  const [draft, setDraft] = useState("");
  const [enhanced, setEnhanced] = useState(false);

  const toggle = (code: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });

  const list = Array.from(selected).sort();
  const over = Math.max(0, selected.size - INCLUDED);

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-3.5">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted">Professional workspace</p>
          <p className="font-serif text-lg font-medium text-ink">Coverage map</p>
        </div>
        <span className="btn-outline btn text-sm">Account ▾</span>
      </div>

      <div className="grid max-w-[80rem] gap-6 p-4 sm:p-8 lg:grid-cols-[minmax(0,410px)_1fr]">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-clay-600">Lead preferences</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${over > 0 ? "bg-clay-50 text-clay-700" : "bg-sage-50 text-sage-700"}`}>
              {selected.size}/{INCLUDED} included
            </span>
          </div>
          <h2 className="mt-2 font-serif text-2xl font-medium text-ink">Select postcode districts</h2>
          <p className="mt-1 text-sm text-muted">
            Choose the districts where you want first access to new projects — or click them on the map. Change this any time.
          </p>

          <div className="mt-4 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter" && /^B\d{1,2}$/.test(draft.trim())) {
                  toggle(draft.trim());
                  setDraft("");
                }
              }}
              placeholder="For example B17"
              className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm uppercase"
            />
            <button
              onClick={() => {
                if (/^B\d{1,2}$/.test(draft.trim())) {
                  toggle(draft.trim());
                  setDraft("");
                }
              }}
              className="btn-primary text-sm"
            >
              + Add
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-clay-600">Included districts</span>
            <button onClick={() => setSelected(new Set())} className="text-xs font-semibold text-sage-700">Clear all</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {list.length ? (
              list.map((d) => (
                <span key={d} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas py-1 pl-2.5 pr-1.5 text-sm font-semibold text-ink">
                  {d}
                  <button onClick={() => toggle(d)} className="text-muted hover:text-clay-600">×</button>
                </span>
              ))
            ) : (
              <span className="text-sm text-muted">No districts selected yet.</span>
            )}
          </div>
          {over > 0 && (
            <p className="mt-2.5 text-sm text-clay-700">
              You’re {over} over your included {INCLUDED}. Add a district package below to cover them.
            </p>
          )}

          <p className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-clay-600">Nearby suggestions</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUGGEST.map((d) => {
              const on = selected.has(d);
              return (
                <button
                  key={d}
                  onClick={() => toggle(d)}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-xs ${
                    on ? "border-sage-600 bg-sage-600 text-white" : "border-line bg-white text-ink hover:border-sage-300"
                  }`}
                >
                  {on ? "✓" : d}
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-clay-200 bg-clay-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-clay-700">🔒 {INCLUDED} districts included with Professional membership</div>
            <p className="mt-0.5 text-xs text-clay-700">Add reusable district slots any time.</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <PriceCard t="+1 district" amt="£5" sub="One adjoining area." />
              <PriceCard t="+10 districts" amt="£40" sub="Save £10 vs single slots." best />
              <PriceCard t="+25 districts" amt="£75" sub="Broad regional coverage." />
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-sage-200 bg-sage-50 p-4">
            <span className="tile h-10 w-10 shrink-0 bg-white" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <strong className="text-sm text-ink">Enhanced profile</strong>
                <span className="font-serif text-ink">£19<span className="text-xs text-muted">/mo</span></span>
              </div>
              <p className="mt-0.5 text-xs text-muted">Featured placement, a bigger portfolio gallery and a verified badge.</p>
              <button
                onClick={() => setEnhanced((v) => !v)}
                className={`mt-2 text-sm ${enhanced ? "btn-primary" : "btn-outline"} btn`}
              >
                {enhanced ? "✓ Enhanced active" : "Upgrade to Enhanced"}
              </button>
            </div>
          </div>

          <button className="btn-primary mt-4 w-full">Save coverage</button>
          <p className="mt-2 text-center text-[0.7rem] text-muted">Preview — pricing buttons connect to Stripe in production.</p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-ink">Your coverage map</h2>
            <span className="text-xs font-semibold text-sage-700">{selected.size} selected</span>
          </div>
          <CoverageMap selected={selected} onToggle={toggle} />
          <p className="mt-2 text-xs text-muted">
            Shaded shapes follow postcode-district boundaries (MapLibre · OpenFreeMap). Click a district on the map or a pill to add or remove it.
          </p>
        </div>
      </div>
    </div>
  );
}

function PriceCard({ t, amt, sub, best }: { t: string; amt: string; sub: string; best?: boolean }) {
  return (
    <div className={`relative rounded-lg border bg-white px-2 py-3 text-center ${best ? "border-clay-300 ring-1 ring-clay-200" : "border-line"}`}>
      {best && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-clay-400 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wide text-sage-900">
          Best value
        </span>
      )}
      <div className="text-[0.72rem] font-semibold text-ink">{t}</div>
      <div className="mt-0.5 font-serif text-xl text-ink">
        {amt}
        <span className="text-[0.65rem] text-muted">/mo</span>
      </div>
      <div className="mt-1 text-[0.62rem] text-muted">{sub}</div>
      <button className="btn-outline btn mt-2 w-full py-1 text-[0.68rem]">Choose</button>
    </div>
  );
}
