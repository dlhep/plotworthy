import Link from "next/link";

export const metadata = { title: "Privacy policy — PlotWorthy" };

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="display mt-8 text-xl">{children}</h2>;
}

export default function PrivacyPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-2xl leading-relaxed text-muted">
        <p className="eyebrow">Legal</p>
        <h1 className="display mt-3 text-4xl">Privacy policy</h1>
        <p className="mt-3 text-sm">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" })}</p>

        <p className="mt-6">
          This policy explains what personal information PlotWorthy collects, why, and your rights over
          it. PlotWorthy is the data controller for the information you give us. Questions? Email{" "}
          <a href="mailto:hello@plotworthy.co.uk" className="font-medium text-sage-700 hover:underline">hello@plotworthy.co.uk</a>.
        </p>

        <H>What we collect</H>
        <p>
          Account details (name, email, password — stored securely and never in plain text); your
          project information (goal, property or postcode, brief answers, documents you add); messages
          you send us; and basic technical data (such as device/browser information and essential
          cookies) needed to run the service securely.
        </p>

        <H>Why we use it</H>
        <p>
          To provide the service — save your project, show relevant local information, and (only when you
          ask) introduce you to professionals; to keep the service secure; to respond to you; and, where
          you have an account, to send service-related messages. We rely on your consent and on our
          legitimate interest in operating PlotWorthy, as applicable.
        </p>

        <H>Who we share it with</H>
        <p>
          We do not sell your personal data, and we do not share your project or contact details with
          professionals unless <strong>you</strong> choose to request an introduction. We use trusted
          service providers to run PlotWorthy (for example hosting, database and email delivery) who
          process data on our behalf under contract.
        </p>

        <H>How long we keep it</H>
        <p>
          We keep your account and project data for as long as your account is active, and for a
          reasonable period afterwards, then delete or anonymise it. You can ask us to delete your
          account at any time.
        </p>

        <H>Your rights</H>
        <p>
          You can access, correct, export or delete your personal data, and object to or restrict certain
          processing. To exercise any right, email{" "}
          <a href="mailto:hello@plotworthy.co.uk" className="font-medium text-sage-700 hover:underline">hello@plotworthy.co.uk</a>.
          In the UK you can also complain to the Information Commissioner&apos;s Office (ico.org.uk).
        </p>

        <H>Cookies</H>
        <p>
          We use essential cookies to keep you signed in and secure. See our{" "}
          <Link href="/cookies" className="font-medium text-sage-700 hover:underline">Cookie policy</Link> for details.
        </p>

        <p className="mt-8 rounded-xl border border-line bg-cream/50 px-4 py-3 text-sm">
          Company registration and registered-address details will be added here once finalised, alongside
          any data-protection registration reference.
        </p>
      </div>
    </div>
  );
}
