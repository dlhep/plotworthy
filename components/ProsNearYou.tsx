"use client";

import { useState } from "react";
import type { Journey } from "@/lib/journeys";
import { journeyDisciplineRoles } from "@/lib/journeys";
import {
  disciplineFromRole,
  professionalsFor,
  DISCIPLINE_LABEL,
} from "@/lib/professionals";
import { IntroFlow } from "./IntroFlow";

export function ProsNearYou({
  journey,
  initialPostcode = "",
}: {
  journey: Journey;
  initialPostcode?: string;
}) {
  const [pc, setPc] = useState(initialPostcode);
  const [applied, setApplied] = useState(initialPostcode);

  const roles = journeyDisciplineRoles(journey);
  const discs = Array.from(new Set(roles.map(disciplineFromRole))).slice(0, 4);
  const pros = discs.map((d) => ({ d, p: professionalsFor(d)[0] })).filter((x) => x.p);
  const area = applied || "your area";

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-clay-600">
        <span className="kicker-num">03</span> Professionals who cover your area
      </div>
      <h2 className="display text-2xl">Vetted professionals for your postcode</h2>
      <p className="mt-2 text-sm text-muted">
        Enter the property postcode to see professionals who cover that area for this project type.
      </p>
      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-clay-50 px-3 py-1 text-xs font-semibold text-clay-700">
        Example professional profiles — for demonstration
      </p>

      <div className="mt-4 flex max-w-sm gap-2">
        <input
          value={pc}
          onChange={(e) => setPc(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter" && pc.trim()) setApplied(pc.trim());
          }}
          placeholder="Property postcode e.g. B14"
          className="flex-1 rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm uppercase text-ink placeholder:text-muted/60 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200"
        />
        <button
          type="button"
          onClick={() => pc.trim() && setApplied(pc.trim())}
          className="btn-primary text-sm"
        >
          Find
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {pros.map(({ d, p }) => {
          const init = p.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
          return (
            <div key={p.id} className="card flex items-start gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage-100 text-sm font-semibold text-sage-700">
                {init}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-ink">{p.name}</span>
                  <span className="text-xs font-semibold text-clay-600">★ {p.rating.toFixed(1)}</span>
                </div>
                <p className="text-xs text-muted">
                  {DISCIPLINE_LABEL[d]} · covering {area}
                </p>
                <p className="mt-1 text-sm leading-snug text-muted">{p.blurb}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <IntroFlow
          compact
          projectName={journey.shortName}
          stageTitle="Choosing your team"
          stageNumber={1}
          roles={roles}
        />
      </div>
    </div>
  );
}
