"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";
import Button from "@/components/ui/Button";

/**
 * Public landing page. If already logged in, bounce to /dashboard.
 */
export default function HomePage() {
  const { isAuthenticated, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && isAuthenticated) router.replace("/dashboard");
  }, [initializing, isAuthenticated, router]);

  return (
    <section className="auth-shell">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
          A simple, secure account experience.
        </h1>
        <p className="mt-4 text-slate-600 text-lg">
          Register, log in, manage your profile, upload an avatar, and delete
          your account — all wired up to your CRUD API.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register">
            <Button size="lg">Create an account</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Log in
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
