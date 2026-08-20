import Link from "next/link";

export default function NotFound() { return <section className="page-hero"><div className="shell narrow"><p className="eyebrow">404</p><h1>That plot is not on this map.</h1><p>The page may have moved or the address is incomplete.</p><Link className="button" href="/">Return home</Link></div></section>; }
