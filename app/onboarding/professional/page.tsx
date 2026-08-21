import type { Metadata } from "next";
import { Building2, DraftingCompass, Hammer, Landmark } from "lucide-react";
import { redirect } from "next/navigation";
import { chooseProfessionalType } from "@/app/onboarding/professional/actions";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Choose your profession" };
export const dynamic = "force-dynamic";

const professionalTypes = [
  { value: "architect", label: "Architect", description: "Architecture practices and registered architects.", icon: DraftingCompass },
  { value: "builder", label: "Builder", description: "Building contractors and construction businesses.", icon: Hammer },
  { value: "planning_consultant", label: "Planning consultant", description: "Planning advisers and town planning practices.", icon: Landmark },
  { value: "structural_engineer", label: "Structural engineer", description: "Structural engineering practices and consultants.", icon: Building2 }
] as const;

export default async function ProfessionalTypePage() {
  if (!hasSupabaseConfig()) redirect("/login");
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("account_type").eq("id", userId).maybeSingle();
  if (profile?.account_type !== "professional") redirect("/onboarding?choose=1");

  return (
    <section className="onboarding-page">
      <div className="shell narrow">
        <div className="onboarding-heading">
          <p className="eyebrow">Professional account · Step 2 of 2</p>
          <h1>What type of professional are you?</h1>
          <p>Choose one to tailor your application and professional workspace.</p>
        </div>
        <div className="professional-choice-grid">
          {professionalTypes.map(({ value, label, description, icon: Icon }) => (
            <form action={chooseProfessionalType} className="professional-choice" key={value}>
              <input type="hidden" name="professionalType" value={value} />
              <span className="choice-icon"><Icon /></span>
              <h2>{label}</h2>
              <p>{description}</p>
              <button className="button button-wide" type="submit">Choose {label.toLowerCase()}</button>
            </form>
          ))}
        </div>
      </div>
    </section>
  );
}
