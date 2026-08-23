import Link from "next/link";
import { GOALS } from "@/lib/start";
import { STAGE_TITLES } from "@/lib/journeys";
import { IntroFlow } from "@/components/IntroFlow";
import { ProjectIcon, StageIcon, HeroMotif } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";

const STAGE_BLURBS = [
  "What are you trying to achieve?",
  "Own it, considering it, or finding it?",
  "Planning route, constraints and likely costs.",
  "Designs, applications and approvals.",
  "Regulations, structure and fire safety.",
  "Tender, build and complete.",
  "Sign off, let, lease or register.",
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-32 -top-40 h-[26rem] w-[26rem] rounded-full bg-sage-100/50 blur-3xl" />
          <div className="absolute -left-32 top-56 h-80 w-80 rounded-full bg-clay-100/40 blur-3xl" />
        </div>

        <div className="container-content pt-10 pb-8 sm:pt-14">
          <Reveal stagger className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center">
              <span className="h-px w-6 bg-clay-400/60" />
              Your property project adviser
              <span className="h-px w-6 bg-clay-400/60" />
            </p>
            <h1 className="display mt-6 text-5xl leading-[1.05] sm:text-6xl">
              Start your
              <br className="hidden sm:block" /> property journey
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
              PlotWorthy shows you what happens next — and introduces the right
              vetted professional exactly when you need them. One clear step at a
              time.
            </p>
            <div className="mt-9 flex items-center justify-center" aria-hidden="true">
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} className="flex items-center">
                  <span
                    className={
                      i === 0
                        ? "h-2.5 w-2.5 rounded-full bg-sage-600"
                        : "h-2 w-2 rounded-full border border-sage-300 bg-canvas"
                    }
                  />
                  {i < 6 && <span className="h-px w-7 bg-gradient-to-r from-sage-300/70 to-sage-200/40" />}
                </span>
              ))}
            </div>
          </Reveal>

          {/* The one question */}
          <div className="mx-auto mt-8 max-w-3xl">
            <h2 className="text-center font-serif text-2xl text-ink">
              What are you hoping to do with a property?
            </h2>
            <Reveal stagger className="mt-8 grid gap-3 sm:grid-cols-2">
              {GOALS.map((g) => (
                <Link
                  key={g.id}
                  href={`/start?goal=${g.id}`}
                  className="card group flex items-start gap-4 px-5 py-5 text-left transition-all hover:-translate-y-0.5 hover:border-sage-300 hover:shadow-lift"
                >
                  <span className="tile h-11 w-11 shrink-0 transition-colors group-hover:bg-sage-100">
                    <ProjectIcon type={g.id} className="h-6 w-6" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium leading-snug text-ink">{g.label}</span>
                    <span className="mt-1 block text-sm text-muted">{g.note}</span>
                  </span>
                  <span className="mt-1 shrink-0 text-sage-500 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100">
                    →
                  </span>
                </Link>
              ))}
            </Reveal>
            <p className="mt-6 text-center text-sm text-muted">
              Prefer to browse first?{" "}
              <Link href="/journeys" className="font-medium text-sage-700 underline-offset-4 hover:underline">
                See the project journeys
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* The journey overview */}
      <section className="container-content mt-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="kicker justify-center">
            <span className="kicker-num">01</span> One clear path
          </p>
          <h2 className="display mt-4 text-4xl">
            Every project follows the same seven stages
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            You can always see the whole journey, so you understand the picture.
            Only your current stage opens in detail — future stages stay calm and
            collapsed until you reach them.
          </p>
        </Reveal>

        <Reveal
          stagger
          as="ol"
          className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STAGE_TITLES.map((title, i) => (
            <li key={title} className="card group px-5 py-6 transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-center justify-between">
                <span className="tile h-10 w-10 text-sage-600">
                  <StageIcon n={i + 1} className="h-[22px] w-[22px]" />
                </span>
                <span className="font-serif text-sm text-sage-600/60">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-lg leading-snug text-ink">{title}</h3>
              <p className="mt-1.5 text-sm text-muted">{STAGE_BLURBS[i]}</p>
            </li>
          ))}
          <li className="flex items-center justify-center rounded-2xl border border-dashed border-sage-300 bg-sage-50/40 px-5 py-6 text-center transition-colors hover:bg-sage-50">
            <Link href="/journeys/hmo" className="text-sm font-medium text-sage-700 hover:underline">
              See a full journey →
            </Link>
          </li>
        </Reveal>
      </section>

      {/* How professionals appear */}
      <section className="container-content mt-28">
        <Reveal stagger className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="kicker">
              <span className="kicker-num">02</span> Support, when it’s useful
            </p>
            <h2 className="display mt-4 text-4xl">
              The right professional, introduced at the right moment
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              PlotWorthy isn’t a directory to wade through. As you reach each
              stage, we simply say “at this point, you may need an architect” —
              then introduce a small number of suitable, vetted professionals.
            </p>
            <ul className="mt-7 space-y-3.5">
              {[
                "Ask PlotWorthy to recommend someone",
                "View a few suitable vetted professionals",
                "Request proposals",
                "Ask PlotWorthy to coordinate the appointment",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-ink/85">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-7">
            <div className="flex items-center gap-3">
              <span className="tile h-11 w-11">
                <StageIcon n={3} className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">At this stage, you may need…</p>
                <p className="font-serif text-2xl text-ink">An architect</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
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
        </Reveal>
      </section>

      {/* CTA */}
      <section className="container-content mt-28">
        <Reveal className="relative overflow-hidden rounded-3xl bg-sage-700 px-8 py-16 text-center text-white">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] text-white">
            <HeroMotif className="absolute -right-6 top-6 h-40 w-80" />
          </div>
          <p className="kicker justify-center text-clay-200">
            <span className="kicker-num text-clay-200/80">03</span> Ready when you are
          </p>
          <h2 className="display mt-4 text-4xl text-white">Ready to see what happens next?</h2>
          <p className="mx-auto mt-4 max-w-md text-sage-50/90">
            Answer two quick questions and PlotWorthy will place you at exactly the
            right point in your journey.
          </p>
          <Link href="/start" className="btn mt-8 bg-white text-sage-800 hover:bg-sage-50">
            Start your journey
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
