"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Clock3, MapPin, Search, SlidersHorizontal, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";

export type WorkspaceOpportunity = {
  id: string;
  title: string;
  postcode_district: string;
  area_label: string;
  project_type: string;
  brief: string;
  budget_min_pence: number | null;
  budget_max_pence: number | null;
  local_priority_until: string;
  quote_count: number;
  max_quotes: number;
  published_at: string;
};

const projectLabels: Record<string, string> = { hmo: "HMO conversion", flats: "Flat conversion", extension: "Extension or loft", land: "Land development", other: "Property project" };
const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export function opportunityBudget(project: WorkspaceOpportunity) {
  if (project.budget_min_pence !== null && project.budget_max_pence !== null) return `${money.format(project.budget_min_pence / 100)}–${money.format(project.budget_max_pence / 100)}`;
  if (project.budget_min_pence !== null) return `From ${money.format(project.budget_min_pence / 100)}`;
  if (project.budget_max_pence !== null) return `Up to ${money.format(project.budget_max_pence / 100)}`;
  return "Budget not stated";
}

export function OpportunityBrowser({ opportunities }: { opportunities: WorkspaceOpportunity[] }) {
  const [currentTime] = useState(() => Date.now());
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(opportunities[0]?.id ?? "");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return opportunities;
    return opportunities.filter((project) => `${project.title} ${project.area_label} ${project.postcode_district} ${project.brief}`.toLowerCase().includes(needle));
  }, [opportunities, query]);
  const selected = filtered.find((project) => project.id === selectedId) ?? filtered[0];

  return (
    <div className="opportunity-browser">
      <section className="opportunity-list-pane">
        <div className="opportunity-tabs" role="tablist" aria-label="Opportunity status">
          <button className="active" type="button" role="tab" aria-selected="true">New <span>{opportunities.length}</span></button>
          <button type="button" role="tab" aria-selected="false">Quoted</button>
          <button type="button" role="tab" aria-selected="false">Closed</button>
        </div>
        <div className="opportunity-search-row">
          <label><Search aria-hidden="true" /><span className="sr-only">Search projects</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search location or project" /></label>
          <button type="button" aria-label="Filter opportunities"><SlidersHorizontal /></button>
        </div>
        <div className="opportunity-result-label"><strong>Available projects</strong><span>{filtered.length} result{filtered.length === 1 ? "" : "s"}</span></div>
        <div className="opportunity-compact-list">
          {filtered.map((project) => {
            const local = new Date(project.local_priority_until).getTime() > currentTime;
            return <button className={selected?.id === project.id ? "active" : undefined} type="button" key={project.id} onClick={() => setSelectedId(project.id)}>
              <span className="opportunity-list-top"><span className={local ? "priority-pill" : "open-pill"}>{local ? "Local priority" : "Open wider"}</span><span>{project.quote_count}/{project.max_quotes} quotes</span></span>
              <strong>{project.title}</strong>
              <span><MapPin /> {project.area_label} · {project.postcode_district}</span>
              <span className="opportunity-list-bottom"><b>{opportunityBudget(project)}</b><time dateTime={project.published_at}>{new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(Math.max(-30, Math.ceil((new Date(project.published_at).getTime() - currentTime) / 86400000)), "day")}</time></span>
            </button>;
          })}
          {!filtered.length ? <div className="workspace-empty compact"><Search /><h2>No projects found</h2><p>Try another location or clear the search.</p></div> : null}
        </div>
      </section>
      <section className="opportunity-preview-pane">
        {selected ? <>
          <div className="opportunity-preview-head">
            <div><p className="workspace-kicker">{projectLabels[selected.project_type] ?? selected.project_type}</p><h2>{selected.title}</h2><p><MapPin /> {selected.area_label} · {selected.postcode_district}</p></div>
            <span className="quote-availability"><UsersRound /><strong>{selected.max_quotes - selected.quote_count}</strong><span>quote places left</span></span>
          </div>
          <div className="opportunity-preview-stats"><div><span>Indicative budget</span><strong>{opportunityBudget(selected)}</strong></div><div><span>Response level</span><strong>{selected.quote_count}/{selected.max_quotes} quotes</strong></div><div><span>Access</span><strong>{new Date(selected.local_priority_until).getTime() > currentTime ? "Local professionals" : "Wider network"}</strong></div></div>
          <div className="opportunity-preview-brief"><h3>Client brief</h3><p>{selected.brief}</p></div>
          <div className="opportunity-fairness"><BriefcaseBusiness /><div><strong>Decide with the facts</strong><span>The client’s details and other professionals’ prices stay private. You see demand before choosing whether to quote.</span></div></div>
          <div className="opportunity-preview-footer"><span><Clock3 /> Posted {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(selected.published_at))}</span><Link className="button" href={`/professional/opportunities/${selected.id}`}>View full brief <ArrowRight /></Link></div>
        </> : <div className="workspace-empty"><BriefcaseBusiness /><h2>Select a project</h2><p>Choose an opportunity to review its brief and quote availability.</p></div>}
      </section>
    </div>
  );
}
