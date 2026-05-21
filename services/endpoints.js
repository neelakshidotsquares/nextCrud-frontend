/**
 * Single source of truth for API paths.
 *
 * Each path can be overridden via env vars without touching code, e.g.:
 *   NEXT_PUBLIC_API_REGISTER=/auth/signup
 *
 * Paths may include URL params like `:id`. Use `buildPath()` (below) to
 * substitute them at call time.
 */
export const endpoints = {
  register: process.env.NEXT_PUBLIC_API_REGISTER || "/user/create",
  login: process.env.NEXT_PUBLIC_API_LOGIN || "/user/login",
  profile: process.env.NEXT_PUBLIC_API_PROFILE || "/user/getUserById/:id",
  updateProfile:
    process.env.NEXT_PUBLIC_API_UPDATE_PROFILE || "/user/updateUser/:id",
  deleteAccount:
    process.env.NEXT_PUBLIC_API_DELETE_ACCOUNT || "/user/deleteUser/:id",
  uploadAvatar:
    process.env.NEXT_PUBLIC_API_UPLOAD_IMAGE || "/user/uploadAvatar/:id",
};

/**
 * Replace `:paramName` segments in a path template with actual values.
 *
 *   buildPath("/user/getUserById/:id", { id: "abc" })
 *   // -> "/user/getUserById/abc"
 *
 * Throws if a required param is missing so we never make a request to a
 * path that still contains `:id` (which would 404 unhelpfully).
 */
export function buildPath(template, params = {}) {
  if (!template) return template;
  return template.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name) => {
    const value = params[name];
    if (value === undefined || value === null || value === "") {
      throw new Error(`Missing URL param ":${name}" for path "${template}"`);
    }
    return encodeURIComponent(value);
  });
}

/** Returns the canonical id for a user object regardless of API shape. */
export function getUserId(user) {
  return user?.id || user?._id || null;
}
