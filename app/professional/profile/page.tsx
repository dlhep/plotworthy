import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Save } from "lucide-react";
import { redirect } from "next/navigation";
import { updateProfessionalPublicProfile } from "@/app/professionals/profile/actions";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Public profile" };
export const dynamic = "force-dynamic";
type PublicProfile = { slug: string; business_name: string; discipline: string; website: string | null; summary: string; postcodes: string[]; specialisms: string[]; verification_badges: string[] };
const demo: PublicProfile = { slug: "hepburn-architects", business_name: "Hepburn Architects", discipline: "architect", website: "https://hepburnarchitects.com", summary: "Residential architects helping homeowners and developers unlock confident planning and design decisions across Birmingham and the West Midlands.", postcodes: ["B1", "B15", "B16", "B17"], specialisms: ["Residential extensions", "Planning applications", "Conversions", "Feasibility studies"], verification_badges: ["PlotWorthy approved", "Architect"] };

export default async function ProfessionalProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  let profile = demo;
  if (hasSupabaseConfig()) {
    const supabase = await createSupabaseServerClient();
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;
    if (!userId) redirect("/login?next=%2Fprofessional%2Fprofile");
    const { data } = await supabase.from("professional_public_profiles").select("slug,business_name,discipline,website,summary,postcodes,specialisms,verification_badges").eq("user_id", userId).eq("status", "active").maybeSingle();
    if (!data) redirect("/professionals/join");
    profile = data as PublicProfile;
  }
  return <><div className="workspace-page-heading"><div><p className="workspace-kicker">Approved listing</p><h1>Public profile</h1><p>Keep your practice description and specialisms clear for clients comparing quotes.</p></div><Link className="button button-ghost" href={`/professionals/${profile.slug}`}>View public profile <ArrowUpRight /></Link></div>{saved ? <div className="workspace-success">Public profile updated.</div> : null}<div className="workspace-profile-grid"><form className="workspace-panel profile-edit-form" action={updateProfessionalPublicProfile}><div className="workspace-panel-heading"><div><p className="workspace-kicker">Practice details</p><h2>{profile.business_name}</h2></div><span className="workspace-status workspace-status-approved">approved</span></div><label>Practice summary<textarea name="summary" defaultValue={profile.summary} rows={6} minLength={30} maxLength={1200} required /></label><label>Specialisms<textarea name="specialisms" defaultValue={profile.specialisms.join(", ")} rows={4} maxLength={600} required /></label><label>Website<input name="website" type="url" inputMode="url" defaultValue={profile.website ?? ""} placeholder="https://example.co.uk" /></label><input type="hidden" name="postcodes" value={profile.postcodes.join(", ")} /><button className="button" type="submit"><Save /> Save profile</button></form><aside className="workspace-side-stack"><section className="workspace-panel profile-verification-card"><BadgeCheck /><p className="workspace-kicker">Verification</p><h2>Approved by PlotWorthy</h2><p>Your verified discipline is controlled by PlotWorthy. Coverage can be managed separately on the visual map.</p><div className="tag-row">{profile.verification_badges.map((badge) => <span key={badge}>{badge}</span>)}</div></section><section className="workspace-panel coverage-card"><div><p className="workspace-kicker">Project coverage</p><h2>{profile.postcodes.length} districts selected</h2><p>{profile.postcodes.join(", ")}</p></div><Link href="/professional/coverage">Edit coverage <ArrowUpRight /></Link></section></aside></div></>;
}
