import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isAdmin(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.redirect(new URL("/admin/login", req.url), 303);
  }

  const form = await req.formData();
  const id = String(form.get("id") || "");
  const decision = String(form.get("decision") || "");
  if (!id || (decision !== "approved" && decision !== "rejected")) {
    return NextResponse.redirect(new URL("/admin/applications", req.url), 303);
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
      if (decision === "approved") {
        await sendEmail({
          to: data.email,
          subject: "You’re approved on PlotWorthy",
          html: `<p>Hi ${data.name || "there"},</p>
            <p>Good news — your application to join the PlotWorthy vetted network has been approved. You’ll be able to set your coverage and start receiving local project introductions.</p>
            <p>— The PlotWorthy team</p>`,
        });
      } else {
        await sendEmail({
          to: data.email,
          subject: "Update on your PlotWorthy application",
          html: `<p>Hi ${data.name || "there"},</p>
            <p>Thank you for applying to join PlotWorthy. On this occasion we’re not able to add your practice to the network. You’re welcome to get in touch at hello@plotworthy.co.uk if you’d like to discuss.</p>
            <p>— The PlotWorthy team</p>`,
        });
      }
    }
  }

  return NextResponse.redirect(new URL("/admin/applications", req.url), 303);
}
