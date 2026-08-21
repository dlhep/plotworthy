import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const stripeApiBase = "https://api.stripe.com/v1";

export function isCoverageBillingConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
    process.env.STRIPE_WEBHOOK_SECRET?.trim() &&
    process.env.STRIPE_COVERAGE_SINGLE_PRICE_ID?.trim() &&
    process.env.STRIPE_COVERAGE_LOCAL_PRICE_ID?.trim() &&
    process.env.STRIPE_COVERAGE_REGIONAL_PRICE_ID?.trim()
  );
}

export async function stripePost<T>(path: string, values: Record<string, string | number | boolean | undefined>) {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) throw new Error("Stripe is not configured.");

  const body = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined) body.set(key, String(value));
  });

  const response = await fetch(`${stripeApiBase}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body,
    cache: "no-store"
  });
  const payload = await response.json() as T & { error?: { message?: string } };
  if (!response.ok) throw new Error(payload.error?.message ?? "Stripe request failed.");
  return payload;
}

export function verifyStripeSignature(payload: string, signatureHeader: string | null) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret || !signatureHeader) return false;

  const parts = signatureHeader.split(",").map((part) => part.split("=", 2));
  const timestamp = parts.find(([key]) => key === "t")?.[1];
  const signatures = parts.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || !signatures.length) return false;
  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds) || Math.abs(Date.now() / 1000 - timestampSeconds) > 300) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`, "utf8").digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return signatures.some((signature) => {
    try {
      const actualBuffer = Buffer.from(signature, "hex");
      return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
    } catch {
      return false;
    }
  });
}
