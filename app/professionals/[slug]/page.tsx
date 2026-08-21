import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PublicProfile = {
  slug: string;
  business_name: string;
  discipline: string;
  postcodes: string[];
  specialisms: string[];
  website: string | null;
  summary: string;
  verification_badges: string[];
  published_at: string;
};

const disciplineLabels: Record<string, string> = {
  architect: "Architect",
  builder: "Builder",
  planning_consultant: "Planning consultant",
  structural_engineer: "Structural engineer"
};

async function getProfile(slug: string) {
  if (!hasSupabaseConfig()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("professional_public_profiles")
    .select("slug,business_name,discipline,postcodes,specialisms,website,summary,verification_badges,published_at")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  return data as PublicProfile | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);
  return profile ? { title: profile.business_name, description: profile.summary } : { title: "Professional profile" };
}

export default async function ProfessionalProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) notFound();

  return <main><section className="professional-profile-hero"><div className="shell"><Link className="back-link" href="/professionals"><ArrowLeft size={17} /> All professionals</Link><div className="public-profile-heading"><div className="profile-monogram">{profile.business_name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</div><div><p className="eyebrow">{disciplineLabels[profile.discipline] ?? profile.discipline}</p><h1>{profile.business_name}</h1><p><MapPin size={17} /> {profile.postcodes.join(", ")}</p></div></div></div></section><section className="section"><div className="shell public-profile-layout"><article className="public-profile-main"><p className="eyebrow">About the practice</p><h2>Relevant expertise for well-prepared projects.</h2><p>{profile.summary}</p><h3>Specialisms</h3><div className="tag-row">{profile.specialisms.map((specialism) => <span key={specialism}>{specialism}</span>)}</div>{profile.website ? <a className="button button-ghost" href={profile.website} target="_blank" rel="noreferrer">Visit practice website <ExternalLink size={17} /></a> : null}</article><aside className="public-profile-verification"><BadgeCheck /><p className="eyebrow">PlotWorthy status</p><h2>Approved professional</h2><p>PlotWorthy has reviewed the application information supplied by this professional.</p><ul><li><ShieldCheck size={17} /> Professional application approved</li><li><MapPin size={17} /> Coverage areas declared</li></ul><div className="tag-row">{profile.verification_badges.map((badge) => <span key={badge}>{badge}</span>)}</div><small>Listed since {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(profile.published_at))}</small></aside></div></section></main>;
}
