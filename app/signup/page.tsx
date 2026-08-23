import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Create your account — PlotWorthy" };
export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="container-content py-16 sm:py-24">
      <Suspense fallback={<div className="h-64" />}>
        <AuthForm mode="signup" />
      </Suspense>
    </div>
  );
}
