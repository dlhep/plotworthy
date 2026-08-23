"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BRIEF_STORAGE_KEY,
  briefSpec,
  goalLabel,
  goalSlug,
  readiness,
  type BriefData,
} from "@/lib/brief";
import { BriefPreview } from "./BriefPreview";
import { BriefBuilder } from "./BriefBuilder";

type Saved = {
  goalId: string;
  data: BriefData;
  stage: number | null;
  positionLabel: string | null;
  savedAt: string;
};

function load(): Saved | null {
  try {
    const raw = localStorage.getItem(BRIEF_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

export function BriefHub() {
  const [saved, setSaved] = useState<Saved | null | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setSaved(load()), []);

  if (saved === undefined) {
    return <div className="h-40 animate-pulse rounded-2xl bg-cream" />;
  }

  if (!saved) {
    return (
      <div className="card p-8 text-center">
        <p className="eyebrow justify-center">Your project home</p>
        <h1 className="mt-2 display text-2xl">No brief yet</h1>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Your project brief is the first thing you make on PlotWorthy — it&apos;s
          what lets a professional quote a fee without a dozen questions.
        </p>
        <Link href="/start" className="btn-primary mt-6">
          Start your journey →
        </Link>
      </div>
    );
  }

  if (editing) {
    return (
      <BriefBuilder
        goalId={saved.goalId}
        initial={saved.data}
        stage={saved.stage ?? undefined}
        positionLabel={saved.positionLabel ?? undefined}
        onBack={() => setEditing(false)}
        onSaved={() => {
          setSaved(load());
          setEditing(false);
        }}
      />
    );
  }

  const slug = goalSlug(saved.goalId);
  const r = readiness(saved.goalId, saved.data);

  const copyBrief = async () => {
    const lines: string[] = [`PROJECT BRIEF — ${goalLabel(saved.goalId)}`, ""];
    for (const section of briefSpec(saved.goalId)) {
      const rows = section.fields.filter((f) => (saved.data[f.id] ?? "").trim());
      if (!rows.length) continue;
      lines.push(section.title.toUpperCase());
      for (const f of rows) lines.push(`  ${f.label}: ${saved.data[f.id]}`);
      lines.push("");
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your project home</p>
          <h1 className="mt-2 display text-3xl sm:text-4xl">{goalLabel(saved.goalId)}</h1>
          <p className="mt-1 text-sm text-muted">
            {r.label} · saved {new Date(saved.savedAt).toLocaleDateString("en-GB")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setEditing(true)} className="btn-outline text-sm">
            Edit brief
          </button>
          <button onClick={copyBrief} className="btn-ghost text-sm">
            {copied ? "Copied ✓" : "Copy brief"}
          </button>
        </div>
      </div>

      <p className="mt-5 max-w-2xl rounded-xl border border-line bg-cream/50 px-4 py-3 text-sm text-muted">
        This is your project home — free to use for the whole journey. Your brief,
        your stage, your professionals and their quotes all live here as you move
        forward. Nothing is shared until you choose to.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
        <BriefPreview goalId={saved.goalId} data={saved.data} />

        <aside className="card p-5">
          <h2 className="display text-lg">Next steps</h2>
          <ol className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3">
              <Step n={1} done />
              <span className="text-ink/85">Brief created</span>
            </li>
            <li className="flex gap-3">
              <Step n={2} />
              <span className="text-ink/85">
                Share it with vetted professionals for your postcode to get fee
                proposals.
              </span>
            </li>
            <li className="flex gap-3">
              <Step n={3} />
              <span className="text-ink/85">
                Follow your project journey stage by stage.
              </span>
            </li>
          </ol>

          <div className="mt-5 flex flex-col gap-2">
            <Link href="/professionals" className="btn-primary w-full">
              Find professionals for my postcode →
            </Link>
            {slug && (
              <Link
                href={`/journeys/${slug}${
                  saved.stage != null ? `?at=${saved.stage}` : ""
                }${
                  saved.data.postcode
                    ? `${saved.stage != null ? "&" : "?"}pc=${encodeURIComponent(saved.data.postcode)}`
                    : ""
                }`}
                className="btn-outline w-full"
              >
                Open my project journey
              </Link>
            )}
          </div>
          <p className="mt-3 text-xs text-muted">
            Sharing your brief with professionals is free — you only pay for the
            work you commission.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Step({ n, done }: { n: number; done?: boolean }) {
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
        done ? "bg-sage-600 text-white" : "bg-sage-50 text-sage-700 ring-1 ring-sage-100"
      }`}
    >
      {done ? "✓" : n}
    </span>
  );
}
