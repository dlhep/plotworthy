import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  BriefcaseBusiness,
  CircleCheckBig,
  FileSearch,
  MapPin,
  MapPinned,
  MessageSquareQuote,
  Settings2,
  Sparkles,
  UserRoundCheck
} from "lucide-react";
import { redirect } from "next/navigation";
import type { WorkspaceOpportunity } from "@/components/opportunity-browser";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
function opportunityBudget(project: WorkspaceOpportunity) {
  if (project.budget_min_pence !== null && project.budget_max_pence !== null) return `${money.format(project.budget_min_pence / 100)}–${money.format(project.budget_max_pence / 100)}`;
  if (project.budget_min_pence !== null) return `From ${money.format(project.budget_min_pence / 100)}`;
  if (project.budget_max_pence !== null) return `Up to ${money.format(project.budget_max_pence / 100)}`;
  return "Budget not stated";
}

const demo: WorkspaceOpportunity[] = [
  { id: "demo-extension", title: "Rear and side extension to family home", postcode_district: "B17", area_label: "Harborne", project_type: "extension", brief: "Design, planning and building regulations support for a family-home extension.", budget_min_pence: 14000000, budget_max_pence: 19000000, local_priority_until: "2099-08-28T09:00:00Z", quote_count: 2, max_quotes: 5, published_at: "2026-08-21T08:15:00Z", status: "live" },
  { id: "demo-hmo", title: "Six-bedroom HMO feasibility and planning", postcode_district: "B16", area_label: "Edgbaston", project_type: "hmo", brief: "Early feasibility and planning support before purchase.", budget_min_pence: 9000000, budget_max_pence: 13500000, local_priority_until: "2099-08-29T09:00:00Z", quote_count: 1, max_quotes: 5, published_at: "2026-08-20T14:30:00Z", status: "live" }
];

export default async function ProfessionalDashboardPage() {
  if (!hasSupabaseConfig()) return <DashboardContent opportunities={demo} quotes={2} shortlisted={1} completeness={78} coverage={["B1", "B15", "B16", "B17"]} businessName="Hepburn Architects" preview />;
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/login?next=%2Fprofessional%2Fdashboard");
  const [{ data: opportunities }, { count: quotes }, { count: shortlisted }, { data: publicProfile }, { data: application }] = await Promise.all([
    supabase.from("marketplace_projects").select("id,title,postcode_district,area_label,project_type,brief,budget_min_pence,budget_max_pence,local_priority_until,quote_count,max_quotes,published_at,status").order("published_at", { ascending: false }).limit(4),
    supabase.from("project_quotes").select("id", { count: "exact", head: true }).eq("professional_user_id", userId),
    supabase.from("project_quotes").select("id", { count: "exact", head: true }).eq("professional_user_id", userId).in("status", ["shortlisted", "accepted"]),
    supabase.from("professional_public_profiles").select("summary,website,postcodes,specialisms,verification_badges").eq("user_id", userId).eq("status", "active").maybeSingle(),
    supabase.from("professional_applications").select("business_name").eq("user_id", userId).order("updated_at", { ascending: false }).limit(1).maybeSingle()
  ]);
  const fields = publicProfile ? [publicProfile.summary, publicProfile.website, publicProfile.postcodes?.length, publicProfile.specialisms?.length, publicProfile.verification_badges?.length] : [];
  const completeness = publicProfile ? Math.round((fields.filter(Boolean).length / fields.length) * 100) : 35;
  return <DashboardContent opportunities={(opportunities ?? []) as WorkspaceOpportunity[]} quotes={quotes ?? 0} shortlisted={shortlisted ?? 0} completeness={completeness} coverage={publicProfile?.postcodes ?? []} businessName={application?.business_name ?? "Your practice"} />;
}

