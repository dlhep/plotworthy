import type { Application } from "@/lib/adminData";

const BADGE: Record<string, string> = {
  approved: "bg-sage-50 text-sage-700 ring-sage-100",
  pending: "bg-cream text-muted ring-line",
  rejected: "bg-clay-50 text-clay-700 ring-clay-100",
  suspended: "bg-clay-50 text-clay-600 ring-clay-100",
};

type Action = { decision: string; label: string; variant: "primary" | "outline" | "ghost" };

/** Which actions to show, by context. `next` is the path to return to. */
export function AppCard({
  a,
  actions = [],
  next,
}: {
  a: Application;
  actions?: Action[];
  next: string;
}) {
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
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${BADGE[a.status] || BADGE.pending}`}>
          {a.status}
        </span>
      </div>

      <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
        <Row k="Email" v={a.email} />
        <Row k="Phone" v={a.phone} />
        <Row k="Accreditations" v={a.accreditations} />
        <Row k="Insurance" v={a.insurance} />
        <Row k="Website" v={a.website} link />
        <Row
          k={a.decided_at ? "Decided" : "Applied"}
          v={new Date(a.decided_at || a.created_at).toLocaleDateString("en-GB")}
        />
      </dl>
      {a.about && <p className="mt-3 text-sm text-ink/85">{a.about}</p>}

      {actions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {actions.map((act) => (
            <form key={act.decision} action="/api/admin/decision" method="post">
              <input type="hidden" name="id" value={a.id} />
              <input type="hidden" name="decision" value={act.decision} />
              <input type="hidden" name="next" value={next} />
              <button
                className={
                  act.variant === "primary"
                    ? "btn-primary text-sm"
                    : act.variant === "outline"
                    ? "btn-outline text-sm"
                    : "btn-ghost text-sm"
                }
              >
                {act.label}
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ k, v, link }: { k: string; v: string | null; link?: boolean }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted">{k}:</dt>
      <dd className="min-w-0 truncate text-ink/85">
        {v && link ? (
          <a href={/^https?:\/\//.test(v) ? v : `https://${v}`} target="_blank" rel="noopener noreferrer" className="text-sage-700 hover:underline">
            {v}
          </a>
        ) : (
          v || "—"
        )}
      </dd>
    </div>
  );
}
