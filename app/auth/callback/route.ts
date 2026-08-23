import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Handles the email-confirmation / recovery redirect. Supports both link
// formats: the PKCE `code` exchange and the `token_hash` + `type` OTP verify,
// so the confirm-email link works whatever template Supabase sends.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") || "/brief";

  const supabase = createClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}/go?next=${encodeURIComponent(next)}`);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/go?next=${encodeURIComponent(next)}`);
  }

  // Verification may have succeeded server-side even if we couldn't open a
  // session here (e.g. link opened on another device) — send them to log in.
  return NextResponse.redirect(`${origin}/login?verified=1&next=${encodeURIComponent(next)}`);
}
