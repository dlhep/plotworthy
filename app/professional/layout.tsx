import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfessionalWorkspace } from "@/components/professional-workspace";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: { default: "Professional workspace", template: "%s — PlotWorthy" } };
export const dynamic = "force-dynamic";

const disciplineLabels: Record<string, string> = {
  architect: "Architect",
  builder: "Builder",
  planning_consultant: "Planning consultant",
  structural_engineer: "Structural engineer"
};

export default async function ProfessionalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!hasSupabaseConfig()) {
    return <ProfessionalWorkspace businessName="Hepburn Architects" discipline="Architect" status="approved">{children}</ProfessionalWorkspace>;
  }

  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/login?next=%2Fprofessional%2Fdashboard");

  const [{ data: profile }, { data: application }] = await Promise.all([
    supabase.from("profiles").select("account_type,professional_type").eq("id", userId).maybeSingle(),
    supabase.from("professional_applications").select("business_name,discipline,status").eq("user_id", userId).order("updated_at", { ascending: false }).limit(1).maybeSingle()
  ]);

  if (profile?.account_type !== "professional") redirect("/dashboard");
  if (!profile.professional_type) redirect("/onboarding/professional");

  return (
    <ProfessionalWorkspace
      businessName={application?.business_name ?? "Professional account"}
      discipline={disciplineLabels[application?.discipline ?? profile.professional_type] ?? "Professional"}
      status={application?.status ?? "incomplete"}
    >
      {children}
    </ProfessionalWorkspace>
  );
}
