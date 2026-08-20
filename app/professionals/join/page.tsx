import type { Metadata } from "next";
import { CheckCircle2, Mail } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Join as a professional" };

export default function JoinPage() {
  return <><section className="page-hero"><div className="shell narrow"><p className="eyebrow">Founding professional network</p><h1>Better-context enquiries, matched to your work.</h1><p>We’re inviting architects, planning consultants and builders to help shape profiles, verification and lead controls before the marketplace opens widely.</p></div></section><section className="section"><div className="shell join-grid"><div><h2>Designed around fit, not volume</h2><ul className="benefit-list"><li><CheckCircle2 /> Set genuine postcode coverage</li><li><CheckCircle2 /> Select project types and specialisms</li><li><CheckCircle2 /> Show evidence behind verification</li><li><CheckCircle2 /> Control availability and contact</li><li><CheckCircle2 /> Receive a structured property brief</li></ul></div><aside className="join-card"><Mail /><p className="eyebrow">Early access</p><h2>Register your interest</h2><p>Tell us your discipline, coverage and the work you want to receive. We’ll reply with the current founding-member process; sending an email does not create a paid subscription.</p><a className="button button-wide" href={`mailto:${site.email}?subject=Professional%20network%20application&body=Name%3A%0ABusiness%3A%0ADiscipline%3A%0APostcodes%20covered%3A%0ASpecialisms%3A`}>Email your details</a><small>Marketplace fees and verification criteria will be shown before any commitment.</small></aside></div></section></>;
}
