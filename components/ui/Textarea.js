"use client";

import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
  { label, name, value, onChange, onBlur, placeholder, rows = 3, error, disabled, className = "", ...rest },
  ref
) {
  const id = `textarea-${name}`;
  const hasError = Boolean(error);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        name={name}
        rows={rows}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        className={[
          "block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition",
          "placeholder:text-slate-400 focus:outline-none focus:ring-2 resize-y",
          hasError
            ? "border-red-300 focus:border-red-400 focus:ring-red-200"
            : "border-slate-200 focus:border-brand-400 focus:ring-brand-100",
          disabled ? "bg-slate-50 cursor-not-allowed opacity-70" : "",
        ].join(" ")}
        {...rest}
      />
      {hasError && <p className="helper-error">{error}</p>}
    </div>
  );
});

export default Textarea;
