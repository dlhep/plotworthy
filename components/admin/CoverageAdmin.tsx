"use client";

import { useState } from "react";
import type { Application } from "@/lib/adminData";
import { toDistrict, districtsFromCoverage } from "@/lib/postcodes";
import { CITY_DISTRICTS, CITY_NAMES } from "@/lib/cities";

type SaveState = "idle" | "saving" | "saved" | "error";

export function CoverageAdmin({ app, next }: { app: Application; next: string }) {
  const seed = app.districts && app.districts.length ? app.districts : districtsFromCoverage(app.coverage);
  const [selected, setSelected] = useState<Set<string>>(new Set(seed));
  const [draft, setDraft] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState<SaveState>("idle");

  const list = Array.from(selected).sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ""), 10);
    const nb = parseInt(b.replace(/\D/g, ""), 10);
    return a.replace(/\d/g, "").localeCompare(b.replace(/\d/g, "")) || na - nb;
  });

  const addDistrict = () => {
    const c = toDistrict(draft);
    if (c) {
      setSelected((p) => new Set(p).add(c));
      setDraft("");
      setState("idle");
    }
  };

  const addCity = (name: string) => {
    const ds = CITY_DISTRICTS[name];
    if (!ds) return;
    setSelected((p) => {
      const n = new Set(p);
      ds.forEach((d) => n.add(d));
      return n;
    });
    setCity("");
    setState("idle");
  };

  const remove = (d: string) =>
    setSelected((p) => {
      const n = new Set(p);
      n.delete(d);
      return n;
    });

  async function save() {
    setState("saving");
    try {
      const res = await fetch("/api/admin/coverage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: app.id, districts: Array.from(selected) }),
      });
      const json = await res.json();
      setState(json.ok ? "saved" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="mt-2 rounded-xl border border-line bg-cream/40 px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Coverage</span>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-ink/80">
          {selected.size} district{selected.size === 1 ? "" : "s"}
        </span>

        <div className="flex items-center gap-1.5">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDistrict())}
            placeholder="Add e.g. TS7"
            className="w-28 rounded-lg border border-line bg-white px-2 py-1 text-sm uppercase"
          />
          <button type="button" onClick={addDistrict} className="btn-outline text-xs">Add</button>
        </div>

        <select
          value={city}
          onChange={(e) => { setCity(e.target.value); if (e.target.value) addCity(e.target.value); }}
          className="rounded-lg border border-line bg-white px-2 py-1 text-sm text-ink"
        >
          <option value="">+ Add a whole city…</option>
          {CITY_NAMES.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <span className="ml-auto flex items-center gap-2">
          {selected.size > 0 && (
            <button type="button" onClick={() => { setSelected(new Set()); setState("idle"); }} className="text-xs text-muted hover:text-clay-600">
              Clear
            </button>
          )}
          <button type="button" onClick={save} disabled={state === "saving"} className="btn-outline text-sm disabled:opacity-60">
            {state === "saving" ? "Saving…" : state === "saved" ? "✓ Saved" : "Save coverage"}
          </button>
        </span>
      </div>

      {list.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {list.map((d) => (
            <span key={d} className="inline-flex items-center gap-1 rounded-md border border-line bg-white py-0.5 pl-2 pr-1 text-xs font-medium text-ink">
              {d}
              <button type="button" onClick={() => remove(d)} className="text-muted hover:text-clay-600" aria-label={`Remove ${d}`}>×</button>
            </span>
          ))}
        </div>
      )}
      {state === "error" && <p className="mt-2 text-xs text-clay-700">Couldn’t save — please try again.</p>}
      <p className="mt-2 text-[0.7rem] text-muted">
        Only you see these. Clients and other professionals just see that this member is available in their area.
      </p>
    </div>
  );
}
