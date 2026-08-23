import Link from "next/link";
import { CLIENT_PRICING, gbp } from "@/lib/pricing";

export const metadata = {
  title: "Enhance your project — PlotWorthy",
  description:
    "Optional extras for your PlotWorthy journey: a guided adviser, one-off expert reviews and cost checks, and PlotWorthy Plus for running several projects.",
};

function mailto(subject: string, body: string) {
  return (
    "mailto:hello@plotworthy.co.uk?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body)
  );
}

const REVIEW_MAILTO = mailto(
  "Expert brief review — register interest",
  "Hi PlotWorthy team, I'd like an expert review of my project brief."
);
const COST_MAILTO = mailto(
  "Project cost check — register interest",
  "Hi PlotWorthy team, I'd like a professional to check my project costings."
);
const PLUS_MAILTO = mailto(
  "PlotWorthy Plus — register interest",
  "Hi PlotWorthy team, I'd like PlotWorthy Plus with a guided adviser."
);

export default function UpgradePage() {
  return (
    <section className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="eyebrow justify-center">Optional extras</p>
          <h1 className="display mt-2 text-3xl sm:text-4xl">Enhance your project</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Your PlotWorthy journey is free — your brief, vetted professionals and their fee quotes
            are all included. These optional extras are here for when you want a guiding hand or an
            independent check.
          </p>
        </div>

        {/* PlotWorthy Plus — the guided, ongoing option */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="card relative flex flex-col border-sage-200 bg-sage-50/40 p-7">
            <span className="absolute right-6 top-6 rounded-full bg-sage-600 px-2.5 py-1 text-xs font-semibold text-white">
              Guided
            </span>
            <h2 className="display text-xl">PlotWorthy Plus</h2>
            <p className="mt-3">
              <span className="display text-3xl">{gbp(CLIENT_PRICING.plusMonthly)}</span>
              <span className="ml-1 text-sm text-muted">/ month</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A guided adviser walks you through each stage, so you always know what&apos;s happening
              now and what&apos;s next — plus room to run and organise more than one project.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <Check>A dedicated adviser to guide you through every stage</Check>
              <Check>Run multiple projects at once (free plan covers one)</Check>
              <Check>Document &amp; quote vault — store drawings, quotes and paperwork</Check>
              <Check>Compare fee proposals side by side</Check>
            </ul>
            <div className="mt-auto pt-6">
              <a href={PLUS_MAILTO} className="btn-primary w-full justify-center">Get PlotWorthy Plus</a>
            </div>
          </div>

          {/* One-off reports & reviews */}
          <div className="flex flex-col gap-6">
            <ReportCard
              title="Expert brief review"
              price={`${gbp(CLIENT_PRICING.expertReview)} one-off`}
              desc="A vetted professional reads your brief before it goes out, so you get sharper, more accurate fee quotes and fewer questions back."
              href={REVIEW_MAILTO}
              cta="Request a review"
            />
            <ReportCard
              title="Project cost check"
              price={`${gbp(CLIENT_PRICING.costCheck)} one-off`}
              desc="Before you commit to a builder, an independent professional checks the costings you've been quoted are realistic and fair — so you don't over-pay. Leasing, sourcing and other fee checks available too."
              href={COST_MAILTO}
              cta="Request a cost check"
            />
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted">
          The core journey stays free — add these only if you want them. Prices are indicative and
          exclude VAT. Online payments are launching soon; register interest above and we&apos;ll set
          you up and confirm pricing.
        </p>

        <div className="mt-10 text-center">
          <Link href="/brief" className="btn-outline">← Back to your dashboard</Link>
        </div>
      </div>
    </section>
  );
}

function ReportCard({
  title,
  price,
  desc,
  href,
  cta,
}: {
  title: string;
  price: string;
  desc: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="card flex flex-col p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="display text-lg">{title}</h3>
        <span className="whitespace-nowrap rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-muted">
          {price}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
      <div className="mt-auto pt-4">
        <a href={href} className="btn-outline w-full justify-center text-sm">{cta}</a>
      </div>
    </div>
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
