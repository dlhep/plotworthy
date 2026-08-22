import Link from "next/link";
import { JOURNEYS, STAGE_TITLES } from "@/lib/journeys";

export const metadata = {
  title: "Project journeys — PlotWorthy",
};

export default function JourneysPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Project journeys</p>
        <h1 className="mt-3 font-serif text-4xl text-ink">
          Choose the journey that fits your plan
        </h1>
        <p className="mt-4 text-muted">
          Each project type follows the same seven stages — your goal, the
          property, viability, permission, buildability, delivery, and completion.
          Pick one to see the whole path.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
        {JOURNEYS.map((j) => (
          <Link
            key={j.slug}
            href={`/journeys/${j.slug}`}
            className="card group flex flex-col p-6 transition-all hover:border-sage-300 hover:shadow-lift"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">{j.emoji}</span>
              {j.isReference && (
                <span className="rounded-full bg-sage-50 px-2.5 py-0.5 text-xs font-semibold text-sage-700">
                  Reference model
                </span>
              )}
            </div>
            <h2 className="mt-4 font-serif text-xl text-ink">{j.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{j.tagline}</p>
            <span className="mt-4 text-sm font-medium text-sage-700 group-hover:underline">
              See the journey →
            </span>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-line bg-cream/50 px-6 py-6">
        <h3 className="font-serif text-lg text-ink">The seven universal stages</h3>
        <ol className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {STAGE_TITLES.map((t, i) => (
            <li key={t} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold text-sage-700">
                {i + 1}
              </span>
              {t}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
