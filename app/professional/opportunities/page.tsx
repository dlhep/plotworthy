import Link from "next/link";
import { getProfessionalForUser } from "@/lib/professionalAuth";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const { pro } = await getProfessionalForUser();
  if (!pro) return null;

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line bg-canvas px-4 py-3 sm:px-8 sm:py-3.5">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted">Professional workspace</p>
          <p className="font-serif text-lg font-medium text-ink">Opportunities</p>
        </div>
      </div>

      <div className="max-w-[70rem] p-4 sm:p-8">
        <p className="text-sm text-muted">
          Every project in your area that you can quote on will appear here — each with a defined scope,
          a known property and a clear stage.
        </p>

        <div className="mt-4 rounded-2xl border border-dashed border-line bg-cream/40 px-6 py-12 text-center">
          <p className="text-sm font-medium text-ink">No live opportunities yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">
            As clients start projects in {pro.coverage || "your area"} and share their briefs, matching
            opportunities will land here. You&apos;ll be notified when the first one arrives.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-sage-200 bg-sage-50 p-4 text-sm text-sage-800">
          <strong>7-day first access:</strong> professionals matched to a project get first access for 7 days.
          After that it opens wider so nearby professionals can quote. Review the area you cover on the{" "}
          <Link href="/professional/coverage" className="font-medium text-sage-700 hover:underline">Coverage</Link> page.
        </div>
      </div>
    </div>
  );
}
