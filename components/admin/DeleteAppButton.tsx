"use client";

import { useState } from "react";

/** Two-step confirm delete for a professional record. */
export function DeleteAppButton({
  id,
  name,
  next,
}: {
  id: string;
  name: string;
  next: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="btn-ghost text-sm text-clay-700"
      >
        Delete
      </button>
    );
  }

  return (
    <form action="/api/admin/application-delete" method="post" className="inline-flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="next" value={next} />
      <span className="text-xs text-muted">Delete {name} permanently?</span>
      <button
        type="submit"
        className="rounded-full bg-clay-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-clay-700"
      >
        Yes, delete
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-full px-2 py-1 text-xs text-muted hover:text-ink"
      >
        Cancel
      </button>
    </form>
  );
}
