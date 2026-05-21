"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

/**
 * Redirects to /login if the user is not authenticated.
 * Wait until AuthProvider finishes hydrating from storage to avoid
 * a flash redirect on refresh.
 */
export function useProtectedRoute() {
  const { isAuthenticated, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      router.replace("/login");
    }
  }, [initializing, isAuthenticated, router]);

  return { ready: !initializing && isAuthenticated, initializing };
}
