import Link from "next/link";
import { JoinForm } from "@/components/JoinForm";

export const metadata = { title: "Join as a professional — PlotWorthy" };

export default function JoinPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <div id="top" className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="kicker">
            <span className="kicker-num">01</span> Join as a professional
          </p>
          <h1 className="display mt-4 text-4xl sm:text-5xl">
            Better leads, better fit
          </h1>
          <p className="mt-4 leading-relaxed text-muted">
            PlotWorthy introduces you to clients at exactly the right moment in
            their project — not cold enquiries. Every introduction arrives with
            the context you need to give a confident, well-priced proposal.
          </p>

          <div className="mt-5">
            <Link href="/professional" className="btn-primary">Open the professional workspace →</Link>
          </div>

          <ul className="mt-8 space-y-4">
            {[
              ["A defined project", "You know the project type and scope before you reply."],
              ["A known property", "The address or clear search area is already established."],
              ["A clear current stage", "You meet the client exactly where they are in the journey."],
              ["A structured brief", "Goals, constraints and requirements, gathered up front."],
              ["Relevant documents", "Plans and information shared, not chased."],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                  <span className="font-medium text-ink">{t}. </span>
                  <span className="text-muted">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <JoinForm />
      </div>

      {/* Pricing */}
      <section className="mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Simple, transparent pricing</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">
            One flat membership. No per-lead charges.
          </h2>
          <p className="mt-3 text-muted">
            Cold-lead sites sell the same enquiry to a queue of firms and bill you
            per click. PlotWorthy introduces you to clients at the right stage,
            with a full brief — for one predictable fee.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[22rem_1fr] lg:items-start">
          {/* Base membership */}
          <div className="card p-7 ring-1 ring-sage-100">
            <div className="flex items-center justify-between">
              <h3 className="display text-xl">Membership</h3>
              <span className="rounded-full bg-clay-50 px-2.5 py-0.5 text-xs font-semibold text-clay-700 ring-1 ring-clay-100">
                Founding offer
              </span>
            </div>
            <p className="mt-4 flex items-baseline gap-1.5">
              <span className="display text-4xl">£39</span>
              <span className="text-muted">/ month</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              or £390/year. Founding members lock this rate for 12 months.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                "Vetted profile in the PlotWorthy network",
                "Coverage across 5 postcode districts",
                "Warm, stage-matched client introductions",
                "Full project brief with every introduction",
                "Submit fee proposals directly in the client's project",
                "No per-lead fees, ever",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <Check /> <span className="text-ink/85">{t}</span>
                </li>
              ))}
            </ul>
            <a href="#top" className="btn-primary mt-6 w-full">
              Apply to join
            </a>
          </div>

          {/* Add-ons */}
          <div>
            <h3 className="display text-xl">Grow when you’re ready</h3>
            <p className="mt-1 text-sm text-muted">
              Optional add-ons on top of membership — turn them on and off any time.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <AddOn
                name="Postcode packs"
                price="+£12 / mo"
                unit="per 5 districts"
                desc="Extend your coverage beyond the 5 districts included with membership."
              />
              <AddOn
                name="Enhanced profile"
                price="+£19 / mo"
                unit="priority placement"
                desc="Case-study gallery, richer profile, and priority placement when PlotWorthy recommends professionals in your area."
              />
              <AddOn
                name="Website link"
                price="+£9 / mo"
                unit="or included in Enhanced"
                desc="Your own website, linked from your verified profile — visible to clients and search engines, and a credibility signal for your practice."
              />
              <AddOn
                name="Vetting & onboarding"
                price="Free"
                unit="one-off"
                desc="We verify your accreditations and insurance before you appear to clients. No joining fee."
              />
            </div>
            <p className="mt-5 text-xs text-muted">
              Prices exclude VAT. Introductory rates for founding members; standard
              pricing applies as the network grows in your area.
            </p>
          </div>
        </div>
      </section>

      <p className="mt-16 text-center text-sm text-muted">
        Looking to start a project instead?{" "}
        <Link href="/start" className="font-medium text-sage-700 hover:underline">
          Start your journey
        </Link>
        .
      </p>
    </div>
  );
}

function Check() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function AddOn({
  name,
  price,
  unit,
  desc,
}: {
  name: string;
  price: string;
  unit: string;
  desc: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-medium text-ink">{name}</h4>
        <div className="text-right">
          <p className="text-sm font-semibold text-sage-700">{price}</p>
          <p className="text-[0.7rem] text-muted">{unit}</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted">{desc}</p>
    </div>
  );
}

