"use client";

import { useRef, useState } from "react";
import Button from "./ui/Button";

/**
 * Read-only display of the user's profile with an avatar uploader.
 *
 * Props:
 *  - user: { name, email, address, profileImage }
 *  - onAvatarChange(file): called as soon as a new image is picked.
 *      The parent decides whether to upload immediately or defer to "Save".
 *  - onEdit(): switch to the editable form
 *  - onDelete(): open the delete-account modal
 *  - uploading: bool — show a spinner overlay while uploading
 */
export default function ProfileCard({
  user,
  onAvatarChange,
  onEdit,
  onDelete,
  uploading = false,
}) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const avatarSrc =
    previewUrl || user?.profileImage || user?.avatar || user?.image || null;

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onAvatarChange?.(file);
  };

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="relative">
          <div className="h-28 w-28 rounded-full bg-brand-100 overflow-hidden ring-4 ring-white shadow-card">
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt={user?.name || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-3xl font-semibold text-brand-700">
                {getInitials(user?.name)}
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white text-xs">
                Uploading…
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handlePickFile}
            disabled={uploading}
            className="absolute bottom-0 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white shadow ring-2 ring-white hover:bg-brand-700 disabled:opacity-60"
            aria-label="Upload profile image"
            title="Upload profile image"
          >
            <CameraIcon />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-semibold text-slate-900">
            {user?.name || "—"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {user?.email || "—"}
          </p>

          <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Field label="Name" value={user?.name} />
            <Field label="Email" value={user?.email} />
            <Field label="Address" value={user?.address} className="sm:col-span-2" />
          </dl>

          <div className="mt-6 flex flex-wrap gap-2 justify-center sm:justify-start">
            <Button onClick={onEdit}>Edit profile</Button>
            <Button variant="secondary" onClick={handlePickFile}>
              Change photo
            </Button>
            <Button variant="danger" onClick={onDelete}>
              Delete account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, className = "" }) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-slate-800 break-words">{value || "—"}</dd>
    </div>
  );
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function CameraIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
