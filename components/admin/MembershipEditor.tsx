import type { Application } from "@/lib/adminData";
import { memberMonthly, gbp, PRICING } from "@/lib/pricing";

/** Compact plan editor shown under an active professional. Plain form → API. */
export function MembershipEditor({ app, next }: { app: Application; next: string }) {
  const m = app.membership;
  const monthly = memberMonthly(m);

  return (
    <form
      action="/api/admin/membership"
      method="post"
      className="mt-3 rounded-xl border border-line bg-cream/40 px-4 py-3"
    >
      <input type="hidden" name="id" value={app.id} />
      <input type="hidden" name="next" value={next} />
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">
          Plan
        </span>

        <label className="flex items-center gap-2 text-sm text-ink/85">
          <span>Postcode packs</span>
          <input
            type="number"
            name="postcodePacks"
            min={0}
            max={99}
            defaultValue={m.postcodePacks}
            className="w-16 rounded-lg border border-line bg-white px-2 py-1 text-sm"
          />
          <span className="text-xs text-muted">×{gbp(PRICING.postcodePack)}</span>
        </label>

        <label className="flex items-center gap-2 text-sm text-ink/85">
          <input type="checkbox" name="enhanced" defaultChecked={m.enhanced} className="h-4 w-4" />
          Enhanced <span className="text-xs text-muted">{gbp(PRICING.enhanced)}</span>
        </label>

        <label className="flex items-center gap-2 text-sm text-ink/85">
          <input type="checkbox" name="website" defaultChecked={m.website} className="h-4 w-4" />
          Website <span className="text-xs text-muted">{gbp(PRICING.website)}</span>
        </label>

        <span className="ml-auto flex items-center gap-3">
          <span className="text-sm">
            <span className="font-semibold text-ink">{gbp(monthly)}</span>
            <span className="text-muted">/mo</span>
          </span>
          <button className="btn-outline text-sm">Save plan</button>
        </span>
      </div>
    </form>
  );
}
