import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { guides } from "@/lib/guides";

export const metadata: Metadata = { title: "Property planning guides", description: "Clear UK planning and property feasibility guides without false certainty." };

export default function GuidesPage() {
  return <><section className="page-hero"><div className="shell"><p className="eyebrow">Plain-English library</p><h1>Make sense of the first planning questions.</h1><p>Practical introductions that tell you what to verify — and where a professional judgement is still needed.</p></div></section><section className="section"><div className="shell guide-grid">{guides.map((guide) => <article className="guide-card" key={guide.slug}><span className="guide-icon"><BookOpen /></span><div><p className="eyebrow">{guide.category} · {guide.readTime}</p><h2>{guide.title}</h2><p>{guide.summary}</p><Link href={`/guides/${guide.slug}`}>Read the guide <ArrowRight size={17} /></Link></div></article>)}</div></section></>;
}
