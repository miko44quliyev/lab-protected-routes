"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // After login succeeds we send the user to the posts page.
      // (Sending them back to where they came from is a stretch goal.)
      const redirectTo = searchParams.get("redirect") || "/posts";
      router.push(redirectTo);
    } catch {
      setError("Wrong email or password, or the backend is not running.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
      <p className="mt-1 text-sm text-slate-500">
        Use a user you seeded in your backend.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900
                       outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            placeholder="demo@ironhack.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900
                       outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            placeholder="password"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white
                     transition-colors hover:bg-indigo-700 disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}