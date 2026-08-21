import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Save } from "lucide-react";
import { redirect } from "next/navigation";
import { updateProfessionalPublicProfile } from "@/app/professionals/profile/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Edit professional profile" };
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

export default async function EditProfessionalProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, supabase] = await Promise.all([searchParams, createSupabaseServerClient()]);
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/login?next=%2Fprofessionals%2Fprofile");
  const { data } = await supabase
    .from("professional_public_profiles")
    .select("slug,business_name,discipline,website,summary,postcodes,specialisms,verification_badges")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  if (!data) redirect("/professionals/join");
  const profile = data as PublicProfile;

  return <main><section className="page-hero"><div className="shell narrow"><p className="eyebrow">Approved professional profile</p><h1>Edit how your practice appears.</h1><p>Your approval status and verified discipline are controlled by PlotWorthy. You can keep your public description, service coverage and specialisms current.</p></div></section><section className="section"><div className="shell profile-edit-layout"><form className="profile-edit-form" action={updateProfessionalPublicProfile}>{saved ? <p className="form-success" role="status">Public profile updated.</p> : null}<div className="selected-profession"><span>Approved listing</span><strong>{profile.business_name}</strong><Link href={`/professionals/${profile.slug}`}>View profile <ArrowUpRight size={14} /></Link></div><label>Practice summary<textarea name="summary" defaultValue={profile.summary} rows={6} minLength={30} maxLength={1200} required /></label><label>Postcode areas covered<textarea name="postcodes" defaultValue={profile.postcodes.join(", ")} rows={3} maxLength={400} required /></label><label>Specialisms<textarea name="specialisms" defaultValue={profile.specialisms.join(", ")} rows={4} maxLength={600} required /></label><label>Website<input name="website" type="url" inputMode="url" defaultValue={profile.website ?? ""} placeholder="https://example.co.uk" /></label><button className="button" type="submit"><Save size={17} /> Save public profile</button></form><aside className="profile-verification-card"><BadgeCheck /><p className="eyebrow">Verification</p><h2>Approved by PlotWorthy</h2><p>Your public profile is live. Any membership badges shown here come from the evidence reviewed with your application.</p><div className="tag-row">{profile.verification_badges.length ? profile.verification_badges.map((badge) => <span key={badge}>{badge}</span>) : <span>Approved professional</span>}</div></aside></div></section></main>;
}
