"use client";

// This is the auth layer you built in yesterday's lesson, wired to your Spring
// Boot `simple_auth` backend. It is cookie based: the token lives in an httpOnly
// cookie that JavaScript never reads. We prove who the user is by asking the
// backend (GET /me), not by reading a token ourselves. It already works. You do
// NOT need to change it for this lab (unless your /me returns a different shape).

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load we ask the backend "who am I?" (GET /me). The browser sends
  // the auth cookie along automatically. If it answers with a user, we are
  // logged in. If it 401s, we are not. While this request is in flight,
  // `loading` is true. THIS is the flag your ProtectedRoute waits on.
  useEffect(() => {
    // /me is expected to return the current user: { id, name, email, role }
    apiFetch("/me")
      .then((me) => setUser(me))
      .catch(() => setUser(null)) // no valid cookie, treat as logged out
      .finally(() => setLoading(false));
  }, []);

  // POST /login sets the httpOnly cookie on the backend. We never see the token.
  // Right after, we ask /me for the full user (so we always have the role from
  // one source of truth).
  async function login(email, password) {
    await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const me = await apiFetch("/me");
    setUser(me);
    return me;
  }

  // Logout has to happen on the backend: only it can clear an httpOnly cookie.
  // We ask it to, then drop the user from context either way.
  async function logout() {
    try {
      await apiFetch("/logout", { method: "POST" });
    } catch {
      // ignore: we still want to clear the UI even if the call fails
    }
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return context;
}
