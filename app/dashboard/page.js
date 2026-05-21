"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ProfileCard from "@/components/ProfileCard";
import ProfileForm from "@/components/ProfileForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

import { useAuth } from "@/hooks/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { userService } from "@/services/userService";
import { getUserId } from "@/services/endpoints";
import { extractApiError } from "@/utils/apiError";

/**
 * Dashboard / profile page.
 *
 * Combines:
 *   - GET /profile     -> show user data
 *   - POST avatar      -> upload + preview
 *   - PUT /profile     -> update name/email/address
 *   - DELETE /profile  -> remove account (with confirmation modal)
 */
export default function DashboardPage() {
  const { ready, initializing } = useProtectedRoute();
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Resolve the current user's id — login returns `id`, getUserById returns `_id`.
  const userId = getUserId(profile) || getUserId(user);

  // Fetch the live profile once we're authenticated.
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    const run = async () => {
      const id = getUserId(user);
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await userService.getProfile(id);
        if (cancelled) return;
        if (data) {
          setProfile(data);
          updateUser(data);
        }
      } catch (err) {
        if (cancelled) return;
        const message = extractApiError(err, "Could not load your profile.");
        // If we have a cached user from login, keep showing it instead of
        // erroring out. This makes the dashboard resilient when the profile
        // endpoint is temporarily down.
        if (user) {
          setProfile(user);
          // eslint-disable-next-line no-console
          console.warn("[dashboard] profile refresh failed, using cached user:", message);
        } else {
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
    // We intentionally only re-run when auth becomes ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // ---- Avatar upload ----
  const handleAvatarChange = async (file) => {
    if (!file || !userId) return;
    setUploading(true);
    try {
      const updated = await userService.uploadAvatar(userId, file);
      if (updated) {
        setProfile(updated);
        updateUser(updated);
      }
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error(extractApiError(err, "Could not upload image."));
    } finally {
      setUploading(false);
    }
  };

  // ---- Update profile ----
  const handleSaveProfile = async (values) => {
    if (!userId) {
      toast.error("Couldn't determine your account id. Please log in again.");
      return;
    }
    setSaving(true);
    try {
      const updated = await userService.updateProfile(userId, values);
      if (updated) {
        setProfile(updated);
        updateUser(updated);
      }
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      toast.error(extractApiError(err, "Could not update profile."));
    } finally {
      setSaving(false);
    }
  };

  // ---- Delete account ----
  const handleDelete = async () => {
    if (!userId) return;
    setDeleting(true);
    try {
      await userService.deleteAccount(userId);
      toast.success("Account deleted");
      logout();
      router.replace("/register");
    } catch (err) {
      toast.error(extractApiError(err, "Could not delete account."));
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  // ---- Render states ----
  if (initializing || !ready) {
    return <FullPageLoader label="Checking your session…" />;
  }

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
          Your dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account, profile photo, and personal details.
        </p>
      </div>

      {loading ? (
        <div className="card p-10 flex flex-col items-center text-slate-500">
          <Spinner size="lg" className="text-brand-600" />
          <p className="mt-3 text-sm">Loading your profile…</p>
        </div>
      ) : error && !profile ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : editing ? (
        <ProfileForm
          user={profile}
          onSubmit={handleSaveProfile}
          onCancel={() => setEditing(false)}
          submitting={saving}
        />
      ) : (
        <ProfileCard
          user={profile}
          uploading={uploading}
          onAvatarChange={handleAvatarChange}
          onEdit={() => setEditing(true)}
          onDelete={() => setConfirmOpen(true)}
        />
      )}

      <Modal
        open={confirmOpen}
        onClose={() => !deleting && setConfirmOpen(false)}
        title="Delete your account?"
        description={
          <>
            This action is permanent. All your profile data will be removed and
            you will be logged out immediately.
          </>
        }
      >
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setConfirmOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Yes, delete my account
          </Button>
        </div>
      </Modal>
    </section>
  );
}

function FullPageLoader({ label }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500">
      <Spinner size="lg" className="text-brand-600" />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="card p-8 text-center">
      <h2 className="text-lg font-semibold text-slate-900">
        Couldn&apos;t load your profile
      </h2>
      <p className="text-sm text-slate-500 mt-1">{message}</p>
      <div className="mt-5">
        <Button onClick={onRetry}>Try again</Button>
      </div>
    </div>
  );
}
