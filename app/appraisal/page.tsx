import Link from "next/link";
import { AppraisalCalc } from "@/components/AppraisalCalc";

export const metadata = {
  title: "Investment appraisal — PlotWorthy",
  description:
    "A quick, independent investment appraisal for a property project — Stamp Duty, total cost, profit, return on cost and rental yield.",
};

export default function AppraisalPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="eyebrow justify-center">Free tool · Investors &amp; developers</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl">Investment appraisal</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Sanity-check a deal before you commit — Stamp Duty, total money in, profit and return on
            cost for a develop-and-sell, or the yield for a buy-to-rent. Your numbers stay on your device.
          </p>
        </div>

        <div className="mt-10">
          <AppraisalCalc />
        </div>

        <div className="mt-10 rounded-2xl border border-sage-200 bg-sage-50/40 px-6 py-6 text-center">
          <h2 className="font-serif text-lg text-ink">Want an expert to pressure-test it?</h2>
          <p className="mx-auto mt-1.5 max-w-lg text-sm text-muted">
            A full expert-reviewed appraisal checks your assumptions — costs, values and risks — with a
            vetted professional before you buy. Part of PlotWorthy&apos;s project reports.
          </p>
          <Link href="/upgrade" className="btn-outline mt-4 text-sm">See project reports →</Link>
        </div>
      </div>
    </div>
  );
}
