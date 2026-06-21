import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { TrendingList } from "@/components/trending-list";
import { getPublicArticles } from "@/lib/articles";
import { categories } from "@/lib/news-data";
import {
  buildMetadata,
  getCategoryFromSlug,
  getCategorySlug,
} from "@/lib/news";

export const revalidate = 60;

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: getCategorySlug(category),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryFromSlug(slug);

  if (!category) {
    return {};
  }

  return buildMetadata({
    title: `${category} News | NewsPressal`,
    description: `Latest ${category.toLowerCase()} reporting, analysis, and features from NewsPressal.`,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryFromSlug(slug);

  if (!category) {
    notFound();
  }

  const allArticles = await getPublicArticles();
  const stories = allArticles.filter((article) => article.category === category);
  const leadStory = stories.find((article) => article.featured) ?? stories[0];
  const secondaryStories = stories.filter((article) => article.slug !== leadStory?.slug);
  const trendingArticles = allArticles
    .slice()
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 5);

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-[78rem] px-4 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <section className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)] sm:text-xs sm:tracking-[0.32em]">
              Category
            </p>
            <h1 className="mt-3 text-[clamp(2.25rem,8vw,3.75rem)] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
              {category}
            </h1>
            <p className="mt-3 max-w-2xl text-[14px] leading-6 text-[var(--text-muted)] sm:mt-4 sm:text-base">
              Reporting and analysis from the {category.toLowerCase()} desk, curated for readers who want more than headlines.
            </p>

            <div className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_0.9fr]">
              {leadStory ? <ArticleCard article={leadStory} /> : null}
              <div className="grid gap-6">
                {secondaryStories.slice(0, 2).map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="horizontal" />
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-[var(--border-subtle)] pt-8 sm:mt-10 sm:pt-10">
              <h2 className="text-[1.55rem] font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                More from the {category} desk
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {secondaryStories.map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="compact" />
                ))}
              </div>
            </div>
          </section>
          <aside className="space-y-6 self-start">
            <TrendingList articles={trendingArticles} />
            <NewsletterSignup />
          </aside>
        </div>
      </div>
    </div>
  );
}
