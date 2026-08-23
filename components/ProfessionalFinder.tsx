"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { JOURNEYS, getJourney, journeyDisciplineRoles } from "@/lib/journeys";
import {
  professionalsFor,
  disciplineFromRole,
  DISCIPLINE_LABEL,
  type Discipline,
  type Professional,
} from "@/lib/professionals";

const DISCIPLINES: Discipline[] = [
  "architect",
  "planning",
  "structural",
  "fire",
  "surveyor",
  "builder",
  "letting",
  "licensing",
  "commercial",
];

export function ProfessionalFinder() {
  const [postcode, setPostcode] = useState("");
  const [applied, setApplied] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [discipline, setDiscipline] = useState<"" | Discipline>("");

  // Which professional types to show, driven by the selected filters.
  const targetDisciplines = useMemo<Discipline[]>(() => {
    if (discipline) return [discipline];
    if (projectSlug) {
      const j = getJourney(projectSlug);
      if (j) {
        const ds = journeyDisciplineRoles(j)
          .map(disciplineFromRole)
          .filter((d) => d !== "adviser") as Discipline[];
        return Array.from(new Set(ds));
      }
    }
    return DISCIPLINES;
  }, [discipline, projectSlug]);

  const results = useMemo(() => {
    const seen = new Set<string>();
    const out: Professional[] = [];
    for (const d of targetDisciplines) {
      for (const p of professionalsFor(d)) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        out.push(p);
      }
    }
    return out;
  }, [targetDisciplines]);

  const area = applied.trim() || "your area";

  return (
    <div>
      {/* Search controls */}
      <div className="card p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-ink">Property postcode</span>
            <input
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") setApplied(postcode);
              }}
              placeholder="e.g. B14"
              className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm uppercase outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Project type</span>
            <select
              value={projectSlug}
              onChange={(e) => setProjectSlug(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
            >
              <option value="">Any project type</option>
              {JOURNEYS.map((j) => (
                <option key={j.slug} value={j.slug}>
                  {j.shortName}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Professional type</span>
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value as "" | Discipline)}
              className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
            >
              <option value="">Any professional</option>
              {DISCIPLINES.map((d) => (
                <option key={d} value={d}>
                  {DISCIPLINE_LABEL[d]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            Showing vetted professionals covering {area}
            {projectSlug ? ` for ${getJourney(projectSlug)?.shortName} projects` : ""}.
          </p>
          <button onClick={() => setApplied(postcode)} className="btn-primary text-sm">
            Find professionals
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {results.map((p) => {
          const initials = p.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2);
          return (
            <div key={p.id} className="card flex items-start gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sage-100 text-sm font-semibold text-sage-700">
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-ink">{p.firm}</p>
                  <span className="text-xs font-semibold text-clay-600">★ {p.rating.toFixed(1)}</span>
                </div>
                <p className="text-xs text-muted">
                  {DISCIPLINE_LABEL[p.discipline]} · covers {area}
                </p>
                <p className="mt-1.5 text-sm leading-snug text-muted">{p.blurb}</p>
                <div className="mt-3">
                  <Link href="/start" className="btn-outline text-sm">
                    Request an introduction →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 rounded-xl border border-line bg-cream/50 px-4 py-3 text-center text-sm text-muted">
        Introductions happen through your project, so a professional receives a clear brief.{" "}
        <Link href="/start" className="font-medium text-sage-700 hover:underline">
          Start your journey
        </Link>{" "}
        to request one.
      </p>
    </div>
  );
}
