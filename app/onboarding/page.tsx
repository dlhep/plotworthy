import type { Metadata } from "next";
import { BriefcaseBusiness, Building2, CheckCircle2, House } from "lucide-react";
import { redirect } from "next/navigation";
import { chooseAccountType } from "@/app/onboarding/actions";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Choose your PlotWorthy account" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ choose?: string; next?: string }> }) {
  if (!hasSupabaseConfig()) redirect("/login");
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login?next=%2Fonboarding");

  const params = await searchParams;
  const requestedNext = params.next;
  const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/dashboard";
  if (next.startsWith("/admin/")) {
    const { data: isAdmin } = await supabase.rpc("is_plotworthy_admin");
    if (isAdmin) redirect(next);
  }

  const { data: profile } = await supabase.from("profiles").select("account_type,professional_type").eq("id", userId).maybeSingle();
  const forceChoice = params.choose === "1";
  if (!forceChoice && profile?.account_type === "property") redirect(next === "/professionals/join" ? "/dashboard" : next);
  if (!forceChoice && profile?.account_type === "professional") {
    redirect(profile.professional_type ? "/professionals/join" : "/onboarding/professional");
  }

  return <section className="onboarding-page"><div className="shell narrow"><div className="onboarding-heading"><p className="eyebrow">Choose your PlotWorthy workspace</p><h1>Are you a client or a professional?</h1><p>This first choice keeps your dashboard and membership information relevant. You can change it later.</p></div><div className="account-choice-grid"><form action={chooseAccountType} className="account-choice"><input type="hidden" name="accountType" value="property" /><input type="hidden" name="next" value={next} /><span className="choice-icon"><House /></span><p className="eyebrow">Client workspace</p><h2>Property owner or developer</h2><p>For homeowners, landlords, investors and developers assessing a property or planning a project.</p><ul><li><CheckCircle2 /> Save property checks and evidence</li><li><CheckCircle2 /> Keep reports in one private workspace</li><li><CheckCircle2 /> Find and contact suitable professionals</li></ul><div className="membership-note"><strong>Client access: Free</strong><span>You will not see professional membership options.</span></div><button className="button button-wide" type="submit">I’m a client <Building2 size={18} /></button></form><form action={chooseAccountType} className="account-choice account-choice-dark"><input type="hidden" name="accountType" value="professional" /><input type="hidden" name="next" value={next} /><span className="choice-icon"><BriefcaseBusiness /></span><p className="eyebrow">Professional workspace</p><h2>Property professional</h2><p>For practices and businesses that want a verified profile and relevant project enquiries.</p><ul><li><CheckCircle2 /> Choose your professional discipline next</li><li><CheckCircle2 /> Add coverage, specialisms and memberships</li><li><CheckCircle2 /> Apply before any paid commitment</li></ul><div className="membership-note"><strong>Professional access</strong><span>You will only see professional application and membership information.</span></div><button className="button button-light button-wide" type="submit">I’m a professional <BriefcaseBusiness size={18} /></button></form></div></div></section>;
}
