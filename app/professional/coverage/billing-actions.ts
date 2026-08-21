"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { coveragePlans, isCoveragePlanKey } from "@/lib/coverage-plans";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isCoverageBillingConfigured, stripePost } from "@/lib/stripe-rest";

type CheckoutSession = { id: string; url: string | null };
type PortalSession = { url: string };

function applicationUrl() {
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

async function getProfessionalAccount() {
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  const email = typeof claims?.claims?.email === "string" ? claims.claims.email : undefined;
  if (!userId) redirect("/login?next=%2Fprofessional%2Fcoverage");

  const { data: profile } = await supabase
    .from("professional_public_profiles")
    .select("user_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  if (!profile) redirect("/professionals/join");

  const { data: billing } = await supabase
    .from("professional_billing_accounts")
    .select("stripe_customer_id, stripe_subscription_id, subscription_status")
    .eq("user_id", userId)
    .maybeSingle();

  return { userId, email, billing };
}

export async function startCoverageCheckout(formData: FormData) {
  if (!isCoverageBillingConfigured()) redirect("/professional/coverage?billing=unavailable");
  const packageKey = String(formData.get("package") ?? "");
  if (!isCoveragePlanKey(packageKey)) redirect("/professional/coverage?billing=invalid");

  const { userId, email, billing } = await getProfessionalAccount();
  if (billing?.stripe_customer_id && ["active", "trialing", "past_due"].includes(billing.subscription_status)) {
    redirect("/professional/coverage?billing=manage");
  }

  const plan = coveragePlans[packageKey];
  const priceId = process.env[plan.priceEnv]?.trim();
  if (!priceId) redirect("/professional/coverage?billing=unavailable");
  const baseUrl = applicationUrl();

  try {
    const session = await stripePost<CheckoutSession>("/checkout/sessions", {
      mode: "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": 1,
      success_url: `${baseUrl}/professional/coverage?billing=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/professional/coverage?billing=cancelled`,
      customer: billing?.stripe_customer_id ?? undefined,
      customer_email: billing?.stripe_customer_id ? undefined : email,
      client_reference_id: userId,
      "metadata[user_id]": userId,
      "metadata[coverage_package]": packageKey,
      "metadata[postcode_slots]": plan.slots,
      "subscription_data[metadata][user_id]": userId,
      "subscription_data[metadata][coverage_package]": packageKey,
      "subscription_data[metadata][postcode_slots]": plan.slots,
      allow_promotion_codes: true
    });
    if (!session.url) redirect("/professional/coverage?billing=error");
    redirect(session.url);
  } catch (error) {
    unstable_rethrow(error);
    redirect("/professional/coverage?billing=error");
  }
}

export async function openCoverageBillingPortal() {
  if (!isCoverageBillingConfigured()) redirect("/professional/coverage?billing=unavailable");
  const { billing } = await getProfessionalAccount();
  if (!billing?.stripe_customer_id) redirect("/professional/coverage?billing=missing");

  try {
    const session = await stripePost<PortalSession>("/billing_portal/sessions", {
      customer: billing.stripe_customer_id,
      return_url: `${applicationUrl()}/professional/coverage`
    });
    redirect(session.url);
  } catch (error) {
    unstable_rethrow(error);
    redirect("/professional/coverage?billing=error");
  }
}
