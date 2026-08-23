"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { briefSpec, readiness, type BriefData, type BriefField } from "@/lib/brief";
import { getCurrentUser, saveProject, writeLocalDraft } from "@/lib/project";
import { BriefPreview } from "./BriefPreview";

export function BriefBuilder({
  goalId,
  initial,
  stage,
  positionLabel,
  onBack,
  onSaved,
}: {
  goalId?: string;
  initial?: BriefData;
  stage?: number;
  positionLabel?: string;
  onBack?: () => void;
  /** When provided, called after save instead of navigating to /brief. */
  onSaved?: () => void;
}) {
  const router = useRouter();
  const sections = useMemo(() => briefSpec(goalId), [goalId]);
  const [data, setData] = useState<BriefData>(initial ?? {});
  const [showPreview, setShowPreview] = useState(false);
  const r = readiness(goalId, data);

  const set = (id: string, v: string) => setData((d) => ({ ...d, [id]: v }));

  const toggleMulti = (id: string, option: string) => {
    setData((d) => {
      const current = (d[id] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...d, [id]: next.join(", ") };
    });
  };

  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      goalId: goalId ?? "",
      data,
      stage: typeof stage === "number" ? stage : null,
      positionLabel: positionLabel ?? null,
    };
    writeLocalDraft(payload);

    const user = await getCurrentUser();
    if (user) {
      await saveProject(user.id, payload);
      if (onSaved) onSaved();
      else router.push("/brief");
    } else {
      // Not signed in yet — create an account to keep the project; the draft
      // we just stored locally is moved onto the account after sign-up.
      router.push("/signup?next=/brief");
    }
    setSaving(false);
  };

  return (
    <div>
      {onBack && (
        <button onClick={onBack} className="mb-4 block text-sm text-muted hover:text-ink">
          ← Back
        </button>
      )}
      <p className="eyebrow">Your project brief</p>
      <h1 className="mt-2 display text-3xl sm:text-4xl">
        Give professionals everything they need to quote
      </h1>
      <p className="mt-3 max-w-xl text-muted">
        Fill in what you know — rough answers are fine. A vetted professional
        reads this and comes back with a fee proposal, not a list of questions.
        You can keep editing it later.
      </p>

      {/* Readiness bar */}
      <div className="mt-6 card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-ink">{r.label}</span>
          <span className="text-muted">
            {r.done}/{r.total} key details
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-sage-600 transition-all duration-500"
            style={{ width: `${r.pct}%` }}
          />
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="display text-lg">{section.title}</h2>
            {section.intro && <p className="mt-1 text-sm text-muted">{section.intro}</p>}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {section.fields.map((f) => (
                <Field
                  key={f.id}
                  field={f}
                  value={data[f.id] ?? ""}
                  onText={(v) => set(f.id, v)}
                  onToggle={(opt) => toggleMulti(f.id, opt)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {showPreview && (
        <div className="mt-8">
          <p className="eyebrow mb-3">Preview</p>
          <BriefPreview goalId={goalId} data={data} />
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save brief & continue →"}
        </button>
        <button
          onClick={() => setShowPreview((s) => !s)}
          className="btn-outline"
          type="button"
        >
          {showPreview ? "Hide preview" : "Preview what professionals see"}
        </button>
      </div>
      <p className="mt-3 text-sm text-muted">
        Next you&apos;ll create a free account so your project is saved to you and
        ready to share with professionals — on any device.
      </p>
    </div>
  );
}

function Field({
  field,
  value,
  onText,
  onToggle,
}: {
  field: BriefField;
  value: string;
  onText: (v: string) => void;
  onToggle: (option: string) => void;
}) {
  const wide = field.type === "textarea" || field.type === "multi";
  const selected = value.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label className="block text-sm font-medium text-ink">
        {field.label}
        {field.critical && <span className="ml-1 text-clay-500">*</span>}
      </label>
      {field.help && <p className="mt-0.5 text-xs text-muted">{field.help}</p>}

      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onText(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
        />
      ) : field.type === "select" ? (
        <select
          value={value}
          onChange={(e) => onText(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
        >
          <option value="">Select…</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : field.type === "multi" ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {field.options?.map((o) => {
            const on = selected.includes(o);
            return (
              <button
                key={o}
                type="button"
                onClick={() => onToggle(o)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors ${
                  on
                    ? "bg-sage-600 text-white ring-sage-600"
                    : "bg-white text-ink/75 ring-line hover:ring-sage-300"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      ) : (
        <input
          type={field.type === "number" ? "number" : "text"}
          value={value}
          onChange={(e) => onText(e.target.value)}
          placeholder={field.placeholder}
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
        />
      )}
    </div>
  );
}
