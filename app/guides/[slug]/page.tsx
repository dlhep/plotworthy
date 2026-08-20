import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { getGuide, guides } from "@/lib/guides";

export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  return guide ? { title: guide.title, description: guide.summary } : {};
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  return <article className="article-page"><header className="article-head"><div className="shell article-shell"><Link className="back-link" href="/guides"><ArrowLeft size={17} /> All guides</Link><p className="eyebrow">{guide.category} · {guide.readTime}</p><h1>{guide.title}</h1><p>{guide.summary}</p></div></header><div className="shell article-layout"><div className="article-body">{guide.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</div><aside className="article-aside"><ShieldCheck /><h3>Important</h3><p>This guide is general information, not advice for a specific property. Rules, policy and mapped constraints can change.</p><a href="https://www.planningportal.co.uk/permission" target="_blank" rel="noreferrer">Planning Portal guidance <ExternalLink size={15} /></a><Link className="button" href="/check">Check a property</Link></aside></div></article>;
}
