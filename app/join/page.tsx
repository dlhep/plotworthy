import Link from "next/link";
import { JoinForm } from "@/components/JoinForm";

export const metadata = { title: "Join as a professional — PlotWorthy" };

export default function JoinPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
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

      <p className="mt-12 text-center text-sm text-muted">
        Looking to start a project instead?{" "}
        <Link href="/start" className="font-medium text-sage-700 hover:underline">
          Start your journey
        </Link>
        .
      </p>
    </div>
  );
}

