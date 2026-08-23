import Link from "next/link";
import { ProfessionalFinder } from "@/components/ProfessionalFinder";

export const metadata = {
  title: "Find a professional — PlotWorthy",
  description:
    "Find vetted architects, planning consultants, builders and other professionals covering your postcode for your type of property project.",
};

export default function ProfessionalsPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow justify-center">Find a professional</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">
          Vetted professionals for your area
        </h1>
        <p className="mt-4 text-muted">
          Choose your postcode and project type to see vetted professionals — architects, planning
          consultants, builders and more — who cover your area for that kind of work.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-4xl">
        <ProfessionalFinder />
      </div>

      <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-line bg-cream/50 px-6 py-8 text-center">
        <h2 className="font-serif text-xl text-ink">Are you a professional?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          Join PlotWorthy to receive better leads — clients with a defined project, a known
          property, a clear stage and a structured brief.
        </p>
        <Link href="/join" className="btn-primary mt-5">Join as a professional</Link>
      </div>
    </div>
  );
}
