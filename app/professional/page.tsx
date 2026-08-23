import Link from "next/link";
import { getProfessionalForUser } from "@/lib/professionalAuth";
import { memberMonthly, gbp } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { pro } = await getProfessionalForUser();
  if (!pro) return null;

  const firm = pro.company || pro.name;
  const districts = 5 + (pro.membership.postcodePacks || 0) * 5;
  const monthly = memberMonthly(pro.membership);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line bg-canvas px-4 py-3 sm:px-8 sm:py-3.5">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted">Professional workspace</p>
          <p className="font-serif text-lg font-medium text-ink">Dashboard</p>
        </div>
        <Link href="/professional/coverage" className="btn-outline btn text-sm">
          {pro.coverage ? `Coverage: ${pro.coverage}` : "Set coverage"}
        </Link>
      </div>

      <div className="max-w-[80rem] p-4 sm:p-8">
        <p className="mb-5 text-sm text-muted">Welcome back, {firm}.</p>

        {/* Live status */}
        <div className="card flex flex-wrap items-center justify-between gap-4 border-sage-200 bg-sage-50/40 p-5">
          <div>
            <p className="flex items-center gap-2 font-serif text-lg text-ink">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sage-500" /> Your listing is live
            </p>
            <p className="mt-1 text-sm text-muted">
              Clients looking for a {pro.discipline.toLowerCase()} in your area can be introduced to you.
            </p>
          </div>
          <Link href="/professional/profile" className="btn-outline text-sm">View your public profile</Link>
        </div>

        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          <Stat label="Coverage" value={`${districts} districts`} />
          <Stat label="Your plan" value={`${gbp(monthly)}/mo`} />
          <Stat label="Status" value="Approved" />
        </div>

        {/* Leads */}
        <div className="mt-10">
          <h2 className="display text-xl">Local project leads</h2>
          <div className="mt-4 rounded-2xl border border-dashed border-line bg-cream/40 px-6 py-10 text-center">
            <p className="text-sm font-medium text-ink">No live leads yet</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted">
              When a client starts a project in your area and shares their brief, it&apos;ll appear
              here — with a defined project, a known property and a clear stage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-5 py-4">
      <div className="font-serif text-2xl text-ink">{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}
