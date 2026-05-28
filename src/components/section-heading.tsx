import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          {title}
        </h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="hidden text-sm font-semibold text-[var(--text-primary)] transition hover:text-[var(--accent)] sm:inline-flex"
        >
          View all
        </Link>
      ) : null}
    </div>
  );
}
