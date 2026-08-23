import { briefSpec, readiness, goalLabel, type BriefData } from "@/lib/brief";

// The brief as a professional reads it: clean, scannable, quote-ready.
export function BriefPreview({
  goalId,
  data,
  proView,
}: {
  goalId?: string;
  data: BriefData;
  /** When true, framed as the professional's read-only view. */
  proView?: boolean;
}) {
  const sections = briefSpec(goalId);
  const r = readiness(goalId, data);

  const badge =
    r.pct >= 100
      ? "bg-sage-50 text-sage-700 ring-sage-100"
      : r.pct >= 60
      ? "bg-clay-50 text-clay-700 ring-clay-100"
      : "bg-cream text-muted ring-line";

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line bg-cream/40 px-6 py-5">
        <div>
          <p className="eyebrow">Project brief</p>
          <h3 className="mt-1 display text-xl">{goalLabel(goalId)}</h3>
          {data.address && (
            <p className="mt-0.5 text-sm text-muted">
              {data.address}
              {data.postcode ? `, ${data.postcode}` : ""}
            </p>
          )}
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badge}`}>{r.label}</span>
      </div>

      <div className="divide-y divide-line">
        {sections.map((section) => {
          const rows = section.fields
            .map((f) => ({ f, v: (data[f.id] ?? "").trim() }))
            .filter((row) => row.v.length > 0);
          if (rows.length === 0) return null;
          return (
            <section key={section.title} className="px-6 py-5">
              <h4 className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-sage-700">
                {section.title}
              </h4>
              <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {rows.map(({ f, v }) => (
                  <div key={f.id} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                    <dt className="text-xs text-muted">{f.label}</dt>
                    {f.type === "multi" ? (
                      <dd className="mt-1 flex flex-wrap gap-1.5">
                        {v.split(",").map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full bg-sage-50 px-2.5 py-0.5 text-xs font-medium text-sage-700 ring-1 ring-sage-100"
                          >
                            {chip.trim()}
                          </span>
                        ))}
                      </dd>
                    ) : (
                      <dd className="mt-0.5 text-sm text-ink/90">{v}</dd>
                    )}
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>

      <p className="border-t border-line bg-cream/40 px-6 py-3 text-xs text-muted">
        {proView
          ? "This is the brief exactly as it reached you — enough to price your fee before you reply."
          : "This is exactly what a vetted professional sees when PlotWorthy introduces you."}
      </p>
    </div>
  );
}
