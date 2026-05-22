"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import Button from "./ui/Button";

/**
 * Top navigation bar.
 * Shows brand on the left and either auth links or a user menu on the right
 * depending on whether the user is logged in.
 */
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
            N
          </span>
          <span className="font-semibold text-slate-900">NextCRUD</span>
        </Link>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Login
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-slate-100 transition"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <Avatar user={user} size={32} />
                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                  {user?.name || "Account"}
                </span>
                <svg className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.085l3.71-3.855a.75.75 0 111.08 1.04l-4.25 4.41a.75.75 0 01-1.08 0l-4.25-4.41a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {open && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-100 bg-white shadow-card overflow-hidden"
                  onMouseLeave={() => setOpen(false)}
                >
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/users"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Users
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

function Avatar({ user, size = 32 }) {
  const src = user?.profileImage || user?.avatar || user?.image;
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={user?.name || "Profile"}
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-white"
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = (user?.name || "?")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold ring-2 ring-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  );
}
