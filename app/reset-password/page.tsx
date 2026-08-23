import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata = { title: "Reset your password — PlotWorthy" };

export default function ResetPasswordPage() {
  return (
    <section className="container-content py-16 sm:py-24">
      <ResetPasswordForm />
    </section>
  );
}
