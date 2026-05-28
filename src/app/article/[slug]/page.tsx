import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { SocialShare } from "@/components/social-share";
import { TrendingList } from "@/components/trending-list";
import {
  getPublicArticleBySlug,
  getPublicArticles,
  getPublicRelatedArticles,
  getSupabaseArticleSlugs,
} from "@/lib/articles";
import { articles } from "@/lib/news-data";
import {
  buildMetadata,
  formatArticleDate,
  formatArticleDateTime,
  getCategorySlug,
} from "@/lib/news";

export async function generateStaticParams() {
  const supabaseSlugs = await getSupabaseArticleSlugs();
  const slugs = new Set([...articles.map((article) => article.slug), ...supabaseSlugs]);

  return [...slugs].map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return buildMetadata({
    title: `${article.title} | NewsPressal`,
    description: article.excerpt,
    path: `/article/${article.slug}`,
    image: article.image,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getPublicRelatedArticles(article, 3);
  const trendingArticles = (await getPublicArticles())
    .slice()
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 5);

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-[78rem] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="min-w-0">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[var(--border-subtle)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-soft)]">
                  {article.source}
                </span>
                <span className="rounded-full bg-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                  {article.category}
                </span>
                {article.video ? (
                  <span className="rounded-full bg-[var(--text-primary)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--site-bg)]">
                    Video
                  </span>
                ) : null}
              </div>
              <h1 className="mt-4 max-w-[18ch] text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--text-primary)] [text-wrap:balance] sm:text-6xl">
                {article.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
                {article.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
                <span>{article.author}</span>
                <span>{article.authorRole}</span>
                <span>{article.location}</span>
                <span>{formatArticleDate(article.publishedAt)}</span>
                <span>{article.readTime}</span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
                Updated {formatArticleDateTime(article.updatedAt ?? article.publishedAt)}
              </p>
            </div>

            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[2rem] border border-[var(--border-subtle)]">
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--border-subtle)] py-5">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[var(--surface-subtle)] px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
              <SocialShare title={article.title} path={`/article/${article.slug}`} />
            </div>

            <div className="mt-8 space-y-6">
              {article.content.map((paragraph) => (
                <p key={paragraph} className="max-w-none text-lg leading-8 text-[var(--text-muted)]">
                  {paragraph}
                </p>
              ))}
            </div>

            <section className="mt-12 rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                Author
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                {article.author}
              </h2>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[var(--text-soft)]">
                {article.authorRole}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-muted)]">
                {article.authorBio}
              </p>
              <Link
                href={`/category/${getCategorySlug(article.category)}`}
                className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]"
              >
                More from the {article.category} desk
              </Link>
            </section>

            <section className="mt-14">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                Related Stories
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                Continue reading
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.slug} article={relatedArticle} variant="compact" />
                ))}
              </div>
            </section>
          </article>

          <aside className="space-y-6 self-start">
            <TrendingList articles={trendingArticles} />
            <NewsletterSignup />
          </aside>
        </div>
      </div>
    </div>
  );
}
