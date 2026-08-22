import Link from "next/link";
import { GOALS } from "@/lib/start";
import { STAGE_TITLES } from "@/lib/journeys";
import { IntroFlow } from "@/components/IntroFlow";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sage-100/60 blur-3xl" />
          <div className="absolute -left-24 top-40 h-80 w-80 rounded-full bg-clay-100/50 blur-3xl" />
        </div>

        <div className="container-content pt-16 pb-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Your property project adviser</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
              Start your property journey
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
              PlotWorthy shows you what happens next — and introduces the right
              vetted professional exactly when you need them. One clear step at a
              time.
            </p>
          </div>

          {/* The one question */}
          <div className="mx-auto mt-12 max-w-3xl">
            <h2 className="text-center font-serif text-2xl text-ink">
              What are you hoping to do with a property?
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {GOALS.map((g) => (
                <Link
                  key={g.id}
                  href={`/start?goal=${g.id}`}
                  className="card group flex items-start gap-4 px-5 py-4 text-left transition-all hover:border-sage-300 hover:shadow-lift"
                >
                  <span className="text-2xl" aria-hidden="true">{g.emoji}</span>
                  <span>
                    <span className="block font-medium text-ink">{g.label}</span>
                    <span className="mt-1 block text-sm text-muted">{g.note}</span>
                  </span>
                  <span className="ml-auto self-center text-sage-500 opacity-0 transition-opacity group-hover:opacity-100">→</span>
                </Link>
              ))}
            </div>
            <p className="mt-5 text-center text-sm text-muted">
              Prefer to browse first?{" "}
              <Link href="/journeys" className="font-medium text-sage-700 underline-offset-2 hover:underline">
                See the project journeys
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* The journey overview */}
      <section className="container-content mt-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">One clear path</p>
          <h2 className="mt-3 font-serif text-3xl text-ink">
            Every project follows the same seven stages
          </h2>
          <p className="mt-4 text-muted">
            You can always see the whole journey, so you understand the picture.
            Only your current stage opens in detail — future stages stay calm and
            collapsed until you reach them.
          </p>
        </div>

        <ol className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAGE_TITLES.map((title, i) => (
            <li key={title} className="card px-5 py-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 text-sm font-semibold text-sage-700">
                {i + 1}
              </span>
              <h3 className="mt-3 font-serif text-lg text-ink">{title}</h3>
            </li>
          ))}
          <li className="flex items-center justify-center rounded-2xl border border-dashed border-sage-300 bg-sage-50/40 px-5 py-5 text-center">
            <Link href="/journeys/hmo" className="text-sm font-medium text-sage-700 hover:underline">
              See a full journey →
            </Link>
          </li>
        </ol>
      </section>

      {/* How professionals appear */}
      <section className="container-content mt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Support, when it’s useful</p>
            <h2 className="mt-3 font-serif text-3xl text-ink">
              The right professional, introduced at the right moment
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              PlotWorthy isn’t a directory to wade through. As you reach each
              stage, we simply say “at this point, you may need an architect” —
              then introduce a small number of suitable, vetted professionals.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Ask PlotWorthy to recommend someone",
                "View a few suitable vetted professionals",
                "Request proposals",
                "Ask PlotWorthy to coordinate the appointment",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-ink/85">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <p className="text-sm text-muted">At this stage, you may need…</p>
            <p className="mt-1 font-serif text-2xl text-ink">An architect</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              They’ll receive a client with a defined project, a known property, a
              clear current stage, a structured brief and the relevant documents —
              so you get better proposals, faster.
            </p>
            <div className="mt-5">
              <IntroFlow
                compact
                projectName="your"
                stageTitle="Is it viable?"
                stageNumber={3}
                roles={["Architect"]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-content mt-24">
        <div className="rounded-2xl bg-sage-600 px-8 py-14 text-center text-white">
          <h2 className="font-serif text-3xl">Ready to see what happens next?</h2>
          <p className="mx-auto mt-3 max-w-md text-sage-50">
            Answer two quick questions and PlotWorthy will place you at exactly the
            right point in your journey.
          </p>
          <Link
            href="/start"
            className="btn mt-7 bg-white text-sage-700 hover:bg-sage-50"
          >
            Start your journey
          </Link>
        </div>
      </section>
    </div>
  );
}
