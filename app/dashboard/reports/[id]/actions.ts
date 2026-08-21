"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { ZodError } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { dispatchProjectNotifications } from "@/lib/project-notifications";
import { publishProjectSchema, quoteResponseSchema } from "@/lib/validation";

export type ProjectActionState = {
  success?: string;
  error?: string;
  projectId?: string;
};

function poundsToPence(value?: number) {
  return value === undefined ? null : Math.round(value * 100);
}

export async function publishProject(
  _previousState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  try {
    const input = publishProjectSchema.parse({
      feasibilityRequestId: formData.get("feasibilityRequestId"),
      title: formData.get("title"),
      brief: formData.get("brief"),
      requiredProfessions: formData.getAll("requiredProfessions"),
      budgetMin: formData.get("budgetMin"),
      budgetMax: formData.get("budgetMax"),
      targetStartDate: formData.get("targetStartDate")
    });
    const supabase = await createSupabaseServerClient();
    const { data: claims } = await supabase.auth.getClaims();
    if (!claims?.claims?.sub) return { error: "Sign in before publishing this project." };

    const { data, error } = await supabase.rpc("publish_marketplace_project", {
      p_feasibility_request_id: input.feasibilityRequestId,
      p_title: input.title,
      p_brief: input.brief,
      p_required_professions: input.requiredProfessions,
      p_budget_min_pence: poundsToPence(input.budgetMin),
      p_budget_max_pence: poundsToPence(input.budgetMax),
      p_target_start_date: input.targetStartDate ?? null
    });
    if (error) throw error;

    const project = Array.isArray(data) ? data[0] : data;
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/reports/${input.feasibilityRequestId}`);
    revalidatePath("/opportunities");
    after(() => dispatchProjectNotifications(10).catch(() => undefined));
    return {
      success: "Your project is live. Nearby matching professionals can now review it and up to five can quote.",
      projectId: project?.id
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues[0]?.message ?? "Check the project details." };
    }
    return { error: error instanceof Error ? error.message : "The project could not be published." };
  }
}

export async function respondToQuote(quoteId: string, status: string, _formData: FormData) {
  void _formData;
  const input = quoteResponseSchema.parse({ quoteId, status });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) throw new Error("Sign in before responding to a quote.");

  const { data, error } = await supabase.rpc("respond_to_project_quote", {
    p_quote_id: input.quoteId,
    p_status: input.status
  });
  if (error) throw error;

  const quote = Array.isArray(data) ? data[0] : data;
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reports/[id]", "page");
  if (quote?.project_id) revalidatePath(`/opportunities/${quote.project_id}`);
}
