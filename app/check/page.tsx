import type { Metadata } from "next";
import { CheckForm } from "@/components/check-form";

export const metadata: Metadata = { title: "Check a property", description: "Build a preliminary evidence-led property feasibility snapshot." };

export default function CheckPage() {
  return <section className="page-hero check-page"><div className="shell narrow"><p className="eyebrow">Free preliminary check</p><h1>Start with the property, not a promise.</h1><p>We’ll verify the location and show the evidence needed to assess your idea properly. Unknowns are labelled — never filled with guesswork.</p><CheckForm /></div></section>;
}
