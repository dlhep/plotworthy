import { UpdatePasswordForm } from "@/components/UpdatePasswordForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Set a new password — PlotWorthy" };

export default function UpdatePasswordPage() {
  return (
    <section className="container-content py-16 sm:py-24">
      <UpdatePasswordForm />
    </section>
  );
}
