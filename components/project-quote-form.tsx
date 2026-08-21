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
      <label>Your professional fee<div className="money-input"><span>£</span><input name="fee" type="number" min="0" step="1" inputMode="decimal" required /></div></label>
      <label>Proposed approach<textarea name="message" rows={6} placeholder="Explain how you would approach this project and why you are a good fit." minLength={30} maxLength={2400} required /></label>
      <label>Expected timeframe<input name="timeframe" placeholder="For example: survey within 2 weeks; drawings in 4–6 weeks" required maxLength={240} /></label>
      <label>What is included? <span>(optional)</span><textarea name="inclusions" rows={4} placeholder="Surveys, drawings, submissions, meetings, revisions…" maxLength={1600} /></label>
      <button className="button button-wide" type="submit" disabled={pending}>{pending ? <><LoaderCircle className="spin" size={18} /> Submitting…</> : <><Send size={18} /> Submit quote</>}</button>
      {state.success ? <p className="form-success" role="status">{state.success}</p> : null}
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
    </form>
  );
}
