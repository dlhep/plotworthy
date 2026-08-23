import { getProfessionalForUser } from "@/lib/professionalAuth";
import { CoverageEditor } from "@/components/CoverageEditor";
import { districtsFromCoverage, postcodeArea } from "@/lib/postcodes";

export const dynamic = "force-dynamic";

export default async function CoveragePage() {
  const { pro } = await getProfessionalForUser();
  if (!pro) return null;

  const saved = Array.isArray((pro as any).districts) ? ((pro as any).districts as string[]) : [];
  const seed = saved.length ? saved : districtsFromCoverage(pro.coverage);
  const area = postcodeArea(seed[0] || pro.coverage) || "TS";
  const packs = pro.membership.postcodePacks || 0;

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line bg-canvas px-4 py-3 sm:px-8 sm:py-3.5">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted">Professional workspace</p>
          <p className="font-serif text-lg font-medium text-ink">Coverage</p>
        </div>
      </div>

      <div className="max-w-[80rem] p-4 sm:p-8">
        <CoverageEditor
          area={area}
          seed={seed}
          includedBase={5}
          packs={packs}
          coverageLabel={pro.coverage || ""}
        />

        <div className="mt-6 rounded-2xl border border-line bg-cream/40 p-5">
          <p className="text-sm font-medium text-ink">Private to your account</p>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            The exact districts and any packs you add are visible only to you. Clients never see which or
            how many areas you cover — only that PlotWorthy recommends you in theirs.
          </p>
        </div>
      </div>
    </div>
  );
}
