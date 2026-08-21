import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { buildPreliminaryResult, lookupPostcode } from "@/lib/feasibility";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { feasibilitySchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const input = feasibilitySchema.parse(await request.json());
    const postcode = await lookupPostcode(input.postcode);
    const result = buildPreliminaryResult(input, postcode);
    let saved = false;

    if (hasSupabaseConfig()) {
      const supabase = await createSupabaseServerClient();
      const { data } = await supabase.auth.getClaims();
      const userId = data?.claims?.sub;

      if (userId) {
        const { error: saveError } = await supabase.from("feasibility_requests").insert({
          id: result.requestId,
          user_id: userId,
          address: result.property.address,
          postcode: result.property.postcode.replace(/\s+/g, "").toUpperCase(),
          project_type: input.projectType,
          property_type: input.propertyType,
          inputs: input,
          status: "ready",
          result,
          source_snapshot: result.evidence
        });

        saved = !saveError;
      }
    }

    return NextResponse.json({ ...result, saved }, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Check the details and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "The check could not be completed." },
      { status: 422 }
    );
  }
}
