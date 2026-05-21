/**
 * Normalize axios/network errors into a single user-friendly message.
 * Tries common API response shapes first.
 */
export function extractApiError(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;

  // Axios error with response from server.
  if (error.response) {
    const data = error.response.data;
    if (data) {
      if (typeof data === "string") return data;
      if (data.message) return data.message;
      if (data.error) return typeof data.error === "string" ? data.error : fallback;
      if (data.errors && Array.isArray(data.errors) && data.errors.length) {
        const first = data.errors[0];
        if (typeof first === "string") return first;
        if (first?.message) return first.message;
      }
    }
    if (error.response.status === 401) return "Session expired. Please log in again.";
    if (error.response.status === 403) return "You don't have permission to do that.";
    if (error.response.status === 404) return "Requested resource was not found.";
    if (error.response.status >= 500) return "Server error. Please try again later.";
  }

  // No response — network failure.
  if (error.request) return "Network error. Check your connection and try again.";

  return error.message || fallback;
}
