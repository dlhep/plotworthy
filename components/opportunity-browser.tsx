"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Check, Clock3, MapPin, Search, SlidersHorizontal, UsersRound, X } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

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
  status?: string;
  own_quote_status?: string | null;
};

const projectLabels: Record<string, string> = { hmo: "HMO conversion", flats: "Flat conversion", extension: "Extension or loft", land: "Land development", other: "Property project" };
const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export function opportunityBudget(project: WorkspaceOpportunity) {
  if (project.budget_min_pence !== null && project.budget_max_pence !== null) return `${money.format(project.budget_min_pence / 100)}–${money.format(project.budget_max_pence / 100)}`;
  if (project.budget_min_pence !== null) return `From ${money.format(project.budget_min_pence / 100)}`;
  if (project.budget_max_pence !== null) return `Up to ${money.format(project.budget_max_pence / 100)}`;
  return "Budget not stated";
}

type OpportunityTab = "new" | "quoted" | "closed";

export function OpportunityBrowser({ opportunities, now }: { opportunities: WorkspaceOpportunity[]; now: number }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [selectedId, setSelectedId] = useState(opportunities[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<OpportunityTab>("new");
  const [filterOpen, setFilterOpen] = useState(false);
  const [projectType, setProjectType] = useState("all");
  const [access, setAccess] = useState("all");
  const counts = useMemo(() => opportunities.reduce((result, project) => {
    const open = (project.status ?? "live") === "live" && project.quote_count < project.max_quotes;
    if (project.own_quote_status) result.quoted += 1;
    else if (open) result.new += 1;
    else result.closed += 1;
    return result;
  }, { new: 0, quoted: 0, closed: 0 }), [opportunities]);
  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    return opportunities.filter((project) => {
      const open = (project.status ?? "live") === "live" && project.quote_count < project.max_quotes;
      const correctTab = activeTab === "quoted" ? Boolean(project.own_quote_status) : activeTab === "new" ? !project.own_quote_status && open : !project.own_quote_status && !open;
      const correctType = projectType === "all" || project.project_type === projectType;
      const local = new Date(project.local_priority_until).getTime() > now;
      const correctAccess = access === "all" || (access === "local" ? local : !local);
      const correctSearch = !needle || `${project.title} ${project.area_label} ${project.postcode_district} ${project.brief}`.toLowerCase().includes(needle);
      return correctTab && correctType && correctAccess && correctSearch;
    });
  }, [access, activeTab, deferredQuery, now, opportunities, projectType]);
  const selected = filtered.find((project) => project.id === selectedId) ?? filtered[0];
  const appliedFilters = Number(projectType !== "all") + Number(access !== "all");
  const uniqueProjectTypes = useMemo(() => Array.from(new Set(opportunities.map((project) => project.project_type))).sort(), [opportunities]);

  function selectTab(tab: OpportunityTab) {
    setActiveTab(tab);
    setSelectedId("");
  }

  function clearFilters() {
    setProjectType("all");
    setAccess("all");
    setQuery("");
  }

  return (
    <div className="opportunity-browser">
      <section className="opportunity-list-pane">
        <div className="opportunity-tabs" role="tablist" aria-label="Opportunity status">
          <button className={activeTab === "new" ? "active" : undefined} type="button" role="tab" aria-selected={activeTab === "new"} onClick={() => selectTab("new")}>New <span>{counts.new}</span></button>
          <button className={activeTab === "quoted" ? "active" : undefined} type="button" role="tab" aria-selected={activeTab === "quoted"} onClick={() => selectTab("quoted")}>Quoted <span>{counts.quoted}</span></button>
          <button className={activeTab === "closed" ? "active" : undefined} type="button" role="tab" aria-selected={activeTab === "closed"} onClick={() => selectTab("closed")}>Closed <span>{counts.closed}</span></button>
        </div>
        <div className="opportunity-search-row">
          <label><Search aria-hidden="true" /><span className="sr-only">Search projects</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search location or project" /></label>
          <button className={filterOpen || appliedFilters ? "active" : undefined} type="button" aria-label="Filter opportunities" aria-expanded={filterOpen} onClick={() => setFilterOpen((open) => !open)}><SlidersHorizontal />{appliedFilters ? <span>{appliedFilters}</span> : null}</button>
        </div>
        {filterOpen ? <div className="opportunity-filter-panel">
          <div><strong>Filter projects</strong><button type="button" onClick={() => setFilterOpen(false)} aria-label="Close filters"><X /></button></div>
          <label>Project type<select value={projectType} onChange={(event) => setProjectType(event.target.value)}><option value="all">All project types</option>{uniqueProjectTypes.map((type) => <option value={type} key={type}>{projectLabels[type] ?? type.replaceAll("_", " ")}</option>)}</select></label>
          <label>Matching access<select value={access} onChange={(event) => setAccess(event.target.value)}><option value="all">All matching projects</option><option value="local">Local priority</option><option value="wider">Open to wider network</option></select></label>
          <button className="opportunity-clear-filters" type="button" onClick={clearFilters}>Clear all filters</button>
        </div> : null}
        <div className="opportunity-result-label" aria-live="polite"><strong>{activeTab === "new" ? "Available projects" : activeTab === "quoted" ? "Your submitted quotes" : "Closed projects"}</strong><span>{filtered.length} result{filtered.length === 1 ? "" : "s"}</span></div>
        <div className="opportunity-compact-list">
          {filtered.map((project) => {
            const local = new Date(project.local_priority_until).getTime() > now;
            const placesLeft = Math.max(0, project.max_quotes - project.quote_count);
            return <button className={selected?.id === project.id ? "active" : undefined} type="button" key={project.id} onClick={() => setSelectedId(project.id)}>
              <span className="opportunity-list-top"><span className={project.own_quote_status ? "quoted-pill" : local ? "priority-pill" : "open-pill"}>{project.own_quote_status ? `Quote ${project.own_quote_status}` : local ? "Local priority" : "Open wider"}</span><span>{placesLeft} place{placesLeft === 1 ? "" : "s"} left</span></span>
              <strong>{project.title}</strong>
              <span><MapPin /> {project.area_label} · {project.postcode_district}</span>
              <span className="opportunity-list-bottom"><b>{opportunityBudget(project)}</b><time dateTime={project.published_at}>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(project.published_at))}</time></span>
            </button>;
          })}
          {!filtered.length ? <div className="workspace-empty compact"><Search /><h2>{activeTab === "quoted" ? "No quotes submitted yet" : activeTab === "closed" ? "No closed projects" : "No projects found"}</h2><p>{activeTab === "new" ? "Try another location or clear the filters." : activeTab === "quoted" ? "Projects you respond to will be organised here." : "Completed and filled opportunities will appear here."}</p>{activeTab === "new" && (appliedFilters || query) ? <button className="button button-ghost" type="button" onClick={clearFilters}>Clear filters</button> : null}</div> : null}
        </div>
      </section>
      <section className="opportunity-preview-pane">
        {selected ? <>
          <div className="opportunity-preview-head">
            <div><p className="workspace-kicker">{projectLabels[selected.project_type] ?? selected.project_type}</p><h2>{selected.title}</h2><p><MapPin /> {selected.area_label} · {selected.postcode_district}</p></div>
            <span className="quote-availability"><UsersRound /><strong>{Math.max(0, selected.max_quotes - selected.quote_count)}</strong><span>quote places left</span></span>
          </div>
          <div className="opportunity-preview-stats"><div><span>Indicative budget</span><strong>{opportunityBudget(selected)}</strong></div><div><span>Response level</span><strong>{selected.quote_count}/{selected.max_quotes} quotes</strong></div><div><span>Access</span><strong>{new Date(selected.local_priority_until).getTime() > now ? "Local professionals" : "Wider network"}</strong></div></div>
          <div className="opportunity-response-meter" aria-label={`${selected.quote_count} of ${selected.max_quotes} quotes submitted`}><span style={{ width: `${Math.min(100, (selected.quote_count / selected.max_quotes) * 100)}%` }} /></div>
          <div className="opportunity-preview-brief"><h3>Client brief</h3><p>{selected.brief}</p></div>
          <div className="opportunity-fairness"><BriefcaseBusiness /><div><strong>Decide with the facts</strong><span>The client’s details and other professionals’ prices stay private. You see demand before choosing whether to quote.</span></div></div>
          <div className="opportunity-preview-footer"><span><Clock3 /> Posted {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(selected.published_at))}</span><Link className="button" href={`/professional/opportunities/${selected.id}`}>{selected.own_quote_status ? <><Check /> View my quote</> : <>Open project &amp; quote <ArrowRight /></>}</Link></div>
        </> : <div className="workspace-empty"><BriefcaseBusiness /><h2>Select a project</h2><p>Choose an opportunity to review its brief and quote availability.</p></div>}
      </section>
    </div>
  );
}
