"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/professionals", label: "Network" },
  { href: "/admin/clients", label: "Clients" },
];

export function AdminNav({ pending }: { pending?: number }) {
  const pathname = usePathname();
  const isActive = (l: (typeof LINKS)[number]) =>
    l.exact ? pathname === l.href : pathname.startsWith(l.href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink text-white/90">
      <div className="container-content flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-sage-500 text-[11px] font-bold text-white">
              P
            </span>
            Control centre
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-3 py-1.5 text-[13px] transition-colors ${
                  isActive(l)
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
                {l.label === "Applications" && pending ? (
                  <span className="ml-1.5 rounded-full bg-clay-400 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {pending}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="hidden text-xs text-white/60 hover:text-white sm:block">
            View site ↗
          </Link>
          <form action="/api/admin/logout" method="post">
            <button className="rounded-full border border-white/20 px-3 py-1.5 text-[13px] text-white/80 hover:bg-white/10 hover:text-white">
              Log out
            </button>
          </form>
        </div>
      </div>
      {/* Mobile nav */}
      <nav className="container-content flex items-center gap-1 overflow-x-auto pb-2 sm:hidden">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] ${
              isActive(l) ? "bg-white/15 text-white" : "text-white/70"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
