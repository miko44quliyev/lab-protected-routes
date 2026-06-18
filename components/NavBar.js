"use client";

import Link from "next/link";

// This navbar is DUMB on purpose. It shows the same links no matter who is
// looking, even when nobody is logged in. Part of your job is to make it adapt
// to the auth state: show the user's name + role and a "Sign Out" button when
// they are logged in, and just a "Login" link when they are not.
//
// Hint: this is a client component, so you can already call useAuth() in here.

export default function NavBar() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-indigo-600">
          PostHub
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/posts"
            className="text-slate-600 transition-colors hover:text-indigo-600"
          >
            Posts
          </Link>
          <Link
            href="/admin"
            className="text-slate-600 transition-colors hover:text-indigo-600"
          >
            Admin
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white
                       transition-colors hover:bg-indigo-700"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
