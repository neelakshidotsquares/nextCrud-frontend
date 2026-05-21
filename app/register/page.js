"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/AuthContext";
import { useGuestRoute } from "@/hooks/useGuestRoute";
import { validators, validateForm } from "@/utils/validation";
import { extractApiError } from "@/utils/apiError";

const initialState = { name: "", email: "", address: "", password: "", confirmPassword: "" };

export default function RegisterPage() {
  useGuestRoute();
  const { register } = useAuth();
  const router = useRouter();

  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
      password: validators.password,
      confirmPassword: (v) => {
        if (!v) return "Please confirm your password";
        if (v !== values.password) return "Passwords do not match";
        return null;
      },
    });

    if (!isValid) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { token } = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        address: values.address.trim(),
        password: values.password,
      });

      toast.success("Account created successfully");

      // Some APIs auto-login (return a token). If not, route to /login.
      if (token) router.replace("/dashboard");
      else router.replace("/login");
    } catch (err) {
      toast.error(extractApiError(err, "Could not create your account."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="w-full max-w-md">
        <div className="card p-7 sm:p-8">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Join in a minute. Your details stay private.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={errors.name}
              autoComplete="name"
              placeholder="Jane Doe"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
              placeholder="you@example.com"
            />
            <Textarea
              label="Address"
              name="address"
              rows={2}
              value={values.address}
              onChange={handleChange}
              error={errors.address}
              placeholder="221B Baker Street, London"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
              placeholder="At least 6 chars, letters + numbers"
            />
            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <Button type="submit" fullWidth loading={submitting}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
