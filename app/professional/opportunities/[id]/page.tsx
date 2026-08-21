import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { ProjectQuoteForm } from "@/components/project-quote-form";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Project opportunity" };
export const dynamic = "force-dynamic";

type Project = { id: string; title: string; postcode_district: string; area_label: string; project_type: string; property_type: string; brief: string; required_professions: string[]; budget_min_pence: number | null; budget_max_pence: number | null; target_start_date: string | null; status: string; local_priority_until: string; quote_count: number; max_quotes: number; published_at: string };
type OwnQuote = { id: string; fee_pence: number; message: string; timeframe: string; inclusions: string; status: string; submitted_at: string };
const professionalLabels: Record<string, string> = { architect: "Architect", builder: "Builder", planning_consultant: "Planning consultant", structural_engineer: "Structural engineer" };
const projectLabels: Record<string, string> = { hmo: "HMO conversion", flats: "Conversion into flats", extension: "Extension or loft", land: "Land development", other: "Property project" };
const propertyLabels: Record<string, string> = { house: "House", flat: "Flat", commercial: "Commercial property", land: "Land", other: "Other property" };
const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

function budget(project: Project) {
  if (project.budget_min_pence !== null && project.budget_max_pence !== null) return `${money.format(project.budget_min_pence / 100)}–${money.format(project.budget_max_pence / 100)}`;
  if (project.budget_min_pence !== null) return `From ${money.format(project.budget_min_pence / 100)}`;
  if (project.budget_max_pence !== null) return `Up to ${money.format(project.budget_max_pence / 100)}`;
  return "Not stated";
}

const demoProject: Project = { id: "demo-extension", title: "Rear and side extension to family home", postcode_district: "B17", area_label: "Harborne, Birmingham", project_type: "extension", property_type: "house", brief: "The owner wants to create an open-plan kitchen and family room with a first-floor side extension. They need a measured survey, design options, planning advice and coordinated building regulations drawings. The property is a 1930s semi-detached house and the client hopes to begin construction next spring.", required_professions: ["architect", "structural_engineer"], budget_min_pence: 14000000, budget_max_pence: 19000000, target_start_date: "2027-03-01", status: "live", local_priority_until: "2099-08-28T09:00:00Z", quote_count: 2, max_quotes: 5, published_at: "2026-08-21T08:15:00Z" };

export default async function ProfessionalOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!hasSupabaseConfig()) return <OpportunityDetail project={{ ...demoProject, id }} ownQuote={null} preview />;
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect(`/login?next=${encodeURIComponent(`/professional/opportunities/${id}`)}`);
  const { data: application } = await supabase.from("professional_applications").select("status").eq("user_id", userId).order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (application?.status !== "approved") redirect("/professional/opportunities");
  const { data: projectData } = await supabase.from("marketplace_projects").select("id,title,postcode_district,area_label,project_type,property_type,brief,required_professions,budget_min_pence,budget_max_pence,target_start_date,status,local_priority_until,quote_count,max_quotes,published_at").eq("id", id).maybeSingle();
  if (!projectData) notFound();
  const { data: quoteData } = await supabase.from("project_quotes").select("id,fee_pence,message,timeframe,inclusions,status,submitted_at").eq("project_id", id).eq("professional_user_id", userId).maybeSingle();
  return <OpportunityDetail project={projectData as Project} ownQuote={quoteData as OwnQuote | null} />;
}

function OpportunityDetail({ project, ownQuote, preview = false }: { project: Project; ownQuote: OwnQuote | null; preview?: boolean }) {
  const canQuote = !ownQuote && project.status === "live" && project.quote_count < project.max_quotes;
  return <><div className="workspace-page-heading opportunity-detail-heading"><div><Link className="workspace-back-link" href="/professional/opportunities"><ArrowLeft /> Back to opportunities</Link><p className="workspace-kicker">{projectLabels[project.project_type] ?? project.project_type}</p><h1>{project.title}</h1><p><MapPin /> {project.area_label} · {project.postcode_district}</p></div><span className="quote-availability"><UsersRound /><strong>{project.max_quotes - project.quote_count}</strong><span>quote places left</span></span></div>{preview ? <div className="workspace-preview-banner">Workspace preview — submission is disabled until Supabase is configured.</div> : null}<div className="workspace-project-grid"><section className="workspace-panel opportunity-full-brief"><div className="opportunity-top"><span className="priority-pill">Discipline matched</span><span><UsersRound /> {project.quote_count}/{project.max_quotes} quotes submitted</span></div><h2>Client brief</h2><p className="project-brief">{project.brief}</p><dl className="project-spec"><div><dt>Existing property</dt><dd>{propertyLabels[project.property_type] ?? project.property_type}</dd></div><div><dt>Project budget</dt><dd>{budget(project)}</dd></div><div><dt>Target start</dt><dd>{project.target_start_date ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(project.target_start_date)) : "Not stated"}</dd></div><div><dt>Posted</dt><dd>{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(project.published_at))}</dd></div></dl><div className="tag-row">{project.required_professions.map((type) => <span key={type}>{professionalLabels[type] ?? type}</span>)}</div><div className="privacy-callout"><ShieldCheck /><div><strong>Client details remain private</strong><span>Submit your response through PlotWorthy. Contact details are shared only through the agreed client flow.</span></div></div></section><aside className="workspace-side-stack">{ownQuote ? <section className="workspace-panel submitted-quote"><p className="workspace-kicker">Your response</p><div className="quote-card-head"><h2>Quote submitted</h2><strong>{money.format(ownQuote.fee_pence / 100)}</strong></div><span className={`application-status quote-status-${ownQuote.status}`}>{ownQuote.status}</span><p>{ownQuote.message}</p><dl><div><dt>Timeframe</dt><dd>{ownQuote.timeframe}</dd></div>{ownQuote.inclusions ? <div><dt>Included</dt><dd>{ownQuote.inclusions}</dd></div> : null}</dl></section> : canQuote ? <section className="workspace-panel quote-submit-panel"><p className="workspace-kicker">Express interest</p><h2>Submit a private quote</h2><p>The client sees your practice, proposed fee and message. Other professionals see only the response count.</p>{preview ? <button className="button button-wide" type="button" disabled>Configure Supabase to submit</button> : <ProjectQuoteForm projectId={project.id} />}</section> : <section className="workspace-panel workspace-empty compact"><Clock3 /><h2>Quoting is closed</h2><p>The project reached its quote limit or the client made a decision.</p></section>}<section className="workspace-panel fair-quoting"><UsersRound /><h2>Fair quoting</h2><div className="quote-meter"><strong>{project.quote_count}/{project.max_quotes}</strong><span>places used</span></div><ul><li>Maximum five responses</li><li>Competitors’ fees stay private</li><li>One quote per practice</li></ul>{project.target_start_date ? <p><CalendarDays /> Target start {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(project.target_start_date))}</p> : null}</section></aside></div></>;
}
