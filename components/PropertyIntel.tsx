"use client";

import { useCallback, useEffect, useState } from "react";
import type { IntelResult } from "@/lib/intelLive";

const FLOOD_MAP = "https://check-long-term-flood-risk.service.gov.uk/postcode";
const HMO_REGISTER = "https://www.gov.uk/find-licences/houses-in-multiple-occupation-licence";

function DecisionBadge({ d }: { d: string }) {
  const cls =
    d === "Approved"
      ? "bg-sage-50 text-sage-700"
      : d === "Refused"
      ? "bg-clay-50 text-clay-700"
      : d === "Pending"
      ? "bg-cream text-muted"
      : "bg-cream text-muted";
  return <span className={`h-fit whitespace-nowrap rounded-full px-2 py-0.5 text-[0.66rem] font-bold ${cls}`}>{d}</span>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-canvas px-4 py-4">
      <h4 className="text-sm font-semibold text-ink">{title}</h4>
      <div className="mt-2 text-sm text-muted">{children}</div>
    </div>
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
  const [data, setData] = useState<IntelResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const lookup = useCallback(async (postcode: string) => {
    setStatus("loading");
    setData(null);
    try {
      const res = await fetch(`/api/intel?postcode=${encodeURIComponent(postcode)}&slug=${encodeURIComponent(slug)}`);
      const json = (await res.json()) as IntelResult;
      setData(json);
      setStatus(json.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }, [slug]);

  useEffect(() => {
    if (initialPc) lookup(initialPc);
  }, [initialPc, lookup]);

  if (!pc) {
    return (
      <div className="card p-6 text-center">
        <h3 className="display text-xl">Real local checks for your property</h3>
        <p className="mx-auto mt-1.5 max-w-xl text-sm text-muted">
          Enter a postcode to check — from official sources — Article 4 status, conservation area,
          listed buildings, flood risk and recent planning applications nearby.
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
            onKeyDown={(e) => e.key === "Enter" && draftPc.trim() && (setPc(draftPc.trim()), setAddress(draftAddr.trim()), lookup(draftPc.trim()))}
            placeholder="Postcode e.g. B14 4AA"
            className="w-40 rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm uppercase"
          />
          <button
            type="button"
            onClick={() => draftPc.trim() && (setPc(draftPc.trim()), setAddress(draftAddr.trim()), lookup(draftPc.trim()))}
            className="btn-primary text-sm"
          >
            Check
          </button>
        </div>
        <p className="mx-auto mt-3 max-w-lg text-[0.7rem] text-muted">
          A full postcode gives the most precise result; an outcode (e.g. B14) uses the area centroid.
        </p>
      </div>
    );
  }

  const reset = () => { setPc(""); setData(null); setStatus("idle"); };

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-serif text-xl font-medium text-ink">
            {address || (data?.geo.council ? `Property in ${data.geo.council}` : `Property at ${pc.toUpperCase()}`)}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {pc.toUpperCase()}
            {data?.geo.council ? ` · ${data.geo.council}` : ""}
            {data?.geo.ward ? ` · ${data.geo.ward}` : ""}
          </p>
        </div>
        <button onClick={reset} className="btn-outline text-sm">Change property</button>
      </div>

      {status === "loading" && (
        <p className="mt-6 text-sm text-muted">Checking official records…</p>
      )}

      {status === "error" && (
        <div className="mt-5 rounded-xl border border-clay-200 bg-clay-50 px-4 py-3 text-sm text-clay-700">
          We couldn&apos;t look up that postcode just now. Check it&apos;s a valid UK postcode, or try again shortly.
        </div>
      )}

      {status === "done" && data && (
        <>
          {/* Article 4 — the headline planning-rights check */}
          <div className="mt-4">
            {data.hmoArticle4 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-clay-50 px-3 py-1 text-xs font-semibold text-clay-700">
                ⚠ Article 4 (HMO) direction here — planning permission is likely required to create an HMO
              </span>
            ) : data.article4.length ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-clay-50 px-3 py-1 text-xs font-semibold text-clay-700">
                ⚠ Article 4 direction here: {data.article4.map((a) => a.name).join(", ")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-50 px-3 py-1 text-xs font-semibold text-sage-700">
                ✓ No Article 4 direction found at this point
              </span>
            )}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <Card title="Conservation area">
              {data.conservation.length ? (
                <span className="font-medium text-clay-700">In {data.conservation.map((c) => c.name).join(", ")}</span>
              ) : (
                "None found at this point."
              )}
            </Card>

            <Card title="Listed buildings (within ~100m)">
              {data.listed.length ? (
                <ul className="space-y-0.5">
                  {data.listed.slice(0, 4).map((l) => (
                    <li key={l.name} className="text-ink/85">{l.name}</li>
                  ))}
                </ul>
              ) : (
                "None found within about 100m."
              )}
            </Card>

            <Card title="Flood risk">
              {data.flood.zones.length ? (
                <span className="font-medium text-clay-700">
                  Flood zone present: {data.flood.zones.map((z) => z.name).join(", ")}.{" "}
                </span>
              ) : (
                "No flood zone returned for this point. "
              )}
              <a href={FLOOD_MAP} target="_blank" rel="noopener noreferrer" className="font-medium text-sage-700 hover:underline">
                Check the EA flood map →
              </a>
            </Card>

            <Card title="HMO licensing">
              HMO counts aren&apos;t published in one national dataset. Check{" "}
              {data.geo.council ? `${data.geo.council}'s` : "your council's"} public HMO register:{" "}
              <a href={HMO_REGISTER} target="_blank" rel="noopener noreferrer" className="font-medium text-sage-700 hover:underline">
                find the HMO register →
              </a>
            </Card>
          </div>

          {/* Real nearby planning applications */}
          <div className="mt-5 rounded-xl border border-line bg-canvas px-4 py-4">
            <h4 className="flex items-center justify-between text-sm font-semibold text-ink">
              Recent planning applications nearby <span className="font-medium text-muted">~800m · {shortName}</span>
            </h4>
            {data.apps.ok && data.apps.items.length ? (
              <div className="mt-2">
                {data.apps.items.map((ap, i) => (
                  <div key={i} className="flex gap-3 border-b border-dashed border-line py-2.5 last:border-0">
                    <DecisionBadge d={ap.decision} />
                    <div className="min-w-0 flex-1">
                      {ap.url ? (
                        <a href={ap.url} target="_blank" rel="noopener noreferrer" className="text-sm text-ink hover:underline">{ap.desc}</a>
                      ) : (
                        <p className="text-sm text-ink">{ap.desc}</p>
                      )}
                      <p className="text-xs text-muted">
                        {[ap.address, ap.ref, ap.date].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">
                No matching recent applications found in the aggregated data. Coverage varies by council —
                confirm on {data.geo.council ? `${data.geo.council}'s` : "your council's"} planning portal.
              </p>
            )}
          </div>

          <p className="mt-4 text-[0.7rem] leading-relaxed text-muted">
            Sources: {data.sources.join(" · ")}. These are real public records, but they can be incomplete or
            out of date and are not a substitute for confirming the position with
            {data.geo.council ? ` ${data.geo.council}` : " the local authority"}. Absence of a designation here
            is not a guarantee that none applies.
          </p>
        </>
      )}
    </div>
  );
}
