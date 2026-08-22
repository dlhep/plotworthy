import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-content py-24 text-center">
      <p className="eyebrow">Page not found</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">
        This part of the journey doesn’t exist
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        The page you’re looking for may have moved. Let’s get you back on the
        right path.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Back to home</Link>
        <Link href="/journeys" className="btn-outline">See the journeys</Link>
      </div>
    </div>
  );
}
