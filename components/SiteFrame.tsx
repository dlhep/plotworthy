"use client";

import { usePathname } from "next/navigation";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The admin control centre has its own chrome; everything else (including the
  // professional workspace) keeps the main site header so you can always navigate.
  const bare = pathname?.startsWith("/admin");

  if (bare) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
