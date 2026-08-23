import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { listApplications } from "@/lib/adminData";
import { AppCard } from "@/components/admin/AppCard";
import { MembershipEditor } from "@/components/admin/MembershipEditor";
import { CoverageAdmin } from "@/components/admin/CoverageAdmin";
import { revenueBreakdown, gbp } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const metadata = { title: "Network — PlotWorthy admin" };

const NEXT = "/admin/professionals";

export default async function NetworkPage() {
  if (!isAdmin(cookies().get(ADMIN_COOKIE)?.value)) redirect("/admin/login");

  const { apps, note } = await listApplications();
  const active = apps.filter((a) => a.status === "approved");
  const suspended = apps.filter((a) => a.status === "suspended");
  const rev = revenueBreakdown(active.map((a) => a.membership));

  return (
    <div className="container-content py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-clay-600">
            PlotWorthy admin
          </p>
          <h1 className="display text-3xl">Your vetted network</h1>
          <p className="mt-1 text-sm text-muted">
            The professionals currently live to clients. Set each member’s plan to track revenue;
            suspend anyone to hold them off the network without rejecting them.
          </p>
        </div>
        <span className="rounded-full bg-sage-50 px-3 py-1 text-sm font-semibold text-sage-700">
          {active.length} active
        </span>
      </div>

      {note && (
        <p className="mt-6 rounded-xl border border-line bg-cream/60 px-4 py-3 text-sm text-muted">{note}</p>
      )}

      {/* Revenue summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RevCard label="Monthly recurring revenue" value={gbp(rev.mrr)} primary sub={`${gbp(rev.arr)} / year`} />
        <RevCard label="Membership base" value={gbp(rev.base)} sub={`${rev.members} × £39`} />
        <RevCard label="Add-ons" value={gbp(rev.postcodePacks + rev.enhanced + rev.website)} sub="postcode · enhanced · website" />
        <RevCard label="Paying members" value={String(rev.members)} sub="active professionals" />
      </div>

      <section className="mt-10">
        <h2 className="display text-xl">Active professionals</h2>
        {active.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No active professionals yet. Approve applications to build the network.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {active.map((a) => (
              <div key={a.id}>
                <AppCard
                  a={a}
                  next={NEXT}
                  deletable
                  actions={[{ decision: "suspended", label: "Suspend", variant: "outline" }]}
                />
                <MembershipEditor app={a} next={NEXT} />
                <CoverageAdmin app={a} next={NEXT} />
              </div>
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
                deletable
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

function RevCard({
  label,
  value,
  sub,
  primary,
}: {
  label: string;
  value: string;
  sub?: string;
  primary?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        primary ? "border-sage-300 bg-sage-50/60" : "border-line bg-white"
      }`}
    >
      <p className={`text-2xl font-semibold ${primary ? "text-sage-800" : "text-ink"}`}>{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </div>
  );
}
