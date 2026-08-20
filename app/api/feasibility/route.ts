import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { buildPreliminaryResult, lookupPostcode } from "@/lib/feasibility";
import { feasibilitySchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const input = feasibilitySchema.parse(await request.json());
    const postcode = await lookupPostcode(input.postcode);
    const result = buildPreliminaryResult(input, postcode);

    return NextResponse.json(result, {
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
