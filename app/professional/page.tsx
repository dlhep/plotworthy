import Link from "next/link";
import { ProjectIcon } from "@/components/Icons";
import { getJourney } from "@/lib/journeys";

const OPPS = [
  { slug: "hmo", title: "HMO conversion — 6-bed professional let", postcode: "B14", stage: "Make it buildable", posted: "2 days ago", status: "new" },
  { slug: "house-to-flats", title: "House to 3 flats conversion", postcode: "B13", stage: "Get permission", posted: "4 days ago", status: "new" },
  { slug: "extension", title: "Rear + loft extension, 1930s semi", postcode: "B31", stage: "Is it viable?", posted: "6 days ago", status: "wider", widerIn: 1 },
  { slug: "office-to-residential", title: "Office block to 9 apartments", postcode: "B15", stage: "Deliver the project", posted: "9 days ago", status: "wider", widerIn: 0 },
  { slug: "hmo", title: "5-bed student HMO refit", postcode: "B17", stage: "Complete and operate", posted: "11 days ago", status: "quoted" },
];

function Status({ o }: { o: (typeof OPPS)[number] }) {
  if (o.status === "new")
    return <span className="whitespace-nowrap rounded-full bg-sage-50 px-2.5 py-0.5 text-[0.68rem] font-semibold text-sage-700">New · first access</span>;
  if (o.status === "wider")
    return (
      <span className="whitespace-nowrap rounded-full bg-clay-50 px-2.5 py-0.5 text-[0.68rem] font-semibold text-clay-700">
        {o.widerIn && o.widerIn > 0 ? `Opens wider in ${o.widerIn} day${o.widerIn > 1 ? "s" : ""}` : "Now open further afield"}
      </span>
    );
  return <span className="whitespace-nowrap rounded-full bg-cream px-2.5 py-0.5 text-[0.68rem] font-semibold text-muted">Quote sent</span>;
}

export default function DashboardPage() {
  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-3.5">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted">Professional workspace</p>
          <p className="font-serif text-lg font-medium text-ink">Dashboard</p>
        </div>
        <Link href="/professional/coverage" className="btn-outline btn text-sm">Coverage: B13–B17</Link>
      </div>

      <div className="max-w-[80rem] p-4 sm:p-8">
        <p className="mb-5 text-sm text-muted">Welcome back, Sample Studio. Here’s what’s happening in your area.</p>
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[["4","Active opportunities"],["3","Quotes sent"],["2","Introductions this month"],["42%","Quote win rate"]].map(([v, l]) => (
            <div key={l} className="card px-5 py-4">
              <div className="font-serif text-2xl text-ink">{v}</div>
              <div className="mt-0.5 text-xs text-muted">{l}</div>
            </div>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="display text-xl">Latest opportunities in your area</h2>
          <span className="text-xs text-muted">B13–B17 · 5 districts</span>
        </div>
        <div className="mb-4 rounded-xl border border-sage-200 bg-sage-50 p-4 text-sm text-sage-800">
          <strong>How lead access works:</strong> matched professionals get first access for 7 days. If a project hasn’t appointed
          the pro it needs for the current stage, it opens wider so nearby professionals can quote.
        </div>

        <div className="flex flex-col gap-3.5">
          {OPPS.map((o, i) => {
            const j = getJourney(o.slug);
            return (
              <div key={i} className="card flex items-start gap-4 p-5">
                <span className="tile h-11 w-11 shrink-0">
                  <ProjectIcon type={o.slug} className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-ink">{o.title}</strong>
                    <Status o={o} />
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span>📍 {o.postcode}</span>
                    <span>{j?.shortName}</span>
                    <span>Stage: {o.stage}</span>
                    <span>Posted {o.posted}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="btn-primary btn text-sm">{o.status === "quoted" ? "View your quote" : "Send a quote"}</button>
                    <button className="btn-ghost btn text-sm">View brief</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
