"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publicProfessionalProfileSchema } from "@/lib/validation";

function splitList(value: string) {
  return value
    .split(/[\n,;]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30);
}

export async function updateProfessionalPublicProfile(formData: FormData) {
  const input = publicProfessionalProfileSchema.parse({
    website: formData.get("website"),
    summary: formData.get("summary"),
    postcodes: formData.get("postcodes"),
    specialisms: formData.get("specialisms")
  });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/login?next=%2Fprofessionals%2Fprofile");

  const { data, error } = await supabase
    .from("professional_public_profiles")
    .update({
      website: input.website || null,
      summary: input.summary,
      postcodes: splitList(input.postcodes).map((postcode) => postcode.toUpperCase()),
      specialisms: splitList(input.specialisms),
      updated_at: new Date().toISOString()
    })
    .eq("user_id", userId)
    .eq("status", "active")
    .select("slug")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("An approved public profile could not be found.");

  revalidatePath("/professionals");
  revalidatePath(`/professionals/${data.slug}`);
  revalidatePath("/professional/profile");
  redirect("/professional/profile?saved=1");
}
