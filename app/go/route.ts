import { NextResponse } from "next/server";
import { getProfessionalForUser } from "@/lib/professionalAuth";

export const dynamic = "force-dynamic";

// Post-login router: sends approved professionals to their workspace and
// everyone else to their client dashboard (or an explicit `next`).
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const raw = searchParams.get("next") || "";
  const next = raw.startsWith("/") ? raw : "";

  const { user, pro } = await getProfessionalForUser();
  if (!user) return NextResponse.redirect(`${origin}/login`);

  // Default landing routes a pro to the workspace; an explicit non-default
  // destination (e.g. /update-password, /start?...) is honoured for everyone.
  if (pro && (!next || next === "/brief" || next.startsWith("/professional"))) {
    return NextResponse.redirect(`${origin}/professional`);
  }
  return NextResponse.redirect(`${origin}${next || "/brief"}`);
}
