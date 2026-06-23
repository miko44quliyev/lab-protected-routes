// components/ProtectedRoute.jsx (enhanced version)
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, isAuthenticated, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Role check (only if requiredRole is specified)
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          This page requires the "{requiredRole}" role.
        </p>
      </div>
    );
  }

  return children;
}