function DashboardContent({ opportunities, quotes, shortlisted, completeness, coverage, businessName, preview = false }: { opportunities: WorkspaceOpportunity[]; quotes: number; shortlisted: number; completeness: number; coverage: string[]; businessName: string; preview?: boolean }) {
  return <>
    <section className="workspace-welcome-card">
      <div>
        <p className="workspace-kicker">Professional dashboard</p>
        <h1>Welcome back, {businessName}</h1>
        <p>Your clearest route to the right local projects—without chasing unsuitable leads.</p>
        <div className="workspace-welcome-actions">
          <Link className="button" href="/professional/opportunities"><FileSearch /> Find project opportunities</Link>
          <Link className="button button-light" href="/professional/profile">View my profile</Link>
        </div>
      </div>
      <div className="workspace-readiness-card">
        <span className="readiness-icon"><Sparkles /></span>
        <div><strong>Your practice is live</strong><span>Matching across {coverage.length || 0} postcode district{coverage.length === 1 ? "" : "s"}</span></div>
        <BadgeCheck />
      </div>
    </section>
    {preview ? <div className="workspace-preview-banner">Workspace preview — example projects and activity are shown for design review.</div> : null}
    <nav className="workspace-quick-actions" aria-label="Quick actions">
      <Link href="/professional/opportunities"><span><BriefcaseBusiness /></span><div><strong>Find projects</strong><small>Browse matched work</small></div><ArrowRight /></Link>
      <Link href="/professional/coverage"><span><MapPinned /></span><div><strong>Coverage</strong><small>Choose postcode areas</small></div><ArrowRight /></Link>
      <Link href="/professional/profile"><span><UserRoundCheck /></span><div><strong>My profile</strong><small>{completeness}% complete</small></div><ArrowRight /></Link>
      <Link href="/professional/profile#practice-details"><span><Settings2 /></span><div><strong>Settings</strong><small>Manage account details</small></div><ArrowRight /></Link>
    </nav>
    <section className="workspace-stat-grid workspace-stat-grid-compact">
      <article><span className="stat-icon"><BriefcaseBusiness /></span><div><strong>{opportunities.length}</strong><span>New matches</span></div><Link href="/professional/opportunities">View projects</Link></article>
      <article><span className="stat-icon"><MessageSquareQuote /></span><div><strong>{quotes}</strong><span>Quotes submitted</span></div><Link href="/professional/opportunities">Track quotes</Link></article>
      <article><span className="stat-icon"><CircleCheckBig /></span><div><strong>{shortlisted}</strong><span>Shortlisted or won</span></div><span className="stat-subtext">Current activity</span></article>
      <article><span className="stat-icon"><UserRoundCheck /></span><div><strong>{completeness}%</strong><span>Profile complete</span></div><Link href="/professional/profile">Improve profile</Link></article>
    </section>
    <div className="workspace-dashboard-grid workspace-dashboard-primary">
      <section className="workspace-panel dashboard-opportunities-panel">
        <div className="workspace-panel-heading"><div><p className="workspace-kicker">Matched to your practice</p><h2>Latest opportunities</h2><p>Local projects are prioritised before they open to the wider network.</p></div><Link href="/professional/opportunities">View all <ArrowRight /></Link></div>
        <div className="workspace-opportunity-list">{opportunities.map((project) => {
          const placesLeft = Math.max(0, project.max_quotes - project.quote_count);
          return <Link href={`/professional/opportunities/${project.id}`} key={project.id}>
            <span className="project-symbol"><BriefcaseBusiness /></span>
            <div><span className="dashboard-project-label">{project.project_type.replaceAll("_", " ")}</span><strong>{project.title}</strong><span><MapPin /> {project.area_label} · {project.postcode_district}</span></div>
            <div className="opportunity-row-meta"><strong>{opportunityBudget(project)}</strong><span>{placesLeft} of {project.max_quotes} quote places left</span><i><b style={{ width: `${Math.min(100, (project.quote_count / project.max_quotes) * 100)}%` }} /></i></div>
            <ArrowRight />
          </Link>;
        })}{!opportunities.length ? <div className="workspace-empty compact"><BriefcaseBusiness /><h3>No new matches</h3><p>We will notify you when a relevant project is published.</p></div> : null}</div>
      </section>
      <aside className="workspace-side-stack">
        <section className="workspace-panel profile-health"><div className="workspace-panel-heading"><div><p className="workspace-kicker">Profile strength</p><h2>Help clients choose you</h2></div><BadgeCheck /></div><div className="workspace-progress"><span style={{ width: `${completeness}%` }} /></div><p><strong>{completeness}% complete.</strong> A focused summary, evidence and portfolio make your quote easier to trust.</p><Link className="button button-ghost button-wide" href="/professional/profile">Complete my profile</Link></section>
        <section className="workspace-panel dashboard-alert-card" id="updates"><BellRing /><div><p className="workspace-kicker">Project alerts</p><h2>Email notifications on</h2><p>We will alert you when a matching project enters your selected areas.</p></div><Link href="/professional/coverage">Review coverage <ArrowRight /></Link></section>
      </aside>
    </div>
    <section className="workspace-panel workspace-update"><div><p className="workspace-kicker">Fair access</p><h2>Local first, then a wider opportunity</h2><p>Approved professionals in the requested discipline receive seven days of local priority. Projects then open further afield until five quotes are received.</p></div><div className="matching-steps"><span><b>1</b> Local alert</span><span><b>2</b> Wider network</span><span><b>3</b> Maximum 5 quotes</span></div></section>
  </>;
}
