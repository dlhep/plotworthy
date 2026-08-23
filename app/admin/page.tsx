import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { getStats, getRevenue, listApplications, listClients } from "@/lib/adminData";
import { goalLabel } from "@/lib/brief";
import { gbp } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — PlotWorthy admin" };

export default async function AdminDashboard() {
  if (!isAdmin(cookies().get(ADMIN_COOKIE)?.value)) redirect("/admin/login");

  const [stats, rev, { apps }, { clients }] = await Promise.all([
    getStats(),
    getRevenue(),
    listApplications(),
    listClients(),
  ]);

  const recentApps = apps.slice(0, 5);
  const recentClients = clients.slice(0, 5);

  return (
    <div className="container-content py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-clay-600">
            PlotWorthy admin
          </p>
          <h1 className="display text-3xl">Control centre</h1>
          <p className="mt-1 text-sm text-muted">
            Everything happening on PlotWorthy — applications, your vetted network, and client projects.
          </p>
        </div>
      </div>

      {!stats.connected && (
        <p className="mt-6 rounded-xl border border-line bg-cream/60 px-4 py-3 text-sm text-muted">
          The database isn’t connected, so live figures aren’t available. Add the Supabase keys to
          populate this dashboard.
        </p>
      )}

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Applications to review" value={stats.pending} href="/admin/applications" accent={stats.pending > 0} />
        <Stat label="Active professionals" value={stats.approved} href="/admin/professionals" />
        <Stat label="Client accounts" value={stats.clients} href="/admin/clients" />
        <Stat label="Live projects" value={stats.projects} href="/admin/clients" />
      </div>

      {/* Revenue */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/professionals"
          className="rounded-2xl border border-sage-300 bg-sage-50/60 p-5 transition-colors hover:border-sage-400 sm:col-span-1"
        >
          <p className="text-3xl font-semibold text-sage-800">{gbp(rev.mrr)}</p>
          <p className="mt-1 text-sm text-muted">Monthly recurring revenue</p>
          <p className="mt-0.5 text-xs text-muted">
            {gbp(rev.arr)} / year · {rev.members} paying member{rev.members === 1 ? "" : "s"}
          </p>
        </Link>
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-sm text-muted">Base membership</p>
          <p className="mt-1 text-lg font-semibold text-ink">{gbp(rev.base)}<span className="text-sm font-normal text-muted">/mo</span></p>
          <p className="mt-1 text-sm text-muted">
            Add-ons {gbp(rev.postcodePacks + rev.enhanced + rev.website)}/mo
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <MiniStat label="Suspended pros" value={stats.suspended} />
          <MiniStat label="Rejected applications" value={stats.rejected} />
        </div>
      </div>

      {/* Two columns of recent activity */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="display text-xl">Latest applications</h2>
            <Link href="/admin/applications" className="text-sm text-sage-700 hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            {recentApps.length === 0 && (
              <p className="px-5 py-6 text-sm text-muted">No applications yet.</p>
            )}
            {recentApps.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {a.name}
                    {a.company ? <span className="text-muted"> · {a.company}</span> : null}
                  </p>
                  <p className="truncate text-xs text-muted">{a.discipline}</p>
                </div>
                <StatusPill status={a.status} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="display text-xl">Newest clients</h2>
            <Link href="/admin/clients" className="text-sm text-sage-700 hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            {recentClients.length === 0 && (
              <p className="px-5 py-6 text-sm text-muted">No client accounts yet.</p>
            )}
            {recentClients.map((c) => (
              <div key={c.userId} className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{c.email || "—"}</p>
                  <p className="truncate text-xs text-muted">
                    {c.project?.goalId ? goalLabel(c.project.goalId) : "No project yet"}
                    {c.project?.postcode ? ` · ${c.project.postcode}` : ""}
                  </p>
                </div>
                <span className="whitespace-nowrap text-xs text-muted">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-GB") : ""}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: number;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border p-5 transition-colors ${
        accent
          ? "border-clay-200 bg-clay-50/60 hover:border-clay-300"
          : "border-line bg-white hover:border-sage-300"
      }`}
    >
      <p className="text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-muted group-hover:text-ink">{label}</p>
    </Link>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-cream/40 px-4 py-3">
      <span className="text-lg font-semibold text-ink">{value}</span>
      <span className="ml-2 text-sm text-muted">{label}</span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-sage-50 text-sage-700 ring-sage-100",
    pending: "bg-cream text-muted ring-line",
    rejected: "bg-clay-50 text-clay-700 ring-clay-100",
    suspended: "bg-clay-50 text-clay-600 ring-clay-100",
  };
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${map[status] || "bg-cream text-muted ring-line"}`}>
      {status}
    </span>
  );
}
