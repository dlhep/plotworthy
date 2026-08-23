import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { listApplications } from "@/lib/adminData";
import { AppCard } from "@/components/admin/AppCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Network — PlotWorthy admin" };

const NEXT = "/admin/professionals";

export default async function NetworkPage() {
  if (!isAdmin(cookies().get(ADMIN_COOKIE)?.value)) redirect("/admin/login");

  const { apps, note } = await listApplications();
  const active = apps.filter((a) => a.status === "approved");
  const suspended = apps.filter((a) => a.status === "suspended");

  return (
    <div className="container-content py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-clay-600">
            PlotWorthy admin
          </p>
          <h1 className="display text-3xl">Your vetted network</h1>
          <p className="mt-1 text-sm text-muted">
            The professionals currently live to clients. Suspend anyone to hold them off the network
            without rejecting them.
          </p>
        </div>
        <span className="rounded-full bg-sage-50 px-3 py-1 text-sm font-semibold text-sage-700">
          {active.length} active
        </span>
      </div>

      {note && (
        <p className="mt-6 rounded-xl border border-line bg-cream/60 px-4 py-3 text-sm text-muted">{note}</p>
      )}

      <section className="mt-8">
        <h2 className="display text-xl">Active professionals</h2>
        {active.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No active professionals yet. Approve applications to build the network.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {active.map((a) => (
              <AppCard
                key={a.id}
                a={a}
                next={NEXT}
                actions={[{ decision: "suspended", label: "Suspend", variant: "outline" }]}
              />
            ))}
          </div>
        )}
      </section>

      {suspended.length > 0 && (
        <section className="mt-10">
          <h2 className="display text-xl">Suspended</h2>
          <div className="mt-4 space-y-4">
            {suspended.map((a) => (
              <AppCard
                key={a.id}
                a={a}
                next={NEXT}
                actions={[
                  { decision: "approved", label: "Reinstate", variant: "primary" },
                  { decision: "rejected", label: "Remove", variant: "ghost" },
                ]}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
