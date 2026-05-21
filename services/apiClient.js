import axios from "axios";
import { tokenStorage } from "@/utils/storage";

/**
 * Single axios instance shared by every service.
 * - Reads the base URL from NEXT_PUBLIC_API_BASE_URL (env-driven).
 * - Attaches the Bearer token (if any) on every request.
 * - On 401, clears the token and redirects to /login.
 *
 * To swap to cookie-based auth (httpOnly cookie set by the server),
 * just remove the request interceptor and set `withCredentials: true`.
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  timeout: 20000,
  // Set to true if your API uses httpOnly cookies for auth.
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      // Token is invalid / expired -> hard logout.
      tokenStorage.clear();
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
