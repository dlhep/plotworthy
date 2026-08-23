"use client";

import { useState } from "react";

export function DeleteClientButton({ userId, email }: { userId: string; email: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-full px-2.5 py-1 text-xs font-medium text-clay-700 hover:bg-clay-50"
      >
        Delete
      </button>
    );
  }

  return (
    <form
      action="/api/admin/client-delete"
      method="post"
      className="inline-flex items-center gap-2"
    >
      <input type="hidden" name="userId" value={userId} />
      <span className="text-xs text-muted">Delete {email}?</span>
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
