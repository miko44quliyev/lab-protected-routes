import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
          Internal tool
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          Welcome to PostHub
        </h1>
        <p className="mt-3 max-w-xl text-slate-600">
          The little dashboard the content team uses to read posts and manage the
          platform. Some of it is for everyone on the team, some of it is for
          admins only.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/posts"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white
                       transition-colors hover:bg-indigo-700"
          >
            Go to posts
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700
                       transition-colors hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">The posts page</h2>
          <p className="mt-1 text-sm text-slate-600">
            A feed of posts for logged in team members.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">The admin panel</h2>
          <p className="mt-1 text-sm text-slate-600">
            User management and the dangerous buttons. Admins only.
          </p>
        </div>
      </div>
    </div>
  );
}
