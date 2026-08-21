import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FileCheck2 } from "lucide-react";
import { redirect } from "next/navigation";
import { ProfessionalApplicationForm } from "@/components/professional-application-form";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Join as a professional" };
export const dynamic = "force-dynamic";

type ExistingApplication = {
  business_name: string;
  discipline: string;
  status: "draft" | "submitted" | "reviewing" | "approved" | "declined";
  updated_at: string;
};

export default async function JoinPage() {
  let signedIn = false;
  let existing: ExistingApplication | null = null;
  let professionalType: string | null = null;

  if (hasSupabaseConfig()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;
    signedIn = Boolean(userId);
    if (userId) {
      const [profileResult, applicationResult] = await Promise.all([
        supabase.from("profiles").select("account_type,professional_type").eq("id", userId).maybeSingle(),
        supabase.from("professional_applications").select("business_name,discipline,status,updated_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle()
      ]);
      if (!profileResult.data?.account_type) redirect("/onboarding?choose=1&next=%2Fprofessionals%2Fjoin");
      if (profileResult.data.account_type === "property") redirect("/dashboard");
      if (!profileResult.data.professional_type) redirect("/onboarding/professional");
      professionalType = profileResult.data.professional_type;
      existing = applicationResult.data as ExistingApplication | null;
    }
  }

  const lockedApplication = existing && ["submitted", "reviewing", "approved"].includes(existing.status) ? existing : null;

  return <><section className="page-hero"><div className="shell narrow"><p className="eyebrow">Founding professional network</p><h1>Better-context enquiries, matched to your work.</h1><p>We’re inviting architects, builders, structural engineers and planning consultants to help shape profiles, verification and lead controls before the marketplace opens widely.</p></div></section><section className="section"><div className="shell join-grid"><div><h2>Designed around fit, not volume</h2><ul className="benefit-list"><li><CheckCircle2 /> Set genuine postcode coverage</li><li><CheckCircle2 /> Select project types and specialisms</li><li><CheckCircle2 /> Show evidence behind verification</li><li><CheckCircle2 /> Control availability and contact</li><li><CheckCircle2 /> Receive a structured property brief</li></ul></div><aside className="join-card"><FileCheck2 /><p className="eyebrow">Early access</p><h2>{existing ? `${existing.business_name}: ${existing.status}` : "Complete your professional application"}</h2>{lockedApplication ? <div className="application-status-card"><p>Your {lockedApplication.discipline.replaceAll("_", " ")} application is <strong>{lockedApplication.status}</strong>. {lockedApplication.status === "approved" ? "Your public profile is live and project opportunities are unlocked." : "Project opportunities remain locked while PlotWorthy completes its review."}</p><small>Last updated {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(lockedApplication.updated_at))}.</small>{lockedApplication.status === "approved" ? <Link className="button button-ghost button-wide" href="/professionals/profile">Edit public profile</Link> : null}</div> : <><p>Add your business, coverage and specialisms. Submitting does not create a paid subscription.</p><ProfessionalApplicationForm signedIn={signedIn} initialDiscipline={professionalType} /></>}<small>Marketplace fees and verification criteria will be shown before any commitment.</small></aside></div></section></>;
}
