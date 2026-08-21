import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { OpportunityBrowser, type WorkspaceOpportunity } from "@/components/opportunity-browser";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Project opportunities" };
export const dynamic = "force-dynamic";

const demo: WorkspaceOpportunity[] = [
  { id: "demo-extension", title: "Rear and side extension to family home", postcode_district: "B17", area_label: "Harborne, Birmingham", project_type: "extension", brief: "The owner wants to create an open-plan kitchen and family room with a first-floor side extension. They need measured survey, design options, planning advice and building regulations drawings.", budget_min_pence: 14000000, budget_max_pence: 19000000, local_priority_until: "2099-08-28T09:00:00Z", quote_count: 2, max_quotes: 5, published_at: "2026-08-21T08:15:00Z", status: "live" },
  { id: "demo-flats", title: "Convert Victorian property into three flats", postcode_district: "B29", area_label: "Selly Oak, Birmingham", project_type: "flats", brief: "Feasibility and full planning support needed for conversion of a large two-storey house into three self-contained apartments, including access, refuse and amenity advice.", budget_min_pence: 22000000, budget_max_pence: 30000000, local_priority_until: "2026-08-20T09:00:00Z", quote_count: 4, max_quotes: 5, published_at: "2026-08-13T11:00:00Z", status: "live", own_quote_status: "submitted" },
  { id: "demo-hmo", title: "Six-bedroom HMO feasibility and planning", postcode_district: "B16", area_label: "Edgbaston, Birmingham", project_type: "hmo", brief: "Client is considering an HMO conversion and needs early planning, layout and fire-strategy coordination before committing to purchase.", budget_min_pence: 9000000, budget_max_pence: 13500000, local_priority_until: "2099-08-29T09:00:00Z", quote_count: 1, max_quotes: 5, published_at: "2026-08-20T14:30:00Z", status: "live" },
  { id: "demo-closed", title: "Planning package for loft conversion", postcode_district: "B30", area_label: "Bournville, Birmingham", project_type: "extension", brief: "The homeowner requested a planning and technical drawing package for a roof conversion. The project has now received its full allocation of responses.", budget_min_pence: 5500000, budget_max_pence: 8000000, local_priority_until: "2026-08-12T09:00:00Z", quote_count: 5, max_quotes: 5, published_at: "2026-08-08T10:00:00Z", status: "closed" }
];

function requestTimestamp() {
  return Date.now();
}

export default async function ProfessionalOpportunitiesPage() {
  const now = requestTimestamp();
  if (!hasSupabaseConfig()) return <OpportunityContent opportunities={demo} now={now} preview />;
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/login?next=%2Fprofessional%2Fopportunities");
  const { data: application } = await supabase.from("professional_applications").select("business_name,postcodes,status").eq("user_id", userId).order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (!application) return <OpportunityGate type="missing" />;
  if (application.status !== "approved") return <OpportunityGate type="pending" status={application.status} />;
  const [{ data: projects }, { data: ownQuotes }] = await Promise.all([
    supabase.from("marketplace_projects").select("id,title,postcode_district,area_label,project_type,brief,budget_min_pence,budget_max_pence,local_priority_until,quote_count,max_quotes,published_at,status").order("published_at", { ascending: false }).limit(50),
    supabase.from("project_quotes").select("project_id,status").eq("professional_user_id", userId)
  ]);
  const quoteStatusByProject = new Map((ownQuotes ?? []).map((quote) => [quote.project_id, quote.status]));
  const opportunities = (projects ?? []).map((project) => ({ ...project, own_quote_status: quoteStatusByProject.get(project.id) ?? null })) as WorkspaceOpportunity[];
  return <OpportunityContent opportunities={opportunities} coverage={application.postcodes?.join(", ")} now={now} />;
}

function OpportunityContent({ opportunities, now, coverage, preview = false }: { opportunities: WorkspaceOpportunity[]; now: number; coverage?: string; preview?: boolean }) {
  return <><div className="workspace-page-heading opportunity-page-heading"><div><p className="workspace-kicker">Project marketplace</p><h1>Find your next project</h1><p>Clear client briefs, visible competition and a five-quote limit help you focus on work that fits your practice.</p></div><Link className="button button-ghost" href="/professional/coverage"><MapPin /> Edit my areas</Link></div>{preview ? <div className="workspace-preview-banner">Workspace preview — example projects are shown until this environment is connected to Supabase.</div> : coverage ? <div className="workspace-coverage-note"><MapPin /><span>Showing projects matched to your discipline and <strong>{coverage}</strong>. Local professionals receive priority for seven days.</span></div> : null}<div className="opportunity-trust-strip"><ShieldCheck /><div><strong>Fair access by design</strong><span>Every opportunity accepts no more than five private quotes. Prices are never shown to competing professionals.</span></div></div>{opportunities.length ? <OpportunityBrowser opportunities={opportunities} now={now} /> : <div className="workspace-panel workspace-empty"><BriefcaseBusiness /><h2>No matching projects right now</h2><p>We will email you when a suitable project enters your selected coverage.</p></div>}</>;
}

function OpportunityGate({ type, status }: { type: "missing" | "pending"; status?: string }) {
  return <div className="workspace-panel workspace-gate">{type === "missing" ? <BriefcaseBusiness /> : <Clock3 />}<div><p className="workspace-kicker">Professional access</p><h1>{type === "missing" ? "Complete your practice profile" : `Application ${status ?? "pending"}`}</h1><p>{type === "missing" ? "Add your discipline and coverage before PlotWorthy can match projects accurately." : "Your opportunity feed unlocks as soon as PlotWorthy approves and publishes your profile."}</p></div><Link className="button" href="/professionals/join">{type === "missing" ? "Complete application" : "View application"}</Link></div>;
}
