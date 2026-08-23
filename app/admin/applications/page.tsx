import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { listApplications } from "@/lib/adminData";
import { AppCard } from "@/components/admin/AppCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Applications — PlotWorthy admin" };

const NEXT = "/admin/applications";

export default async function ApplicationsPage() {
  if (!isAdmin(cookies().get(ADMIN_COOKIE)?.value)) redirect("/admin/login");

  const { apps, note } = await listApplications();
  const pending = apps.filter((a) => a.status === "pending");
  const decided = apps.filter((a) => a.status !== "pending");

  return (
    <div className="container-content py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-clay-600">
            PlotWorthy admin
          </p>
          <h1 className="display text-3xl">Professional applications</h1>
        </div>
        <span className="rounded-full bg-sage-50 px-3 py-1 text-sm font-semibold text-sage-700">
          {pending.length} pending
        </span>
      </div>

      {note && (
        <p className="mt-6 rounded-xl border border-line bg-cream/60 px-4 py-3 text-sm text-muted">{note}</p>
      )}

      {pending.length > 0 && (
        <section className="mt-8">
          <h2 className="display text-xl">Awaiting review</h2>
          <div className="mt-4 space-y-4">
            {pending.map((a) => (
              <AppCard
                key={a.id}
                a={a}
                next={NEXT}
                actions={[
                  { decision: "approved", label: "Approve", variant: "primary" },
                  { decision: "rejected", label: "Reject", variant: "outline" },
                ]}
              />
            ))}
          </div>
        </section>
      )}

      {decided.length > 0 && (
        <section className="mt-10">
          <h2 className="display text-xl">Decided</h2>
          <div className="mt-4 space-y-4">
            {decided.map((a) => (
              <AppCard
                key={a.id}
                a={a}
                next={NEXT}
                deletable
                actions={
                  a.status === "rejected"
                    ? [{ decision: "approved", label: "Approve after all", variant: "outline" }]
                    : []
                }
              />
            ))}
          </div>
        </section>
      )}

      {apps.length === 0 && !note && <p className="mt-8 text-sm text-muted">No applications yet.</p>}
    </div>
  );
}
