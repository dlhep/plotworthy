"use client";

import { useState } from "react";
import { authConfigured, createClient } from "@/lib/supabase/client";

const DISCIPLINES = [
  "Architect",
  "Planning consultant",
  "Structural engineer",
  "Fire consultant",
  "Surveyor / valuer",
  "Builder / contractor",
  "Letting / lease adviser",
  "Licensing / care specialist",
  "Other",
];

type State = "idle" | "sending" | "done" | "error";

export function JoinForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [existing, setExisting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries()) as Record<string, string>;

    const email = (payload.email || "").trim();
    const password = payload.password || "";
    const confirm = payload.confirm || "";

    if (password.length < 8) {
      setError("Please choose a password of at least 8 characters.");
      setState("error");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don’t match.");
      setState("error");
      return;
    }
    if (!authConfigured) {
      setError("Sign-up isn’t available right now. Please email hello@plotworthy.co.uk.");
      setState("error");
      return;
    }

    setState("sending");

    // 1) Create the professional's login and send the email-confirmation link.
    //    They'll land in their workspace once we approve them.
    let existingAccount = false;
    try {
      const supabase = createClient();
      const { error: signErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/professional`,
          data: { role: "professional" },
        },
      });
      if (signErr) {
        const msg = signErr.message.toLowerCase();
        if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
          existingAccount = true; // fine — they'll use their existing password
        } else {
          setError(signErr.message || "Couldn’t create your login. Please try again.");
          setState("error");
          return;
        }
      }
    } catch {
      setError("Couldn’t create your login. Please try again.");
      setState("error");
      return;
    }

    // 2) Record the application for admin review.
    // Strip the password fields — they never leave the auth system.
    const { password: _p, confirm: _c, ...application } = payload;
    try {
      const res = await fetch("/api/professional-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(application),
      });
      const json = await res.json();
      if (json.ok) {
        setExisting(existingAccount);
        setState("done");
      } else {
        setError(json.error || "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setError("Couldn’t reach the server. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="display mt-4 text-2xl">Application received</h2>
        {existing ? (
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Thanks — we’ll review your details and be in touch. You already have a PlotWorthy account, so once
            you’re approved just log in with your existing password and you’ll go straight to your workspace.
          </p>
        ) : (
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Thanks — <span className="font-medium text-ink">check your inbox to confirm your email</span> and
            activate your login. We’ll review your details, and once you’re approved you can log in and you’ll
            go straight to your professional workspace.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-8">
      <h2 className="display text-2xl">Apply to join the network</h2>
      <p className="mt-1 text-sm text-muted">
        Tell us about your practice. Applications are reviewed before you appear to clients or receive leads.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Your name" placeholder="Jordan Fletcher" required />
          <Field name="company" label="Practice / company" placeholder="Fletcher Design Ltd" />
          <Field name="email" label="Email" type="email" placeholder="you@example.com" required />
          <Field name="phone" label="Phone" placeholder="07…" />
        </div>

        <div className="rounded-xl border border-line bg-cream/40 p-4">
          <p className="text-sm font-medium text-ink">Create your login</p>
          <p className="mt-0.5 text-xs text-muted">
            Set a password now. You’ll confirm your email to activate it, and use it to sign into your
            workspace once you’re approved.
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field name="password" label="Password" type="password" placeholder="At least 8 characters" required />
            <Field name="confirm" label="Confirm password" type="password" placeholder="Re-enter password" required />
          </div>
        </div>

        <div>
          <label htmlFor="discipline" className="block text-sm font-medium text-ink">Discipline</label>
          <select
            id="discipline"
            name="discipline"
            required
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200"
          >
            {DISCIPLINES.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="coverage" label="Coverage (postcode districts)" placeholder="B13, B14, B15" />
          <Field name="accreditations" label="Accreditations" placeholder="ARB, RIBA" />
          <Field name="insurance" label="Professional indemnity insurance" placeholder="£2m — Hiscox" />
          <Field name="website" label="Website / portfolio" placeholder="https://…" />
        </div>
        <div>
          <label htmlFor="about" className="block text-sm font-medium text-ink">About your practice</label>
          <textarea
            id="about"
            name="about"
            rows={3}
            placeholder="What you specialise in and the kinds of projects you take on."
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200"
          />
        </div>

        {state === "error" && (
          <p className="rounded-xl bg-clay-50 px-4 py-3 text-sm text-clay-700">{error}</p>
        )}

        <button type="submit" disabled={state === "sending"} className="btn-primary w-full disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Submit application"}
        </button>
        <p className="text-center text-xs text-muted">
          We’ll only use these details to review your application and contact you about joining.
        </p>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-clay-500"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200"
      />
    </div>
  );
}
