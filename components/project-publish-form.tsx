"use client";

import { CalendarDays, LoaderCircle, Radio, ShieldCheck } from "lucide-react";
import { useActionState } from "react";
import { publishProject, type ProjectActionState } from "@/app/dashboard/reports/[id]/actions";

const initialState: ProjectActionState = {};

const professionalChoices = [
  ["architect", "Architect"],
  ["builder", "Builder"],
  ["planning_consultant", "Planning consultant"],
  ["structural_engineer", "Structural engineer"]
] as const;

export function ProjectPublishForm({ reportId, defaultTitle }: { reportId: string; defaultTitle: string }) {
  const [state, action, pending] = useActionState(publishProject, initialState);

  return (
    <form className="project-form" action={action}>
      <input type="hidden" name="feasibilityRequestId" value={reportId} />
      <div className="privacy-callout"><ShieldCheck /><div><strong>Your address and full report stay private</strong><span>Professionals see the postcode district, general area and the brief you write below.</span></div></div>
      <label>Project title<input name="title" defaultValue={defaultTitle} required maxLength={140} /></label>
      <label>Project brief<textarea name="brief" rows={6} placeholder="Describe the work, priorities and any known constraints. Do not include personal contact details." required minLength={20} maxLength={1800} /></label>
      <fieldset className="profession-picker">
        <legend>Who would you like quotes from?</legend>
        <div>{professionalChoices.map(([value, label]) => <label key={value}><input type="checkbox" name="requiredProfessions" value={value} /><span>{label}</span></label>)}</div>
      </fieldset>
      <div className="form-grid">
        <label>Budget from <span>(optional)</span><div className="money-input"><span>£</span><input name="budgetMin" type="number" min="0" step="100" inputMode="numeric" /></div></label>
        <label>Budget to <span>(optional)</span><div className="money-input"><span>£</span><input name="budgetMax" type="number" min="0" step="100" inputMode="numeric" /></div></label>
        <label className="full"><CalendarDays size={16} /> Target start date <span>(optional)</span><input name="targetStartDate" type="date" /></label>
      </div>
      <div className="quote-rules"><Radio /><p><strong>How matching works</strong>For seven days this is shown only to matching professionals whose coverage includes the project postcode. It then opens to the same professional types further afield. Quoting stops automatically at five.</p></div>
      <button className="button button-wide" type="submit" disabled={pending}>{pending ? <><LoaderCircle className="spin" size={18} /> Publishing…</> : "Publish project for quotes"}</button>
      {state.success ? <p className="form-success" role="status">{state.success}</p> : null}
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
    </form>
  );
}
