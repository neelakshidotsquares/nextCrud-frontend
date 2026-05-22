"use client";

import Spinner from "./ui/Spinner";
import Button from "./ui/Button";

/**
 * Stateless paginated user table.
 *
 * The owning page controls page/limit/data — this component just renders
 * what it's given and emits onPageChange / onLimitChange events.
 *
 * Props:
 *  - users:        Array<{ id, name, email, address, profileImage, createdAt }>
 *  - page:         current 1-based page number
 *  - limit:        current page size
 *  - total:        total number of records across all pages
 *  - totalPages:   total number of pages
 *  - loading:      bool — show a spinner row while a page is being fetched
 *  - onPageChange: (nextPage) => void
 *  - onLimitChange: (nextLimit) => void
 */
export default function UsersTable({
  users = [],
  page = 1,
  limit = 10,
  total = 0,
  totalPages = 0,
  loading = false,
  onPageChange,
  onLimitChange,
}) {
  const isFirstPage = page <= 1;
  const isLastPage = totalPages === 0 || page >= totalPages;

  // Inclusive range of records visible on the current page (e.g. "11-20 of 47").
  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(total, page * limit);

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <Th className="w-16">#</Th>
              <Th>User</Th>
              <Th>Email</Th>
              <Th>Address</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12">
                  <div className="flex flex-col items-center text-slate-500">
                    <Spinner size="lg" className="text-brand-600" />
                    <p className="mt-2 text-sm">Loading users…</p>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, i) => (
                <UserRow
                  key={user.id || user._id || `${page}-${i}`}
                  index={(page - 1) * limit + i + 1}
                  user={user}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        loading={loading}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th
      className={`px-4 py-3 font-medium uppercase tracking-wide text-xs ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

function UserRow({ user, index }) {
  const name = user.name || "—";
  const email = user.email || "—";
  const address = user.address || "—";
  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <Td className="text-slate-500">{index}</Td>
      <Td>
        <div className="flex items-center gap-3">
          <Avatar user={user} />
          <span className="font-medium text-slate-900">{name}</span>
        </div>
      </Td>
      <Td className="text-slate-700">{email}</Td>
      <Td className="text-slate-700 max-w-xs truncate" title={address}>
        {address}
      </Td>
      <Td className="text-slate-500">{joined}</Td>
    </tr>
  );
}

function Avatar({ user, size = 36 }) {
  const src = user?.profileImage || user?.avatar || user?.image;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={user?.name || "User"}
        width={size}
        height={size}
        className="rounded-full object-cover ring-1 ring-slate-200"
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = (user?.name || "?")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold ring-1 ring-slate-200"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  );
}

function PaginationFooter({
  rangeStart,
  rangeEnd,
  total,
  page,
  limit,
  totalPages,
  isFirstPage,
  isLastPage,
  loading,
  onPageChange,
  onLimitChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 bg-white px-4 py-3">
      <div className="text-sm text-slate-500">
        {total === 0 ? (
          "0 users"
        ) : (
          <>
            Showing <span className="font-medium text-slate-700">{rangeStart}</span>–
            <span className="font-medium text-slate-700">{rangeEnd}</span> of{" "}
            <span className="font-medium text-slate-700">{total}</span> users
          </>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="text-sm text-slate-500 hidden sm:block">
          Rows per page
        </label>
        <select
          value={limit}
          onChange={(e) => onLimitChange?.(Number(e.target.value))}
          disabled={loading}
          className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:opacity-50"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="secondary"
            disabled={isFirstPage || loading}
            onClick={() => onPageChange?.(page - 1)}
          >
            Prev
          </Button>
          <span className="px-2 text-sm text-slate-600">
            Page <span className="font-medium text-slate-900">{page}</span> of{" "}
            <span className="font-medium text-slate-900">
              {Math.max(totalPages, 1)}
            </span>
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={isLastPage || loading}
            onClick={() => onPageChange?.(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
