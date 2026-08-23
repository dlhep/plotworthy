import { getProfessionalForUser } from "@/lib/professionalAuth";
import { CoverageMapMulti } from "@/components/CoverageMapMulti";
import { districtsFromCoverage } from "@/lib/postcodes";
import { memberMonthly, gbp } from "@/lib/pricing";
import { isOwnerEmail } from "@/lib/owner";

export const dynamic = "force-dynamic";

export default async function CoveragePage() {
  const { pro } = await getProfessionalForUser();
  if (!pro) return null;

  const owner = isOwnerEmail(pro.email);
  const allowance = 5 + (pro.membership.postcodePacks || 0) * 5;
  const assigned = Array.isArray((pro as any).districts) ? ((pro as any).districts as string[]) : [];
  const districts = assigned.length ? assigned : districtsFromCoverage(pro.coverage);
  const sorted = [...districts].sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ""), 10);
    const nb = parseInt(b.replace(/\D/g, ""), 10);
    return a.replace(/\d/g, "").localeCompare(b.replace(/\d/g, "")) || na - nb;
  });
  const monthly = memberMonthly(pro.membership);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line bg-canvas px-4 py-3 sm:px-8 sm:py-3.5">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted">Professional workspace</p>
          <p className="font-serif text-lg font-medium text-ink">Coverage map</p>
        </div>
        <span className="rounded-full bg-sage-50 px-3 py-1.5 text-sm font-semibold text-sage-700">
          {sorted.length} district{sorted.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="max-w-[80rem] p-4 sm:p-8">
        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-cream/40 px-6 py-12 text-center">
            <p className="text-sm font-medium text-ink">No coverage set yet</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted">
              PlotWorthy will set the postcode districts you cover. They&apos;ll appear here on a map once added.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-serif text-xl font-medium text-ink">Where you&apos;re live</h2>
                <span className="text-xs font-semibold text-sage-700">{sorted.length} highlighted</span>
              </div>
              <CoverageMapMulti districts={sorted} />
              <p className="mt-2 text-xs text-muted">
                Shaded districts (MapLibre · OpenFreeMap) are where PlotWorthy introduces you to clients.
                Private to you — clients only see that you&apos;re available in their area.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="card p-5">
                <h3 className="font-serif text-lg text-ink">Your districts</h3>
                <p className="mt-0.5 text-xs text-muted">Everywhere you&apos;re currently listed.</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sorted.map((d) => (
                    <span key={d} className="rounded-md border border-line bg-white px-2 py-0.5 text-xs font-medium text-ink">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-serif text-lg text-ink">Your plan</h3>
                <dl className="mt-2 space-y-1.5 text-sm">
                  <div className="flex justify-between"><dt className="text-muted">Membership</dt><dd className="text-ink">{gbp(monthly)}/mo</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">Enhanced profile</dt><dd className="text-ink">{pro.membership.enhanced ? "On" : "Off"}</dd></div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Districts covered</dt>
                    <dd className="text-ink">{owner ? `${sorted.length} · included` : `${sorted.length} of ${allowance}`}</dd>
                  </div>
                </dl>
                {owner ? (
                  <p className="mt-3 text-xs text-muted">Owner account — coverage is included in full.</p>
                ) : sorted.length > allowance ? (
                  <p className="mt-3 text-xs text-clay-700">
                    {sorted.length - allowance} district{sorted.length - allowance === 1 ? "" : "s"} beyond your plan.
                    Add {Math.ceil((sorted.length - allowance) / 5)} postcode pack{Math.ceil((sorted.length - allowance) / 5) === 1 ? "" : "s"} ({gbp(12)}/5) to keep them live —{" "}
                    <a href="mailto:hello@plotworthy.co.uk?subject=Add%20postcode%20packs" className="font-medium text-sage-700 hover:underline">get in touch</a>.
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-muted">
                    Your plan covers {allowance} districts. To widen your reach,{" "}
                    <a href="mailto:hello@plotworthy.co.uk?subject=Add%20postcode%20packs" className="font-medium text-sage-700 hover:underline">add packs</a>.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
