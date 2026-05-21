"use client";

import { useEffect } from "react";

/**
 * Accessible modal/dialog.
 *
 * Props:
 *  - open (bool): controls visibility
 *  - onClose (fn): called when user clicks the backdrop or presses Esc
 *  - title (string): heading
 *  - description (string|node): body text shown above children
 *  - children: footer/actions area (rendered after description)
 *  - size: "sm" | "md" | "lg"
 */
const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={[
          "relative w-full bg-white rounded-2xl shadow-card border border-slate-100",
          "p-6 animate-[fadeIn_120ms_ease-out]",
          sizeClasses[size] || sizeClasses.md,
        ].join(" ")}
      >
        {title && (
          <h2
            id="modal-title"
            className="text-lg font-semibold text-slate-900 mb-2"
          >
            {title}
          </h2>
        )}
        {description && (
          <div className="text-sm text-slate-600 mb-5">{description}</div>
        )}
        {children}
      </div>
    </div>
  );
}
