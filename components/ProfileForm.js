"use client";

import { useEffect, useState } from "react";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";
import { validators, validateForm } from "@/utils/validation";

/**
 * Edit-profile form. Only validates name / email / address — password
 * changes are deliberately out of scope here.
 *
 * Props:
 *  - user — current user values (initial form state)
 *  - onSubmit(values) — async, parent persists the change
 *  - onCancel() — return to read-only view
 *  - submitting — show loading state on the save button
 */
export default function ProfileForm({ user, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues({
      name: user?.name || "",
      email: user?.email || "",
      address: user?.address || "",
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: nextErrors } = validateForm(values, {
      name: validators.name,
      email: validators.email,
      address: validators.address,
    });
    if (!isValid) {
      setErrors(nextErrors);
      return;
    }
    await onSubmit?.({
      name: values.name.trim(),
      email: values.email.trim(),
      address: values.address.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Edit profile</h2>
        <p className="text-sm text-slate-500 mt-1">
          Update your personal details below.
        </p>
      </div>

      <Input
        label="Name"
        name="name"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
        autoComplete="name"
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        autoComplete="email"
      />
      <Textarea
        label="Address"
        name="address"
        value={values.address}
        onChange={handleChange}
        error={errors.address}
        rows={3}
      />

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
