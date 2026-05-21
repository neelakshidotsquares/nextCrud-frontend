/**
 * Storage helpers for the auth token and the cached user object.
 *
 * The storage strategy is selected via NEXT_PUBLIC_AUTH_STORAGE:
 *   - "localStorage" (default): stored in window.localStorage
 *   - "cookie": stored in a non-httpOnly cookie (readable by JS).
 *               Use this only if your backend does NOT already set an
 *               httpOnly cookie itself. If it does, leave the token
 *               handling to the browser and skip the explicit storage.
 *
 * All functions are safe to call during SSR (they no-op on the server).
 */

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const isBrowser = () => typeof window !== "undefined";

const useCookies = () =>
  (process.env.NEXT_PUBLIC_AUTH_STORAGE || "localStorage").toLowerCase() === "cookie";

function setCookie(name, value, days = 7) {
  if (!isBrowser()) return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

function getCookie(name) {
  if (!isBrowser()) return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function deleteCookie(name) {
  if (!isBrowser()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export const tokenStorage = {
  get() {
    if (!isBrowser()) return null;
    return useCookies() ? getCookie(TOKEN_KEY) : window.localStorage.getItem(TOKEN_KEY);
  },
  set(token) {
    if (!isBrowser() || !token) return;
    if (useCookies()) setCookie(TOKEN_KEY, token);
    else window.localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    if (!isBrowser()) return;
    if (useCookies()) deleteCookie(TOKEN_KEY);
    else window.localStorage.removeItem(TOKEN_KEY);
  },
};

export const userStorage = {
  get() {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(user) {
    if (!isBrowser() || !user) return;
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(USER_KEY);
  },
};
