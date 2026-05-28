import Image from "next/image";
import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { categories } from "@/lib/news-data";
import { getCategorySlug } from "@/lib/news";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/search", label: "Search" },
  { href: "/", label: "Latest Headlines" },
];

const newsletterLinks = [
  "Morning Briefing",
  "Market Watch",
  "Weekend Reads",
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)] bg-[var(--surface-subtle)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr_0.7fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white p-1 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="NewsPressal logo"
                    width={44}
                    height={44}
                    className="h-full w-full object-contain"
                  />
                </span>
                <div>
                  <p className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
                    NewsPressal
                  </p>
                  <p className="text-xs text-[var(--text-soft)]">
                    Independent. Insightful. In real time.
                  </p>
                </div>
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                Reporting with range, context, and editorial discipline.
              </h2>
              <p className="mt-4 max-w-md text-base text-[var(--text-muted)]">
                Premium coverage across politics, business, technology, sports, entertainment, and opinion, built for desktop and mobile reading habits.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)]">
                Sections
              </h3>
              <div className="mt-4 grid gap-3">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/category/${getCategorySlug(category)}`}
                    className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] transition hover:text-[var(--accent)]"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)]">
                Company
              </h3>
              <div className="mt-4 grid gap-3">
                {companyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] transition hover:text-[var(--accent)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)]">
                Newsletters
              </h3>
              <div className="mt-4 grid gap-3">
                {newsletterLinks.map((label) => (
                  <p
                    key={label}
                    className="max-w-none text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]"
                  >
                    {label}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <NewsletterSignup />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-6 text-sm text-[var(--text-soft)] md:flex-row md:items-center md:justify-between">
          <p className="max-w-none">Copyright 2026 NewsPressal. Independent reporting, global perspective.</p>
          <div className="flex flex-wrap items-center gap-5">
            <span>Editorial Standards</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
