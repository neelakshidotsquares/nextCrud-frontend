import apiClient from "./apiClient";
import { endpoints } from "./endpoints";

/**
 * Auth-related API calls.
 *
 * Response shapes are normalized to:
 *   { token: string|null, user: object|null, raw: <full server payload> }
 * so pages don't have to care about server-specific keys.
 *
 * Supported shapes (each branch is independent):
 *   { token, user }
 *   { accessToken | access_token | jwt, user }
 *   { data: { token, user } }
 *   { status, success, message, data: <userObject> }                <-- register
 *   { status, success, message, access_token, data: <userObject> }  <-- login
 */

function looksLikeUser(value) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (value.email || value.name || value.id || value._id)
  );
}

function normalizeAuthResponse(payload) {
  const root = payload || {};
  const candidates = [root, root.data, root.result].filter(
    (c) => c && typeof c === "object"
  );

  let token = null;
  for (const c of candidates) {
    token = c.access_token ?? c.accessToken ?? c.token ?? c.jwt ?? null;
    if (token) break;
  }

  let user = null;
  for (const c of candidates) {
    const u = c.user ?? c.User ?? c.profile ?? null;
    if (looksLikeUser(u)) {
      user = u;
      break;
    }
  }

  // Some APIs (this one) return the user object directly under `data`,
  // without nesting it as `data.user`. Recognize that case.
  if (!user && looksLikeUser(root.data)) {
    user = root.data;
  }

  return { token, user, raw: payload };
}

/**
 * Some endpoints return HTTP 200 with `{ success: false, message }` for
 * business-rule failures (e.g. "User already exists"). Surface those as
 * thrown errors so callers can rely on try/catch.
 */
function ensureSuccess(payload) {
  if (payload && typeof payload === "object" && payload.success === false) {
    const error = new Error(payload.message || "Request failed");
    error.response = { data: payload, status: 400 };
    throw error;
  }
  return payload;
}

export const authService = {
  /**
   * Register a new user.
   * Endpoint: POST /user/create
   *
   * @param {{ name: string; email: string; address: string; password: string }} payload
   * @returns {Promise<{ token: string|null, user: object|null, raw: object }>}
   */
  async register(payload) {
    const { data } = await apiClient.post(endpoints.register, payload);
    ensureSuccess(data);
    return normalizeAuthResponse(data);
  },

  /**
   * Log a user in.
   * Endpoint: POST /auth/login (placeholder until provided)
   */
  async login(payload) {
    const { data } = await apiClient.post(endpoints.login, payload);
    ensureSuccess(data);
    return normalizeAuthResponse(data);
  },
};
