import Link from "next/link";

export const metadata = {
  title: "FAQ — PlotWorthy | How our property project adviser works",
  description:
    "Answers to common questions about PlotWorthy — how the journey works, what it costs, how professionals are vetted, coverage across England & Wales, and the optional adviser and report add-ons.",
};

type QA = { q: string; a: string };
type Section = { title: string; items: QA[] };

const SECTIONS: Section[] = [
  {
    title: "Getting started",
    items: [
      {
        q: "What is PlotWorthy?",
        a: "PlotWorthy is a journey-first property project adviser. It shows you, step by step, what happens on a project like an extension, a house-to-flats conversion, an office-to-residential scheme, an HMO or a care development — and introduces the right vetted professional exactly when you need them, so you never have to work out who to speak to next on your own.",
      },
      {
        q: "How much does PlotWorthy cost?",
        a: "The core journey is free. Creating your project brief, seeing your stage-by-stage journey, and being introduced to vetted professionals for fee quotes costs nothing — you only pay the professionals for work you choose to commission. Optional extras (an expert review of your brief, a project cost check, a guided adviser, or PlotWorthy Plus for running several projects) are available if you want them.",
      },
      {
        q: "Do I need an account to use PlotWorthy?",
        a: "Yes. You create a free account with your email and a password, verify your email, and log in. That keeps your project saved securely to you and available on any device, and it means your details are only shared with a professional when you choose to.",
      },
      {
        q: "What is a project brief?",
        a: "Your project brief is the first thing you make on PlotWorthy. It captures what you want to do, the property, and the practical details a professional needs — so a vetted professional can come back with an accurate fee proposal instead of a dozen questions.",
      },
    ],
  },
  {
    title: "Professionals & quotes",
    items: [
      {
        q: "Which professionals are on PlotWorthy?",
        a: "The network covers the disciplines a property project needs: architects, planning consultants, structural and fire engineers, surveyors and valuers, builders and contractors, and specialists such as HMO licensing and care registration advisers.",
      },
      {
        q: "How are professionals vetted?",
        a: "Every professional applies to join and is reviewed before they appear to clients — we check their accreditations and insurance. Only approved professionals are shown, and any professional can be paused if needed.",
      },
      {
        q: "How do I get fee quotes?",
        a: "Once your brief is ready, you share it with vetted professionals who cover your postcode and they come back with fee proposals. Sharing your brief is free — you only pay for the work you commission.",
      },
      {
        q: "What areas do you cover?",
        a: "PlotWorthy works across England & Wales. Professionals are matched to your project by the property's postcode, so you're introduced to people who genuinely cover your area for your type of project.",
      },
      {
        q: "Is my information private?",
        a: "Yes. Your project stays private to your account. Nothing is shared with a professional until you choose to, and a professional's exact coverage is never exposed to other users — you simply see that they cover your area.",
      },
    ],
  },
  {
    title: "Optional extras",
    items: [
      {
        q: "What is an expert brief review?",
        a: "It's an optional one-off service where a vetted professional reads your brief before it goes out — strengthening it, filling gaps, and flagging anything that would slow down or inflate a fee quote — so you get sharper, more accurate proposals.",
      },
      {
        q: "What is a project cost check?",
        a: "Before you commit to a builder, an independent professional reviews the costings you've been quoted so you can see whether they're realistic and fair for the work — helping you avoid over-paying or nasty surprises mid-build. Similar one-off checks can cover leasing, sourcing and other project fees.",
      },
      {
        q: "Can I have someone guide me through it?",
        a: "Yes — with a guided adviser you get a dedicated point of contact who walks you through each stage of your project, so you always know what's happening now and what's next. It's part of PlotWorthy Plus.",
      },
      {
        q: "Can I run more than one project?",
        a: "The free plan covers a single project. PlotWorthy Plus lets you run several projects at once and keeps everything organised with a document and quote vault, so you can compare fee proposals side by side.",
      },
    ],
  },
  {
    title: "For professionals",
    items: [
      {
        q: "How do I join as a professional?",
        a: "Apply through the Join as a professional page. We verify your accreditations and insurance, and once approved you're live to clients and start receiving local project introductions.",
      },
      {
        q: "What does membership cost?",
        a: "Professionals pay a monthly membership, with optional add-ons such as extra postcode coverage, an enhanced profile, and a website link. Vetting and onboarding are free.",
      },
    ],
  },
];

const ALL_QA = SECTIONS.flatMap((s) => s.items);

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL_QA.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: { "@type": "Answer", text: qa.a },
    })),
  };

  return (
    <section className="container-content py-14 sm:py-20">
      {/* FAQPage structured data — valid schema; aids AI answer engines. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="eyebrow justify-center">Questions &amp; answers</p>
          <h1 className="display mt-2 text-3xl sm:text-4xl">Frequently asked questions</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            How PlotWorthy works, what it costs, and how we introduce you to vetted professionals
            across England &amp; Wales.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="display text-xl text-ink">{section.title}</h2>
              <dl className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
                {section.items.map((qa) => (
                  <div key={qa.q} className="px-6 py-5">
                    <dt className="font-medium text-ink">{qa.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted">{qa.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-sage-200 bg-sage-50/40 px-6 py-6 text-center">
          <h2 className="display text-lg">Still have a question?</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">
            Start your journey to see your project mapped out, or get in touch and we&apos;ll help.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link href="/start" className="btn-primary">Start your journey →</Link>
            <a href="mailto:hello@plotworthy.co.uk" className="btn-outline">Email us</a>
          </div>
        </div>
      </div>
    </section>
  );
}
