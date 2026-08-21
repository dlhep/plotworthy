import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  CircleCheck,
  Globe2,
  ImagePlus,
  MapPinned,
  Save,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { redirect } from "next/navigation";
import { updateProfessionalPublicProfile } from "@/app/professionals/profile/actions";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Professional profile" };
export const dynamic = "force-dynamic";

type PublicProfile = {
  slug: string;
  business_name: string;
  discipline: string;
  website: string | null;
  summary: string;
  postcodes: string[];
  specialisms: string[];
  verification_badges: string[];
};

const demo: PublicProfile = {
  slug: "hepburn-architects",
  business_name: "Hepburn Architects",
  discipline: "architect",
  website: "https://hepburnarchitects.com",
  summary:
    "Residential architects helping homeowners and developers unlock confident planning and design decisions across Birmingham and the West Midlands.",
  postcodes: ["B1", "B15", "B16", "B17"],
  specialisms: ["Residential extensions", "Planning applications", "Conversions", "Feasibility studies"],
  verification_badges: ["PlotWorthy approved", "Architect"]
};

function titleCase(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default async function ProfessionalProfilePage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  let profile = demo;

  if (hasSupabaseConfig()) {
    const supabase = await createSupabaseServerClient();
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;

    if (!userId) redirect("/login?next=%2Fprofessional%2Fprofile");

    const { data } = await supabase
      .from("professional_public_profiles")
      .select("slug,business_name,discipline,website,summary,postcodes,specialisms,verification_badges")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (!data) redirect("/professionals/join");
    profile = data as PublicProfile;
  }

  const completionChecks = [
    Boolean(profile.business_name),
    Boolean(profile.website),
    profile.summary.length >= 80,
    profile.specialisms.length >= 3,
    profile.postcodes.length > 0,
    profile.verification_badges.length > 0
  ];
  const completion = Math.round((completionChecks.filter(Boolean).length / completionChecks.length) * 100);
  const discipline = titleCase(profile.discipline);

  return (
    <>
      <div className="workspace-page-heading profile-page-heading">
        <div>
          <p className="workspace-kicker">Account &amp; visibility</p>
          <h1>Professional profile</h1>
          <p>Keep your practice information clear, credible and ready for clients comparing professionals.</p>
        </div>
        <Link className="button button-ghost" href={`/professionals/${profile.slug}`}>
          View public profile <ArrowUpRight />
        </Link>
      </div>

      {saved ? (
        <div className="workspace-success" role="status">
          <CircleCheck /> Profile changes saved successfully.
        </div>
      ) : null}

      <nav className="profile-settings-tabs" aria-label="Professional account sections">
        <a className="active" href="#practice-details">Profile</a>
        <a href="#services">Services</a>
        <Link href="/professional/coverage">Locations</Link>
        <a href="#portfolio">Portfolio</a>
        <a href="#verification">Verification</a>
      </nav>

      <div className="profile-settings-layout">
        <aside className="profile-account-column">
          <section className="workspace-panel profile-completion-card">
            <div
              className="profile-completion-ring"
              style={{ background: `conic-gradient(#d5a62e ${completion * 3.6}deg, #e7e4dc 0deg)` }}
              aria-label={`${completion}% profile complete`}
            >
              <span>{initials(profile.business_name)}</span>
            </div>
            <h2>{profile.business_name}</h2>
            <p>{discipline}</p>
            <strong className="profile-completion-score">{completion}% complete</strong>
            <div className="profile-completion-list">
              <span><Check /> Practice details</span>
              <span><Check /> Services selected</span>
              <span><Check /> Coverage set</span>
            </div>
            <Link className="button button-wide" href={`/professionals/${profile.slug}`}>
              View public profile <ArrowUpRight />
            </Link>
          </section>

          <section className="workspace-panel profile-tip-card">
            <Sparkles />
            <div>
              <strong>Profiles with detail earn more trust</strong>
              <p>Add a concise description, focused services and a portfolio of relevant work.</p>
            </div>
          </section>
        </aside>

        <form className="profile-settings-main" action={updateProfessionalPublicProfile}>
          <section className="workspace-panel profile-settings-card" id="practice-details">
            <header className="profile-section-heading">
              <div>
                <p className="workspace-kicker">Profile details</p>
                <h2>Your practice</h2>
                <p>This information appears on your public profile and project responses.</p>
              </div>
              <span className="profile-section-complete"><CircleCheck /> Complete</span>
            </header>

            <div className="profile-form-grid">
              <label>
                Practice name
                <span className="profile-readonly-field"><Building2 /> {profile.business_name}</span>
                <small>Contact PlotWorthy support to change your verified practice name.</small>
              </label>
              <label>
                Professional discipline
                <span className="profile-readonly-field"><BadgeCheck /> {discipline}</span>
                <small>Your approved discipline is verified by PlotWorthy.</small>
              </label>
              <label className="profile-field-wide">
                Practice summary
                <textarea
                  name="summary"
                  defaultValue={profile.summary}
                  rows={6}
                  minLength={30}
                  maxLength={1200}
                  required
                />
                <small>Explain what you do, the clients you help and the value you bring. Aim for 80–180 words.</small>
              </label>
              <label className="profile-field-wide">
                Website
                <span className="profile-input-with-icon">
                  <Globe2 />
                  <input
                    name="website"
                    type="url"
                    inputMode="url"
                    defaultValue={profile.website ?? ""}
                    placeholder="https://example.co.uk"
                  />
                </span>
              </label>
            </div>
          </section>

          <section className="workspace-panel profile-settings-card" id="services">
            <header className="profile-section-heading">
              <div>
                <p className="workspace-kicker">Services</p>
                <h2>Specialisms &amp; project fit</h2>
                <p>Focused services help PlotWorthy show you the most relevant opportunities.</p>
              </div>
              <span className="profile-section-complete"><CircleCheck /> {profile.specialisms.length} selected</span>
            </header>
            <label className="profile-list-field">
              Your specialisms
              <textarea
                name="specialisms"
                defaultValue={profile.specialisms.join(", ")}
                rows={4}
                maxLength={600}
                required
              />
              <small>Separate services with commas—for example, extensions, conversions and planning applications.</small>
            </label>
            <div className="profile-chip-list" aria-label="Current specialisms">
              {profile.specialisms.map((specialism) => <span key={specialism}><Check /> {specialism}</span>)}
            </div>
          </section>

          <section className="workspace-panel profile-settings-card" id="portfolio">
            <header className="profile-section-heading">
              <div>
                <p className="workspace-kicker">Portfolio</p>
                <h2>Show clients the quality of your work</h2>
                <p>A clear project gallery will make it easier for clients to shortlist your practice.</p>
              </div>
              <span className="profile-coming-soon">Coming next</span>
            </header>
            <div className="profile-portfolio-preview">
              <div className="profile-portfolio-upload">
                <ImagePlus />
                <strong>Add project images</strong>
                <span>JPG, PNG or WebP</span>
              </div>
              {profile.specialisms.slice(0, 3).map((specialism, index) => (
                <div className={`profile-portfolio-placeholder profile-portfolio-placeholder-${index + 1}`} key={specialism}>
                  <span>Portfolio category</span>
                  <strong>{specialism}</strong>
                </div>
              ))}
            </div>
            <p className="profile-section-note">Portfolio uploads are the next profile feature. The layout is ready without presenting placeholder work as real client projects.</p>
          </section>

          <section className="profile-settings-split">
            <article className="workspace-panel profile-settings-card" id="verification">
              <header className="profile-section-heading compact">
                <div>
                  <p className="workspace-kicker">Verification</p>
                  <h2>Approved by PlotWorthy</h2>
                </div>
                <ShieldCheck />
              </header>
              <p className="profile-card-copy">Your approval is visible to clients and opportunities are unlocked for your professional account.</p>
              <div className="profile-chip-list verification">
                {profile.verification_badges.map((badge) => <span key={badge}><BadgeCheck /> {badge}</span>)}
              </div>
            </article>

            <article className="workspace-panel profile-settings-card">
              <header className="profile-section-heading compact">
                <div>
                  <p className="workspace-kicker">Service locations</p>
                  <h2>{profile.postcodes.length} postcode districts</h2>
                </div>
                <MapPinned />
              </header>
              <p className="profile-card-copy">Your selected districts control local-priority project alerts.</p>
              <div className="profile-chip-list coverage">
                {profile.postcodes.slice(0, 8).map((postcode) => <span key={postcode}>{postcode}</span>)}
              </div>
              <Link className="profile-text-link" href="/professional/coverage">Edit coverage map <ArrowUpRight /></Link>
            </article>
          </section>

          <input type="hidden" name="postcodes" value={profile.postcodes.join(", ")} />
          <div className="profile-save-bar">
            <div>
              <strong>Keep your profile current</strong>
              <span>Changes update your public listing after saving.</span>
            </div>
            <button className="button" type="submit"><Save /> Save changes</button>
          </div>
        </form>
      </div>
    </>
  );
}
