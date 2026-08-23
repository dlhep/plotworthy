"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser, readLocalDraft, saveProject } from "@/lib/project";
import { Logo } from "./Logo";

export function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/brief";
  const justVerified = params.get("verified") === "1";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [check, setCheck] = useState(false);

  // If the client made a brief before signing up, move it onto their account.
  async function syncDraft() {
    const user = await getCurrentUser();
    if (!user) return;
    const draft = readLocalDraft();
    if (draft && draft.goalId) await saveProject(user.id, draft);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === "signup" && password.length < 8) {
      setError("Please use a password of at least 8 characters.");
      return;
    }
    setBusy(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name.trim() || null },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      if (data.session) {
        await syncDraft();
        router.push(next);
        router.refresh();
      } else {
        // email confirmation required
        setCheck(true);
        setBusy(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      await syncDraft();
      router.push(next);
      router.refresh();
    }
  }

  if (check) {
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
          <h1 className="display mt-4 text-2xl">Confirm your email</h1>
          <p className="mt-2 text-muted">
            We&apos;ve sent a confirmation link to <span className="font-medium text-ink">{email}</span>.
            Click it to finish creating your account and open your project.
          </p>
        </div>
      </div>
    );
  }

  const isSignup = mode === "signup";
  return (
    <div className="mx-auto max-w-md">
      <div className="flex justify-center">
        <Link href="/" aria-label="PlotWorthy home">
          <Logo />
        </Link>
      </div>
      <div className="card mt-8 p-8">
        <h1 className="text-center font-serif text-2xl text-ink">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-center text-sm text-muted">
          {isSignup
            ? "Free to start your property journey. We’ll verify your email, then it’s saved to you on any device."
            : "Log in to pick up your property project where you left off."}
        </p>

        {!isSignup && justVerified && (
          <p className="mt-4 rounded-lg bg-sage-50 px-3 py-2 text-center text-sm text-sage-700">
            Your email is verified — log in to open your project.
          </p>
        )}

        <form onSubmit={submit} className="mt-7 space-y-4">
          {isSignup && (
            <Field label="Your name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First and last"
                className="input"
                autoComplete="name"
              />
            </Field>
          )}
          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
              autoComplete="email"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-clay-50 px-3 py-2 text-sm text-clay-700">{error}</p>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? "Please wait…" : isSignup ? "Create account" : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-sage-700 hover:underline">
                Log in
              </Link>
            </>
          ) : (
            <>
              New to PlotWorthy?{" "}
              <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-medium text-sage-700 hover:underline">
                Create an account
              </Link>
            </>
          )}
        </p>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--tw-line, #e7e0d3);
          background: #fff;
          padding: 0.6rem 0.85rem;
          font-size: 0.9rem;
          outline: none;
        }
        .input:focus {
          border-color: #7fa389;
          box-shadow: 0 0 0 3px rgba(67, 107, 79, 0.12);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
