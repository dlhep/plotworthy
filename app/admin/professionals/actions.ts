"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { professionalReviewSchema } from "@/lib/validation";

export async function reviewProfessionalApplication(formData: FormData) {
  const input = professionalReviewSchema.parse({
    applicationId: formData.get("applicationId"),
    status: formData.get("status"),
    notes: formData.get("notes")
  });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login?next=%2Fadmin%2Fprofessionals");

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_plotworthy_admin");
  if (adminError || !isAdmin) throw new Error("Administrator access is required.");

  const { error } = await supabase.rpc("review_professional_application", {
    p_application_id: input.applicationId,
    p_status: input.status,
    p_review_notes: input.notes
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/professionals");
  revalidatePath("/professionals");
  revalidatePath("/dashboard");
  redirect(`/admin/professionals?updated=${input.status}`);
}
