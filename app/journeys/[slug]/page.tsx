import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNEYS, getJourney, getHubInfo, STAGE_TITLES } from "@/lib/journeys";
import { JourneyStepper } from "@/components/JourneyStepper";
import { ProjectIcon, StageIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { ProsNearYou } from "@/components/ProsNearYou";
import { PropertyIntel } from "@/components/PropertyIntel";

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
  searchParams: { at?: string; pc?: string; address?: string };
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
  const hubInfo = getHubInfo(journey.slug);

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

      {/* Property intelligence */}
      <Reveal className="mt-8">
        <PropertyIntel
          slug={journey.slug}
          shortName={journey.shortName}
          initialPc={searchParams.pc ?? ""}
          initialAddress={searchParams.address ?? ""}
        />
      </Reveal>

      {/* About this project type */}
      {hubInfo && (
        <Reveal className="mt-8 grid gap-4 md:grid-cols-3">
          <HubFact label="End-to-end timescale" value={hubInfo.timescale} />
          <HubFact label="Consents & regulations" value={hubInfo.consents} />
          <HubFact label="Key thing to watch" value={hubInfo.watch} />
        </Reveal>
      )}

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

      {/* Information you'll need */}
      <Reveal className="mt-16">
        <h2 className="display text-2xl">Information you’ll need</h2>
        <p className="mt-2 text-sm text-muted">
          Everything this project type typically requires, stage by stage. You upload and sign each
          item off in its stage as you reach it.
        </p>
        <div className="mt-4 rounded-2xl border border-line bg-white px-6 py-2">
          {journey.stages.map((s) => (
            <div key={s.n} className="border-b border-dashed border-line py-3.5 last:border-0">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="font-serif text-sage-600/60">0{s.n}</span> {s.title}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {s.documents.map((d, i) => (
                  <span key={i} className="rounded-full border border-line bg-cream/50 px-3 py-1 text-xs text-ink/80">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Find vetted professionals near you */}
      <Reveal className="mt-16">
        <ProsNearYou journey={journey} initialPostcode={searchParams.pc ?? ""} />
      </Reveal>

      {/* Best-practice resources */}
      {hubInfo && (
        <Reveal className="mt-16">
          <h2 className="display text-2xl">Best-practice resources</h2>
          <p className="mt-2 text-sm text-muted">
            Trusted official guidance for this project type. Opens the source in a new tab.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {hubInfo.resources.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-center gap-3 p-4 transition-colors hover:border-sage-300"
              >
                <span className="tile h-9 w-9">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.5 1.5" strokeLinecap="round" />
                    <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1.5-1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink">{r.label}</span>
                  <span className="text-xs text-muted">{r.host}</span>
                </span>
                <span className="text-muted">↗</span>
              </a>
            ))}
          </div>
        </Reveal>
      )}

      {/* Cross-links */}
      <Reveal className="mt-16 rounded-2xl border border-line bg-cream/50 px-6 py-6">
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

function HubFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-white px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-clay-600">{label}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink">{value}</p>
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
