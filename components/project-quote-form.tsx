"use client";

import { LoaderCircle, Send } from "lucide-react";
import { useActionState } from "react";
import { submitQuote, type QuoteActionState } from "@/app/opportunities/[id]/actions";

const initialState: QuoteActionState = {};

export function ProjectQuoteForm({ projectId }: { projectId: string }) {
  const [state, action, pending] = useActionState(submitQuote, initialState);

  return (
    <form className="project-form quote-form" action={action}>
      <input type="hidden" name="projectId" value={projectId} />
      <label>Your proposed fee<div className="money-input"><span>£</span><input name="fee" type="number" min="0" step="1" inputMode="decimal" placeholder="For example 2450" required /></div><small>The client sees this fee privately. Other professionals only see the response count.</small></label>
      <label>Your message to the client<textarea name="message" rows={6} placeholder="Introduce your practice, explain your approach and highlight relevant experience." minLength={30} maxLength={2400} required /></label>
      <label>Expected timeframe<input name="timeframe" placeholder="For example: survey in 2 weeks; drawings in 4–6 weeks" required maxLength={240} /></label>
      <label>What your fee includes <span>(optional)</span><textarea name="inclusions" rows={4} placeholder="Measured survey, design options, planning submission, meetings and revisions…" maxLength={1600} /></label>
      <button className="button button-wide" type="submit" disabled={pending}>{pending ? <><LoaderCircle className="spin" size={18} /> Sending securely…</> : <><Send size={18} /> Send my private quote</>}</button>
      {state.success ? <p className="form-success" role="status">{state.success}</p> : null}
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
    </form>
  );
}
