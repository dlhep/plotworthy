import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const emailSchema = z.object({ email: z.email("Enter a valid email address") });

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.json({ error: "Sign-in is not configured in this preview." }, { status: 503 });
  }

  try {
    const { email } = emailSchema.parse(await request.json());
    const requestOrigin = new URL(request.url).origin;
    const origin = process.env.NODE_ENV === "development"
      ? requestOrigin
      : process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.plotworthy.co.uk";
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/auth/callback?next=/dashboard` }
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "We could not send the sign-in link." },
      { status: 400 }
    );
  }
}
