import Link from "next/link";

export const metadata = { title: "Terms of use — PlotWorthy" };

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="display mt-8 text-xl">{children}</h2>;
}

export default function TermsPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-2xl leading-relaxed text-muted">
        <p className="eyebrow">Legal</p>
        <h1 className="display mt-3 text-4xl">Terms of use</h1>
        <p className="mt-3 text-sm">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" })}</p>

        <p className="mt-6">
          These terms govern your use of PlotWorthy. By using the service you agree to them. If you do
          not agree, please do not use PlotWorthy.
        </p>

        <H>What PlotWorthy is</H>
        <p>
          PlotWorthy helps you understand a property project and, when you choose, introduces you to
          professionals in our network. We provide general guidance and information — not legal,
          planning, structural, financial or other professional advice. See{" "}
          <Link href="/trust" className="font-medium text-sage-700 hover:underline">how we work</Link>.
        </p>

        <H>Guidance, not advice</H>
        <p>
          Information on PlotWorthy (including project stages, local intelligence and cost indications) is
          for general guidance only and may be incomplete or out of date. You should confirm anything
          important with the relevant authority and take appropriate professional advice before making
          decisions.
        </p>

        <H>Introductions & professionals</H>
        <p>
          PlotWorthy introduces you to independent professionals; it does not provide their services and
          is not a party to any contract you enter into with them. While we vet professionals before they
          join the network (see <Link href="/trust" className="font-medium text-sage-700 hover:underline">what &ldquo;vetted&rdquo; means</Link>),
          you are responsible for satisfying yourself as to a professional&apos;s suitability, and any
          agreement you make with them is between you and them.
        </p>

        <H>Your account</H>
        <p>
          Keep your login details secure and give us accurate information. You must be old enough to enter
          a contract and use PlotWorthy lawfully. We may suspend accounts that misuse the service.
        </p>

        <H>Demonstration content</H>
        <p>
          Where the site shows example reports or example professional profiles, they are labelled as
          demonstration data and must not be relied on as real.
        </p>

        <H>Liability</H>
        <p>
          PlotWorthy is provided &ldquo;as is&rdquo;. To the extent permitted by law, we are not liable
          for decisions you make based on general guidance, for the acts or omissions of professionals,
          or for indirect or consequential loss. Nothing in these terms limits liability that cannot be
          limited by law.
        </p>

        <H>Contact</H>
        <p>
          Questions about these terms? Email{" "}
          <a href="mailto:hello@plotworthy.co.uk" className="font-medium text-sage-700 hover:underline">hello@plotworthy.co.uk</a>.
        </p>

        <p className="mt-8 rounded-xl border border-line bg-cream/50 px-4 py-3 text-sm">
          Company registration and registered-address details, and the governing-law jurisdiction, will
          be confirmed here once finalised.
        </p>
      </div>
    </div>
  );
}
