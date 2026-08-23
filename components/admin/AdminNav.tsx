"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

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

  const linkClass = (active: boolean) =>
    `relative rounded-full px-3 py-1.5 text-[13px] transition-colors ${
      active ? "bg-sage-50 font-medium text-sage-700" : "text-ink/70 hover:bg-cream hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Logo />
            <span className="hidden rounded-full bg-sage-50 px-2 py-0.5 text-[11px] font-semibold text-sage-700 sm:inline">
              Control centre
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(isActive(l))}>
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
        <div className="flex items-center gap-2">
          <Link href="/" className="hidden text-xs text-muted hover:text-ink sm:block">
            View site ↗
          </Link>
          <form action="/api/admin/logout" method="post">
            <button className="btn-outline whitespace-nowrap px-4 py-2 text-[13px]">Log out</button>
          </form>
        </div>
      </div>
      {/* Mobile / tablet nav */}
      <nav className="container-content flex items-center gap-1 overflow-x-auto pb-2 lg:hidden">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] ${
              isActive(l) ? "bg-sage-50 font-medium text-sage-700" : "text-ink/70"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
