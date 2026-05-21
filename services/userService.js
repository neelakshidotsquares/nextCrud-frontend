import apiClient from "./apiClient";
import { buildPath, endpoints } from "./endpoints";

/**
 * Profile / account API calls. All methods unwrap the user object from
 * common server response shapes ({ user }, { data }, etc.).
 *
 * Every method takes the target user's id explicitly so the service has
 * no hidden dependency on global auth state — the dashboard owns "who is
 * logged in" and just hands the id down.
 */

function pickUser(payload) {
  if (!payload) return null;
  return (
    payload.user ?? payload.User ?? payload.profile ?? payload.data ?? payload
  );
}

function requireId(id, action) {
  if (!id) throw new Error(`A user id is required to ${action}.`);
}

export const userService = {
  /**
   * Fetch a user's full profile.
   * Endpoint: GET /user/getUserById/:id
   * Response: { success, message, user: { _id, name, email, address, profileImage, ... } }
   */
  async getProfile(userId) {
    requireId(userId, "fetch the profile");
    const path = buildPath(endpoints.profile, { id: userId });
    const { data } = await apiClient.get(path);
    return pickUser(data);
  },

  /**
   * Update profile fields.
   * Endpoint: PUT /user/updateUser/:id
   * Payload (JSON): { name, email, address, ... }
   *   - You can also pass a FormData if the backend later supports file fields.
   * Response: { status, success, message, user: <updatedUser> }
   */
  async updateProfile(userId, payload) {
    requireId(userId, "update the profile");
    const isFormData =
      typeof FormData !== "undefined" && payload instanceof FormData;
    const path = buildPath(endpoints.updateProfile, { id: userId });
    const { data } = await apiClient.put(path, payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return pickUser(data);
  },

  /**
   * Upload a profile image as multipart/form-data.
   * Endpoint: POST /user/uploadAvatar/:id  (placeholder until backend adds it)
   */
  async uploadAvatar(userId, file) {
    requireId(userId, "upload the avatar");
    const formData = new FormData();
    formData.append("image", file);
    const path = buildPath(endpoints.uploadAvatar, { id: userId });
    // Intentionally not setting Content-Type — axios sees FormData and adds
    // `multipart/form-data; boundary=...` automatically. Setting it manually
    // strips the boundary and can break the server-side parser.
    const { data } = await apiClient.post(path, formData);
    return pickUser(data);
  },

  /**
   * Delete a user's account.
   * Endpoint: DELETE /user/deleteUser/:id
   */
  async deleteAccount(userId) {
    requireId(userId, "delete the account");
    const path = buildPath(endpoints.deleteAccount, { id: userId });
    const { data } = await apiClient.delete(path);
    return data;
  },
};
