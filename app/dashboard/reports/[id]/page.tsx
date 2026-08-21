import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, FileText, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { ProjectPublishForm } from "@/components/project-publish-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { respondToQuote } from "./actions";

export const metadata: Metadata = { title: "Project & quotes" };
export const dynamic = "force-dynamic";

type Report = {
  id: string;
  address: string;
  postcode: string;
  project_type: string;
  property_type: string;
  status: string;
  result: { summary?: string; nextSteps?: string[]; property?: { district?: string } } | null;
  created_at: string;
};

type Project = {
  id: string;
  title: string;
  postcode_district: string;
  area_label: string;
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

type Quote = {
  id: string;
  business_name: string;
  professional_type: string;
  fee_pence: number;
  message: string;
  timeframe: string;
  inclusions: string;
  status: string;
  submitted_at: string;
};

const projectLabels: Record<string, string> = {
  hmo: "HMO conversion",
  flats: "Conversion into flats",
  extension: "Extension or loft project",
  land: "Land development",
  other: "Property project"
};

const professionalLabels: Record<string, string> = {
  architect: "Architect",
  builder: "Builder",
  planning_consultant: "Planning consultant",
  structural_engineer: "Structural engineer"
};

const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export default async function ReportProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect(`/login?next=${encodeURIComponent(`/dashboard/reports/${id}`)}`);

  const { data: profile } = await supabase.from("profiles").select("account_type").eq("id", userId).maybeSingle();
  if (profile?.account_type !== "property") redirect("/dashboard");

  const { data: reportData } = await supabase
    .from("feasibility_requests")
    .select("id,address,postcode,project_type,property_type,status,result,created_at")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (!reportData) notFound();
  const report = reportData as Report;

  const { data: projectData } = await supabase
    .from("marketplace_projects")
    .select("id,title,postcode_district,area_label,brief,required_professions,budget_min_pence,budget_max_pence,target_start_date,status,local_priority_until,quote_count,max_quotes,published_at")
    .eq("feasibility_request_id", report.id)
    .maybeSingle();
  const project = projectData as Project | null;

  let quotes: Quote[] = [];
  if (project) {
    const { data } = await supabase
      .from("project_quotes")
      .select("id,business_name,professional_type,fee_pence,message,timeframe,inclusions,status,submitted_at")
      .eq("project_id", project.id)
      .order("submitted_at", { ascending: true });
    quotes = (data ?? []) as Quote[];
  }

  const compactPostcode = report.postcode.replace(/\s+/g, "").toUpperCase();
  const postcodeDistrict = compactPostcode.length > 3 ? compactPostcode.slice(0, -3) : compactPostcode;
  const defaultTitle = `${projectLabels[report.project_type] ?? "Property project"} in ${report.result?.property?.district || postcodeDistrict}`;

  return (
    <main className="project-workspace">
      <section className="project-hero"><div className="shell"><Link className="back-link" href="/dashboard"><ArrowLeft size={17} /> Back to dashboard</Link><p className="eyebrow">Private property workspace</p><h1>{report.address}</h1><p><MapPin size={17} /> {report.postcode} · {projectLabels[report.project_type] ?? report.project_type}</p></div></section>
      <section className="section"><div className="shell project-detail-grid">
        <div className="project-main">
          <article className="report-summary-card"><div className="panel-heading"><div><p className="eyebrow">Saved report</p><h2>Your preliminary snapshot</h2></div><span className="status status-verified">{report.status}</span></div><p>{report.result?.summary ?? "Your feasibility evidence is saved privately in PlotWorthy."}</p>{report.result?.nextSteps?.length ? <ul className="benefit-list">{report.result.nextSteps.map((step) => <li key={step}><CheckCircle2 />{step}</li>)}</ul> : null}</article>

          {!project ? <article className="publish-panel"><div className="panel-heading"><div><p className="eyebrow">Find the right team</p><h2>Invite professionals to quote</h2></div><UsersRound /></div><p>Publish a privacy-safe summary to the PlotWorthy professional network. You choose which disciplines you need, and quoting closes at five responses.</p><ProjectPublishForm reportId={report.id} defaultTitle={defaultTitle} /></article> : <>
            <article className="live-project-card"><div className="live-project-head"><div><span className={`application-status project-status-${project.status}`}>{project.status}</span><h2>{project.title}</h2><p><MapPin size={16} /> {project.area_label} · {project.postcode_district}</p></div><div className="quote-meter"><strong>{project.quote_count}/{project.max_quotes}</strong><span>quotes received</span></div></div><p className="project-brief">{project.brief}</p><div className="project-facts"><span><ShieldCheck /> Full address hidden from professionals</span><span><Clock3 /> Local priority until {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(project.local_priority_until))}</span>{project.target_start_date ? <span><CalendarDays /> Target start {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(project.target_start_date))}</span> : null}</div><div className="tag-row">{project.required_professions.map((type) => <span key={type}>{professionalLabels[type] ?? type}</span>)}</div></article>

            <section className="quotes-section"><div className="panel-heading"><div><p className="eyebrow">Private responses</p><h2>Professional quotes</h2></div><span>{quotes.length} of {project.max_quotes}</span></div>{quotes.length ? <div className="client-quotes">{quotes.map((quote) => <article className="client-quote" key={quote.id}><div className="quote-card-head"><div><p className="eyebrow">{professionalLabels[quote.professional_type] ?? quote.professional_type}</p><h3>{quote.business_name}</h3></div><strong>{money.format(quote.fee_pence / 100)}</strong></div><p>{quote.message}</p><dl><div><dt>Timeframe</dt><dd>{quote.timeframe}</dd></div>{quote.inclusions ? <div><dt>Included</dt><dd>{quote.inclusions}</dd></div> : null}</dl><div className="quote-card-footer"><span className={`application-status quote-status-${quote.status}`}>{quote.status}</span>{["submitted", "shortlisted"].includes(quote.status) ? <div className="button-row">{quote.status === "submitted" ? <form action={respondToQuote.bind(null, quote.id, "shortlisted")}><button className="button button-ghost button-small" type="submit">Shortlist</button></form> : null}<form action={respondToQuote.bind(null, quote.id, "declined")}><button className="button button-ghost button-small" type="submit">Decline</button></form><form action={respondToQuote.bind(null, quote.id, "accepted")}><button className="button button-small" type="submit">Accept quote</button></form></div> : null}</div></article>)}</div> : <div className="empty-state compact"><FileText /><h2>No quotes yet</h2><p>Matched local professionals can now review the summary. You will see each private quote here.</p></div>}</section>
          </>}
        </div>
        <aside className="project-aside"><ShieldCheck /><h2>You stay in control</h2><p>Professionals cannot see your full address, name, email or private report. They see only the project summary you publish.</p><ul><li>Maximum five quotes</li><li>Competitors see the count, not quote prices</li><li>You decide who to shortlist or accept</li></ul></aside>
      </div></section>
    </main>
  );
}
