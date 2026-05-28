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
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)] sm:text-xs sm:tracking-[0.28em]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-[1.55rem] font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
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
