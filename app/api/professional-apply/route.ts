import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail, ADMIN_EMAIL } from "@/lib/email";

export const dynamic = "force-dynamic";

function esc(s: unknown) {
  return String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
}

export async function POST(req: Request) {
  let data: Record<string, string> = {};
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }

  const { name, company, email, phone, discipline, coverage, accreditations, insurance, website, about } = data;

  if (!name?.trim() || !email?.trim() || !discipline?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Please provide at least your name, email and discipline." },
      { status: 400 }
    );
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  let stored = false;
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from("professional_applications").insert({
      name: name.trim(),
      company: company?.trim() || null,
      email: email.trim(),
      phone: phone?.trim() || null,
      discipline: discipline.trim(),
      coverage: coverage?.trim() || null,
      accreditations: accreditations?.trim() || null,
      insurance: insurance?.trim() || null,
      website: website?.trim() || null,
      about: about?.trim() || null,
    });
    if (error) console.error("Supabase insert error:", error);
    else stored = true;
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  const reviewLine = site ? `<p><a href="${site}/admin/applications">Review in the admin area →</a></p>` : "";
  const html = `
    <h2>New professional application</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      ${[
        ["Name", name],
        ["Company", company],
        ["Email", email],
        ["Phone", phone],
        ["Discipline", discipline],
        ["Coverage", coverage],
        ["Accreditations", accreditations],
        ["Insurance", insurance],
        ["Website", website],
        ["About", about],
      ]
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#786f62;vertical-align:top">${k}</td><td style="padding:4px 0">${esc(v) || "—"}</td></tr>`
        )
        .join("")}
    </table>
    ${reviewLine}
    <p style="color:#786f62;font-size:12px">${stored ? "Saved to the applications table." : "Not saved to a database (Supabase not connected) — this email is the record."}</p>
  `;

  const emailed = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New professional application — ${name} (${discipline})`,
    html,
    replyTo: email,
  });

  if (!stored && !emailed) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Thanks — but the application system isn’t fully connected yet, so we couldn’t submit this. Please email hello@plotworthy.co.uk directly for now.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
