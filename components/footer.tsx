"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { site } from "@/lib/site";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/professional")) return null;
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Logo />
          <p className="footer-intro">Clear property evidence before you commit time, fees or building work.</p>
        </div>
        <div>
          <p className="footer-title">Explore</p>
          <Link href="/check">Check a property</Link>
          <Link href="/professionals">Find professionals</Link>
          <Link href="/guides">Planning guides</Link>
        </div>
        <div>
          <p className="footer-title">Company</p>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/professionals/join">Join as a professional</Link>
        </div>
        <div>
          <p className="footer-title">Legal</p>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} PlotWorthy</span>
        <span>Early feasibility, clearly labelled — never a planning guarantee.</span>
      </div>
    </footer>
  );
}
