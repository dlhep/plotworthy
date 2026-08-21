import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CoverageSelector } from "@/components/coverage-selector";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Coverage map" };
export const dynamic = "force-dynamic";

export default async function CoveragePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  let coverage = ["B1", "B15", "B16", "B17"];
  if (hasSupabaseConfig()) {
    const supabase = await createSupabaseServerClient();
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;
    if (!userId) redirect("/login?next=%2Fprofessional%2Fcoverage");
    const { data } = await supabase.from("professional_public_profiles").select("postcodes").eq("user_id", userId).eq("status", "active").maybeSingle();
    if (!data) redirect("/professionals/join");
    coverage = data.postcodes ?? [];
  }
  return <><div className="workspace-page-heading"><div><p className="workspace-kicker">Project matching</p><h1>Coverage map</h1><p>Control where you receive local-priority project alerts and see the area clearly.</p></div></div><CoverageSelector initialCoverage={coverage} saved={saved} /></>;
}
