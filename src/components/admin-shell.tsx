import type { ReactNode } from "react";
import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin-logout-button";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", description: "Overview" },
  { href: "/admin/articles/new", label: "New Article", description: "Publishing" },
  { href: "/admin/login", label: "Login", description: "Session" },
];

export function AdminShell({
  title,
  description,
  children,
  showLogout = false,
  eyebrow = "Newsroom CMS",
}: {
  title: string;
  description: string;
  children: ReactNode;
  showLogout?: boolean;
  eyebrow?: string;
}) {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-[82rem] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,rgba(179,143,69,0.12),rgba(255,255,255,0.96)_26%)] shadow-[0_28px_70px_rgba(15,23,42,0.08)]">
          <div className="grid gap-6 border-b border-[var(--border-subtle)] px-5 py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:px-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                {eyebrow}
              </p>
              <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap items-start justify-start gap-2 lg:justify-end">
              {showLogout ? <AdminLogoutButton /> : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 px-5 py-4 lg:px-7">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group min-w-[9rem] rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-3 transition hover:border-[var(--accent)] hover:bg-white"
              >
                <p className="text-sm font-semibold text-[var(--text-primary)] transition group-hover:text-[var(--accent)]">
                  {link.label}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[var(--text-soft)]">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
