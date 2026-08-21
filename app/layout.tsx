import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "PlotWorthy — Know what your property could become", template: "%s — PlotWorthy" },
  description: site.description,
  openGraph: { type: "website", locale: "en_GB", siteName: site.name, images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" }
};

export const viewport: Viewport = { themeColor: "#14342d", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description
  };

  return (
    <html lang="en-GB">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
