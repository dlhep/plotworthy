import Link from "next/link";

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

        <div className="card p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-ink">Register your interest</h2>
          <p className="mt-1 text-sm text-muted">
            Tell us a little about your practice and we’ll be in touch about
            joining the vetted network.
          </p>

          <form className="mt-6 space-y-4" action="/join?submitted=1">
            <Field label="Your name" name="name" placeholder="Jordan Fletcher" />
            <Field label="Practice / company" name="company" placeholder="Fletcher Design Ltd" />
            <Field label="Email" name="email" type="email" placeholder="you@example.com" />
            <div>
              <label htmlFor="discipline" className="block text-sm font-medium text-ink">
                Discipline
              </label>
              <select
                id="discipline"
                name="discipline"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200"
              >
                <option>Architect</option>
                <option>Planning consultant</option>
                <option>Structural engineer</option>
                <option>Fire consultant</option>
                <option>Surveyor / valuer</option>
                <option>Builder / contractor</option>
                <option>Letting / lease adviser</option>
                <option>Licensing / care specialist</option>
                <option>Other</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full">
              Register interest
            </button>
            <p className="text-center text-xs text-muted">
              This is a demonstration form. No data is stored yet.
            </p>
          </form>
        </div>
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

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200"
      />
    </div>
  );
}
