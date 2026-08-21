"use client";

import Link from "next/link";
import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  Map,
  Menu,
  Settings,
  UserRound,
  X
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { signOut } from "@/app/professional/actions";
import { Logo } from "@/components/logo";

const navigation = [
  { href: "/professional/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/professional/opportunities", label: "Opportunities", icon: BriefcaseBusiness },
  { href: "/professional/coverage", label: "Coverage map", icon: Map },
  { href: "/professional/profile", label: "Profile", icon: UserRound }
] as const;

export function ProfessionalWorkspace({
  businessName,
  discipline,
  status,
  children
}: {
  businessName: string;
  discipline: string;
  status: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="professional-app-shell">
      <aside className={menuOpen ? "workspace-sidebar is-open" : "workspace-sidebar"}>
        <div className="workspace-brand-row">
          <Logo />
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close workspace navigation">
            <X />
          </button>
        </div>
        <div className="workspace-profile-summary">
          <span className="workspace-avatar" aria-hidden="true">{businessName.slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{businessName}</strong>
            <span>{discipline}</span>
          </div>
          <span className={`workspace-status workspace-status-${status}`}>{status}</span>
        </div>
        <nav className="workspace-navigation" aria-label="Professional workspace">
          <p>Workspace</p>
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link className={active ? "active" : undefined} href={href} key={href} onClick={() => setMenuOpen(false)}>
                <Icon />
                <span>{label}</span>
              </Link>
            );
          })}
          <p>Account</p>
          <Link href="/professional/profile#practice-details" onClick={() => setMenuOpen(false)}><Settings /><span>Account settings</span></Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}><CircleHelp /><span>Help & support</span></Link>
        </nav>
        <div className="workspace-sidebar-footer">
          <Link href="/">View public website</Link>
          <form action={signOut}><button type="submit">Sign out</button></form>
        </div>
      </aside>
      {menuOpen ? <button className="workspace-scrim" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} /> : null}
      <div className="workspace-main">
        <header className="workspace-topbar">
          <button className="workspace-menu-button" type="button" aria-label="Open workspace navigation" onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>
          <div>
            <span className="workspace-topbar-label">Professional workspace</span>
            <strong>{discipline}</strong>
          </div>
          <div className="workspace-topbar-actions">
            <Link className="workspace-notification-button" href="/professional/dashboard#updates" aria-label="Notifications"><Bell /></Link>
            <Link className="workspace-account-button" href="/professional/profile">
              <span>{businessName.slice(0, 1).toUpperCase()}</span>
              <strong>Account</strong>
              <ChevronDown />
            </Link>
          </div>
        </header>
        <div className="workspace-content">{children}</div>
      </div>
    </div>
  );
}
