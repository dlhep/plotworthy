import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type DeliveryResult = {
  configured: boolean;
  queuedForExpansion: number;
  sent: number;
  failed: number;
};

type NotificationRow = {
  id: string;
  project_id: string;
  professional_user_id: string;
  phase: "local" | "expanded";
  status: "queued" | "failed";
  attempts: number;
};

type ProjectRow = {
  id: string;
  title: string;
  area_label: string;
  postcode_district: string;
  brief: string;
  status: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character] ?? character);
}

export async function dispatchProjectNotifications(limit = 25): Promise<DeliveryResult> {
  const admin = createSupabaseAdminClient();
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (!admin || !resendKey) return { configured: false, queuedForExpansion: 0, sent: 0, failed: 0 };

  const { data: expansionCount } = await admin.rpc("queue_expanded_project_notifications");
  const { data: notificationData, error: notificationError } = await admin
    .from("project_notifications")
    .select("id,project_id,professional_user_id,phase,status,attempts")
    .in("status", ["queued", "failed"])
    .lt("attempts", 5)
    .order("created_at", { ascending: true })
    .limit(Math.max(1, Math.min(limit, 100)));
  if (notificationError) throw notificationError;

  let sent = 0;
  let failed = 0;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.plotworthy.co.uk").replace(/\/$/, "");
  const from = process.env.PROJECT_NOTIFICATION_FROM || "PlotWorthy <projects@plotworthy.co.uk>";

  for (const notification of (notificationData ?? []) as NotificationRow[]) {
    const { data: claimed } = await admin
      .from("project_notifications")
      .update({ status: "sending", attempts: notification.attempts + 1, last_error: null })
      .eq("id", notification.id)
      .eq("status", notification.status)
      .select("id")
      .maybeSingle();
    if (!claimed) continue;

    try {
      const [{ data: project }, { data: professional }] = await Promise.all([
        admin.from("marketplace_projects").select("id,title,area_label,postcode_district,brief,status").eq("id", notification.project_id).single(),
        admin.from("profiles").select("email,full_name").eq("id", notification.professional_user_id).single()
      ]);
      const typedProject = project as ProjectRow | null;
      if (!typedProject || !professional?.email) throw new Error("Notification recipient or project is unavailable.");

      if (typedProject.status !== "live") {
        await admin.from("project_notifications").update({ status: "sent", sent_at: new Date().toISOString(), last_error: "Skipped because project is closed." }).eq("id", notification.id);
        continue;
      }

      const opportunityUrl = `${siteUrl}/opportunities/${typedProject.id}`;
      const greeting = professional.full_name ? `Hello ${escapeHtml(professional.full_name)},` : "Hello,";
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `project-notification-${notification.id}`
        },
        body: JSON.stringify({
          from,
          to: [professional.email],
          subject: `New ${notification.phase === "local" ? "local " : ""}project: ${typedProject.title}`,
          html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#14342d;max-width:620px;margin:auto"><p>${greeting}</p><h1 style="font-family:Georgia,serif">A new PlotWorthy project matches your profile</h1><p><strong>${escapeHtml(typedProject.title)}</strong><br>${escapeHtml(typedProject.area_label)} · ${escapeHtml(typedProject.postcode_district)}</p><p>${escapeHtml(typedProject.brief.slice(0, 500))}</p><p><a href="${opportunityUrl}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#14342d;color:#fff;text-decoration:none;font-weight:bold">Review project and quote</a></p><p style="color:#597169;font-size:13px">The client accepts a maximum of five private quotes. Other professionals can see the response count, but never your price or message.</p></div>`,
          text: `${professional.full_name ? `Hello ${professional.full_name},\n\n` : "Hello,\n\n"}A new PlotWorthy project matches your profile.\n\n${typedProject.title}\n${typedProject.area_label} · ${typedProject.postcode_district}\n\n${typedProject.brief.slice(0, 500)}\n\nReview and quote: ${opportunityUrl}`
        })
      });
      if (!response.ok) throw new Error(`Email provider returned ${response.status}.`);

      await admin.from("project_notifications").update({ status: "sent", sent_at: new Date().toISOString(), last_error: null }).eq("id", notification.id);
      sent += 1;
    } catch (error) {
      await admin.from("project_notifications").update({ status: "failed", last_error: error instanceof Error ? error.message.slice(0, 500) : "Email delivery failed." }).eq("id", notification.id);
      failed += 1;
    }
  }

  return { configured: true, queuedForExpansion: Number(expansionCount ?? 0), sent, failed };
}
