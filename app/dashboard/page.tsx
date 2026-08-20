import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, FileText, Plus, UserRoundCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  if (!hasSupabaseConfig()) return <DashboardEmpty preview />;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login");
  const [{ count: savedCount }, { count: reportCount }, { count: leadCount }] = await Promise.all([
    supabase.from("saved_properties").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("report_runs").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("user_id", userId)
  ]);
  return <DashboardEmpty counts={{ saved: savedCount ?? 0, reports: reportCount ?? 0, enquiries: leadCount ?? 0 }} />;
}

function DashboardEmpty({ preview = false, counts = { saved: 0, reports: 0, enquiries: 0 } }: { preview?: boolean; counts?: { saved: number; reports: number; enquiries: number } }) {
  return <><section className="dashboard-head"><div className="shell"><div><p className="eyebrow">Your workspace</p><h1>Property decisions, kept in one place.</h1><p>{preview ? "Account data will appear here once Supabase is configured for this environment." : "Save evidence, track report checks and control professional enquiries."}</p></div><Link className="button" href="/check"><Plus size={18} /> New property check</Link></div></section><section className="section"><div className="shell stat-grid"><article><Bookmark /><strong>{counts.saved}</strong><span>Saved properties</span></article><article><FileText /><strong>{counts.reports}</strong><span>Report runs</span></article><article><UserRoundCheck /><strong>{counts.enquiries}</strong><span>Professional enquiries</span></article></div><div className="shell empty-state"><FileText /><h2>Your next property will appear here</h2><p>Run a preliminary check, verify the email for your account and save the record when you are ready.</p><Link className="button button-ghost" href="/check">Check a property</Link></div></section></>;
}
