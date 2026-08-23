"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "./Logo";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });
    // Always show the confirmation, even on error, so we don't reveal which
    // emails have accounts.
    if (error) setError(error.message);
    setSent(true);
    setBusy(false);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="flex justify-center">
          <Link href="/" aria-label="PlotWorthy home">
            <Logo />
          </Link>
        </div>
        <div className="card mt-8 p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-50 text-sage-700">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16v12H4z" strokeLinejoin="round" />
              <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="display mt-4 text-2xl">Check your email</h1>
          <p className="mt-2 text-muted">
            If an account exists for <span className="font-medium text-ink">{email}</span>, we&apos;ve
            sent a link to reset your password. Open it to choose a new one.
          </p>
          <p className="mt-5 text-sm text-muted">
            <Link href="/login" className="font-medium text-sage-700 hover:underline">
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="flex justify-center">
        <Link href="/" aria-label="PlotWorthy home">
          <Logo />
        </Link>
      </div>
      <div className="card mt-8 p-8">
        <h1 className="text-center font-serif text-2xl text-ink">Reset your password</h1>
        <p className="mt-1 text-center text-sm text-muted">
          Enter your email and we&apos;ll send you a link to set a new password.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
            />
          </div>
          {error && (
            <p className="rounded-lg bg-clay-50 px-3 py-2 text-sm text-clay-700">{error}</p>
          )}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-sage-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
