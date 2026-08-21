"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const professionalTypeSchema = z.enum([
  "architect",
  "builder",
  "planning_consultant",
  "structural_engineer"
]);

export async function chooseProfessionalType(formData: FormData) {
  const professionalType = professionalTypeSchema.parse(formData.get("professionalType"));
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({
      account_type: "professional",
      professional_type: professionalType,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId);
  if (error) throw error;

  redirect(`/professionals/join?discipline=${professionalType}`);
}
