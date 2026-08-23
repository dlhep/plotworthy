export const metadata = { title: "Cookie policy — PlotWorthy" };

export default function CookiesPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <div className="mx-auto max-w-2xl leading-relaxed text-muted">
        <p className="eyebrow">Legal</p>
        <h1 className="display mt-3 text-4xl">Cookie policy</h1>
        <p className="mt-3 text-sm">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" })}</p>

        <p className="mt-6">
          Cookies are small files stored on your device. PlotWorthy keeps its use of them to a minimum.
        </p>

        <h2 className="display mt-8 text-xl">Essential cookies</h2>
        <p>
          We use strictly necessary cookies to keep you signed in, keep your session secure, and remember
          basic preferences. The service cannot function without these, so they do not require consent.
          Our authentication provider (Supabase) sets a secure session cookie when you log in.
        </p>

        <h2 className="display mt-8 text-xl">What we don&apos;t do</h2>
        <p>
          We do not use advertising cookies, and we do not sell your data to advertisers. If we introduce
          any optional analytics in future, we will ask for your consent first and update this page.
        </p>

        <h2 className="display mt-8 text-xl">Managing cookies</h2>
        <p>
          You can clear or block cookies in your browser settings, but blocking essential cookies will
          stop you being able to sign in and use your account.
        </p>

        <p className="mt-8">
          Questions? Email{" "}
          <a href="mailto:hello@plotworthy.co.uk" className="font-medium text-sage-700 hover:underline">hello@plotworthy.co.uk</a>.
        </p>
      </div>
    </div>
  );
}
