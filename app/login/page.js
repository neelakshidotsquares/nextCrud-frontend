"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/AuthContext";
import { useGuestRoute } from "@/hooks/useGuestRoute";
import { validators, validateForm } from "@/utils/validation";
import { extractApiError } from "@/utils/apiError";

export default function LoginPage() {
  useGuestRoute();
  const { login } = useAuth();
  const router = useRouter();

  const [values, setValues] = useState({ email: "", password: "" });
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
      email: validators.email,
      password: validators.loginPassword,
    });
    if (!isValid) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { token } = await login({
        email: values.email.trim(),
        password: values.password,
      });

      if (!token) {
        // The API may use http-only cookies; in that case the server
        // sets the cookie itself and we can still proceed.
        toast.success("Welcome back!");
        router.replace("/dashboard");
        return;
      }

      toast.success("Logged in successfully");
      router.replace("/dashboard");
    } catch (err) {
      toast.error(extractApiError(err, "Invalid email or password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="w-full max-w-md">
        <div className="card p-7 sm:p-8">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1">
              Log in to manage your profile.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            <Input
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
              placeholder="••••••••"
            />

            <Button type="submit" fullWidth loading={submitting}>
              Log in
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-slate-500">
            New here?{" "}
            <Link href="/register" className="link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
