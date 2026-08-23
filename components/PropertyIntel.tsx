"use client";

import { useState } from "react";
import { getIntel, hmoDots, appDots } from "@/lib/intel";

const decColor = (d: string) =>
  d === "Approved" ? "var(--sage-600, #436b4f)" : d === "Refused" ? "var(--clay-600, #b85a30)" : "#786f62";

function LocalMap({ intel }: { intel: ReturnType<typeof getIntel> }) {
  const cx = 160,
    cy = 98,
    R = 66;
  return (
    <svg
      viewBox="0 0 320 200"
      role="img"
      aria-label="Local area map"
      className="mt-2 block h-auto w-full rounded-lg"
      style={{ background: "linear-gradient(180deg,#f0ede4,#f7f2e8)" }}
    >
      <g stroke="#e6dccb" strokeWidth="6" fill="none" strokeLinecap="round">
        <path d="M0 58 H320" />
        <path d="M0 140 H320" />
        <path d="M92 0 V200" />
        <path d="M232 0 V200" />
      </g>
      <circle cx={cx} cy={cy} r={R} fill="#436b4f" fillOpacity="0.08" stroke="#557b56" strokeWidth="1.3" strokeDasharray="4 4" />
      {hmoDots(intel).map((d, i) => (
        <circle key={"h" + i} cx={d.x} cy={d.y} r="4" fill="#cd6f3b" opacity="0.9" />
      ))}
      {appDots(intel).map((d, i) => (
        <circle key={"a" + i} cx={d.x} cy={d.y} r="4.5" fill="none" stroke={decColor(d.decision)} strokeWidth="2" />
      ))}
      <circle cx={cx} cy={cy} r="6" fill="#375741" />
      <path d={`M${cx} ${cy + 6} L${cx} ${cy + 13}`} stroke="#375741" strokeWidth="2" />
      <text x={cx} y={cy + R + 15} textAnchor="middle" fontSize="9" fill="#786f62">
        100m radius
      </text>
    </svg>
  );
}

