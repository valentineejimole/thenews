import Link from "next/link";
import type { Article } from "@/lib/news-data";
import { formatArticleDate } from "@/lib/news";

export function TrendingList({
  articles,
  title = "Trending",
}: {
  articles: Article[];
  title?: string;
}) {
  return (
    <section className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight text-[var(--text-primary)] sm:text-lg">
          {title}
        </h2>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] sm:text-xs">
          Most read
        </span>
      </div>
      <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
        {articles.map((article, index) => (
          <article
            key={article.slug}
            className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3 border-b border-[var(--border-subtle)] pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-4 sm:pb-5"
          >
            <span className="text-[1.65rem] font-semibold leading-none tracking-[-0.04em] text-[var(--text-soft)] sm:text-3xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                {article.source}
              </p>
              <Link
                href={`/article/${article.slug}`}
                className="headline-clamp-3 mt-1.5 block max-w-[30ch] text-[15px] font-semibold leading-6 text-[var(--text-primary)] transition hover:text-[var(--accent)] sm:mt-2 sm:text-base"
              >
                {article.title}
              </Link>
              <p className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--text-soft)] sm:mt-2 sm:text-xs">
                {article.category}
                {" | "}
                {formatArticleDate(article.publishedAt)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
