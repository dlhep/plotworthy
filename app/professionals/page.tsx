import Link from "next/link";

export const metadata = { title: "Find a professional — PlotWorthy" };

const roles = [
  { name: "Architect", stages: "Viability, permission, buildable" },
  { name: "Planning consultant", stages: "Viability, permission" },
  { name: "Structural engineer", stages: "Make it buildable" },
  { name: "Fire consultant", stages: "Make it buildable" },
  { name: "Surveyor / valuer", stages: "The property" },
  { name: "Builder / contractor", stages: "Deliver the project" },
  { name: "Letting / lease adviser", stages: "Complete and operate" },
  { name: "Licensing & care specialist", stages: "HMO & care projects" },
];

export default function ProfessionalsPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="kicker justify-center">
          <span className="kicker-num">01</span> Find a professional
        </p>
        <h1 className="display mt-4 text-4xl sm:text-5xl">
          The right professional, at the right moment
        </h1>
        <p className="mt-4 text-muted">
          PlotWorthy isn’t a directory to wade through. The best way to meet a
          professional is through your journey — they’ll receive a defined
          project, a known property and a clear brief, so you get better
          proposals, faster.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/start" className="btn-primary">Start your journey</Link>
          <Link href="/journeys/hmo" className="btn-outline">See professionals in context</Link>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="font-serif text-2xl text-ink">Professionals you may meet</h2>
        <p className="mt-2 text-muted">
          Each is introduced at the stage where they add the most value.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {roles.map((r) => (
            <div key={r.name} className="card flex items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-medium text-ink">{r.name}</p>
                <p className="mt-0.5 text-xs text-muted">Introduced at: {r.stages}</p>
              </div>
              <span className="rounded-full bg-sage-50 px-3 py-1 text-xs font-medium text-sage-700">
                Vetted
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-4xl rounded-2xl border border-line bg-cream/50 px-6 py-8 text-center">
        <h2 className="font-serif text-xl text-ink">Are you a professional?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          Join PlotWorthy to receive better leads — clients with a defined
          project, a known property, a clear stage and a structured brief.
        </p>
        <Link href="/join" className="btn-primary mt-5">Join as a professional</Link>
      </div>
    </div>
  );
}