export function PropertyIntel({
  slug,
  shortName,
  initialPc = "",
  initialAddress = "",
}: {
  slug: string;
  shortName: string;
  initialPc?: string;
  initialAddress?: string;
}) {
  const [pc, setPc] = useState(initialPc);
  const [address, setAddress] = useState(initialAddress);
  const [draftPc, setDraftPc] = useState("");
  const [draftAddr, setDraftAddr] = useState("");

  if (!pc) {
    return (
      <div className="card p-6 text-center">
        <h3 className="display text-xl">Add your property to unlock local intelligence</h3>
        <p className="mx-auto mt-1.5 max-w-xl text-sm text-muted">
          Enter the property address and postcode — or a postcode you’re considering. PlotWorthy
          checks Article 4 status, {slug === "hmo" ? "HMO saturation within 100m, " : ""}nearby
          planning history and matches vetted professionals in that area.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <input
            value={draftAddr}
            onChange={(e) => setDraftAddr(e.target.value)}
            placeholder="Address (optional)"
            className="min-w-48 flex-1 rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm"
          />
          <input
            value={draftPc}
            onChange={(e) => setDraftPc(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && draftPc.trim() && (setPc(draftPc.trim()), setAddress(draftAddr.trim()))}
            placeholder="Postcode e.g. B14"
            className="w-36 rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm uppercase"
          />
          <button
            type="button"
            onClick={() => draftPc.trim() && (setPc(draftPc.trim()), setAddress(draftAddr.trim()))}
            className="btn-primary text-sm"
          >
            Look up
          </button>
        </div>
      </div>
    );
  }

  const intel = getIntel(pc, slug);
  const satPct = (Math.min(intel.pct, 15) / 15) * 100;
  const satColor = intel.pct >= 10 ? "#cd6f3b" : intel.pct >= 8 ? "#dc8c52" : "#557b56";

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-serif text-xl font-medium text-ink">{address || `Property in ${intel.area}`}</p>
          <p className="mt-0.5 text-sm text-muted">
            {pc.toUpperCase()} · {intel.authority}
          </p>
          <div className="mt-2">
            {intel.article4 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-clay-50 px-3 py-1 text-xs font-semibold text-clay-700">
                ⚠ Article 4 area — planning permission likely required
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-50 px-3 py-1 text-xs font-semibold text-sage-700">
                ✓ Not in a known Article 4 area
              </span>
            )}
          </div>
        </div>
        <button onClick={() => setPc("")} className="btn-outline text-sm">
          Change property
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {slug === "hmo" ? (
          <div className="rounded-xl border border-line bg-canvas px-4 py-4">
            <h4 className="flex items-center justify-between text-sm font-semibold text-ink">
              HMO saturation <span className="font-medium text-muted">100m radius</span>
            </h4>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl text-ink">{intel.hmoCount}</span>
              <span className="text-sm text-muted">licensed HMOs · {intel.pct}% of homes</span>
            </div>
            <div className="relative mt-2 h-2.5 rounded-full bg-sage-100">
              <div className="h-full rounded-full" style={{ width: `${satPct}%`, background: satColor }} />
              <div className="absolute -top-1 bottom-[-4px] w-0.5 bg-ink/50" style={{ left: `${(10 / 15) * 100}%` }} />
            </div>
            <p className="mt-4 text-[0.6rem] text-muted" style={{ marginLeft: `${(10 / 15) * 100 - 3}%` }}>
              10% threshold
            </p>
            <p className={`text-sm font-semibold ${intel.pct >= 10 ? "text-clay-700" : "text-sage-700"}`}>
              {intel.satStatus}
            </p>
            <LocalMap intel={intel} />
            <p className="mt-1.5 text-[0.68rem] text-muted">
              ● licensed HMO&nbsp;&nbsp;◯ planning application (green approved · clay refused). Many councils refuse
              new HMOs once 10% of homes within 100m are already HMOs.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-line bg-canvas px-4 py-4">
            <h4 className="text-sm font-semibold text-ink">Local context</h4>
            <LocalMap intel={intel} />
            <p className="mt-1.5 text-[0.68rem] text-muted">
              ◯ nearby {shortName.toLowerCase()} planning application (green approved · clay refused).
            </p>
          </div>
        )}

        <div className="rounded-xl border border-line bg-canvas px-4 py-4">
          <h4 className="flex items-center justify-between text-sm font-semibold text-ink">
            Planning history nearby <span className="font-medium text-muted">{shortName}</span>
          </h4>
          <div className="mt-2">
            {intel.apps.map((ap, i) => (
              <div key={i} className="flex gap-3 border-b border-dashed border-line py-2.5 last:border-0">
                <span
                  className={`h-fit whitespace-nowrap rounded-full px-2 py-0.5 text-[0.66rem] font-bold ${
                    ap.decision === "Approved"
                      ? "bg-sage-50 text-sage-700"
                      : ap.decision === "Refused"
                      ? "bg-clay-50 text-clay-700"
                      : "bg-cream text-muted"
                  }`}
                >
                  {ap.decision}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">{ap.desc}</p>
                  <p className="text-xs text-muted">
                    {ap.addr} · {ap.ref} · {ap.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div
            className={`mt-3 flex items-center gap-3 rounded-xl px-4 py-3 ${
              intel.rate >= 60 ? "bg-sage-50" : "bg-clay-50"
            }`}
          >
            <span className={`font-serif text-2xl ${intel.rate >= 60 ? "text-sage-700" : "text-clay-700"}`}>
              {intel.rate}%
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Approval rate nearby</p>
              <p className="text-xs text-muted">
                {intel.rate >= 70
                  ? "Strong track record locally"
                  : intel.rate >= 50
                  ? "Mixed — worth an early planning view"
                  : "Challenging — get advice early"}{" "}
                — recent {shortName.toLowerCase()} applications in {intel.area}.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[0.7rem] text-muted">
        Prototype intelligence — in the live app this draws on the council’s Article 4 map, the public HMO
        licensing register and the Planning Data / council planning portal for real figures.
      </p>
    </div>
  );
}
