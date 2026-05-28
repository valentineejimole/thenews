import Image from "next/image";
import Link from "next/link";
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
                ? "aspect-[4/3] md:h-full"
                : compact
                  ? "aspect-[4/3]"
                  : "aspect-[16/10]"
            }`}
          >
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              priority={priority}
              sizes={
                horizontal
                  ? "(min-width: 1024px) 320px, 100vw"
                  : compact
                    ? "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                    : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              }
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
            />
          </div>
        </Link>
      ) : null}
      <div className={minimal ? "min-w-0 px-0 py-3" : "min-w-0 p-4 sm:p-5"}>
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
          className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]"
        >
          {article.category}
        </Link>
        <Link href={`/article/${article.slug}`} className="block">
          <h3
            className={`${headlineClampClass} ${headlineWidthClass} mt-2.5 font-semibold tracking-tight text-[var(--text-primary)] [text-wrap:pretty] transition group-hover:text-[var(--accent)] ${
              minimal
                ? "text-[1.05rem] leading-[1.18]"
                : compact
                  ? "text-[1.18rem] leading-[1.16]"
                  : horizontal
                    ? "text-[1.15rem] leading-[1.16] xl:text-[1.22rem]"
                    : "text-[1.24rem] leading-[1.15] xl:text-[1.34rem]"
            }`}
          >
            {article.title}
          </h3>
        </Link>
        <p className="excerpt-clamp-2 mt-2.5 max-w-[62ch] text-sm leading-6 text-[var(--text-muted)]">
          {article.excerpt}
        </p>
        <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--text-soft)]">
          <span>{article.author}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--text-soft)]" />
          <span>{formatArticleDate(article.publishedAt)}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--text-soft)]" />
          <span>{article.readTime}</span>
        </div>
        <p className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--text-soft)]">
          {article.location} | {formatArticleDateTime(article.updatedAt ?? article.publishedAt)}
        </p>
      </div>
    </article>
  );
}
