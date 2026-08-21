"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { projectQuoteSchema } from "@/lib/validation";

export type QuoteActionState = { success?: string; error?: string };

export async function submitQuote(
  _previousState: QuoteActionState,
  formData: FormData
): Promise<QuoteActionState> {
  try {
    const input = projectQuoteSchema.parse({
      projectId: formData.get("projectId"),
      fee: formData.get("fee"),
      message: formData.get("message"),
      timeframe: formData.get("timeframe"),
      inclusions: formData.get("inclusions")
    });
    const supabase = await createSupabaseServerClient();
    const { data: claims } = await supabase.auth.getClaims();
    if (!claims?.claims?.sub) return { error: "Sign in before submitting a quote." };

    const { error } = await supabase.rpc("submit_project_quote", {
      p_project_id: input.projectId,
      p_fee_pence: Math.round(input.fee * 100),
      p_message: input.message,
      p_timeframe: input.timeframe,
      p_inclusions: input.inclusions
    });
    if (error) throw error;

    revalidatePath("/professional/opportunities");
    revalidatePath(`/professional/opportunities/${input.projectId}`);
    revalidatePath("/professional/dashboard");
    return { success: "Quote submitted. The client can now review it in their private workspace." };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0]?.message ?? "Check the quote details." };
    }
    return { error: error instanceof Error ? error.message : "The quote could not be submitted." };
  }
}
