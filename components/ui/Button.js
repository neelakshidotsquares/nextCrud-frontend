"use client";

import Spinner from "./Spinner";

/**
 * Reusable button.
 *
 * Variants: primary | secondary | ghost | danger
 * Sizes:    sm | md | lg
 * Props:    loading, disabled, fullWidth, leftIcon, rightIcon, type
 */
const variantClasses = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-200 disabled:bg-brand-300",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-200",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 disabled:bg-red-300",
};

const sizeClasses = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-5 py-3",
};

export default function Button({
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed",
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? <Spinner size="sm" /> : leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
}
