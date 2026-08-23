"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { briefSpec, goalLabel, goalSlug, readiness } from "@/lib/brief";
import {
  getCurrentUser,
  loadProject,
  saveProject,
  readLocalDraft,
  type Project,
} from "@/lib/project";
import { BriefPreview } from "./BriefPreview";
import { BriefBuilder } from "./BriefBuilder";

type State = {
  loading: boolean;
  signedIn: boolean;
  email: string | null;
  userId: string | null;
  project: Project | null;
};

export function BriefHub() {
  const [state, setState] = useState<State>({
    loading: true,
    signedIn: false,
    email: null,
    userId: null,
    project: null,
  });
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  async function refresh() {
    const user = await getCurrentUser();
    if (user) {
      let project = await loadProject(user.id);
      if (!project) {
        // First visit after signing up — move the local draft onto the account.
        const draft = readLocalDraft();
        if (draft && draft.goalId) {
          await saveProject(user.id, draft);
          project = draft;
        }
      }
      setState({ loading: false, signedIn: true, email: user.email ?? null, userId: user.id, project });
    } else {
      const draft = readLocalDraft();
      setState({ loading: false, signedIn: false, email: null, userId: null, project: draft });
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  if (state.loading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-cream" />;
  }

  const project = state.project;

  if (!project || !project.goalId) {
    return (
      <div className="card p-8 text-center">
        <p className="eyebrow justify-center">Your project home</p>
        <h1 className="mt-2 display text-2xl">No project yet</h1>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Your project brief is the first thing you make on PlotWorthy — it&apos;s
          what lets a professional quote a fee without a dozen questions.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/start" className="btn-primary">Start your journey →</Link>
          {!state.signedIn && (
            <Link href="/login?next=/brief" className="btn-outline">Log in</Link>
          )}
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <BriefBuilder
        goalId={project.goalId}
        initial={project.data}
        stage={project.stage ?? undefined}
        positionLabel={project.positionLabel ?? undefined}
        onBack={() => setEditing(false)}
        onSaved={() => {
          setEditing(false);
          refresh();
        }}
      />
    );
  }

  const slug = goalSlug(project.goalId);
  const r = readiness(project.goalId, project.data);

  const copyBrief = async () => {
    const lines: string[] = [`PROJECT BRIEF — ${goalLabel(project.goalId)}`, ""];
    for (const section of briefSpec(project.goalId)) {
      const rows = section.fields.filter((f) => (project.data[f.id] ?? "").trim());
      if (!rows.length) continue;
      lines.push(section.title.toUpperCase());
      for (const f of rows) lines.push(`  ${f.label}: ${project.data[f.id]}`);
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
          <h1 className="mt-2 display text-3xl sm:text-4xl">{goalLabel(project.goalId)}</h1>
          <p className="mt-1 text-sm text-muted">
            {r.label}
            {project.updatedAt ? ` · saved ${new Date(project.updatedAt).toLocaleDateString("en-GB")}` : ""}
            {state.email ? ` · ${state.email}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setEditing(true)} className="btn-outline text-sm">Edit brief</button>
          <button onClick={copyBrief} className="btn-ghost text-sm">{copied ? "Copied ✓" : "Copy brief"}</button>
          {state.signedIn && (
            <form action="/auth/signout" method="post">
              <button className="btn-ghost text-sm" type="submit">Log out</button>
            </form>
          )}
        </div>
      </div>

      {!state.signedIn ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-clay-200 bg-clay-50/70 px-4 py-3">
          <p className="text-sm text-clay-700">
            This project is only saved on this device. Create a free account to
            keep it and use it on any device.
          </p>
          <Link href="/signup?next=/brief" className="btn-primary text-sm">Create a free account</Link>
        </div>
      ) : (
        <p className="mt-5 max-w-2xl rounded-xl border border-line bg-cream/50 px-4 py-3 text-sm text-muted">
          This is your project home — free to use for the whole journey. Your brief,
          your stage, your professionals and their quotes all live here. Nothing is
          shared until you choose to.
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
        <BriefPreview goalId={project.goalId} data={project.data} />

        <aside className="card p-5">
          <h2 className="display text-lg">Next steps</h2>
          <ol className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3"><Step n={1} done /><span className="text-ink/85">Brief created</span></li>
            <li className="flex gap-3">
              <Step n={2} done={state.signedIn} />
              <span className="text-ink/85">{state.signedIn ? "Account created" : "Create a free account to save it"}</span>
            </li>
            <li className="flex gap-3">
              <Step n={3} />
              <span className="text-ink/85">Share it with vetted professionals for your postcode to get fee proposals.</span>
            </li>
          </ol>

          <div className="mt-5 flex flex-col gap-2">
            <Link href="/professionals" className="btn-primary w-full">Find professionals for my postcode →</Link>
            {slug && (
              <Link
                href={`/journeys/${slug}${project.stage != null ? `?at=${project.stage}` : ""}${
                  project.data.postcode
                    ? `${project.stage != null ? "&" : "?"}pc=${encodeURIComponent(project.data.postcode)}`
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
