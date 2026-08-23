import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isAdmin } from "@/lib/adminAuth";
import { listClients } from "@/lib/adminData";
import { goalLabel } from "@/lib/brief";
import { STAGE_TITLES } from "@/lib/journeys";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clients — PlotWorthy admin" };

export default async function ClientsPage() {
  if (!isAdmin(cookies().get(ADMIN_COOKIE)?.value)) redirect("/admin/login");

  const { clients, note } = await listClients();
  const withProject = clients.filter((c) => c.project?.goalId).length;

  return (
    <div className="container-content py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-clay-600">
            PlotWorthy admin
          </p>
          <h1 className="display text-3xl">Clients &amp; projects</h1>
          <p className="mt-1 text-sm text-muted">
            Everyone who has created an account, and the project each is working on.
          </p>
        </div>
        <span className="rounded-full bg-sage-50 px-3 py-1 text-sm font-semibold text-sage-700">
          {clients.length} accounts · {withProject} with a project
        </span>
      </div>

      {note && (
        <p className="mt-6 rounded-xl border border-line bg-cream/60 px-4 py-3 text-sm text-muted">{note}</p>
      )}

      {clients.length === 0 && !note && (
        <p className="mt-8 text-sm text-muted">No client accounts yet.</p>
      )}

      {clients.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-semibold">Client</th>
                <th className="px-5 py-3 font-semibold">Project</th>
                <th className="px-5 py-3 font-semibold">Postcode</th>
                <th className="px-5 py-3 font-semibold">Stage</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => {
                const p = c.project;
                const stageTitle =
                  p && p.stage != null && STAGE_TITLES[p.stage]
                    ? `${p.stage + 1}. ${STAGE_TITLES[p.stage]}`
                    : "—";
                return (
                  <tr key={c.userId} className="border-b border-line last:border-0 align-top">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-ink">{c.email || "—"}</p>
                      {c.name && <p className="text-xs text-muted">{c.name}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      {p?.goalId ? (
                        <span className="text-ink/85">{goalLabel(p.goalId)}</span>
                      ) : (
                        <span className="text-muted">No project</span>
                      )}
                      {p?.positionLabel && (
                        <p className="text-xs text-muted">{p.positionLabel}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-ink/85">{p?.postcode || "—"}</td>
                    <td className="px-5 py-3.5 text-ink/85">{stageTitle}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-muted">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-GB") : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      {c.confirmed ? (
                        <span className="rounded-full bg-sage-50 px-2 py-0.5 text-xs font-semibold text-sage-700">
                          Confirmed
                        </span>
                      ) : (
                        <span className="rounded-full bg-cream px-2 py-0.5 text-xs font-semibold text-muted">
                          Unconfirmed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
