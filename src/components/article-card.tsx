import Link from "next/link";
import { NewsImage } from "@/components/news-image";
import type { Article } from "@/lib/news-data";
import { formatArticleDate, formatArticleDateTime, getCategorySlug } from "@/lib/news";

export function ArticleCard({
  article,
  priority = false,
  variant = "standard",
}: {
  article: Article;
  priority?: boolean;
  variant?: "standard" | "compact" | "horizontal" | "minimal";
}) {
  const compact = variant === "compact";
  const horizontal = variant === "horizontal";
  const minimal = variant === "minimal";
  const headlineClampClass = minimal ? "headline-clamp-3" : horizontal ? "headline-clamp-3" : "headline-clamp-3";
  const headlineWidthClass = horizontal
    ? "max-w-[34ch]"
    : minimal
      ? "max-w-[34ch]"
      : "max-w-[30ch]";

  return (
    <article
      className={`group min-w-0 self-start overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] transition duration-300 hover:border-[var(--border-strong)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] ${
        horizontal ? "grid gap-0 md:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)]" : ""
      } ${minimal ? "border-0 bg-transparent shadow-none hover:translate-y-0 hover:shadow-none" : ""}`}
    >
      {!minimal ? (
        <Link href={`/article/${article.slug}`} className="block min-w-0">
          <div
            className={`relative overflow-hidden ${
              horizontal
                ? "aspect-[16/9] md:h-full md:aspect-[4/3]"
                : compact
                  ? "aspect-[16/9] sm:aspect-[4/3]"
                  : "aspect-[16/9] sm:aspect-[16/10]"
            }`}
          >
            <NewsImage
              src={article.image}
              alt={article.imageAlt}
              priority={priority}
              sizes={
                horizontal
                  ? "(min-width: 1024px) 320px, 100vw"
                  : compact
                    ? "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                    : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              }
              className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
            />
          </div>
        </Link>
      ) : null}
      <div className={minimal ? "min-w-0 px-0 py-2.5 sm:py-3" : "flex min-w-0 flex-1 flex-col p-4 sm:p-5"}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[var(--border-subtle)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-soft)]">
            {article.source}
          </span>
          {article.video ? (
            <span className="rounded-full bg-[var(--text-primary)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--site-bg)]">
              Video
            </span>
          ) : null}
          {article.editorPick ? (
            <span className="rounded-full bg-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
              Editor&apos;s Pick
            </span>
          ) : null}
        </div>
        <Link
          href={`/category/${getCategorySlug(article.category)}`}
          className="mt-3 inline-flex text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] sm:mt-4 sm:text-xs"
        >
          {article.category}
        </Link>
        <Link href={`/article/${article.slug}`} className="block">
          <h3
            className={`${headlineClampClass} ${headlineWidthClass} mt-2 font-semibold tracking-tight text-[var(--text-primary)] [text-wrap:pretty] transition group-hover:text-[var(--accent)] ${
              minimal
                ? "text-[1.02rem] leading-[1.22] sm:text-[1.05rem]"
                : compact
                  ? "text-[1.08rem] leading-[1.18] sm:text-[1.18rem]"
                  : horizontal
                    ? "text-[1.08rem] leading-[1.18] sm:text-[1.15rem] xl:text-[1.22rem]"
                    : "text-[1.14rem] leading-[1.18] sm:text-[1.24rem] xl:text-[1.34rem]"
            }`}
          >
            {article.title}
          </h3>
        </Link>
        <p className="excerpt-clamp-2 mt-2 max-w-[62ch] text-sm leading-6 text-[var(--text-muted)]">
          {article.excerpt}
        </p>
        <div className={`${minimal ? "mt-3" : "mt-3 pt-0 sm:mt-auto sm:pt-3.5"} flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] uppercase tracking-[0.16em] text-[var(--text-soft)] sm:text-[11px]`}>
          <span>{article.author}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--text-soft)]" />
          <span>{formatArticleDate(article.publishedAt)}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--text-soft)]" />
          <span>{article.readTime}</span>
        </div>
        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-soft)] sm:mt-1.5 sm:text-[11px]">
          {article.location} | {formatArticleDateTime(article.updatedAt ?? article.publishedAt)}
        </p>
      </div>
    </article>
  );
}
