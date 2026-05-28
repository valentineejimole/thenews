import Link from "next/link";
import type { Article } from "@/lib/news-data";

export function BreakingTicker({ articles }: { articles: Article[] }) {
  if (!articles.length) {
    return null;
  }

  const tickerItems = [...articles, ...articles];

  return (
    <div className="overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--ticker-bg)] text-[var(--ticker-text)]">
      <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-3 py-1.5 sm:gap-3 sm:px-6 sm:py-2 lg:px-8">
        <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[var(--signal)] px-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:h-7 sm:px-3 sm:text-[11px]">
          Breaking
        </span>
        <p className="hidden shrink-0 text-xs font-medium text-[var(--ticker-text)]/75 sm:block">
          Developing stories:
        </p>
        <div className="ticker-viewport min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track">
            {tickerItems.map((article, index) => (
              <Link
                key={`${article.slug}-${index}`}
                href={`/article/${article.slug}`}
                className="ticker-item whitespace-nowrap text-[12px] font-semibold text-[var(--ticker-text)] transition hover:text-white sm:text-sm"
              >
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
