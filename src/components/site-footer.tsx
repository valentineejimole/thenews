import Image from "next/image";
import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { categories } from "@/lib/news-data";
import { getCategorySlug } from "@/lib/news";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/search", label: "Search" },
  { href: "/", label: "Latest Headlines" },
  { href: "mailto:editor@newspressal.example", label: "Contact" },
];

const resourceLinks = [
  { href: "/", label: "Morning Briefing" },
  { href: "/", label: "Market Watch" },
  { href: "/", label: "Weekend Reads" },
];

const utilityLinks = [
  { href: "/", label: "Editorial Standards" },
  { href: "/", label: "Privacy" },
  { href: "/", label: "Terms" },
  { href: "mailto:editor@newspressal.example", label: "Contact" },
];

const socialLinks = [
  { href: "/", label: "X" },
  { href: "/", label: "LinkedIn" },
  { href: "/", label: "Instagram" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)] bg-[linear-gradient(180deg,rgba(179,143,69,0.08),transparent_26%)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 h-px w-full bg-[linear-gradient(90deg,var(--accent),rgba(179,143,69,0.16),transparent_80%)] opacity-70" />
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white p-1 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="NewsPressal logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </span>
              <div>
                <p className="text-[1.05rem] font-semibold tracking-tight text-[var(--text-primary)]">
                  NewsPressal
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-soft)]">
                  Independent. Insightful. In real time.
                </p>
              </div>
            </div>
            <h2 className="mt-4 max-w-[14ch] text-[1.9rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--text-primary)]">
              Reporting with clarity, range, and editorial discipline.
            </h2>
            <p className="mt-3 max-w-[32ch] text-sm leading-6 text-[var(--text-muted)]">
              NewsPressal covers politics, markets, technology, sports, culture, and opinion with a digital-first newsroom rhythm built for modern readers.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-3 content-start">
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-primary)]">
              Sections
            </h3>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${getCategorySlug(category)}`}
                className="text-sm font-medium text-[var(--text-muted)] transition hover:translate-x-0.5 hover:text-[var(--accent)]"
              >
                {category}
              </Link>
            ))}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            <div className="grid gap-3 content-start">
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-primary)]">
                Company
              </h3>
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[var(--text-muted)] transition hover:translate-x-0.5 hover:text-[var(--accent)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="grid gap-3 content-start">
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-primary)]">
                Resources
              </h3>
              {resourceLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-[var(--text-muted)] transition hover:translate-x-0.5 hover:text-[var(--accent)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:pl-2">
            <div className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-1">
              <NewsletterSignup compact />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--border-subtle)] pt-5 text-sm text-[var(--text-soft)] lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-none text-[13px]">
            Copyright 2026 NewsPressal. Independent reporting with a global editorial perspective.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {utilityLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13px] transition hover:text-[var(--accent)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
