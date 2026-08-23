import Link from "next/link";
import { CLIENT_PRICING, gbp } from "@/lib/pricing";

export const metadata = {
  title: "Enhance your project — PlotWorthy",
};

const REVIEW_MAILTO =
  "mailto:hello@plotworthy.co.uk?subject=" +
  encodeURIComponent("Expert brief review — register interest") +
  "&body=" +
  encodeURIComponent("Hi PlotWorthy team, I'd like an expert review of my project brief.");

const PLUS_MAILTO =
  "mailto:hello@plotworthy.co.uk?subject=" +
  encodeURIComponent("PlotWorthy Plus — register interest") +
  "&body=" +
  encodeURIComponent("Hi PlotWorthy team, I'd like to use PlotWorthy Plus for multiple projects.");

export default function UpgradePage() {
  return (
    <section className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="eyebrow justify-center">Optional extras</p>
          <h1 className="display mt-2 text-3xl sm:text-4xl">Enhance your project</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Your PlotWorthy journey is free — your brief, vetted professionals and their fee quotes
            are all included. These optional extras are here for when you want a little more.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* One-off: Expert brief review */}
          <div className="card flex flex-col p-7">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="display text-xl">Expert brief review</h2>
              <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-muted">
                One-off · per project
              </span>
            </div>
            <p className="mt-3">
              <span className="display text-3xl">{gbp(CLIENT_PRICING.expertReview)}</span>
              <span className="ml-1 text-sm text-muted">one-off</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A vetted professional reads your brief before it goes out — so you get sharper, more
              accurate fee quotes and fewer back-and-forth questions from professionals.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <Check>A professional read-through of your brief</Check>
              <Check>Suggestions to strengthen it and fill gaps</Check>
              <Check>Flags anything that would slow a fee quote down</Check>
            </ul>
            <div className="mt-auto pt-6">
              <a href={REVIEW_MAILTO} className="btn-primary w-full justify-center">
                Request an expert review
              </a>
            </div>
          </div>

          {/* Subscription: PlotWorthy Plus */}
          <div className="card relative flex flex-col border-sage-200 bg-sage-50/40 p-7">
            <span className="absolute right-6 top-6 rounded-full bg-sage-600 px-2.5 py-1 text-xs font-semibold text-white">
              For multiple projects
            </span>
            <h2 className="display text-xl">PlotWorthy Plus</h2>
            <p className="mt-3">
              <span className="display text-3xl">{gbp(CLIENT_PRICING.plusMonthly)}</span>
              <span className="ml-1 text-sm text-muted">/ month</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Running more than one property project? Plus keeps them all in one place with room to
              organise everything as you go.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <Check>Run multiple projects at once (free plan covers one)</Check>
              <Check>Document &amp; quote vault — store drawings, quotes and paperwork</Check>
              <Check>Compare fee proposals side by side</Check>
            </ul>
            <div className="mt-auto pt-6">
              <a href={PLUS_MAILTO} className="btn-primary w-full justify-center">
                Get PlotWorthy Plus
              </a>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted">
          The core journey stays free — add these only if you want them. Prices exclude VAT.
          Online payments are launching soon; register interest above and we’ll set you up and
          confirm pricing.
        </p>

        <div className="mt-10 text-center">
          <Link href="/brief" className="btn-outline">← Back to your project</Link>
        </div>
      </div>
    </section>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sage-100 text-[11px] font-bold text-sage-700">
        ✓
      </span>
      <span className="text-ink/85">{children}</span>
    </li>
  );
}
