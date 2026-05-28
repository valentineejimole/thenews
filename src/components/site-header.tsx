"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { categories } from "@/lib/news-data";
import { getCategorySlug } from "@/lib/news";

const desktopNav = [
  { href: "/", label: "Home" },
  ...categories.map((category) => ({
    href: `/category/${getCategorySlug(category)}`,
    label: category,
  })),
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[color:var(--surface-raised)]/95 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:px-6 sm:py-2.5 lg:px-8">
          <Link href="/" aria-label="NewsPressal home" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white p-1 shadow-sm sm:h-11 sm:w-11">
              <Image
                src="/logo.png"
                alt="NewsPressal logo"
                width={44}
                height={44}
                className="h-full w-full object-contain"
                priority
              />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold tracking-tight text-[var(--text-primary)] sm:text-lg">
                NewsPressal
              </p>
              <p className="hidden text-[11px] font-medium tracking-[0.02em] text-[var(--text-soft)] md:block">
                Independent. Insightful. In real time.
              </p>
            </div>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center justify-center gap-5 overflow-x-auto text-[13px] font-semibold uppercase tracking-[0.14em] lg:flex"
          >
            {desktopNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/search"
              aria-label="Search articles"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <SearchIcon className="h-4 w-4" />
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1.5 md:hidden">
            <Link
              href="/search"
              aria-label="Search articles"
              className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <SearchIcon className="h-4 w-4" />
            </Link>
            <ThemeToggle />
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)]"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
                <path
                  d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-[60] bg-slate-950/45 md:hidden">
          <div
            id="mobile-nav-menu"
            className="ml-auto flex h-full w-[min(24rem,100%)] flex-col border-l border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white p-1 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="NewsPressal logo"
                    width={36}
                    height={36}
                    className="h-full w-full object-contain"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                    NewsPressal
                  </p>
                  <p className="text-xs text-[var(--text-soft)]">
                    Independent. Insightful. In real time.
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)]"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <Link
                href="/search"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--site-bg)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]"
              >
                <span>Search the newsroom</span>
                <SearchIcon className="h-4 w-4" />
              </Link>
            </div>
            <nav aria-label="Mobile primary" className="mt-4 grid gap-2">
              {desktopNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-2xl border border-transparent px-3 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)] transition hover:border-[var(--border-subtle)] hover:bg-[var(--surface-subtle)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--site-bg)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                Morning Briefing
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                Open the search desk or jump directly into politics, markets, technology, sports, entertainment, and opinion.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
