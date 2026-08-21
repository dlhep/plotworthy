"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const accountTypeSchema = z.enum(["property", "professional"]);

function safeNext(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/dashboard";
}

export async function chooseAccountType(formData: FormData) {
  const accountType = accountTypeSchema.parse(formData.get("accountType"));
  const requestedNext = safeNext(formData.get("next"));
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect(`/login?next=${encodeURIComponent("/onboarding")}`);

  const { error } = await supabase
    .from("profiles")
    .update({
      account_type: accountType,
      professional_type: null,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId);
  if (error) throw error;

  if (accountType === "professional") {
    redirect(`/onboarding/professional?next=${encodeURIComponent(requestedNext)}`);
  }
  redirect(requestedNext === "/professionals/join" ? "/dashboard" : requestedNext);
}
