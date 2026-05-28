"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin-logout-button";

const adminLinks = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    description: "Overview",
  },
  {
    href: "/admin/articles/new",
    label: "New Story",
    description: "Compose",
  },
  {
    href: "/admin/login",
    label: "Session",
    description: "Access",
  },
] as const;

function AdminLinkIcon({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl border transition ${
        active
          ? "border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_16%,white)] text-[var(--accent-strong)]"
          : "border-[var(--border-subtle)] bg-white text-[var(--text-soft)]"
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
    </span>
  );
}

export function AdminShell({
  title,
  description,
  children,
  showLogout = false,
  eyebrow = "Editorial CMS",
}: {
  title: string;
  description: string;
  children: ReactNode;
  showLogout?: boolean;
  eyebrow?: string;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="page-shell min-h-screen bg-[radial-gradient(circle_at_top,rgba(179,143,69,0.12),transparent_38%),linear-gradient(180deg,#fffdf9_0%,var(--site-bg)_48%,#f5efe5_100%)]">
      <div className="mx-auto max-w-[88rem] px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <div className="grid items-start gap-5 lg:grid-cols-[15.5rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
          <aside className="hidden lg:sticky lg:top-[5.75rem] lg:block">
            <div className="overflow-hidden rounded-[2rem] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,rgba(179,143,69,0.16),rgba(255,255,255,0.98)_22%)] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <div className="rounded-[1.6rem] border border-[var(--border-subtle)] bg-white/90 p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-white p-1 shadow-sm">
                    <Image
                      src="/logo.png"
                      alt="NewsPressal logo"
                      width={48}
                      height={48}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                      {eyebrow}
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                      NewsPressal
                    </p>
                  </div>
                </div>
                <p className="mt-4 max-w-[22ch] text-sm leading-6 text-[var(--text-muted)]">
                  Publishing workflow for editors, desks, and live newsroom operations.
                </p>
              </div>

              <nav aria-label="Admin navigation" className="mt-4 grid gap-2">
                {adminLinks.map((link) => {
                  const active =
                    link.href === "/admin/articles/new"
                      ? pathname?.startsWith("/admin/articles")
                      : pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`group flex items-center gap-3 rounded-[1.4rem] border px-3 py-3 transition ${
                        active
                          ? "border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,white)]"
                          : "border-transparent bg-white/65 hover:border-[var(--border-subtle)] hover:bg-white"
                      }`}
                    >
                      <AdminLinkIcon active={active} />
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold transition ${
                            active ? "text-[var(--accent-strong)]" : "text-[var(--text-primary)]"
                          }`}
                        >
                          {link.label}
                        </p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[var(--text-soft)]">
                          {link.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                  Shift note
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                  Move quickly between drafts, scheduled stories, and live homepage priorities.
                </p>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <header className="sticky top-3 z-40 rounded-[2rem] border border-[var(--border-subtle)] bg-[color:var(--surface-raised)]/94 px-4 py-3.5 shadow-[0_16px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:top-4 sm:px-5 sm:py-4 lg:px-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen(true)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-white text-[var(--text-primary)] lg:hidden"
                      aria-label="Open admin navigation"
                    >
                      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
                        <path d="M4 5.5h12M4 10h12M4 14.5h12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
                      </svg>
                    </button>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                      {eyebrow}
                    </span>
                  </div>
                  <h1 className="mt-3 max-w-4xl text-[clamp(1.85rem,5vw,3.25rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--text-primary)]">
                    {title}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
                    {description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/admin/articles/new"
                    className="rounded-full bg-[var(--text-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--site-bg)] transition hover:bg-[var(--accent)]"
                  >
                    New article
                  </Link>
                  {showLogout ? <AdminLogoutButton /> : null}
                </div>
              </div>
            </header>

            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-[70] bg-slate-950/45 lg:hidden">
          <div className="ml-auto flex h-full w-[min(22rem,100%)] flex-col border-l border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-white p-1 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="NewsPressal logo"
                    width={44}
                    height={44}
                    className="h-full w-full object-contain"
                  />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                    {eyebrow}
                  </p>
                  <p className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                    NewsPressal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border-subtle)] text-[var(--text-primary)]"
                aria-label="Close admin navigation"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
                </svg>
              </button>
            </div>

            <nav aria-label="Admin mobile navigation" className="mt-5 grid gap-2">
              {adminLinks.map((link) => {
                const active =
                  link.href === "/admin/articles/new"
                    ? pathname?.startsWith("/admin/articles")
                    : pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-[1.35rem] border px-3 py-3 ${
                      active
                        ? "border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,white)]"
                        : "border-[var(--border-subtle)] bg-white"
                    }`}
                  >
                    <AdminLinkIcon active={active} />
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{link.label}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[var(--text-soft)]">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Editorial Desk
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                Manage drafts, scheduled coverage, and front-page priorities from one secure workspace.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
