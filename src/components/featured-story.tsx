import Link from "next/link";
import { NewsImage } from "@/components/news-image";
import type { Article } from "@/lib/news-data";
import { formatArticleDate, formatArticleDateTime, getCategorySlug } from "@/lib/news";

export function FeaturedStory({ article }: { article: Article }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] shadow-[0_22px_48px_rgba(15,23,42,0.08)]">
      <div className="grid items-start xl:grid-cols-[1.08fr_0.92fr]">
        <div className="relative aspect-[16/10] overflow-hidden xl:aspect-auto xl:min-h-[100%]">
          <NewsImage
            src={article.image}
            alt={article.imageAlt}
            priority
            sizes="(min-width: 1280px) 44rem, (min-width: 1024px) 56vw, 100vw"
            className="object-cover object-center transition duration-700 group-hover:scale-[1.02]"
          />
        </div>
        <div className="flex min-w-0 flex-col justify-between p-5 sm:p-6 xl:p-7">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
                Lead Story
              </span>
              {article.breaking ? (
                <span className="rounded-full border border-[var(--signal)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--signal)]">
                  Breaking
                </span>
              ) : null}
            </div>
            <Link
              href={`/category/${getCategorySlug(article.category)}`}
              className="mt-5 inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]"
            >
              {article.category}
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[var(--border-subtle)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-soft)]">
                {article.source}
              </span>
              {article.editorPick ? (
                <span className="rounded-full bg-[var(--text-primary)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--site-bg)]">
                  Editor&apos;s Pick
                </span>
              ) : null}
            </div>
            <Link href={`/article/${article.slug}`} className="block">
              <h1 className="mt-3 max-w-[24ch] text-[1.95rem] font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--text-primary)] [text-wrap:pretty] transition hover:text-[var(--accent)] sm:text-[2.2rem] xl:text-[2.55rem]">
                {article.title}
              </h1>
            </Link>
            <p className="mt-3 max-w-[58ch] text-[15px] leading-7 text-[var(--text-muted)]">
              {article.excerpt}
            </p>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[var(--border-subtle)] pt-4 text-[11px] uppercase tracking-[0.16em] text-[var(--text-soft)]">
            <span>{article.author}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--text-soft)]" />
            <span>{formatArticleDate(article.publishedAt)}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--text-soft)]" />
            <span>{article.readTime}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--text-soft)]" />
            <span>{article.location}</span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
            Updated {formatArticleDateTime(article.updatedAt ?? article.publishedAt)}
          </p>
        </div>
      </div>
    </article>
  );
}
