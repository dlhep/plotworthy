import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, MapPin, MapPinned, Search, ShieldCheck } from "lucide-react";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Find property professionals", description: "Find relevant local architects, builders, structural engineers and planning consultants for a better-prepared property project." };
export const dynamic = "force-dynamic";

type PublicProfile = {
  slug: string;
  business_name: string;
  discipline: string;
  postcodes: string[];
  specialisms: string[];
  summary: string;
  verification_badges: string[];
};

const disciplineLabels: Record<string, string> = {
  architect: "Architect",
  builder: "Builder",
  planning_consultant: "Planning consultant",
  structural_engineer: "Structural engineer"
};

export default async function ProfessionalsPage() {
  let professionals: PublicProfile[] = [];
  if (hasSupabaseConfig()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("professional_public_profiles")
      .select("slug,business_name,discipline,postcodes,specialisms,summary,verification_badges")
      .eq("status", "active")
      .order("business_name");
    professionals = (data ?? []) as PublicProfile[];
  }

  return <><section className="page-hero pro-hero"><div className="shell split-heading"><div><p className="eyebrow">Professional network</p><h1>Find the right expertise for the actual project.</h1></div><p>PlotWorthy matches by location, project type and relevant experience — with clearer briefs and no hidden auction for your contact details.</p></div></section><section className="section"><div className="shell"><div className="feature-grid three"><article className="feature-card"><span><Search /></span><h3>Relevant matching</h3><p>Search by postcode coverage, discipline and specialism rather than a generic directory listing.</p></article><article className="feature-card"><span><BadgeCheck /></span><h3>Visible credentials</h3><p>Approved profiles show the evidence supplied during application and the areas each professional covers.</p></article><article className="feature-card"><span><ShieldCheck /></span><h3>You stay in control</h3><p>Your email is verified before an enquiry and is only shared when you choose to contact or request a response.</p></article></div></div></section><section className="section section-soft"><div className="shell"><div className="section-heading"><p className="eyebrow">Approved directory</p><h2>Professionals ready for relevant projects.</h2><p>Only applications approved by PlotWorthy appear here.</p></div>{professionals.length ? <div className="professional-directory-grid">{professionals.map((profile) => <article className="professional-directory-card" key={profile.slug}><div className="profile-top"><span>{profile.business_name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</span><div><p className="eyebrow">{disciplineLabels[profile.discipline] ?? profile.discipline}</p><h3>{profile.business_name}</h3><p><MapPin size={15} /> {profile.postcodes.join(", ")}</p></div></div><p>{profile.summary}</p><div className="tag-row">{profile.specialisms.slice(0, 5).map((specialism) => <span key={specialism}>{specialism}</span>)}</div><div className="directory-card-footer"><span><BadgeCheck size={16} /> Approved</span><Link href={`/professionals/${profile.slug}`}>View profile <ArrowRight size={16} /></Link></div></article>)}</div> : <div className="empty-state"><BriefcaseBusiness /><h2>The founding directory is opening shortly</h2><p>Approved architects, builders, structural engineers and planning consultants will appear here as reviews are completed.</p></div>}</div></section><section className="section"><div className="shell marketplace-preview"><div><p className="eyebrow">Clear professional information</p><h2>What every approved profile tells you.</h2><ul className="tick-list"><li><MapPinned /> Areas genuinely covered</li><li><BriefcaseBusiness /> Relevant project and consent experience</li><li><BadgeCheck /> Checks completed and last reviewed</li><li><ShieldCheck /> How enquiries and fees are handled</li></ul></div><div className="profile-sample"><BadgeCheck /><p className="eyebrow">Controlled publishing</p><h3>Application first, public profile second.</h3><p>A professional cannot publish themselves. PlotWorthy creates the public listing only after an administrator records an approval decision.</p></div></div></section><section className="cta-band"><div className="shell"><div><p className="eyebrow">Are you a professional?</p><h2>Apply to join a higher-quality lead network.</h2></div><Link className="button button-light" href="/professionals/join">Apply to join <ArrowRight size={18} /></Link></div></section></>;
}
