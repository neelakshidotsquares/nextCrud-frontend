"use client";

import { forwardRef } from "react";

/**
 * Reusable text input.
 *
 * Props:
 *  - label, name, type, value, onChange, onBlur
 *  - placeholder, autoComplete, disabled
 *  - error  — error message (string) renders helper text and red border
 *  - leftIcon — optional ReactNode rendered inside the input on the left
 */
const Input = forwardRef(function Input(
  {
    label,
    name,
    type = "text",
    value,
    onChange,
    onBlur,
    placeholder,
    autoComplete,
    disabled = false,
    error,
    leftIcon,
    className = "",
    ...rest
  },
  ref
) {
  const id = `input-${name}`;
  const hasError = Boolean(error);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={[
            "block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition",
            "placeholder:text-slate-400 focus:outline-none focus:ring-2",
            leftIcon ? "pl-10" : "",
            hasError
              ? "border-red-300 focus:border-red-400 focus:ring-red-200"
              : "border-slate-200 focus:border-brand-400 focus:ring-brand-100",
            disabled ? "bg-slate-50 cursor-not-allowed opacity-70" : "",
          ].join(" ")}
          {...rest}
        />
      </div>
      {hasError && (
        <p id={`${id}-error`} className="helper-error">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
