import Link from "next/link";

export default function OpportunitiesPage() {
  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-3.5">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted">Professional workspace</p>
          <p className="font-serif text-lg font-medium text-ink">Opportunities</p>
        </div>
      </div>
      <div className="max-w-[70rem] p-4 sm:p-8">
        <p className="text-sm text-muted">
          Every project in your coverage you can quote on right now lives here. Your latest opportunities are shown on the{" "}
          <Link href="/professional" className="font-medium text-sage-700 hover:underline">Dashboard</Link>.
        </p>
        <div className="mt-4 rounded-xl border border-sage-200 bg-sage-50 p-4 text-sm text-sage-800">
          <strong>7-day escalation:</strong> matched professionals get first access for 7 days; after that a project opens wider so
          nearby professionals can quote. Widen your reach on the{" "}
          <Link href="/professional/coverage" className="font-medium text-sage-700 hover:underline">Coverage map</Link>.
        </div>
      </div>
    </div>
  );
}
