import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/check", "/professionals", "/professionals/join", "/guides", "/about", "/contact", "/privacy", "/terms"];
  return [...routes.map((route) => ({ url: `${site.url}${route}`, lastModified: new Date(), changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : 0.7 })), ...guides.map((guide) => ({ url: `${site.url}/guides/${guide.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 }))];
}
