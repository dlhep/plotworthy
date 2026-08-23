"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/project";

/** Shown on the (public) journey hub to signed-out visitors: they've seen the
 *  value, now offer a free account to save it and request introductions. */
export function SaveProjectBanner() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let ok = true;
    getCurrentUser().then((u) => ok && setSignedIn(Boolean(u)));
    return () => {
      ok = false;
    };
  }, []);

  if (signedIn !== false) return null; // hide while unknown or when signed in

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-clay-200 bg-clay-50/60 p-6">
      <div>
        <h3 className="font-serif text-lg text-ink">Save this project — free</h3>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Create a free account to save your project and progress, keep your documents and quotes in
          one place, and request introductions to vetted professionals when you&apos;re ready.
        </p>
      </div>
      <div className="flex gap-2">
        <Link href="/signup?next=/brief" className="btn-primary whitespace-nowrap text-sm">
          Create free account
        </Link>
        <Link href="/login?next=/brief" className="btn-outline whitespace-nowrap text-sm">
          Log in
        </Link>
      </div>
    </div>
  );
}
