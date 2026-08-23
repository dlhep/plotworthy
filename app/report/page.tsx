import { FeasibilityReport } from "@/components/FeasibilityReport";

export const metadata = {
  title: "Feasibility report — PlotWorthy",
  description:
    "A free, independent feasibility summary for your property project — Article 4, conservation, flood and listed-building checks plus the local planning approval signal.",
};

export default function ReportPage({ searchParams }: { searchParams: { pc?: string; slug?: string } }) {
  return (
    <div className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="eyebrow justify-center">Free tool</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl">Project feasibility report</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            An independent read on whether your project stacks up — built from official planning data.
            Pick your project type and postcode to see what&apos;s in your favour and what to watch.
          </p>
        </div>

        <div className="mt-10">
          <FeasibilityReport initialPc={searchParams.pc ?? ""} initialSlug={searchParams.slug ?? ""} />
        </div>
      </div>
    </div>
  );
}
