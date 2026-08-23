import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["approved", "rejected", "suspended", "pending"]);

function safeNext(raw: string): string {
  // Only allow returning to an internal admin path.
  return raw.startsWith("/admin") ? raw : "/admin/applications";
}

export async function POST(req: Request) {
  if (!isAdmin(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.redirect(new URL("/admin/login", req.url), 303);
  }

  const form = await req.formData();
  const id = String(form.get("id") || "");
  const decision = String(form.get("decision") || "");
  const next = safeNext(String(form.get("next") || "/admin/applications"));

  if (!id || !ALLOWED.has(decision)) {
    return NextResponse.redirect(new URL(next, req.url), 303);
  }

  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from("professional_applications")
      .update({ status: decision, decided_at: new Date().toISOString(), decided_by: "admin" })
      .eq("id", id)
      .select("name, email")
      .single();

    if (!error && data?.email) {
      const name = data.name || "there";
      if (decision === "approved") {
        await sendEmail({
          to: data.email,
          subject: "You’re approved on PlotWorthy",
          html: `<p>Hi ${name},</p>
            <p>Good news — your practice is live on the PlotWorthy vetted network. You’ll be able to set your coverage and start receiving local project introductions.</p>
            <p>— The PlotWorthy team</p>`,
        });
      } else if (decision === "suspended") {
        await sendEmail({
          to: data.email,
          subject: "Your PlotWorthy listing is paused",
          html: `<p>Hi ${name},</p>
            <p>We’ve temporarily paused your PlotWorthy listing, so you won’t receive new introductions for now. If this is unexpected, reply to this email or contact hello@plotworthy.co.uk and we’ll sort it out.</p>
            <p>— The PlotWorthy team</p>`,
        });
      } else if (decision === "rejected") {
        await sendEmail({
          to: data.email,
          subject: "Update on your PlotWorthy application",
          html: `<p>Hi ${name},</p>
            <p>Thank you for your interest in PlotWorthy. On this occasion we’re not able to add your practice to the network. You’re welcome to get in touch at hello@plotworthy.co.uk if you’d like to discuss.</p>
            <p>— The PlotWorthy team</p>`,
        });
      }
      // "pending" (re-open for review) sends no email.
    }
  }

  return NextResponse.redirect(new URL(next, req.url), 303);
}
