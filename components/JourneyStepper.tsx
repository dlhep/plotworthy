"use client";

import { useState } from "react";
import type { Journey, Stage } from "@/lib/journeys";
import { IntroFlow } from "./IntroFlow";

type Status = "done" | "current" | "upcoming";

function statusOf(index: number, current: number): Status {
  if (index < current) return "done";
  if (index === current) return "current";
  return "upcoming";
}

export function JourneyStepper({
  journey,
  currentStage,
}: {
  journey: Journey;
  currentStage?: number;
}) {
  const current =
    typeof currentStage === "number" &&
    currentStage >= 0 &&
    currentStage < journey.stages.length
      ? currentStage
      : journey.defaultStage;
  const [openIndex, setOpenIndex] = useState<number>(current);

  return (
    <div className="space-y-3">
      {journey.stages.map((stage, i) => {
        const status = statusOf(i, current);
        const isOpen = openIndex === i;
        return (
          <StageRow
            key={stage.n}
            stage={stage}
            status={status}
            isOpen={isOpen}
            isLast={i === journey.stages.length - 1}
            projectName={journey.shortName}
            onToggle={() => setOpenIndex(isOpen ? -1 : i)}
          />
        );
      })}
    </div>
  );
}

function StageRow({
  stage,
  status,
  isOpen,
  isLast,
  projectName,
  onToggle,
}: {
  stage: Stage;
  status: Status;
  isOpen: boolean;
  isLast: boolean;
  projectName: string;
  onToggle: () => void;
}) {
  return (
    <div
      className={`card overflow-hidden transition-shadow ${
        status === "current" ? "border-sage-300 shadow-lift" : ""
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="relative flex flex-col items-center">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              status === "done"
                ? "bg-sage-600 text-white"
                : status === "current"
                ? "bg-clay-400 text-white ring-4 ring-clay-100"
                : "bg-cream text-muted"
            }`}
          >
            {status === "done" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              stage.n
            )}
          </span>
          {!isLast && <span className="mt-1 h-4 w-px bg-line" aria-hidden="true" />}
        </span>

        <span className="flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-serif text-lg text-ink">{stage.title}</span>
            {status === "current" && (
              <span className="rounded-full bg-clay-100 px-2.5 py-0.5 text-xs font-semibold text-clay-700">
                You are here
              </span>
            )}
            {status === "done" && (
              <span className="rounded-full bg-sage-50 px-2.5 py-0.5 text-xs font-medium text-sage-700">
                Complete
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-sm text-muted">
            {status === "upcoming" ? stage.collapsedNote : stage.clientSees}
          </span>
        </span>

        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && <StageDetail stage={stage} status={status} projectName={projectName} />}
    </div>
  );
}

function StageDetail({
  stage,
  status,
  projectName,
}: {
  stage: Stage;
  status: Status;
  projectName: string;
}) {
  return (
    <div className="border-t border-line bg-canvas/60 px-5 py-6 sm:px-6">
      {status === "upcoming" && (
        <p className="mb-5 rounded-xl bg-cream px-4 py-3 text-sm text-muted">
          This stage opens in full once you reach it. Here’s a preview so you can
          see what’s coming.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Block title="Three immediate actions" accent>
          <ol className="space-y-2.5">
            {stage.actions.map((a, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink/85">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-semibold text-sage-700">
                  {i + 1}
                </span>
                {a}
              </li>
            ))}
          </ol>
        </Block>

        <Block title="Important decision to make">
          <p className="text-sm leading-relaxed text-ink/85">{stage.decision}</p>
        </Block>

        <Block title="Documents or information needed">
          <ul className="space-y-2">
            {stage.documents.map((d, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-clay-400" />
                {d}
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Professionals you may need now">
          <div className="flex flex-wrap gap-2">
            {stage.professionals.map((p, i) => (
              <span
                key={i}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink/80"
              >
                {p}
              </span>
            ))}
          </div>
          <IntroFlow
            projectName={projectName}
            stageTitle={stage.title}
            stageNumber={stage.n}
            roles={stage.professionals}
          />
        </Block>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-white px-4 py-3.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          What happens afterwards
        </p>
        <p className="mt-1 text-sm text-ink/85">{stage.afterwards}</p>
      </div>
    </div>
  );
}

function Block({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-4 ${
        accent ? "border-sage-200 bg-sage-50/50" : "border-line bg-white"
      }`}
    >
      <h4 className="mb-3 text-sm font-semibold text-ink">{title}</h4>
      {children}
    </div>
  );
}

