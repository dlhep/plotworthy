import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Building2, Clock3, ExternalLink, Mail, MapPin, ShieldCheck, UsersRound, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { reviewProfessionalApplication } from "@/app/admin/professionals/actions";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Professional approvals" };
export const dynamic = "force-dynamic";

type Application = {
  id: string;
  business_name: string;
  discipline: string;
  contact_email: string | null;
  postcodes: string[];
  specialisms: string[];
  website: string | null;
  membership_details: { summary?: unknown } | null;
  status: "draft" | "submitted" | "reviewing" | "approved" | "declined";
  review_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
};

const disciplineLabels: Record<string, string> = {
  architect: "Architect",
  builder: "Builder",
  planning_consultant: "Planning consultant",
  structural_engineer: "Structural engineer"
};

export default async function ProfessionalApprovalsPage({ searchParams }: { searchParams: Promise<{ updated?: string }> }) {
  if (!hasSupabaseConfig()) redirect("/login?next=%2Fadmin%2Fprofessionals");
  const [{ updated }, supabase] = await Promise.all([searchParams, createSupabaseServerClient()]);
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login?next=%2Fadmin%2Fprofessionals");

  const { data: isAdmin } = await supabase.rpc("is_plotworthy_admin");
  if (!isAdmin) redirect("/dashboard");

  const { data, error } = await supabase
    .from("professional_applications")
    .select("id,business_name,discipline,contact_email,postcodes,specialisms,website,membership_details,status,review_notes,created_at,reviewed_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const applications = (data ?? []) as Application[];
  const awaiting = applications.filter((application) => ["submitted", "reviewing"].includes(application.status)).length;
  const approved = applications.filter((application) => application.status === "approved").length;

  return <main className="admin-workspace"><section className="dashboard-head admin-head"><div className="shell"><div><p className="eyebrow">PlotWorthy administration</p><h1>Professional approvals</h1><p>Review credentials, record your decision and control who can appear publicly or quote for client projects.</p></div><Link className="button button-light" href="/professionals">View public directory</Link></div></section><section className="section"><div className="shell">{updated ? <p className="form-success admin-flash" role="status">Application updated to {updated}.</p> : null}<div className="admin-stat-grid"><article><Clock3 /><strong>{awaiting}</strong><span>Awaiting a decision</span></article><article><BadgeCheck /><strong>{approved}</strong><span>Approved professionals</span></article><article><UsersRound /><strong>{applications.length}</strong><span>Total applications</span></article></div>{applications.length ? <div className="admin-application-list">{applications.map((application) => {
    const membership = typeof application.membership_details?.summary === "string" ? application.membership_details.summary : "Not supplied";
    return <article className="admin-application-card" key={application.id}><div className="admin-application-summary"><div><div className="admin-card-title"><span className={`application-status admin-status-${application.status}`}>{application.status}</span><p className="eyebrow">{disciplineLabels[application.discipline] ?? application.discipline}</p></div><h2>{application.business_name}</h2><div className="admin-contact-row">{application.contact_email ? <a href={`mailto:${application.contact_email}`}><Mail size={15} /> {application.contact_email}</a> : null}{application.website ? <a href={application.website} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Website</a> : null}</div></div><time dateTime={application.created_at}>Applied {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(application.created_at))}</time></div><div className="admin-evidence-grid"><div><span><MapPin size={16} /> Coverage</span><p>{application.postcodes.join(", ") || "Not supplied"}</p></div><div><span><Building2 size={16} /> Memberships</span><p>{membership}</p></div><div className="admin-evidence-wide"><span><ShieldCheck size={16} /> Specialisms</span><div className="tag-row">{application.specialisms.map((specialism) => <span key={specialism}>{specialism}</span>)}</div></div></div><form className="admin-review-form" action={reviewProfessionalApplication}><input type="hidden" name="applicationId" value={application.id} /><label htmlFor={`notes-${application.id}`}>Private review notes<textarea id={`notes-${application.id}`} name="notes" defaultValue={application.review_notes ?? ""} rows={3} maxLength={1200} placeholder="Record checks completed, membership numbers or reasons for the decision." /></label><div className="admin-review-actions"><button className="button button-ghost" type="submit" name="status" value="reviewing"><Clock3 size={17} /> Mark reviewing</button><button className="button button-danger" type="submit" name="status" value="declined"><XCircle size={17} /> Decline</button><button className="button" type="submit" name="status" value="approved"><BadgeCheck size={17} /> Approve & publish</button></div></form></article>;
  })}</div> : <div className="empty-state"><UsersRound /><h2>No applications yet</h2><p>New professional applications will appear here automatically.</p></div>}</div></section></main>;
}
