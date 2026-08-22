import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNEYS, getJourney, STAGE_TITLES } from "@/lib/journeys";
import { JourneyStepper } from "@/components/JourneyStepper";
import { ProjectIcon, StageIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return JOURNEYS.map((j) => ({ slug: j.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const journey = getJourney(params.slug);
  return {
    title: journey ? `${journey.name} — PlotWorthy` : "Project journey — PlotWorthy",
  };
}

export default function JourneyHubPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { at?: string };
}) {
  const journey = getJourney(params.slug);
  if (!journey) notFound();

  const parsedAt = searchParams.at ? parseInt(searchParams.at, 10) : NaN;
  const current =
    !Number.isNaN(parsedAt) && parsedAt >= 0 && parsedAt < journey.stages.length
      ? parsedAt
      : journey.defaultStage;

  const stage = journey.stages[current];
  const progress = Math.round(((current + 1) / journey.stages.length) * 100);

  return (
    <div className="container-content py-12 sm:py-16">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href="/journeys" className="hover:text-ink">Project journeys</Link>
        <span>/</span>
        <span className="text-ink">{journey.shortName}</span>
      </div>

      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="tile h-14 w-14">
              <ProjectIcon type={journey.slug} className="h-8 w-8" />
            </span>
            {journey.isReference && (
              <span className="rounded-full bg-sage-50 px-2.5 py-0.5 text-xs font-semibold text-sage-700 ring-1 ring-sage-100">
                Reference model
              </span>
            )}
          </div>
          <h1 className="display mt-5 text-4xl sm:text-[2.75rem]">{journey.name}</h1>
          <p className="mt-3 leading-relaxed text-muted">{journey.intro}</p>
        </div>

        <div className="shrink-0">
          <Link href="/start" className="btn-outline text-sm">Not your project? Start again</Link>
        </div>
      </div>

      {/* Hub summary — the top-level view */}
      <Reveal className="mt-10 rounded-2xl border border-sage-200 bg-sage-50/40 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="tile h-12 w-12 shrink-0 bg-clay-50 text-clay-600 ring-clay-100">
              <StageIcon n={stage.n} className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-clay-600">
                You are here · Stage {stage.n} of {journey.stages.length}
              </p>
              <h2 className="mt-1 font-serif text-2xl text-ink">{stage.title}</h2>
              <p className="mt-1 text-muted">{stage.clientSees}</p>
            </div>
          </div>
          <div className="min-w-[160px]">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Overall progress</span>
              <span className="font-semibold text-sage-700">{progress}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-sage-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <SummaryCard title="Three immediate actions">
            <ol className="space-y-1.5 text-sm text-ink/85">
              {stage.actions.map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-semibold text-sage-600">{i + 1}.</span> {a}
                </li>
              ))}
            </ol>
          </SummaryCard>
          <SummaryCard title="Important decision">
            <p className="text-sm text-ink/85">{stage.decision}</p>
          </SummaryCard>
          <SummaryCard title="Professionals needed now">
            <div className="flex flex-wrap gap-1.5">
              {stage.professionals.map((p, i) => (
                <span key={i} className="rounded-full border border-line bg-white px-2.5 py-1 text-xs text-ink/80">
                  {p}
                </span>
              ))}
            </div>
          </SummaryCard>
        </div>

        <p className="mt-5 text-sm text-muted">
          <span className="font-medium text-ink">What happens afterwards: </span>
          {stage.afterwards}
        </p>
      </Reveal>

      {/* The full journey */}
      <Reveal className="mt-14">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-2xl text-ink">Your full journey</h2>
          <p className="text-sm text-muted">
            The whole path is visible. Your current stage is open; tap any stage to preview it.
          </p>
        </div>
        <JourneyStepper journey={journey} currentStage={current} />
      </Reveal>

      {/* Cross-links */}
      <Reveal className="mt-14 rounded-2xl border border-line bg-cream/50 px-6 py-6">
        <h3 className="font-serif text-lg text-ink">Same seven stages, every project</h3>
        <p className="mt-2 text-sm text-muted">
          {STAGE_TITLES.join(" · ")}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {JOURNEYS.filter((j) => j.slug !== journey.slug).map((j) => (
            <Link
              key={j.slug}
              href={`/journeys/${j.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink/80 transition-colors hover:border-sage-300 hover:text-ink"
            >
              <ProjectIcon type={j.slug} className="h-4 w-4 text-sage-600" />
              {j.shortName}
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white px-4 py-4">
      <h3 className="mb-2.5 text-sm font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}
