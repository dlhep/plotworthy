import Link from "next/link";
import { getProfessionalForUser } from "@/lib/professionalAuth";

export const dynamic = "force-dynamic";

export default async function CoveragePage() {
  const { pro } = await getProfessionalForUser();
  if (!pro) return null;

  const packs = pro.membership.postcodePacks || 0;
  const included = 5;
  const districts = included + packs * 5;

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line bg-canvas px-4 py-3 sm:px-8 sm:py-3.5">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted">Professional workspace</p>
          <p className="font-serif text-lg font-medium text-ink">Coverage</p>
        </div>
      </div>

      <div className="max-w-[70rem] p-4 sm:p-8">
        <div className="card border-sage-200 bg-sage-50/40 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-clay-600">Your coverage area</p>
              <h2 className="mt-1 font-serif text-2xl font-medium text-ink">
                {pro.coverage || "Not set yet"}
              </h2>
            </div>
            <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-sage-700">
              {districts} districts
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/85">
            {pro.coverage
              ? <>You&apos;re listed across {pro.coverage} and the surrounding area. When a client requests an introduction in one of your districts, we confirm you cover their postcode — nothing more.</>
              : <>Let us know the area you work in and we&apos;ll introduce you to the right clients there.</>}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Included with membership" value={`${included} districts`} />
          <Stat label="Postcode packs" value={packs > 0 ? `${packs} × 5` : "None"} />
          <Stat label="Total reach" value={`${districts} districts`} />
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-cream/40 p-5">
          <p className="text-sm font-medium text-ink">Private to your account</p>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            The exact districts and any postcode packs you&apos;ve added are visible only to you. Clients never
            see which or how many areas you cover — only that PlotWorthy recommends you in theirs.
          </p>
        </div>

        <p className="mt-6 text-sm text-muted">
          Want to widen your reach or change the areas you cover?{" "}
          <a href="mailto:hello@plotworthy.co.uk?subject=Coverage%20change" className="font-medium text-sage-700 hover:underline">
            Get in touch
          </a>{" "}
          and we&apos;ll update your listing. See how leads flow on the{" "}
          <Link href="/professional" className="font-medium text-sage-700 hover:underline">Dashboard</Link>.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-5 py-4">
      <div className="font-serif text-2xl text-ink">{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}
