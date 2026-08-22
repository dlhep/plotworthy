"use client";

import { useEffect, useMemo, useState } from "react";
import {
  disciplineFromRole,
  professionalsFor,
  DISCIPLINE_LABEL,
  type Professional,
} from "@/lib/professionals";

type Props = {
  projectName: string;
  stageTitle: string;
  stageNumber: number;
  roles: string[];
  compact?: boolean;
};

export function IntroFlow({ projectName, stageTitle, stageNumber, roles, compact }: Props) {
  const [open, setOpen] = useState(false);

  const disciplines = useMemo(() => {
    const set = new Set(roles.map(disciplineFromRole));
    return Array.from(set);
  }, [roles]);

  return (
    <>
      <div className={compact ? "flex flex-wrap gap-2" : "mt-4 border-t border-line pt-3"}>
        {!compact && <p className="text-xs text-muted">Introduce me to someone:</p>}
        <div className={compact ? "flex flex-wrap gap-2" : "mt-2 flex flex-wrap gap-2"}>
          <button onClick={() => setOpen(true)} className="btn-outline px-3 py-1.5 text-xs">
            Recommend someone
          </button>
          <button onClick={() => setOpen(true)} className="btn-ghost px-3 py-1.5 text-xs">
            View vetted professionals
          </button>
          <button onClick={() => setOpen(true)} className="btn-ghost px-3 py-1.5 text-xs">
            Request proposals
          </button>
        </div>
      </div>

      {open && (
        <IntroModal
          onClose={() => setOpen(false)}
          projectName={projectName}
          stageTitle={stageTitle}
          stageNumber={stageNumber}
          disciplines={disciplines}
        />
      )}
    </>
  );
}

function IntroModal({
  onClose,
  projectName,
  stageTitle,
  stageNumber,
  disciplines,
}: {
  onClose: () => void;
  projectName: string;
  stageTitle: string;
  stageNumber: number;
  disciplines: ReturnType<typeof disciplineFromRole>[];
}) {
  const [activeDiscipline, setActiveDiscipline] = useState(disciplines[0]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);

  const pros = professionalsFor(activeDiscipline);
  const selectedList = pros.filter((p) => selected[p.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function toggle(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Request a professional introduction"
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-canvas shadow-lift sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-line bg-canvas px-6 py-4">
          <div>
            <p className="eyebrow">Introduction · Stage {stageNumber} · {stageTitle}</p>
            <h2 className="mt-1 font-serif text-xl text-ink">
              {sent ? "Introduction requested" : "Meet a vetted professional"}
            </h2>
          </div>
          <button onClick={onClose} className="btn-ghost -mr-2 px-2 py-2" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {sent ? (
          <Confirmation
            projectName={projectName}
            stageTitle={stageTitle}
            stageNumber={stageNumber}
            selectedList={selectedList}
            discipline={activeDiscipline}
            onClose={onClose}
          />
        ) : (
          <div className="px-6 py-5">
            {/* Context recap */}
            <div className="rounded-xl border border-sage-200 bg-sage-50/50 px-4 py-3">
              <p className="text-sm text-ink/85">
                They’ll receive your <span className="font-medium">{projectName}</span>{" "}
                project at the <span className="font-medium">{stageTitle.toLowerCase()}</span>{" "}
                stage, with your property, current stage and brief already defined —
                so you get better proposals, faster.
              </p>
            </div>

            {/* Discipline tabs (if more than one at this stage) */}
            {disciplines.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {disciplines.map((d) => (
                  <button
                    key={d}
                    onClick={() => setActiveDiscipline(d)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      d === activeDiscipline
                        ? "bg-sage-600 text-white"
                        : "border border-line bg-white text-ink/70 hover:border-sage-300"
                    }`}
                  >
                    {DISCIPLINE_LABEL[d]}
                  </button>
                ))}
              </div>
            )}

            <p className="mt-4 text-sm text-muted">
              A few suitable {DISCIPLINE_LABEL[activeDiscipline].toLowerCase()}s — select any
              you’d like introduced, or let PlotWorthy choose for you.
            </p>

            <div className="mt-3 space-y-3">
              {pros.map((p) => (
                <ProCard key={p.id} pro={p} checked={!!selected[p.id]} onToggle={() => toggle(p.id)} />
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button onClick={() => setSent(true)} className="btn-primary flex-1">
                {selectedList.length > 0
                  ? `Request introduction${selectedList.length > 1 ? "s" : ""} (${selectedList.length})`
                  : "Let PlotWorthy choose for me"}
              </button>
              <button onClick={onClose} className="btn-ghost">
                Not now
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              Demonstration flow — no request is actually sent yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProCard({
  pro,
  checked,
  onToggle,
}: {
  pro: Professional;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
        checked ? "border-sage-500 bg-sage-50/60 ring-1 ring-sage-200" : "border-line bg-white hover:border-sage-300"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
          checked ? "border-sage-600 bg-sage-600 text-white" : "border-line bg-white"
        }`}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-ink">{pro.name}</span>
          <span className="text-sm text-muted">· {pro.firm}</span>
        </span>
        <span className="mt-0.5 block text-sm text-muted">{pro.blurb}</span>
        <span className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1 text-clay-600">★ {pro.rating.toFixed(1)}</span>
          <span>{pro.projects} projects</span>
          <span>{pro.location}</span>
          <span className="rounded-full bg-sage-50 px-2 py-0.5 font-medium text-sage-700">Vetted</span>
        </span>
      </span>
    </button>
  );
}

function Confirmation({
  projectName,
  stageTitle,
  stageNumber,
  selectedList,
  discipline,
  onClose,
}: {
  projectName: string;
  stageTitle: string;
  stageNumber: number;
  selectedList: Professional[];
  discipline: ReturnType<typeof disciplineFromRole>;
  onClose: () => void;
}) {
  const chosen = selectedList.length > 0;
  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-sage-700">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="font-serif text-lg text-ink">You’re all set</p>
          <p className="text-sm text-muted">PlotWorthy will handle the introduction.</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-line bg-white px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          What the professional receives
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink/85">
          <li>✓ A defined project — {projectName}</li>
          <li>✓ Your current stage — Stage {stageNumber}, {stageTitle}</li>
          <li>✓ Your property and search area</li>
          <li>✓ A structured brief and relevant documents</li>
        </ul>
      </div>

      <div className="mt-4">
        <p className="text-sm text-muted">
          {chosen
            ? `We’ll introduce you to ${selectedList.length} ${DISCIPLINE_LABEL[discipline].toLowerCase()}${
                selectedList.length > 1 ? "s" : ""
              }:`
            : `PlotWorthy will select a suitable ${DISCIPLINE_LABEL[discipline].toLowerCase()} and introduce you shortly.`}
        </p>
        {chosen && (
          <ul className="mt-2 space-y-1 text-sm text-ink">
            {selectedList.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sage-500" />
                {p.name} · {p.firm}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="btn-primary">Done</button>
      </div>
    </div>
  );
}
