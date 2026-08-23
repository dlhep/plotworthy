"use client";

import { useState } from "react";
import Link from "next/link";
import { appraise, gbp0, type AppraisalInput } from "@/lib/appraisal";

function Num({ label, value, onChange, prefix = "£", hint }: { label: string; value: string; onChange: (v: string) => void; prefix?: string; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      {hint && <span className="ml-1 text-xs text-muted">{hint}</span>}
      <div className="mt-1.5 flex items-center rounded-lg border border-line bg-white focus-within:border-sage-400 focus-within:ring-2 focus-within:ring-sage-100">
        <span className="pl-3 text-sm text-muted">{prefix}</span>
        <input
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
          className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
          placeholder="0"
        />
      </div>
    </label>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" | "warn" }) {
  const color = tone === "good" ? "text-sage-700" : tone === "bad" ? "text-clay-700" : "text-ink";
  return (
    <div className="rounded-xl border border-line bg-white px-4 py-3">
      <div className={`font-serif text-2xl ${color}`}>{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}

const n = (s: string) => (s ? parseFloat(s) : 0) || 0;
const pct = (x: number) => `${x >= 0 ? "" : "−"}${Math.abs(x).toFixed(1)}%`;

export function AppraisalCalc() {
  const [mode, setMode] = useState<"sell" | "rent">("sell");
  const [additional, setAdditional] = useState(true);
  const [purchase, setPurchase] = useState("");
  const [works, setWorks] = useState("");
  const [fees, setFees] = useState("");
  const [gdv, setGdv] = useState("");
  const [rent, setRent] = useState("");
  const [running, setRunning] = useState("");

  const input: AppraisalInput = {
    mode,
    purchase: n(purchase),
    additional,
    works: n(works),
    fees: n(fees),
    gdv: n(gdv),
    annualRent: n(rent),
    runningCosts: n(running),
  };
  const r = appraise(input);
  const hasInput = input.purchase > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
      {/* Inputs */}
      <div className="card p-5 sm:p-6">
        <div className="flex rounded-lg border border-line p-1 text-sm">
          {(["sell", "rent"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-md px-3 py-1.5 font-medium transition-colors ${
                mode === m ? "bg-sage-600 text-white" : "text-ink/70 hover:bg-cream"
              }`}
            >
              {m === "sell" ? "Develop & sell" : "Buy & rent"}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          <Num label="Purchase price" value={purchase} onChange={setPurchase} />
          <label className="flex items-center gap-2 text-sm text-ink/85">
            <input type="checkbox" checked={additional} onChange={(e) => setAdditional(e.target.checked)} className="h-4 w-4" />
            Additional property (buy-to-let / second home) — adds 5% SDLT surcharge
          </label>
          <Num label={mode === "sell" ? "Build / refurb cost" : "Refurb cost"} value={works} onChange={setWorks} />
          <Num label="Other costs" value={fees} onChange={setFees} hint="legals, survey, finance, contingency" />
          {mode === "sell" ? (
            <Num label="End value (GDV)" value={gdv} onChange={setGdv} hint="expected sale value" />
          ) : (
            <>
              <Num label="Gross annual rent" value={rent} onChange={setRent} />
              <Num label="Annual running costs" value={running} onChange={setRunning} hint="management, voids, maintenance, insurance" />
            </>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="card p-5 sm:p-6">
        <h3 className="display text-lg">Your figures</h3>
        {!hasInput ? (
          <p className="mt-2 text-sm text-muted">Enter a purchase price to see your appraisal.</p>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Stat label="Stamp Duty (SDLT)" value={gbp0(r.sdlt)} />
              <Stat label="Total invested" value={gbp0(r.totalInvestment)} />
              {mode === "sell" ? (
                <>
                  <Stat label="Profit" value={gbp0(r.profit)} tone={r.profit >= 0 ? "good" : "bad"} />
                  <Stat label="Return on cost" value={pct(r.returnOnCost)} tone={r.returnOnCost >= 20 ? "good" : r.returnOnCost >= 0 ? "warn" : "bad"} />
                  <Stat label="Margin on GDV" value={pct(r.marginOnGdv)} tone={r.marginOnGdv >= 20 ? "good" : r.marginOnGdv >= 0 ? "warn" : "bad"} />
                </>
              ) : (
                <>
                  <Stat label="Gross yield" value={pct(r.grossYield)} tone={r.grossYield >= 7 ? "good" : "warn"} />
                  <Stat label="Yield on total cost" value={pct(r.yieldOnCost)} tone={r.yieldOnCost >= 7 ? "good" : "warn"} />
                  <Stat label="Net income / yr" value={gbp0(r.netAnnual)} tone={r.netAnnual >= 0 ? "good" : "bad"} />
                  <Stat label="Net yield on cost" value={pct(r.netYieldOnCost)} tone={r.netYieldOnCost >= 5 ? "good" : "warn"} />
                </>
              )}
            </div>
            <p className="mt-4 text-[0.7rem] leading-relaxed text-muted">
              Indicative only, to help you sanity-check a deal — not financial, tax or investment advice.
              SDLT uses England &amp; NI residential rates (from April 2025) and doesn&apos;t cover reliefs,
              company purchases, or mixed-use. Confirm figures with a qualified adviser. See{" "}
              <Link href="/trust" className="font-medium text-sage-700 hover:underline">how we work</Link>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
