"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    if (json.ok) router.push("/admin");
    else {
      setError(json.error || "Login failed.");
      setBusy(false);
    }
  }

  return (
    <div className="container-content flex min-h-screen items-center justify-center py-20">
      <form onSubmit={submit} className="card w-full max-w-sm p-8">
        <h1 className="display text-2xl">PlotWorthy admin</h1>
        <p className="mt-1 text-sm text-muted">Enter the admin password to open the control centre.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm"
          autoFocus
        />
        {error && <p className="mt-3 rounded-lg bg-clay-50 px-3 py-2 text-sm text-clay-700">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary mt-4 w-full disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
