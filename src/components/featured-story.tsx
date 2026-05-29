import Link from "next/link";
import { NewsImage } from "@/components/news-image";
import { resolveArticleImageSrc, type Article } from "@/lib/news-data";
import { formatArticleDate, formatArticleDateTime, getCategorySlug } from "@/lib/news";

export function FeaturedStory({ article }: { article: Article }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] shadow-[0_22px_48px_rgba(15,23,42,0.08)]">
      <div className="grid items-start xl:grid-cols-[1.08fr_0.92fr]">
        <div className="relative aspect-[16/9] overflow-hidden xl:aspect-auto xl:min-h-[100%]">
          <NewsImage
            src={resolveArticleImageSrc(article)}
            alt={article.imageAlt}
            priority
            sizes="(min-width: 1280px) 44rem, (min-width: 1024px) 56vw, 100vw"
            className="object-cover object-center transition duration-700 group-hover:scale-[1.02]"
          />
        </div>
        <div className="flex min-w-0 flex-col justify-between p-4 sm:p-6 xl:p-7">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white sm:px-3 sm:text-[11px]">
                Lead Story
              </span>
              {article.breaking ? (
                <span className="rounded-full border border-[var(--signal)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--signal)] sm:px-3 sm:text-[11px]">
                  Breaking
                </span>
              ) : null}
            </div>
            <Link
              href={`/category/${getCategorySlug(article.category)}`}
              className="mt-4 inline-flex text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] sm:mt-5 sm:text-xs"
            >
              {article.category}
            </Link>
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
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
              <h1 className="mt-3 max-w-[18ch] text-[clamp(1.7rem,7vw,2.55rem)] font-semibold leading-[1.01] tracking-[-0.045em] text-[var(--text-primary)] [text-wrap:pretty] transition hover:text-[var(--accent)]">
                {article.title}
              </h1>
            </Link>
            <p className="mt-2.5 max-w-[58ch] text-[14px] leading-6 text-[var(--text-muted)] sm:mt-3 sm:text-[15px] sm:leading-7">
              {article.excerpt}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[var(--border-subtle)] pt-3.5 text-[10px] uppercase tracking-[0.16em] text-[var(--text-soft)] sm:mt-5 sm:pt-4 sm:text-[11px]">
            <span>{article.author}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--text-soft)]" />
            <span>{formatArticleDate(article.publishedAt)}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--text-soft)]" />
            <span>{article.readTime}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--text-soft)]" />
            <span>{article.location}</span>
          </div>
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-[var(--text-soft)] sm:mt-2 sm:text-xs">
            Updated {formatArticleDateTime(article.updatedAt ?? article.publishedAt)}
          </p>
        </div>
      </div>
    </article>
  );
}
