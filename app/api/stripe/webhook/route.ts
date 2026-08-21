import { NextResponse } from "next/server";
import { coveragePlans, type CoveragePlanKey } from "@/lib/coverage-plans";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyStripeSignature } from "@/lib/stripe-rest";

export const runtime = "nodejs";

type StripeObject = {
  id?: string;
  customer?: string | { id?: string } | null;
  subscription?: string | { id?: string } | null;
  status?: string;
  cancel_at_period_end?: boolean;
  current_period_end?: number;
  client_reference_id?: string | null;
  metadata?: Record<string, string>;
  items?: { data?: Array<{ quantity?: number | null; current_period_end?: number; price?: { id?: string } }> };
};
type StripeEvent = { id: string; type: string; data: { object: StripeObject } };

function objectId(value: StripeObject["customer"] | StripeObject["subscription"]) {
  if (typeof value === "string") return value;
  return value?.id ?? null;
}

function planFromSubscription(subscription: StripeObject) {
  const item = subscription.items?.data?.[0];
  const priceId = item?.price?.id;
  const plan = (Object.entries(coveragePlans) as Array<[CoveragePlanKey, (typeof coveragePlans)[CoveragePlanKey]]>)
    .find(([, candidate]) => process.env[candidate.priceEnv]?.trim() === priceId);
  if (plan) return { key: plan[0], slots: plan[1].slots * Math.max(1, item?.quantity ?? 1) };

  const metadataKey = subscription.metadata?.coverage_package;
  if (metadataKey && metadataKey in coveragePlans) {
    const key = metadataKey as CoveragePlanKey;
    return { key, slots: coveragePlans[key].slots };
  }
  return { key: null, slots: 0 };
}

async function resolveUserId(object: StripeObject) {
  const metadataUserId = object.metadata?.user_id ?? object.client_reference_id;
  if (metadataUserId) return metadataUserId;
  const customerId = objectId(object.customer);
  const admin = createSupabaseAdminClient();
  if (!customerId || !admin) return null;
  const { data } = await admin
    .from("professional_billing_accounts")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return data?.user_id ?? null;
}

async function upsertCheckout(object: StripeObject) {
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("Supabase admin is not configured for Stripe webhooks.");
  const userId = await resolveUserId(object);
  if (!userId) throw new Error("Stripe checkout is missing a PlotWorthy user reference.");
  const { error } = await admin.from("professional_billing_accounts").upsert({
    user_id: userId,
    stripe_customer_id: objectId(object.customer),
    stripe_subscription_id: objectId(object.subscription)
  }, { onConflict: "user_id" });
  if (error) throw new Error("Stripe checkout could not be recorded.");
}

async function upsertSubscription(object: StripeObject, deleted = false) {
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("Supabase admin is not configured for Stripe webhooks.");
  const userId = await resolveUserId(object);
  if (!userId || !object.id) throw new Error("Stripe subscription is missing a PlotWorthy reference.");

  const status = deleted ? "canceled" : object.status ?? "incomplete";
  const activeStatuses = new Set(["active", "trialing", "past_due"]);
  const plan = planFromSubscription(object);
  const itemPeriodEnd = object.items?.data?.[0]?.current_period_end;
  const periodEnd = itemPeriodEnd ?? object.current_period_end;
  const { error } = await admin.from("professional_billing_accounts").upsert({
    user_id: userId,
    stripe_customer_id: objectId(object.customer),
    stripe_subscription_id: object.id,
    coverage_package: activeStatuses.has(status) ? plan.key : null,
    addon_postcode_allowance: activeStatuses.has(status) ? Math.min(plan.slots, 25) : 0,
    subscription_status: status,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    cancel_at_period_end: Boolean(object.cancel_at_period_end)
  }, { onConflict: "user_id" });
  if (error) throw new Error("Stripe subscription could not be recorded.");
}

export async function POST(request: Request) {
  const body = await request.text();
  if (!verifyStripeSignature(body, request.headers.get("stripe-signature"))) {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(body) as StripeEvent;
  } catch {
    return NextResponse.json({ error: "Invalid event payload." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") await upsertCheckout(event.data.object);
    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      await upsertSubscription(event.data.object);
    }
    if (event.type === "customer.subscription.deleted") await upsertSubscription(event.data.object, true);
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
