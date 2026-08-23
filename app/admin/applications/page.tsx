import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Applications — PlotWorthy admin" };

type App = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  discipline: string;
  coverage: string | null;
  accreditations: string | null;
  insurance: string | null;
  website: string | null;
  about: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default async function ApplicationsPage() {
  if (!isAdmin(cookies().get(ADMIN_COOKIE)?.value)) redirect("/admin/login");

  const sb = getSupabaseAdmin();
  let apps: App[] = [];
  let note = "";
  if (!sb) {
    note =
      "Supabase isn’t connected yet, so applications aren’t stored here — they’re emailed to hello@plotworthy.co.uk. Add the database keys to manage them on this page.";
  } else {
    const { data, error } = await sb
      .from("professional_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) note = `Couldn’t load applications: ${error.message}`;
    else apps = (data as App[]) || [];
  }

  const pending = apps.filter((a) => a.status === "pending");
  const decided = apps.filter((a) => a.status !== "pending");

  return (
    <div className="container-content py-12">
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
              <AppCard key={a.id} a={a} showActions />
            ))}
          </div>
        </section>
      )}

      {decided.length > 0 && (
        <section className="mt-10">
          <h2 className="display text-xl">Decided</h2>
          <div className="mt-4 space-y-4">
            {decided.map((a) => (
              <AppCard key={a.id} a={a} />
            ))}
          </div>
        </section>
      )}

      {sb && apps.length === 0 && (
        <p className="mt-8 text-sm text-muted">No applications yet.</p>
      )}
    </div>
  );
}

function AppCard({ a, showActions }: { a: App; showActions?: boolean }) {
  const badge =
    a.status === "approved"
      ? "bg-sage-50 text-sage-700"
      : a.status === "rejected"
      ? "bg-clay-50 text-clay-700"
      : "bg-cream text-muted";
  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-serif text-lg text-ink">
            {a.name} {a.company ? <span className="text-muted">· {a.company}</span> : null}
          </p>
          <p className="text-sm text-muted">
            {a.discipline}
            {a.coverage ? ` · covers ${a.coverage}` : ""}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge}`}>{a.status}</span>
      </div>
      <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
        <Row k="Email" v={a.email} />
        <Row k="Phone" v={a.phone} />
        <Row k="Accreditations" v={a.accreditations} />
        <Row k="Insurance" v={a.insurance} />
        <Row k="Website" v={a.website} />
        <Row k="Applied" v={new Date(a.created_at).toLocaleDateString("en-GB")} />
      </dl>
      {a.about && <p className="mt-3 text-sm text-ink/85">{a.about}</p>}

      {showActions && (
        <div className="mt-4 flex gap-2">
          <form action="/api/admin/decision" method="post">
            <input type="hidden" name="id" value={a.id} />
            <input type="hidden" name="decision" value="approved" />
            <button className="btn-primary btn text-sm">Approve</button>
          </form>
          <form action="/api/admin/decision" method="post">
            <input type="hidden" name="id" value={a.id} />
            <input type="hidden" name="decision" value="rejected" />
            <button className="btn-outline btn text-sm">Reject</button>
          </form>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string | null }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted">{k}:</dt>
      <dd className="text-ink/85">{v || "—"}</dd>
    </div>
  );
}
