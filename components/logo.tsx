import Link from "next/link";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="PlotWorthy home">
      <span className="logo-mark" aria-hidden="true"><span /></span>
      <span>PlotWorthy</span>
    </Link>
  );
}
