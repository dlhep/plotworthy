export const site = {
  name: "PlotWorthy",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.plotworthy.co.uk",
  email: "hello@plotworthy.co.uk",
  description:
    "Evidence-led property feasibility for homeowners and developers, with relevant local architects, builders, structural engineers and planning consultants when you are ready to act."
};

export const navigation = [
  { href: "/check", label: "Check a property" },
  { href: "/professionals", label: "Find professionals" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" }
];
