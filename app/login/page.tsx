import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Log in" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  const requestedNext = params.next;
  const destination = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") && !requestedNext.startsWith("/onboarding")
    ? requestedNext
    : "/dashboard";

  if (hasSupabaseConfig()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getClaims();
    if (data?.claims?.sub) redirect(destination);
  }

  const initialError = params.error === "link"
    ? "That sign-in link has expired or has already been used. Request one new link below and open only the newest email."
    : undefined;
  return <section className="page-hero auth-page"><div className="shell"><LoginForm initialError={initialError} next={destination} /></div></section>;
}
