import { Resend } from "resend";

// Sends email via Resend when configured; otherwise a no-op that returns false.
// FROM defaults to Resend's shared sender until you verify plotworthy.co.uk,
// after which set EMAIL_FROM to "PlotWorthy <hello@plotworthy.co.uk>".
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@plotworthy.co.uk";
const FROM = process.env.EMAIL_FROM || "PlotWorthy <onboarding@resend.dev>";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    if (error) {
      console.error("Resend error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Email send failed:", e);
    return false;
  }
}

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY);
