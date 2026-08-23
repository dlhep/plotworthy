import Link from "next/link";
import { CLIENT_PRICING, gbp } from "@/lib/pricing";

export const metadata = {
  title: "Project reports & tools — PlotWorthy",
  description:
    "Independent PlotWorthy reports for any property project — feasibility, investment appraisal, planning likelihood and permitted-development checks — plus PlotWorthy Plus for running several projects.",
};

function mailto(subject: string) {
  return `mailto:hello@plotworthy.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `Hi PlotWorthy team, I'd like to register interest in: ${subject}.`
  )}`;
}

export default function UpgradePage() {
  return (
    <section className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="eyebrow justify-center">Reports &amp; tools</p>
          <h1 className="display mt-2 text-3xl sm:text-4xl">Independent reports for your project</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            Your journey, brief and professional introductions are always free. These reports help you
            decide <em>before</em> you commit — things an independent adviser can give you that a hired
            professional won&apos;t, across every project type.
          </p>
        </div>

        {/* Free working tools */}
        <div className="mt-12">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-sage-600 px-2.5 py-1 text-xs font-semibold text-white">Free · instant</span>
            <h2 className="display text-xl">Try these now</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <ToolCard
              title="Project feasibility report"
              desc="An instant, independent read on whether your project stacks up — Article 4, conservation, flood and listed-building checks plus the local planning approval signal, all from official data."
              href="/report"
              cta="Get your feasibility report →"
            />
            <ToolCard
              title="Investment appraisal"
              desc="For investors and developers: work out Stamp Duty, total money in, profit and return on cost for a develop-and-sell, or the yield for a buy-to-rent — before you make an offer."
              href="/appraisal"
              cta="Open the appraisal tool →"
            />
          </div>
        </div>

        {/* Expert-reviewed reports */}
        <div className="mt-14">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-clay-100 px-2.5 py-1 text-xs font-semibold text-clay-700">Expert-reviewed</span>
            <h2 className="display text-xl">Reports checked by a vetted professional</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ReportCard
              title="Full feasibility report"
              price={`${gbp(CLIENT_PRICING.feasibilityFull)}`}
              desc="Your free summary, plus a vetted professional's judgement on your specific scheme and the likely route to consent."
              href={mailto("Full feasibility report")}
            />
            <ReportCard
              title="Planning likelihood report"
              price={`${gbp(CLIENT_PRICING.planningLikelihood)}`}
              desc="Your chances of getting permission, from nearby approvals and refusals and the site's constraints — and how to improve them."
              href={mailto("Planning likelihood report")}
            />
            <ReportCard
              title="Permitted development check"
              price={`${gbp(CLIENT_PRICING.pdCheck)}`}
              desc="A clear answer on whether you even need planning permission — with the reasons, for extensions, conversions and office-to-resi."
              href={mailto("Permitted development check")}
            />
            <ReportCard
              title="Investment appraisal review"
              price={`${gbp(CLIENT_PRICING.investmentReview)}`}
              desc="A professional pressure-tests your numbers — costs, values and risks — before you buy."
              href={mailto("Investment appraisal review")}
            />
          </div>
        </div>

        {/* Subscription */}
        <div className="mt-14 grid gap-6 rounded-2xl border border-sage-200 bg-sage-50/40 p-7 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <span className="rounded-full bg-sage-600 px-2.5 py-1 text-xs font-semibold text-white">For several projects</span>
            <h2 className="display mt-3 text-xl">PlotWorthy Plus — {gbp(CLIENT_PRICING.plusMonthly)}/month</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              The free plan covers one project. Plus is for when you&apos;re running more than one — with a
              guided adviser and a place to keep everything together.
            </p>
          </div>
          <ul className="space-y-2.5 text-sm">
            <Check>Run several projects at once (free plan covers one)</Check>
            <Check>A dedicated adviser to guide you through every stage</Check>
            <Check>Document &amp; quote vault — drawings, quotes and paperwork in one place</Check>
            <Check>Compare fee proposals side by side</Check>
            <li className="pt-2"><a href={mailto("PlotWorthy Plus")} className="btn-primary text-sm">Register interest in Plus</a></li>
          </ul>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted">
          The free tools work now. Expert-reviewed reports and Plus are indicative prices and exclude VAT —
          online payments are launching soon, so registering interest just puts you on the list; we&apos;ll
          confirm scope and pricing. Reports are general guidance, not professional or financial advice.
        </p>

        <div className="mt-8 text-center">
          <Link href="/brief" className="btn-outline">← Back to your dashboard</Link>
        </div>
      </div>
    </section>
  );
}

function ToolCard({ title, desc, href, cta }: { title: string; desc: string; href: string; cta: string }) {
  return (
    <div className="card flex flex-col border-sage-200 p-6">
      <h3 className="display text-lg">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{desc}</p>
      <div className="mt-4">
        <Link href={href} className="btn-primary w-full justify-center text-sm">{cta}</Link>
      </div>
    </div>
  );
}

function ReportCard({ title, price, desc, href }: { title: string; price: string; desc: string; href: string }) {
  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-serif text-base font-medium text-ink">{title}</h3>
        <span className="whitespace-nowrap rounded-full bg-cream px-2 py-0.5 text-xs font-semibold text-muted">{price}</span>
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{desc}</p>
      <div className="mt-4">
        <a href={href} className="btn-outline w-full justify-center text-xs">Register interest</a>
      </div>
    </div>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sage-100 text-[11px] font-bold text-sage-700">✓</span>
      <span className="text-ink/85">{children}</span>
    </li>
  );
}
