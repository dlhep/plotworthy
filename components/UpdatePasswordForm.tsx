"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "./Logo";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"checking" | "ready" | "nosession" | "done">("checking");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setStatus(data.user ? "ready" : "nosession");
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Please use a password of at least 8 characters.");
      return;
    }
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    setStatus("done");
    setTimeout(() => {
      router.push("/brief");
      router.refresh();
    }, 1200);
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="flex justify-center">
        <Link href="/" aria-label="PlotWorthy home">
          <Logo />
        </Link>
      </div>
      <div className="card mt-8 p-8">
        {status === "checking" && (
          <p className="text-center text-sm text-muted">Checking your reset link…</p>
        )}

        {status === "nosession" && (
          <div className="text-center">
            <h1 className="font-serif text-2xl text-ink">Reset link expired</h1>
            <p className="mt-2 text-sm text-muted">
              This password reset link is invalid or has expired. Request a new one and try again.
            </p>
            <Link href="/reset-password" className="btn-primary mt-5 inline-flex">
              Send a new link
            </Link>
          </div>
        )}

        {status === "done" && (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-50 text-sage-700">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="mt-4 font-serif text-2xl text-ink">Password updated</h1>
            <p className="mt-2 text-sm text-muted">Taking you to your dashboard…</p>
          </div>
        )}

        {status === "ready" && (
          <>
            <h1 className="text-center font-serif text-2xl text-ink">Choose a new password</h1>
            <p className="mt-1 text-center text-sm text-muted">
              Set a new password for your PlotWorthy account.
            </p>
            <form onSubmit={submit} className="mt-7 space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink">New password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
                />
              </div>
              {error && (
                <p className="rounded-lg bg-clay-50 px-3 py-2 text-sm text-clay-700">{error}</p>
              )}
              <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
                {busy ? "Saving…" : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
