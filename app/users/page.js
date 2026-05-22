"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import UsersTable from "@/components/UsersTable";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";

import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { userService } from "@/services/userService";
import { extractApiError } from "@/utils/apiError";

const DEFAULT_LIMIT = 10;

/**
 * Users listing page.
 *
 * Wraps the dumb <UsersTable /> with the data-fetching state machine:
 *   page / limit -> fetch -> users / pagination -> render
 *
 * Failures show an inline error with a retry button instead of leaving the
 * page blank, so a transient API hiccup doesn't look like a broken UI.
 */
export default function UsersPage() {
  const { ready, initializing } = useProtectedRoute();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the current page. `useCallback` so the effect below has a stable
  // reference and we can also call it from the "Try again" button.
  const fetchUsers = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);
      try {
        const result = await userService.listUsers({ page, limit });
        if (signal?.aborted) return;
        setUsers(result.users);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        if (signal?.aborted) return;
        const message = extractApiError(err, "Could not load users.");
        setError(message);
        toast.error(message);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [page, limit]
  );

  // Re-fetch whenever auth becomes ready or page/limit changes.
  // AbortController prevents a stale response from a slow earlier request
  // from overwriting a fresher one if the user clicks Next quickly.
  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    fetchUsers(controller.signal);
    return () => controller.abort();
  }, [ready, fetchUsers]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1) return;
    setPage(nextPage);
  };

  const handleLimitChange = (nextLimit) => {
    setLimit(nextLimit);
    // Reset to page 1 — the previous page index is meaningless under a new page size.
    setPage(1);
  };

  if (initializing || !ready) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <Spinner size="lg" className="text-brand-600" />
        <p className="mt-3 text-sm">Checking your session…</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Users
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse every account registered on the platform.
          </p>
        </div>
        <div className="text-sm text-slate-500">
          {loading
            ? "Refreshing…"
            : `${total.toLocaleString()} ${total === 1 ? "user" : "users"} total`}
        </div>
      </div>

      {error && users.length === 0 ? (
        <ErrorState
          message={error}
          onRetry={() => fetchUsers()}
        />
      ) : (
        <UsersTable
          users={users}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          loading={loading}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </section>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="card p-8 text-center">
      <h2 className="text-lg font-semibold text-slate-900">
        Couldn&apos;t load users
      </h2>
      <p className="text-sm text-slate-500 mt-1">{message}</p>
      <div className="mt-5">
        <Button onClick={onRetry}>Try again</Button>
      </div>
    </div>
  );
}
