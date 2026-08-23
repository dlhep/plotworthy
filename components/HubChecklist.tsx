"use client";

import { useEffect, useMemo, useState } from "react";
import { getJourney } from "@/lib/journeys";
import {
  getCurrentUser,
  loadProject,
  saveProject,
  type Project,
} from "@/lib/project";

// Checklist items are derived deterministically from the journey definition,
// so an item's id is stable across sessions.
type Item = { id: string; label: string; kind: "action" | "document" };

function buildItems(slug: string) {
  const journey = getJourney(slug);
  if (!journey) return [] as { n: number; title: string; items: Item[] }[];
  return journey.stages.map((s) => ({
    n: s.n,
    title: s.title,
    items: [
      ...s.actions.map((a, i) => ({ id: `${slug}:${s.n}:a:${i}`, label: a, kind: "action" as const })),
      ...s.documents.map((d, i) => ({ id: `${slug}:${s.n}:d:${i}`, label: d, kind: "document" as const })),
    ],
  }));
}

const localKey = (slug: string) => `plotworthy.progress.${slug}`;

function readLocal(slug: string): string[] {
  try {
    const raw = localStorage.getItem(localKey(slug));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
function writeLocal(slug: string, ids: string[]) {
  try {
    localStorage.setItem(localKey(slug), JSON.stringify(ids));
  } catch {
    /* storage blocked */
  }
}

function parseProgress(p: Project | null): string[] {
  const raw = p?.data?.["_progress"];
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function HubChecklist({ slug, currentStage }: { slug: string; currentStage: number }) {
  const stages = useMemo(() => buildItems(slug), [slug]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  // The signed-in project this checklist is bound to (only when its goal matches this hub).
  const [boundProject, setBoundProject] = useState<Project | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  // Which stages are expanded — current stage open by default.
  const [open, setOpen] = useState<Set<number>>(new Set([currentStage + 1]));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await getCurrentUser();
      if (user) {
        const project = await loadProject(user.id);
        if (!cancelled && project && project.goalId === slug) {
          setBoundProject(project);
          setChecked(new Set(parseProgress(project)));
          setReady(true);
          return;
        }
      }
      if (!cancelled) {
        setChecked(new Set(readLocal(slug)));
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const totalItems = stages.reduce((n, s) => n + s.items.length, 0);
  const doneCount = checked.size;
  const pct = totalItems ? Math.round((doneCount / totalItems) * 100) : 0;

  async function toggle(id: string) {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
    const ids = Array.from(next);

    if (boundProject) {
      // Persist onto the client's account project.
      const updated: Project = {
        ...boundProject,
        data: { ...boundProject.data, _progress: JSON.stringify(ids) },
      };
      setBoundProject(updated);
      const user = await getCurrentUser();
      if (user) {
        await saveProject(user.id, updated);
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1500);
      }
    } else {
      writeLocal(slug, ids);
    }
  }

  function toggleStage(n: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }

  if (!stages.length) return null;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="display text-2xl">Your progress checklist</h2>
          <p className="mt-1 text-sm text-muted">
            Tick each item as you complete it. {boundProject
              ? "Saved to your account — it’s here on any device."
              : "Saved on this device; sign in and it follows your project."}
          </p>
        </div>
        <div className="min-w-[150px] text-right">
          <div className="flex items-center justify-end gap-2 text-sm">
            <span className="font-semibold text-sage-700">{pct}%</span>
            <span className="text-muted">
              {doneCount}/{totalItems}
            </span>
            {savedFlash && <span className="text-xs text-sage-600">Saved ✓</span>}
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line sm:w-40">
            <div
              className="h-full rounded-full bg-sage-500 transition-all duration-500"
              style={{ width: `${ready ? pct : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {stages.map((s) => {
          const isOpen = open.has(s.n);
          const stageDone = s.items.filter((it) => checked.has(it.id)).length;
          const isCurrent = s.n === currentStage + 1;
          return (
            <div key={s.n} className="border-b border-line last:border-0">
              <button
                type="button"
                onClick={() => toggleStage(s.n)}
                className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-cream/40"
              >
                <span className="flex items-center gap-3">
                  <span className="font-serif text-sage-600/60">0{s.n}</span>
                  <span className="text-sm font-semibold text-ink">{s.title}</span>
                  {isCurrent && (
                    <span className="rounded-full bg-clay-50 px-2 py-0.5 text-[11px] font-semibold text-clay-600 ring-1 ring-clay-100">
                      You are here
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-3 text-xs text-muted">
                  {stageDone}/{s.items.length}
                  <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>›</span>
                </span>
              </button>
              {isOpen && (
                <ul className="space-y-1 px-5 pb-4">
                  {s.items.map((it) => {
                    const on = checked.has(it.id);
                    return (
                      <li key={it.id}>
                        <button
                          type="button"
                          onClick={() => toggle(it.id)}
                          className="flex w-full items-start gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-cream/50"
                        >
                          <span
                            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[11px] transition-colors ${
                              on
                                ? "border-sage-600 bg-sage-600 text-white"
                                : "border-line bg-white text-transparent"
                            }`}
                          >
                            ✓
                          </span>
                          <span className={`text-sm ${on ? "text-muted line-through" : "text-ink/85"}`}>
                            {it.label}
                            {it.kind === "document" && (
                              <span className="ml-2 rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                                info
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
