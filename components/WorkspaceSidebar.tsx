"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/professional", label: "Dashboard", key: "dash" },
  { href: "/professional/opportunities", label: "Opportunities", key: "opp" },
  { href: "/professional/coverage", label: "Coverage map", key: "cov" },
  { href: "/professional/profile", label: "Public profile", key: "prof" },
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
    <aside className="sticky top-0 flex h-screen w-[250px] shrink-0 flex-col bg-sage-900 px-3.5 py-4 text-[#e9efe7]">
      <div className="px-2 pb-3.5">
        <span className="font-serif text-lg font-semibold text-white">
          Plot<span className="text-clay-300">Worthy</span>
        </span>
      </div>
      <div className="rounded-xl bg-white/[0.07] p-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-clay-300 text-sm font-bold text-sage-900">
            HE
          </span>
          <div>
            <div className="text-sm font-semibold text-white">Hepburn Architects</div>
            <div className="text-xs text-[#e9efe7]/70">Architect</div>
          </div>
        </div>
        <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-sage-400/30 px-2.5 py-1 text-[0.62rem] font-bold tracking-wide text-[#d7e6d3]">
          ✓ APPROVED
        </span>
      </div>
      <nav className="mt-4 flex flex-col gap-0.5">
        <span className="px-2.5 pb-1.5 pt-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#e9efe7]/45">
          Workspace
        </span>
        {NAV.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm ${
                active ? "bg-clay-400 font-semibold text-sage-900" : "text-[#e9efe7]/85 hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              {ICON[n.key]}
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-1.5 pt-4 text-sm text-[#e9efe7]/70">
        <Link href="/" className="hover:text-white">← View public website</Link>
        <Link href="/" className="hover:text-white">Sign out</Link>
      </div>
    </aside>
  );
}
