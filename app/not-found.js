import Link from "next/link";

export default function NotFound() {
  return (
    <section className="auth-shell">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-brand-600">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-slate-500">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-brand-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-brand-700"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
