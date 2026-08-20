"use client";

import { LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
        body: JSON.stringify({ email })
      });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "We could not send the link.");
      setMessage("Check your inbox for a secure sign-in link.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not send the link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={submit}>
      <span className="login-icon"><Mail /></span>
      <h1>Sign in without a password</h1>
      <p>We’ll email you a one-time secure link. This verifies where saved reports and professional replies should go.</p>
      <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.co.uk" required /></label>
      <button className="button button-wide" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={18} /> Sending…</> : "Email me a sign-in link"}</button>
      {message ? <p className="form-success" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <small><ShieldCheck size={15} /> Your email is not sold to professionals. You choose when to request contact.</small>
    </form>
  );
}
