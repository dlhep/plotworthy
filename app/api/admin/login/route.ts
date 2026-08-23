import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, adminConfigured } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin isn’t configured yet. Set ADMIN_PASSWORD in your environment." },
      { status: 503 }
    );
  }
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
