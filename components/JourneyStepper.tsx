"use client";

import { useState } from "react";
import type { Journey, Stage } from "@/lib/journeys";
import { getStageExtra } from "@/lib/journeys";
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
            slug={journey.slug}
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
  slug,
  onToggle,
}: {
  stage: Stage;
  status: Status;
  isOpen: boolean;
  isLast: boolean;
  projectName: string;
  slug: string;
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

      {isOpen && (
        <StageDetail stage={stage} status={status} projectName={projectName} slug={slug} />
      )}
    </div>
  );
}

function StageDetail({
  stage,
  status,
  projectName,
  slug,
}: {
  stage: Stage;
  status: Status;
  projectName: string;
  slug: string;
}) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [docState, setDocState] = useState<
    Record<number, { status: "sub" | "ok"; name: string }>
  >({});
  const extra = getStageExtra(slug, stage.n);
  const doneCount = stage.actions.filter((_, i) => checked[i]).length;
  const signedCount = stage.documents.filter((_, i) => docState[i]?.status === "ok").length;
  const toggle = (i: number) => setChecked((c) => ({ ...c, [i]: !c[i] }));
  const onUpload = (i: number, name: string) =>
    setDocState((s) => ({ ...s, [i]: { status: "sub", name } }));
  const onSignoff = (i: number) =>
    setDocState((s) => ({ ...s, [i]: { status: "ok", name: s[i]?.name ?? "" } }));
  // Future stages stay calm: a short glimpse only, not the full working detail.
  if (status === "upcoming") {
    return (
      <div className="border-t border-line bg-canvas/60 px-5 py-6 sm:px-6">
        <p className="text-sm leading-relaxed text-muted">
          <span className="font-medium text-ink">Later in your journey. </span>
          {stage.collapsedNote} This stage opens in full — with your actions,
          decisions and documents — once you reach it.
        </p>
        <div className="mt-4 rounded-xl border border-line bg-white px-4 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Professionals likely involved
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {stage.professionals.map((p, i) => (
              <span
                key={i}
                className="rounded-full border border-line bg-cream/60 px-3 py-1.5 text-xs font-medium text-muted"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-line bg-canvas/60 px-5 py-6 sm:px-6">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-clay-600">
        <span className="h-1.5 w-1.5 rounded-full bg-clay-400" />
        {status === "current" ? "Your current stage — everything you need now" : "Completed — here’s what this stage covered"}
      </p>

      {/* Overview + facts */}
      {extra && (
        <>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink/85">{extra.overview}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs text-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8.5" /><path d="M12 8v4l2.5 1.5" strokeLinecap="round" /></svg>
              <span className="font-medium text-ink">Typical timescale:</span> {extra.timescale}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs text-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.2" /><path d="M5.5 19a6.5 6.5 0 0 1 13 0" strokeLinecap="round" /></svg>
              <span className="font-medium text-ink">Who leads:</span> {extra.leads}
            </span>
          </div>
        </>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Interactive action checklist */}
        <Block title="Your action checklist" accent>
          <div className="mb-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sage-100">
              <div
                className="h-full rounded-full bg-sage-500 transition-all"
                style={{ width: `${(doneCount / stage.actions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-sage-700">
              {doneCount}/{stage.actions.length} done
            </span>
          </div>
          <ul className="space-y-1">
            {stage.actions.map((a, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-start gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-white/70"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      checked[i] ? "border-sage-600 bg-sage-600 text-white" : "border-sage-300 bg-white"
                    }`}
                  >
                    {checked[i] && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </span>
                  <span className={checked[i] ? "text-muted line-through" : "text-ink/85"}>{a}</span>
                </button>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Important decision to make">
          <p className="text-sm leading-relaxed text-ink/85">{stage.decision}</p>
        </Block>

        {/* Key considerations */}
        {extra && (
          <Block title="Key considerations at this stage">
            <ul className="space-y-2.5">
              {extra.considerations.map((c, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink/85">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-0.5 shrink-0 text-clay-500"><path d="M12 3l9 16H3z" strokeLinejoin="round" /><path d="M12 10v3.5M12 16.2v.2" strokeLinecap="round" /></svg>
                  {c}
                </li>
              ))}
            </ul>
          </Block>
        )}

        <Block title="Required information — upload & sign-off">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-clay-100">
              <div
                className="h-full rounded-full bg-sage-500 transition-all"
                style={{ width: `${(signedCount / stage.documents.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-sage-700">
              {signedCount}/{stage.documents.length} signed off
            </span>
          </div>
          <ul>
            {stage.documents.map((d, i) => {
              const st = docState[i]?.status;
              return (
                <li
                  key={i}
                  className="flex items-center gap-2.5 border-b border-dashed border-line py-2 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-sm text-ink/85">{d}</span>
                    {docState[i]?.name && (
                      <span className="block truncate text-xs text-muted">📄 {docState[i].name}</span>
                    )}
                  </div>
                  <span
                    className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[0.68rem] font-semibold ${
                      st === "ok"
                        ? "bg-sage-50 text-sage-700"
                        : st === "sub"
                        ? "bg-clay-50 text-clay-700"
                        : "bg-cream text-muted"
                    }`}
                  >
                    {st === "ok" ? "Signed off ✓" : st === "sub" ? "Submitted" : "Required"}
                  </span>
                  {!st && (
                    <label className="cursor-pointer whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold text-sage-700 hover:bg-sage-50">
                      Upload
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => onUpload(i, e.target.files?.[0]?.name ?? "document.pdf")}
                      />
                    </label>
                  )}
                  {st === "sub" && (
                    <button
                      type="button"
                      onClick={() => onSignoff(i)}
                      className="whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold text-sage-700 hover:bg-sage-50"
                    >
                      Sign off
                    </button>
                  )}
                </li>
              );
            })}
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

