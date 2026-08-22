"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "/start", label: "Start your journey" },
  { href: "/journeys", label: "Project journeys" },
  { href: "/professionals", label: "Find a professional" },
  { href: "/how-it-works", label: "How PlotWorthy helps" },
  { href: "/join", label: "Join as a professional" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between">
        <Link href="/" aria-label="PlotWorthy home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-medium text-ink/70 transition-colors hover:bg-cream hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 lg:flex">
          <Link href="/login" className="btn-ghost whitespace-nowrap px-4 py-2 text-[13px]">
            Log in
          </Link>
          <Link href="/start" className="btn-primary whitespace-nowrap px-4 py-2 text-[13px]">
            Start your journey
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="btn-ghost lg:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-canvas lg:hidden">
          <div className="container-content flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-ink/80 hover:bg-cream"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 px-1">
              <Link href="/login" onClick={() => setOpen(false)} className="btn-outline flex-1 text-sm">
                Log in
              </Link>
              <Link href="/start" onClick={() => setOpen(false)} className="btn-primary flex-1 text-sm">
                Start
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
