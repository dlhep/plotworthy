import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CoverageSelector } from "@/components/coverage-selector";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isCoverageBillingConfigured } from "@/lib/stripe-rest";

export const metadata: Metadata = { title: "Coverage map" };
export const dynamic = "force-dynamic";

export default async function CoveragePage({ searchParams }: { searchParams: Promise<{ saved?: string; billing?: string }> }) {
  const { saved, billing } = await searchParams;
  let coverage = ["B1", "B15", "B16", "B17"];
  let allowance = 5;
  let billingStatus = "none";
  let coveragePackage: string | null = null;
  let cancelAtPeriodEnd = false;
  if (hasSupabaseConfig()) {
    const supabase = await createSupabaseServerClient();
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;
    if (!userId) redirect("/login?next=%2Fprofessional%2Fcoverage");
    const [{ data }, { data: billingAccount }] = await Promise.all([
      supabase.from("professional_public_profiles").select("postcodes").eq("user_id", userId).eq("status", "active").maybeSingle(),
      supabase
        .from("professional_billing_accounts")
        .select("base_postcode_allowance, addon_postcode_allowance, coverage_package, subscription_status, cancel_at_period_end")
        .eq("user_id", userId)
        .maybeSingle()
    ]);
    if (!data) redirect("/professionals/join");
    coverage = data.postcodes ?? [];
    if (billingAccount) {
      allowance = billingAccount.base_postcode_allowance + billingAccount.addon_postcode_allowance;
      billingStatus = billingAccount.subscription_status;
      coveragePackage = billingAccount.coverage_package;
      cancelAtPeriodEnd = billingAccount.cancel_at_period_end;
    }
  }
  return <><div className="workspace-page-heading"><div><p className="workspace-kicker">Project matching</p><h1>Coverage map</h1><p>Control where you receive local-priority project alerts and see the area clearly.</p></div></div><CoverageSelector initialCoverage={coverage} allowance={allowance} saved={saved} billing={billing} billingConfigured={isCoverageBillingConfigured()} billingStatus={billingStatus} coveragePackage={coveragePackage} cancelAtPeriodEnd={cancelAtPeriodEnd} /></>;
}
