import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, Clock3, MapPin } from "lucide-react";
import { redirect } from "next/navigation";
import { OpportunityBrowser, type WorkspaceOpportunity } from "@/components/opportunity-browser";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Project opportunities" };
export const dynamic = "force-dynamic";

const demo: WorkspaceOpportunity[] = [
  { id: "demo-extension", title: "Rear and side extension to family home", postcode_district: "B17", area_label: "Harborne, Birmingham", project_type: "extension", brief: "The owner wants to create an open-plan kitchen and family room with a first-floor side extension. They need measured survey, design options, planning advice and building regulations drawings.", budget_min_pence: 14000000, budget_max_pence: 19000000, local_priority_until: "2099-08-28T09:00:00Z", quote_count: 2, max_quotes: 5, published_at: "2026-08-21T08:15:00Z" },
  { id: "demo-flats", title: "Convert Victorian property into three flats", postcode_district: "B29", area_label: "Selly Oak, Birmingham", project_type: "flats", brief: "Feasibility and full planning support needed for conversion of a large two-storey house into three self-contained apartments, including access, refuse and amenity advice.", budget_min_pence: 22000000, budget_max_pence: 30000000, local_priority_until: "2026-08-20T09:00:00Z", quote_count: 4, max_quotes: 5, published_at: "2026-08-13T11:00:00Z" },
  { id: "demo-hmo", title: "Six-bedroom HMO feasibility and planning", postcode_district: "B16", area_label: "Edgbaston, Birmingham", project_type: "hmo", brief: "Client is considering an HMO conversion and needs early planning, layout and fire-strategy coordination before committing to purchase.", budget_min_pence: 9000000, budget_max_pence: 13500000, local_priority_until: "2099-08-29T09:00:00Z", quote_count: 1, max_quotes: 5, published_at: "2026-08-20T14:30:00Z" }
];

export default async function ProfessionalOpportunitiesPage() {
  if (!hasSupabaseConfig()) return <OpportunityContent opportunities={demo} preview />;
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/login?next=%2Fprofessional%2Fopportunities");
  const { data: application } = await supabase.from("professional_applications").select("business_name,postcodes,status").eq("user_id", userId).order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (!application) return <OpportunityGate type="missing" />;
  if (application.status !== "approved") return <OpportunityGate type="pending" status={application.status} />;
  const { data } = await supabase.from("marketplace_projects").select("id,title,postcode_district,area_label,project_type,brief,budget_min_pence,budget_max_pence,local_priority_until,quote_count,max_quotes,published_at").order("published_at", { ascending: false }).limit(50);
  return <OpportunityContent opportunities={(data ?? []) as WorkspaceOpportunity[]} coverage={application.postcodes?.join(", ")} />;
}

function OpportunityContent({ opportunities, coverage, preview = false }: { opportunities: WorkspaceOpportunity[]; coverage?: string; preview?: boolean }) {
  return <><div className="workspace-page-heading"><div><p className="workspace-kicker">Project marketplace</p><h1>Opportunities</h1><p>Review relevant client briefs and response levels before deciding whether to quote.</p></div><Link className="button button-ghost" href="/professional/coverage"><MapPin /> Edit coverage</Link></div>{preview ? <div className="workspace-preview-banner">Workspace preview — example projects are shown until this environment is connected to Supabase.</div> : coverage ? <div className="workspace-coverage-note"><MapPin /><span>Matching your discipline and <strong>{coverage}</strong>. Local professionals receive priority for seven days.</span></div> : null}{opportunities.length ? <OpportunityBrowser opportunities={opportunities} /> : <div className="workspace-panel workspace-empty"><BriefcaseBusiness /><h2>No matching projects right now</h2><p>We will email you when a suitable project enters your selected coverage.</p></div>}</>;
}

function OpportunityGate({ type, status }: { type: "missing" | "pending"; status?: string }) {
  return <div className="workspace-panel workspace-gate">{type === "missing" ? <BriefcaseBusiness /> : <Clock3 />}<div><p className="workspace-kicker">Professional access</p><h1>{type === "missing" ? "Complete your practice profile" : `Application ${status ?? "pending"}`}</h1><p>{type === "missing" ? "Add your discipline and coverage before PlotWorthy can match projects accurately." : "Your opportunity feed unlocks as soon as PlotWorthy approves and publishes your profile."}</p></div><Link className="button" href="/professionals/join">{type === "missing" ? "Complete application" : "View application"}</Link></div>;
}
