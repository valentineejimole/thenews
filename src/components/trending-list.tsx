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
    <section className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
          {title}
        </h2>
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
          Most read
        </span>
      </div>
      <div className="mt-6 space-y-5">
        {articles.map((article, index) => (
          <article
            key={article.slug}
            className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-[var(--border-subtle)] pb-5 last:border-b-0 last:pb-0"
          >
            <span className="text-3xl font-semibold leading-none tracking-[-0.04em] text-[var(--text-soft)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                {article.source}
              </p>
              <Link
                href={`/article/${article.slug}`}
                className="headline-clamp-3 mt-2 block max-w-[28ch] text-base font-semibold leading-6 text-[var(--text-primary)] transition hover:text-[var(--accent)]"
              >
                {article.title}
              </Link>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
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
