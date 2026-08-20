import type { Metadata } from "next";
import { Mail, MessageSquareText } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <section className="page-hero contact-page"><div className="shell contact-grid"><div><p className="eyebrow">Contact PlotWorthy</p><h1>Tell us what you’re trying to work out.</h1><p>Questions about a property check, professional membership, data sources or an error are all welcome.</p><div className="contact-detail"><Mail /><div><strong>Email</strong><a href={`mailto:${site.email}`}>{site.email}</a></div></div></div><aside className="contact-card"><MessageSquareText /><h2>What to include</h2><ul><li>The property postcode, if relevant</li><li>What you were checking</li><li>The source or result that looks wrong</li><li>A screenshot or reference number</li></ul><a className="button button-wide" href={`mailto:${site.email}?subject=PlotWorthy%20enquiry`}>Start an email</a><p>We do not provide emergency, legal or site-safety advice.</p></aside></div></section>;
}
