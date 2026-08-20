import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return <section className="page-hero auth-page"><div className="shell"><LoginForm /></div></section>;
}
