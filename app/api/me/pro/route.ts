import { NextResponse } from "next/server";
import { getProfessionalForUser } from "@/lib/professionalAuth";

export const dynamic = "force-dynamic";

// Lightweight check used by the site nav to decide whether to show the
// professional "My workspace" button. Returns whether the current user is
// signed in and whether they're an approved professional.
export async function GET() {
  const { user, pro } = await getProfessionalForUser();
  return NextResponse.json({ signedIn: Boolean(user), pro: Boolean(pro) });
}
