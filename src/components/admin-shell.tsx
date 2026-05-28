import type { ReactNode } from "react";
import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin-logout-button";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/articles/new", label: "New Article" },
  { href: "/admin/login", label: "Login" },
];

export function AdminShell({
  title,
  description,
  children,
  showLogout = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  showLogout?: boolean;
}) {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-[78rem] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Admin
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
              {description}
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-[var(--border-subtle)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {link.label}
              </Link>
            ))}
            {showLogout ? <AdminLogoutButton /> : null}
          </nav>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
