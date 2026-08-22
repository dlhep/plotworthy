import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-cream/60">
      <div className="container-content grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Your property project adviser — showing you what happens next and
            introducing the right vetted professional when you need them.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">Get started</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li><Link href="/start" className="hover:text-ink">Start your journey</Link></li>
            <li><Link href="/journeys" className="hover:text-ink">Project journeys</Link></li>
            <li><Link href="/how-it-works" className="hover:text-ink">How PlotWorthy helps</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">Professionals</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li><Link href="/professionals" className="hover:text-ink">Find a professional</Link></li>
            <li><Link href="/join" className="hover:text-ink">Join as a professional</Link></li>
            <li><Link href="/login" className="hover:text-ink">Log in</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">Project types</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li><Link href="/journeys/hmo" className="hover:text-ink">HMO</Link></li>
            <li><Link href="/journeys/extension" className="hover:text-ink">Extension</Link></li>
            <li><Link href="/journeys/house-to-flats" className="hover:text-ink">House to flats</Link></li>
            <li><Link href="/journeys/office-to-residential" className="hover:text-ink">Office to homes</Link></li>
            <li><Link href="/journeys/care" className="hover:text-ink">Care / supported</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-content flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} PlotWorthy. All rights reserved.</p>
          <p>Clear guidance. Vetted professionals. One property project at a time.</p>
        </div>
      </div>
    </footer>
  );
}
