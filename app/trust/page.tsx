import Link from "next/link";

export const metadata = {
  title: "Trust, transparency & how we work — PlotWorthy",
  description:
    "What 'vetted' means, how PlotWorthy makes money, whether professionals pay for introductions, where our data comes from, and the difference between guidance and professional advice.",
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line pt-8">
      <h2 className="display text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function TrustPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Trust &amp; transparency</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">How PlotWorthy works — honestly</h1>
        <p className="mt-4 leading-relaxed text-muted">
          PlotWorthy only works if you can trust it. This page explains, in plain terms, what
          &ldquo;vetted&rdquo; means, how we make money, whether professionals pay us, where our
          information comes from, and where our guidance ends and professional advice begins.
        </p>

        <div className="mt-6 rounded-xl border border-clay-200 bg-clay-50/60 px-4 py-3 text-sm text-clay-800">
          <strong>PlotWorthy is in build.</strong> While we connect verified data sources and onboard our
          first professionals, example reports and profiles on the site are clearly labelled
          &ldquo;demonstration data&rdquo; and must not be relied on.
        </div>

        <div className="mt-10 space-y-8">
          <Section id="vetted" title="What “vetted” means">
            <p>
              Before a professional appears to clients or receives an introduction, we intend to check:
              their identity and the practice they represent; relevant professional accreditations
              (for example ARB/RIBA for architects, RTPI for planners, or equivalent for other
              disciplines); and current professional indemnity insurance. We also require them to agree
              to our conduct standards.
            </p>
            <p>
              &ldquo;Vetted&rdquo; means these checks have been completed — it is not a guarantee of
              outcome or quality, and it does not replace your own judgement. Always confirm a
              professional&apos;s credentials and references before you appoint them.
            </p>
          </Section>

          <Section id="money" title="How PlotWorthy makes money">
            <p>
              Professionals pay a simple, flat membership to be part of the network. Clients use the
              core journey — your project roadmap, local checks and professional introductions — for
              free. We also offer optional paid extras for clients (such as an expert brief review or a
              project cost check) that you can choose to buy, or not.
            </p>
            <p>
              We do <strong>not</strong> sell the same enquiry to a queue of firms, and we do
              <strong> not</strong> charge professionals per lead. Our aim is to be paid for making
              genuinely good introductions, not for volume.
            </p>
          </Section>

          <Section id="introductions" title="Do professionals pay for introductions?">
            <p>
              Professionals pay a fixed monthly membership, not a fee per introduction or per lead. A
              professional&apos;s membership or coverage area does not let them pay to rank above a
              better-matched professional for your project. Where a professional has chosen an enhanced
              listing, it is labelled as such.
            </p>
          </Section>

          <Section id="data" title="Where our information comes from & accuracy">
            <p>
              Local project intelligence — Article 4 status, HMO saturation, nearby planning history and
              approval rates — is intended to draw on public sources such as the local authority&apos;s
              Article 4 maps, the public HMO licensing register, and official planning records
              (council portals / Planning Data).
            </p>
            <p>
              Public records can be incomplete, out of date, or open to interpretation. PlotWorthy&apos;s
              figures are a starting point to help you ask better questions — not a substitute for
              confirming the position directly with the local authority. Any report shown before our live
              data sources are connected is clearly marked as demonstration data.
            </p>
          </Section>

          <Section id="criteria" title="Professional membership & verification criteria">
            <p>
              To join and remain in the network, a professional must: operate a genuine practice in the
              discipline they list; hold the accreditations and insurance relevant to their work; keep
              their details current; and act in line with our conduct standards. We may suspend or remove
              a professional who no longer meets these criteria or about whom we receive substantiated
              concerns.
            </p>
          </Section>

          <Section id="advice" title="Guidance vs professional advice">
            <p>
              PlotWorthy provides general guidance and information to help you understand and navigate a
              property project. It is not legal, planning, structural, financial or other professional
              advice, and it is not a substitute for advice from a suitably qualified professional who
              has assessed your specific circumstances.
            </p>
            <p>
              Decisions about your property — including planning strategy, design, structural work and
              costs — should be taken with appropriate professional advice.
            </p>
          </Section>

          <Section id="contact" title="Who we are & how to reach us">
            <p>
              PlotWorthy is a trading name operated by its owner. Contact us any time at{" "}
              <a href="mailto:hello@plotworthy.co.uk" className="font-medium text-sage-700 hover:underline">
                hello@plotworthy.co.uk
              </a>
              .
            </p>
            <p className="text-sm">
              See also our{" "}
              <Link href="/privacy" className="font-medium text-sage-700 hover:underline">Privacy policy</Link>,{" "}
              <Link href="/terms" className="font-medium text-sage-700 hover:underline">Terms of use</Link> and{" "}
              <Link href="/cookies" className="font-medium text-sage-700 hover:underline">Cookie policy</Link>.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
