"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

/**
 * Inverse of useProtectedRoute: bounces an authenticated user away
 * from /login or /register straight to the dashboard.
 */
export function useGuestRoute() {
  const { isAuthenticated, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [initializing, isAuthenticated, router]);

  return { initializing };
}
