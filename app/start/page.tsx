import Link from "next/link";
import { StartFlow } from "@/components/StartFlow";

export const metadata = {
  title: "Start your journey — PlotWorthy",
};

export default function StartPage({
  searchParams,
}: {
  searchParams: { goal?: string };
}) {
  return (
    <section className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <StartFlow initialGoalId={searchParams.goal} />

        {/* Optional paid extras — the journey above is free */}
        <div className="mt-14 border-t border-line pt-8">
          <p className="eyebrow">Optional extras</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sage-200 bg-sage-50/40 px-6 py-5">
            <div>
              <h2 className="display text-lg">Want more from your project?</h2>
              <p className="mt-1 max-w-xl text-sm text-muted">
                Everything above is free. When you’re ready, add an expert review of your brief, or
                PlotWorthy Plus for running several projects with a document &amp; quote vault.
              </p>
            </div>
            <Link href="/upgrade" className="btn-outline whitespace-nowrap text-sm">
              See enhanced features →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
