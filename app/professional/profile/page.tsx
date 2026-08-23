import { getProfessionalForUser } from "@/lib/professionalAuth";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { pro } = await getProfessionalForUser();
  if (!pro) return null;

  const firm = pro.company || pro.name;
  const initials =
    firm
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PW";

  const tags = [pro.discipline, pro.accreditations].filter(Boolean) as string[];

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line bg-canvas px-4 py-3 sm:px-8 sm:py-3.5">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted">Professional workspace</p>
          <p className="font-serif text-lg font-medium text-ink">Public profile</p>
        </div>
      </div>
      <div className="max-w-[70rem] p-4 sm:p-8">
        <p className="mb-4 text-sm text-muted">This is how clients see you when PlotWorthy introduces you.</p>

        <div className="card flex flex-wrap items-start gap-5 p-6">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-sage-100 font-serif text-2xl font-semibold text-sage-700">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="display text-2xl">{firm}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-sage-50 px-2.5 py-1 text-xs font-bold text-sage-700">✓ Vetted &amp; approved</span>
            </div>
            <p className="mt-1 text-sm text-muted">{pro.discipline}</p>
            {pro.about ? (
              <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-ink/85">{pro.about}</p>
            ) : (
              <p className="mt-3.5 max-w-2xl text-sm italic text-muted">
                Add an “about” so clients get a feel for your practice.
              </p>
            )}
            {tags.length > 0 && (
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t} className="rounded-full border border-line bg-white px-3 py-1 text-xs text-ink/80">{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <div>
            <h3 className="display mb-2 text-lg">Coverage area</h3>
            <p className="max-w-xl text-sm text-muted">
              {pro.coverage ? <>You cover {pro.coverage} and the surrounding area. </> : "Set your coverage so we introduce you to the right clients. "}
              Clients don&apos;t see the exact districts you cover — when they request an introduction,
              we simply confirm you work in their postcode.
            </p>
            <p className="mt-2 text-xs text-muted">
              Your specific coverage and any postcode packs are private to your account.
            </p>
          </div>

          <div>
            <h3 className="display mb-2 text-lg">Verified details</h3>
            <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
              <Row k="Insurance" v={pro.insurance} />
              <Row k="Accreditations" v={pro.accreditations} />
              <Row k="Website" v={pro.website} link />
              <Row k="Contact" v={pro.email} />
            </dl>
          </div>

          <div>
            <h3 className="display mb-2 text-lg">What clients say</h3>
            <div className="rounded-2xl border border-dashed border-line bg-cream/40 px-6 py-8 text-center text-sm text-muted">
              No reviews yet — reviews from clients you work with through PlotWorthy will show here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, link }: { k: string; v: string | null; link?: boolean }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted">{k}:</dt>
      <dd className="min-w-0 truncate text-ink/85">
        {v && link ? (
          <a href={/^https?:\/\//.test(v) ? v : `https://${v}`} target="_blank" rel="noopener noreferrer" className="text-sage-700 hover:underline">
            {v}
          </a>
        ) : (
          v || "—"
        )}
      </dd>
    </div>
  );
}
