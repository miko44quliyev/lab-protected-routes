"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // поправьте путь под структуру вашего проекта

// This navbar is DUMB on purpose. It shows the same links no matter who is
// looking, even when nobody is logged in. Part of your job is to make it adapt
// to the auth state: show the user's name + role and a "Sign Out" button when
// they are logged in, and just a "Login" link when they are not.
//
// Hint: this is a client component, so you can already call useAuth() in here.

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setIsSigningOut(false);
    }
  }

  function linkClass(href) {
    return pathname === href
      ? "font-semibold text-indigo-600"
      : "text-slate-600 transition-colors hover:text-indigo-600";
  }

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-indigo-600">
          PostHub
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/posts" className={linkClass("/posts")}>
            Posts
          </Link>

          {isAuthenticated && user?.role === "ADMIN" && (
            <Link href="/admin" className={linkClass("/admin")}>
              Admin
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <span className="text-slate-500">
                {user.name}
                <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                  {user.role}
                </span>
              </span>
              <button
                onClick={handleLogout}
                disabled={isSigningOut}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 font-medium text-white
                           transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white
                         transition-colors hover:bg-indigo-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}