import Link from "next/link";
import { WorkspaceSidebar } from "@/components/WorkspaceSidebar";
import { getProfessionalForUser } from "@/lib/professionalAuth";

export const metadata = { title: "Professional workspace — PlotWorthy" };
export const dynamic = "force-dynamic";

export default async function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  const { user, pro } = await getProfessionalForUser();

  // Middleware guarantees a signed-in user here. If they aren't an approved
  // professional, show an access notice instead of the workspace.
  if (!pro) {
    return (
      <div className="container-content py-16 sm:py-24">
        <div className="mx-auto max-w-lg text-center">
          <p className="eyebrow justify-center">Professional workspace</p>
          <h1 className="display mt-3 text-3xl">No professional account yet</h1>
          <p className="mt-3 text-muted">
            We couldn&apos;t find an approved professional listing for
            {user?.email ? <> <span className="font-medium text-ink">{user.email}</span></> : " your account"}.
            If you&apos;ve applied, we&apos;ll email you as soon as you&apos;re approved. If your
            approval is under a different email, sign in with that one.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/join" className="btn-primary">Join as a professional</Link>
            <Link href="/brief" className="btn-outline">Go to my dashboard</Link>
          </div>
          <form action="/auth/signout" method="post" className="mt-4">
            <button className="text-sm text-muted hover:text-ink" type="submit">Log out</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      <WorkspaceSidebar name={pro.company || pro.name} discipline={pro.discipline} />
      <div className="min-w-0 flex-1 bg-canvas">{children}</div>
    </div>
  );
}
