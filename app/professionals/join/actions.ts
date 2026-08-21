"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { professionalApplicationSchema } from "@/lib/validation";

export type ApplicationState = {
  success?: string;
  error?: string;
};

function splitList(value: string) {
  return value
    .split(/[\n,;]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30);
}

export async function submitProfessionalApplication(
  _previousState: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  if (!hasSupabaseConfig()) return { error: "Applications are not configured in this preview." };

  try {
    const input = professionalApplicationSchema.parse({
      businessName: formData.get("businessName"),
      discipline: formData.get("discipline"),
      postcodes: formData.get("postcodes"),
      specialisms: formData.get("specialisms"),
      website: formData.get("website"),
      membership: formData.get("membership")
    });
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;
    if (!userId) return { error: "Sign in before submitting your application." };
    const contactEmail = typeof data.claims.email === "string" ? data.claims.email : null;

    const application = {
      user_id: userId,
      contact_email: contactEmail,
      business_name: input.businessName,
      discipline: input.discipline,
      postcodes: splitList(input.postcodes).map((item) => item.toUpperCase()),
      specialisms: splitList(input.specialisms),
      website: input.website || null,
      membership_details: input.membership ? { summary: input.membership } : {},
      status: "submitted" as const,
      updated_at: new Date().toISOString()
    };

    const { data: existing } = await supabase
      .from("professional_applications")
      .select("id")
      .eq("user_id", userId)
      .in("status", ["draft", "submitted"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const mutation = existing
      ? supabase.from("professional_applications").update(application).eq("id", existing.id).eq("user_id", userId)
      : supabase.from("professional_applications").insert(application);
    const { error } = await mutation;
    if (error) throw error;

    revalidatePath("/professionals/join");
    revalidatePath("/dashboard");
    return { success: "Application submitted. We’ll review your details and keep the status in your dashboard." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0]?.message ?? "Check the application details." };
    }
    return { error: error instanceof Error ? error.message : "We could not submit the application." };
  }
}
