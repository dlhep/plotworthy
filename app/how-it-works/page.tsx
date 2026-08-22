import Link from "next/link";
import { STAGE_TITLES, STAGE_SUPPORT } from "@/lib/journeys";

export const metadata = { title: "How PlotWorthy helps — PlotWorthy" };

export default function HowItWorksPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">How PlotWorthy helps</p>
        <h1 className="mt-3 font-serif text-4xl text-ink">
          A calmer way to run a property project
        </h1>
        <p className="mt-4 text-muted">
          PlotWorthy is your property project adviser. We start with your goal —
          not with products or prices — and guide you through one clear journey,
          introducing the right vetted professional only when you need them.
        </p>
      </div>

      {/* Three principles */}
      <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
        {[
          {
            t: "Start with your goal",
            d: "We ask what you're trying to achieve and where you are today, then place you at the right point — never forcing you to start from stage one.",
          },
          {
            t: "See the whole path",
            d: "The full seven-stage journey is always visible, so you understand the picture. Only your current stage opens in detail; the rest stay calm and collapsed.",
          },
          {
            t: "Support when it's useful",
            d: "At each stage we introduce a small number of suitable, vetted professionals — with your project, property and brief already defined.",
          },
        ].map((c) => (
          <div key={c.t} className="card p-6">
            <h2 className="font-serif text-xl text-ink">{c.t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{c.d}</p>
          </div>
        ))}
      </div>

      {/* Stage / support table */}
      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="font-serif text-2xl text-ink">The client journey</h2>
        <p className="mt-2 text-muted">
          Every project uses the same simple structure — what you see, and the
          professional support available at each stage.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-cream/70 text-ink">
                <th className="px-4 py-3 font-semibold">Stage</th>
                <th className="px-4 py-3 font-semibold">What you see</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Professional support</th>
              </tr>
            </thead>
            <tbody>
              {STAGE_TITLES.map((title, i) => (
                <tr key={title} className="border-t border-line align-top">
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage-100 text-xs font-semibold text-sage-700">
                        {i + 1}
                      </span>
                      <span className="font-medium text-ink">{title}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-muted">
                    {i === 0 && "What are you trying to achieve?"}
                    {i === 1 && "Own it, considering it, or need help finding it?"}
                    {i === 2 && "Planning route, major constraints and likely costs."}
                    {i === 3 && "Designs, planning application, licensing and approvals."}
                    {i === 4 && "Building Regulations, structure, fire and technical design."}
                    {i === 5 && "Tendering, builders, contracts and construction."}
                    {i === 6 && "Completion, letting, leasing, licensing or registration."}
                  </td>
                  <td className="hidden px-4 py-4 text-muted sm:table-cell">{STAGE_SUPPORT[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-4xl rounded-2xl bg-sage-600 px-8 py-12 text-center text-white">
        <h2 className="font-serif text-2xl">See where you’d start</h2>
        <p className="mx-auto mt-2 max-w-md text-sage-50">
          Two quick questions, and PlotWorthy places you at the right point in
          your journey.
        </p>
        <Link href="/start" className="btn mt-6 bg-white text-sage-700 hover:bg-sage-50">
          Start your journey
        </Link>
      </div>
    </div>
  );
}
