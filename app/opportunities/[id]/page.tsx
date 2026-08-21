import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { ProjectQuoteForm } from "@/components/project-quote-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Project opportunity" };
export const dynamic = "force-dynamic";

type Project = {
  id: string;
  title: string;
  postcode_district: string;
  area_label: string;
  project_type: string;
  property_type: string;
  brief: string;
  required_professions: string[];
  budget_min_pence: number | null;
  budget_max_pence: number | null;
  target_start_date: string | null;
  status: string;
  local_priority_until: string;
  quote_count: number;
  max_quotes: number;
  published_at: string;
};

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

export default async function OpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect(`/login?next=${encodeURIComponent(`/opportunities/${id}`)}`);
  const [{ data: profile }, { data: application }] = await Promise.all([
    supabase.from("profiles").select("account_type,professional_type").eq("id", userId).maybeSingle(),
    supabase.from("professional_applications").select("status").eq("user_id", userId).order("updated_at", { ascending: false }).limit(1).maybeSingle()
  ]);
  if (profile?.account_type !== "professional") redirect("/dashboard");
  if (application?.status !== "approved") redirect("/opportunities");

  const { data: projectData } = await supabase
    .from("marketplace_projects")
    .select("id,title,postcode_district,area_label,project_type,property_type,brief,required_professions,budget_min_pence,budget_max_pence,target_start_date,status,local_priority_until,quote_count,max_quotes,published_at")
    .eq("id", id)
    .maybeSingle();
  if (!projectData) notFound();
  const project = projectData as Project;

  const { data: quoteData } = await supabase
    .from("project_quotes")
    .select("id,fee_pence,message,timeframe,inclusions,status,submitted_at")
    .eq("project_id", project.id)
    .eq("professional_user_id", userId)
    .maybeSingle();
  const ownQuote = quoteData as OwnQuote | null;
  const canQuote = !ownQuote && project.status === "live" && project.quote_count < project.max_quotes;

  return <main className="project-workspace"><section className="project-hero"><div className="shell"><Link className="back-link" href="/opportunities"><ArrowLeft size={17} /> Back to opportunities</Link><p className="eyebrow">{projectLabels[project.project_type] ?? project.project_type}</p><h1>{project.title}</h1><p><MapPin size={17} /> {project.area_label} · {project.postcode_district}</p></div></section><section className="section"><div className="shell project-detail-grid"><div className="project-main"><article className="live-project-card opportunity-detail"><div className="opportunity-top"><span className="status status-verified">Discipline matched</span><span><UsersRound size={16} /> {project.quote_count}/{project.max_quotes} quotes submitted</span></div><h2>Client brief</h2><p className="project-brief">{project.brief}</p><dl className="project-spec"><div><dt>Existing property</dt><dd>{propertyLabels[project.property_type] ?? project.property_type}</dd></div><div><dt>Project budget</dt><dd>{budget(project)}</dd></div><div><dt>Target start</dt><dd>{project.target_start_date ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(project.target_start_date)) : "Not stated"}</dd></div><div><dt>Posted</dt><dd>{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(project.published_at))}</dd></div></dl><div className="tag-row">{project.required_professions.map((type) => <span key={type}>{professionalLabels[type] ?? type}</span>)}</div><div className="privacy-callout"><ShieldCheck /><div><strong>Client details remain private</strong><span>Submit your quote here. PlotWorthy will reveal contact details only through the agreed client flow.</span></div></div></article>{ownQuote ? <article className="submitted-quote"><p className="eyebrow">Your response</p><div className="quote-card-head"><h2>Quote submitted</h2><strong>{money.format(ownQuote.fee_pence / 100)}</strong></div><span className={`application-status quote-status-${ownQuote.status}`}>{ownQuote.status}</span><p>{ownQuote.message}</p><dl><div><dt>Timeframe</dt><dd>{ownQuote.timeframe}</dd></div>{ownQuote.inclusions ? <div><dt>Included</dt><dd>{ownQuote.inclusions}</dd></div> : null}</dl></article> : canQuote ? <article className="publish-panel"><p className="eyebrow">Express interest</p><h2>Submit a private quote</h2><p>The client sees your business name, discipline, proposed fee and message. Other professionals see only the response count.</p><ProjectQuoteForm projectId={project.id} /></article> : <div className="empty-state compact"><Clock3 /><h2>Quoting is closed</h2><p>This project has reached its quote limit or the client has already made a decision.</p></div>}</div><aside className="project-aside"><UsersRound /><h2>Fair quoting</h2><p>You can see demand without seeing competitors’ commercial details.</p><div className="quote-meter"><strong>{project.quote_count}/{project.max_quotes}</strong><span>quote places used</span></div><ul><li>Maximum five responses</li><li>Your fee is private to the client</li><li>One quote per professional</li></ul>{project.target_start_date ? <p className="aside-date"><CalendarDays /> Target start: {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(project.target_start_date))}</p> : null}</aside></div></section></main>;
}
