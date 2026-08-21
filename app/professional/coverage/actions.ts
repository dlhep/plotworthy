"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const codePattern = /^[A-Z]{1,2}[0-9][0-9A-Z]?$/;

export async function updateCoverage(formData: FormData) {
  let values: unknown = [];
  try { values = JSON.parse(String(formData.get("postcodes") ?? "[]")); } catch { throw new Error("Coverage could not be read."); }
  if (!Array.isArray(values)) throw new Error("Coverage could not be read.");
  const postcodes = Array.from(new Set(values.map((value) => String(value).toUpperCase().replace(/\s/g, "")).filter((value) => codePattern.test(value)))).slice(0, 30);
  if (!postcodes.length) throw new Error("Choose at least one postcode district.");
  if (!hasSupabaseConfig()) redirect("/professional/coverage?saved=preview");
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login?next=%2Fprofessional%2Fcoverage");
  const { error } = await supabase.rpc("update_professional_coverage", { p_postcodes: postcodes });
  if (error) throw new Error(error.message);
  revalidatePath("/professional/coverage");
  revalidatePath("/professional/dashboard");
  revalidatePath("/professional/opportunities");
  redirect("/professional/coverage?saved=1");
}
