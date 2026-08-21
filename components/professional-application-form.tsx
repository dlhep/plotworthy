"use client";

import Link from "next/link";
import { LoaderCircle, Send } from "lucide-react";
import { useActionState } from "react";
import { submitProfessionalApplication, type ApplicationState } from "@/app/professionals/join/actions";

const initialState: ApplicationState = {};
const disciplineLabels: Record<string, string> = {
  architect: "Architect",
  builder: "Builder",
  planning_consultant: "Planning consultant",
  structural_engineer: "Structural engineer"
};

export function ProfessionalApplicationForm({ signedIn, initialDiscipline }: { signedIn: boolean; initialDiscipline?: string | null }) {
  const [state, action, pending] = useActionState(submitProfessionalApplication, initialState);

  if (!signedIn) {
    return (
      <div className="application-signin">
        <p>Sign in with your email before submitting. This keeps the application and future enquiries private.</p>
        <Link className="button button-wide" href="/login?next=%2Fprofessionals%2Fjoin">Sign in to apply</Link>
      </div>
    );
  }

  return (
    <form className="application-form" action={action}>
      <div className="selected-profession">
        <span>Your professional account</span>
        <strong>{disciplineLabels[initialDiscipline ?? ""] ?? "Property professional"}</strong>
        <Link href="/onboarding/professional">Change profession</Link>
      </div>
      <input type="hidden" name="discipline" value={initialDiscipline ?? ""} />
      <label>Business name<input name="businessName" autoComplete="organization" required maxLength={120} /></label>
      <label>Postcode areas covered<textarea name="postcodes" rows={3} placeholder="B1, B13, B24" required maxLength={400} /></label>
      <label>Specialisms<textarea name="specialisms" rows={3} placeholder="HMOs, house extensions, listed buildings" required maxLength={600} /></label>
      <label>Website <span>(optional)</span><input name="website" type="url" inputMode="url" placeholder="https://example.co.uk" /></label>
      <label>Professional memberships <span>(optional)</span><textarea name="membership" rows={3} placeholder="ARB, RIBA, FMB or other relevant details" maxLength={400} /></label>
      <button className="button button-wide" type="submit" disabled={pending}>{pending ? <><LoaderCircle className="spin" size={18} /> Submitting…</> : <><Send size={18} /> Submit application</>}</button>
      {state.success ? <p className="form-success" role="status">{state.success}</p> : null}
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
    </form>
  );
}
