import Link from "next/link";
import { JOURNEYS, STAGE_TITLES } from "@/lib/journeys";
import { ProjectIcon, StageIcon } from "@/components/Icons";

export const metadata = {
  title: "Project journeys — PlotWorthy",
};

export default function JourneysPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="kicker justify-center">
          <span className="kicker-num">01</span> Project journeys
        </p>
        <h1 className="display mt-4 text-4xl sm:text-5xl">
          Choose the journey that fits your plan
        </h1>
        <p className="mt-4 text-muted">
          Each project type follows the same seven stages — your goal, the
          property, viability, permission, buildability, delivery, and completion.
          Pick one to see the whole path.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2">
        {JOURNEYS.map((j) => (
          <Link
            key={j.slug}
            href={`/journeys/${j.slug}`}
            className="card group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:border-sage-300 hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <span className="tile h-12 w-12">
                <ProjectIcon type={j.slug} className="h-7 w-7" />
              </span>
              {j.isReference && (
                <span className="rounded-full bg-sage-50 px-2.5 py-0.5 text-xs font-semibold text-sage-700 ring-1 ring-sage-100">
                  Reference model
                </span>
              )}
            </div>
            <h2 className="mt-5 font-serif text-xl text-ink">{j.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{j.tagline}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sage-700 transition-all group-hover:gap-2">
              See the journey <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-line bg-cream/50 px-6 py-7">
        <h3 className="font-serif text-lg text-ink">The seven universal stages</h3>
        <ol className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {STAGE_TITLES.map((t, i) => (
            <li key={t} className="flex items-center gap-2.5 text-sm text-ink/80">
              <span className="tile h-8 w-8 shrink-0 bg-white ring-sage-100">
                <StageIcon n={i + 1} className="h-[18px] w-[18px]" />
              </span>
              <span className="font-serif text-sage-600/60">0{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
