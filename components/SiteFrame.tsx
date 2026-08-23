"use client";

import { usePathname } from "next/navigation";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWorkspace = pathname?.startsWith("/professional");

  if (isWorkspace) {
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
