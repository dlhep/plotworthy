import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, FileText, Plus, ShieldCheck, UserRoundCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

type ReportRow = {
  id: string;
  address: string;
  postcode: string;
  project_type: string;
  status: string;
  created_at: string;
};

type ApplicationRow = {
  business_name: string;
  discipline: string;
  status: string;
  updated_at: string;
};

const projectLabels: Record<string, string> = {
  hmo: "HMO conversion",
  flats: "Conversion into flats",
  extension: "Extension or loft",
  land: "Land development",
  other: "Property project"
};

export default async function DashboardPage() {
  if (!hasSupabaseConfig()) return <Dashboard preview reports={[]} accountType="property" />;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("account_type,professional_type").eq("id", userId).maybeSingle();
  if (!profile?.account_type) redirect("/onboarding?choose=1&next=%2Fdashboard");
  if (profile.account_type === "professional" && !profile.professional_type) redirect("/onboarding/professional");
  if (profile.account_type === "professional") redirect("/professional/dashboard");
  const accountType = "property" as const;

  const [reportResult, applicationResult, activityResult, adminResult] = await Promise.all([
    supabase.from("feasibility_requests").select("id,address,postcode,project_type,status,created_at", { count: "exact" }).eq("user_id", userId).order("created_at", { ascending: false }).limit(8),
    supabase.from("professional_applications").select("business_name,discipline,status,updated_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("project_quotes").select("id", { count: "exact", head: true }),
    supabase.rpc("is_plotworthy_admin")
  ]);

  return <Dashboard accountType={accountType} reports={(reportResult.data ?? []) as ReportRow[]} application={applicationResult.data as ApplicationRow | null} counts={{ reports: reportResult.count ?? 0, applications: applicationResult.data ? 1 : 0, activity: activityResult.count ?? 0 }} isAdmin={Boolean(adminResult.data)} dataIssue={Boolean(reportResult.error || applicationResult.error || activityResult.error || adminResult.error)} />;
}

function Dashboard({ accountType, preview = false, reports, application = null, counts = { reports: 0, applications: 0, activity: 0 }, isAdmin = false, dataIssue = false }: { accountType: "property" | "professional"; preview?: boolean; reports: ReportRow[]; application?: ApplicationRow | null; counts?: { reports: number; applications: number; activity: number }; isAdmin?: boolean; dataIssue?: boolean }) {
  const isPropertyAccount = accountType === "property";
  const approved = application?.status === "approved";
  return <><section className="dashboard-head"><div className="shell"><div><p className="eyebrow">{isPropertyAccount ? "Property owner & developer workspace" : "Professional workspace"}</p><h1>{isPropertyAccount ? "Property decisions, kept in one place." : "Relevant projects, without the race to the bottom."}</h1><p>{preview ? "Account data will appear here once Supabase is configured for this environment." : isPropertyAccount ? "Your free workspace for property checks, saved evidence and private professional quotes." : "Manage your profile and respond to projects matched to your discipline and coverage."}</p></div><Link className="button" href={isPropertyAccount ? "/check" : approved ? "/opportunities" : "/professionals/join"}>{isPropertyAccount ? <><Plus size={18} /> New property check</> : approved ? <><BriefcaseBusiness size={18} /> Browse opportunities</> : <>View application</>}</Link></div></section><section className="section">{isAdmin ? <div className="shell admin-dashboard-link"><ShieldCheck /><div><p className="eyebrow">Administrator controls</p><h2>Review professional applications</h2><p>Approve, decline and publish professional profiles from the protected admin workspace.</p></div><Link className="button" href="/admin/professionals">Open approvals</Link></div> : null}<div className="shell stat-grid"><article><FileText /><strong>{isPropertyAccount ? counts.reports : approved ? counts.activity : 0}</strong><span>{isPropertyAccount ? "Saved reports" : "Visible opportunities"}</span></article><article><BriefcaseBusiness /><strong>{isPropertyAccount ? "Free" : counts.applications}</strong><span>{isPropertyAccount ? "Client workspace" : "Professional application"}</span></article><article><UserRoundCheck /><strong>{isPropertyAccount ? counts.activity : approved ? "Live" : application?.status ?? "Not started"}</strong><span>{isPropertyAccount ? "Quotes received" : "Approval status"}</span></article></div>{dataIssue ? <div className="shell dashboard-notice">Some account data could not be loaded. Your saved records have not been changed.</div> : null}<div className="shell dashboard-layout"><section className="records-panel">{isPropertyAccount ? <><div className="panel-heading"><div><p className="eyebrow">Your evidence</p><h2>Recent property reports</h2></div><Link href="/check">Run another check</Link></div>{reports.length ? <div className="record-list">{reports.map((report) => <Link className="record-item" href={`/dashboard/reports/${report.id}`} key={report.id}><div><h3>{report.address}</h3><p>{report.postcode} · {projectLabels[report.project_type] ?? report.project_type}</p></div><div className="record-meta"><span className={`status status-${report.status === "ready" ? "verified" : "indicative"}`}>{report.status}</span><time dateTime={report.created_at}>{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(report.created_at))}</time></div></Link>)}</div> : <div className="empty-state compact"><FileText /><h2>Your next property will appear here</h2><p>Run a preliminary check while signed in and PlotWorthy will keep the resulting evidence snapshot in this private workspace.</p><Link className="button button-ghost" href="/check">Check a property</Link></div>}</> : <><div className="panel-heading"><div><p className="eyebrow">Project marketplace</p><h2>Opportunities for your practice</h2></div>{approved ? <Link href="/opportunities">View all</Link> : null}</div><div className="professional-dashboard-intro"><BriefcaseBusiness /><h3>{approved ? `${counts.activity} matched project${counts.activity === 1 ? "" : "s"}` : application ? `Application ${application.status}` : "Add your coverage to start matching"}</h3><p>{approved ? "Projects are filtered by your discipline and postcode coverage for the first seven days, then matching briefs can open further afield." : application ? "Project access remains locked until a PlotWorthy administrator approves and publishes your professional profile." : "Complete your professional application so PlotWorthy can review your credentials and match relevant projects."}</p><Link className="button button-ghost" href={approved ? "/opportunities" : "/professionals/join"}>{approved ? "Browse projects" : application ? "View application" : "Complete professional profile"}</Link></div></>}</section><aside className="application-panel">{isPropertyAccount ? <><p className="eyebrow">Your workspace</p><h2>Free property account</h2><span className="application-status status-free">No monthly fee</span><p>Save reports, publish a privacy-safe brief and compare up to five private quotes from relevant professionals.</p><Link className="button button-ghost button-wide" href="/check">Start a project</Link></> : <><p className="eyebrow">Professional profile</p><h2>{application ? application.business_name : "Complete your application"}</h2>{application ? <><span className="application-status">{application.status}</span><p>{approved ? `Your approved ${application.discipline.replaceAll("_", " ")} profile is live and controls which opportunities you can see.` : "Your application is awaiting an administrator decision. Opportunities remain locked until approval."}</p><Link className="button button-ghost button-wide" href={approved ? "/professionals/profile" : "/professionals/join"}>{approved ? "Edit public profile" : "View application"}</Link></> : <><p>Add your discipline, postcode coverage and specialisms to apply for the professional network.</p><Link className="button button-ghost button-wide" href="/professionals/join">Complete application</Link></>}</>}</aside></div></section></>;
}
