"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/professional", label: "Dashboard", short: "Dashboard", key: "dash" },
  { href: "/professional/opportunities", label: "Opportunities", short: "Leads", key: "opp" },
  { href: "/professional/coverage", label: "Coverage map", short: "Coverage", key: "cov" },
  { href: "/professional/profile", label: "Public profile", short: "Profile", key: "prof" },
];

const ICON: Record<string, JSX.Element> = {
  dash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[1.05rem] w-[1.05rem]">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  ),
  opp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[1.05rem] w-[1.05rem]">
      <path d="M4 7h16v12H4z" />
      <path d="M9 7V5h6v2" />
    </svg>
  ),
  cov: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[1.05rem] w-[1.05rem]">
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  ),
  prof: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[1.05rem] w-[1.05rem]">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  ),
};

export function WorkspaceSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full shrink-0 bg-sage-900 px-3.5 py-3 text-[#e9efe7] lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[250px] lg:flex-col lg:py-4">
      <div className="flex items-center justify-between gap-3 px-1 lg:px-2 lg:pb-3.5">
        <span className="font-serif text-lg font-semibold text-white">
          Plot<span className="text-clay-300">Worthy</span>
        </span>
        <Link href="/" className="text-xs text-[#e9efe7]/70 hover:text-white lg:hidden">
          Exit preview
        </Link>
      </div>

      {/* Profile card — full on desktop, hidden on the compact mobile bar */}
      <div className="mt-3 hidden rounded-xl bg-white/[0.07] p-3.5 lg:mt-0 lg:block">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-clay-300 text-sm font-bold text-sage-900">
            SS
          </span>
          <div>
            <div className="text-sm font-semibold text-white">Sample Studio</div>
            <div className="text-xs text-[#e9efe7]/70">Architect</div>
          </div>
        </div>
        <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-sage-400/30 px-2.5 py-1 text-[0.62rem] font-bold tracking-wide text-[#d7e6d3]">
          ✓ APPROVED
        </span>
      </div>

      <nav className="mt-3 grid grid-cols-4 gap-1 lg:mt-4 lg:flex lg:flex-col lg:gap-0.5">
        <span className="hidden px-2.5 pb-1.5 pt-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#e9efe7]/45 lg:block">
          Workspace
        </span>
        {NAV.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-center text-[11px] leading-tight lg:flex-row lg:gap-2.5 lg:px-2.5 lg:py-2.5 lg:text-left lg:text-sm ${
                active ? "bg-clay-400 font-semibold text-sage-900" : "text-[#e9efe7]/85 hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              {ICON[n.key]}
              <span className="lg:hidden">{n.short}</span>
              <span className="hidden lg:inline">{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden flex-col gap-1.5 pt-4 text-sm text-[#e9efe7]/70 lg:flex">
        <Link href="/" className="hover:text-white">← View public website</Link>
        <Link href="/" className="hover:text-white">Sign out</Link>
      </div>
    </aside>
  );
}
