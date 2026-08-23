import { ProjectIcon } from "@/components/Icons";

export default function ProfilePage() {
  const reviews = [
    ["Sarah & Tom, B14", "Guided our HMO through planning and fire compliance without fuss. Clear, calm and responsive."],
    ["Priya, B13", "Turned our tired semi into a brilliant house-to-flats scheme. Highly recommend."],
  ];
  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur sm:px-8 sm:py-3.5">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted">Professional workspace</p>
          <p className="font-serif text-lg font-medium text-ink">Public profile</p>
        </div>
      </div>
      <div className="max-w-[70rem] p-4 sm:p-8">
        <p className="mb-4 text-sm text-muted">This is how clients see you when PlotWorthy introduces you or they browse professionals.</p>
        <div className="card flex flex-wrap items-start gap-5 p-6">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-sage-100 font-serif text-2xl font-semibold text-sage-700">SS</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="display text-2xl">Sample Studio</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-sage-50 px-2.5 py-1 text-xs font-bold text-sage-700">✓ Vetted &amp; approved</span>
            </div>
            <p className="mt-1 text-sm text-muted">Architect · Birmingham &amp; West Midlands</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted">
              <span className="font-semibold text-clay-600">★ 4.9</span>
              <span>62 projects</span>
              <span>Typically replies within 1 day</span>
            </div>
            <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-ink/85">
              Residential-focused practice specialising in HMOs, house-to-flat conversions and extensions. Strong on feasibility,
              planning-led design and buildable detailing.
            </p>
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {["HMO conversions", "House to flats", "Extensions", "Planning & feasibility"].map((t) => (
                <span key={t} className="rounded-full border border-line bg-white px-3 py-1 text-xs text-ink/80">{t}</span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-primary btn">Request introduction</button>
              <button className="btn-outline btn">Message</button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <div>
            <h3 className="display mb-2 text-lg">Coverage area</h3>
            <p className="max-w-xl text-sm text-muted">
              Serving Birmingham &amp; the West Midlands. Clients don’t see the exact districts a
              professional covers — when you request an introduction, we simply confirm they work in
              your postcode.
            </p>
            <p className="mt-2 text-xs text-muted">
              Your specific coverage and any postcode packs are private to your account.
            </p>
          </div>
          <div>
            <h3 className="display mb-2 text-lg">Selected work</h3>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex aspect-[4/3] items-center justify-center rounded-xl border border-line bg-gradient-to-br from-sage-100 to-cream text-sage-600">
                  <ProjectIcon type="extension" className="h-7 w-7" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="display mb-2 text-lg">What clients say</h3>
            <div className="grid gap-3">
              {reviews.map((r) => (
                <div key={r[0]} className="card p-5">
                  <div className="text-clay-500">★★★★★</div>
                  <p className="mt-2 text-sm text-ink/85">“{r[1]}”</p>
                  <p className="mt-2 text-xs text-muted">{r[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
