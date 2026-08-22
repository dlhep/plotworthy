import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Log in — PlotWorthy" };

export default function LoginPage() {
  return (
    <div className="container-content py-16 sm:py-24">
      <div className="mx-auto max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="card mt-8 p-8">
          <h1 className="text-center font-serif text-2xl text-ink">Welcome back</h1>
          <p className="mt-1 text-center text-sm text-muted">
            Log in to pick up your property journey where you left off.
          </p>

          <form className="mt-7 space-y-4" action="/login?submitted=1">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200"
              />
            </div>
            <button type="submit" className="btn-primary w-full">Log in</button>
          </form>

          <p className="mt-5 text-center text-xs text-muted">
            This is a demonstration screen. Authentication isn’t wired up yet.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          New to PlotWorthy?{" "}
          <Link href="/start" className="font-medium text-sage-700 hover:underline">
            Start your journey
          </Link>
        </p>
      </div>
    </div>
  );
}
