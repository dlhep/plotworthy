import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, CircleCheckBig, MapPin, MessageSquareQuote, UserRoundCheck } from "lucide-react";
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
  { id: "demo-extension", title: "Rear and side extension to family home", postcode_district: "B17", area_label: "Harborne", project_type: "extension", brief: "Design, planning and building regulations support for a family-home extension.", budget_min_pence: 14000000, budget_max_pence: 19000000, local_priority_until: "2099-08-28T09:00:00Z", quote_count: 2, max_quotes: 5, published_at: "2026-08-21T08:15:00Z" },
  { id: "demo-hmo", title: "Six-bedroom HMO feasibility and planning", postcode_district: "B16", area_label: "Edgbaston", project_type: "hmo", brief: "Early feasibility and planning support before purchase.", budget_min_pence: 9000000, budget_max_pence: 13500000, local_priority_until: "2099-08-29T09:00:00Z", quote_count: 1, max_quotes: 5, published_at: "2026-08-20T14:30:00Z" }
];

export default async function ProfessionalDashboardPage() {
  if (!hasSupabaseConfig()) return <DashboardContent opportunities={demo} quotes={2} shortlisted={1} completeness={78} coverage={["B1", "B15", "B16", "B17"]} preview />;
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/login?next=%2Fprofessional%2Fdashboard");
  const [{ data: opportunities }, { count: quotes }, { count: shortlisted }, { data: publicProfile }] = await Promise.all([
    supabase.from("marketplace_projects").select("id,title,postcode_district,area_label,project_type,brief,budget_min_pence,budget_max_pence,local_priority_until,quote_count,max_quotes,published_at").order("published_at", { ascending: false }).limit(3),
    supabase.from("project_quotes").select("id", { count: "exact", head: true }).eq("professional_user_id", userId),
    supabase.from("project_quotes").select("id", { count: "exact", head: true }).eq("professional_user_id", userId).in("status", ["shortlisted", "accepted"]),
    supabase.from("professional_public_profiles").select("summary,website,postcodes,specialisms,verification_badges").eq("user_id", userId).eq("status", "active").maybeSingle()
  ]);
  const fields = publicProfile ? [publicProfile.summary, publicProfile.website, publicProfile.postcodes?.length, publicProfile.specialisms?.length, publicProfile.verification_badges?.length] : [];
  const completeness = publicProfile ? Math.round((fields.filter(Boolean).length / fields.length) * 100) : 35;
  return <DashboardContent opportunities={(opportunities ?? []) as WorkspaceOpportunity[]} quotes={quotes ?? 0} shortlisted={shortlisted ?? 0} completeness={completeness} coverage={publicProfile?.postcodes ?? []} />;
}

function DashboardContent({ opportunities, quotes, shortlisted, completeness, coverage, preview = false }: { opportunities: WorkspaceOpportunity[]; quotes: number; shortlisted: number; completeness: number; coverage: string[]; preview?: boolean }) {
  return <><div className="workspace-page-heading"><div><p className="workspace-kicker">Good morning</p><h1>Your professional dashboard</h1><p>See what needs attention and move quickly on the right projects.</p></div><Link className="button" href="/professional/opportunities">Browse opportunities <ArrowRight /></Link></div>{preview ? <div className="workspace-preview-banner">Workspace preview — example projects and activity are shown for design review.</div> : null}<section className="workspace-stat-grid"><article><span className="stat-icon"><BriefcaseBusiness /></span><div><strong>{opportunities.length}</strong><span>New matches</span></div><Link href="/professional/opportunities">View projects</Link></article><article><span className="stat-icon"><MessageSquareQuote /></span><div><strong>{quotes}</strong><span>Quotes submitted</span></div><Link href="/professional/opportunities">Track quotes</Link></article><article><span className="stat-icon"><CircleCheckBig /></span><div><strong>{shortlisted}</strong><span>Shortlisted or won</span></div><span className="stat-subtext">Keep responding</span></article><article><span className="stat-icon"><UserRoundCheck /></span><div><strong>{completeness}%</strong><span>Profile complete</span></div><Link href="/professional/profile">Improve profile</Link></article></section><div className="workspace-dashboard-grid"><section className="workspace-panel"><div className="workspace-panel-heading"><div><p className="workspace-kicker">Matched projects</p><h2>Latest opportunities</h2></div><Link href="/professional/opportunities">View all <ArrowRight /></Link></div><div className="workspace-opportunity-list">{opportunities.map((project) => <Link href={`/professional/opportunities/${project.id}`} key={project.id}><span className="project-symbol"><BriefcaseBusiness /></span><div><strong>{project.title}</strong><span><MapPin /> {project.area_label} · {project.postcode_district}</span></div><div className="opportunity-row-meta"><strong>{opportunityBudget(project)}</strong><span>{project.quote_count}/{project.max_quotes} quotes</span></div><ArrowRight /></Link>)}{!opportunities.length ? <div className="workspace-empty compact"><BriefcaseBusiness /><h3>No new matches</h3><p>We will notify you when a relevant project is published.</p></div> : null}</div></section><aside className="workspace-side-stack"><section className="workspace-panel profile-health"><div className="workspace-panel-heading"><div><p className="workspace-kicker">Public profile</p><h2>Stand out locally</h2></div><BadgeCheck /></div><div className="workspace-progress"><span style={{ width: `${completeness}%` }} /></div><p><strong>{completeness}% complete.</strong> Add focused specialisms and a strong summary to help clients compare confidently.</p><Link className="button button-ghost button-wide" href="/professional/profile">Review profile</Link></section><section className="workspace-panel coverage-card"><MapPin /><div><p className="workspace-kicker">Lead coverage</p><h2>{coverage.length} postcode district{coverage.length === 1 ? "" : "s"}</h2><p>{coverage.length ? coverage.join(", ") : "Choose the areas where you want to receive project alerts."}</p></div><Link href="/professional/coverage">Edit map <ArrowRight /></Link></section></aside></div><section className="workspace-panel workspace-update" id="updates"><div><p className="workspace-kicker">How matching works</p><h2>Local first, then a wider opportunity</h2><p>Projects are shown to approved professionals in the requested discipline and local postcode coverage for seven days. They then open to matching professionals further afield until five quotes are received.</p></div><div className="matching-steps"><span><b>1</b> Local alert</span><span><b>2</b> Wider network</span><span><b>3</b> Maximum 5 quotes</span></div></section></>;
}
