import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  const requestedNext = params.next;
  const destination = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") && !requestedNext.startsWith("/onboarding")
    ? requestedNext
    : "/dashboard";
  const next = `/onboarding?choose=1&next=${encodeURIComponent(destination)}`;
  const initialError = params.error === "link"
    ? "That sign-in link has expired or has already been used. Request one new link below and open only the newest email."
    : undefined;
  return <section className="page-hero auth-page"><div className="shell"><LoginForm initialError={initialError} next={next} /></div></section>;
}
