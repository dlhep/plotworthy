"use client";

import { LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

export function LoginForm({ initialError = "", next = "/dashboard" }: { initialError?: string; next?: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/auth/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, next })
      });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "We could not send the link.");
      setMessage("A new link has been sent. Open the newest email once; earlier links will no longer work.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not send the link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={submit}>
      <span className="login-icon"><Mail /></span>
      <p className="eyebrow">Returning to PlotWorthy</p>
      <h1>Log in to your account</h1>
      <p>Enter the email you registered with. We’ll send a secure one-time link and take you straight to your client or professional workspace.</p>
      <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.co.uk" required /></label>
      <button className="button button-wide" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={18} /> Sending…</> : "Send my secure login link"}</button>
      {message ? <p className="form-success" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <small><ShieldCheck size={15} /> New here? The same secure link will help you choose a client or professional account after verification.</small>
    </form>
  );
}
