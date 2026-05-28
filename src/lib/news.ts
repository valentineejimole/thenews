import type { Metadata } from "next";
import { articles, categories, type Article, type Category } from "@/lib/news-data";

export const siteName = "NewsPressal";
export const siteDescription =
  "NewsPressal is an independent digital newsroom delivering breaking coverage, deep reporting, and sharp analysis across politics, business, technology, sports, entertainment, and opinion in real time.";
export const siteUrl = "https://newspressal.example";

export function getFeaturedArticle() {
  return articles.find((article) => article.featured) ?? getLatestArticles(1)[0];
}

export function getTrendingArticles(limit = 5) {
  return [...articles]
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit);
}

export function getLatestArticles(limit?: number) {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export function getBreakingArticles() {
  return getLatestArticles().filter((article) => article.breaking);
}

export function getEditorPicks(limit = 4) {
  return getLatestArticles().filter((article) => article.editorPick).slice(0, limit);
}

export function getVideoArticles(limit = 3) {
  return getLatestArticles().filter((article) => article.video).slice(0, limit);
}

export function getWeekendReads(limit = 4) {
  return getLatestArticles().filter((article) => article.weekendRead).slice(0, limit);
}

export function getMarketWatchArticles(limit = 4) {
  return getLatestArticles().filter((article) => article.marketWatch).slice(0, limit);
}

export function getOpinionArticles(limit = 4) {
  return getLatestArticles()
    .filter((article) => article.category === "Opinion")
    .slice(0, limit);
}

export function getCategoryArticles(category: Category) {
  return getLatestArticles().filter((article) => article.category === category);
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getRelatedArticles(article: Article, limit = 3) {
  return getLatestArticles()
    .filter(
      (candidate) =>
        candidate.slug !== article.slug &&
        (candidate.category === article.category ||
          candidate.tags.some((tag) => article.tags.includes(tag))),
    )
    .slice(0, limit);
}

export function searchArticles(query: string, categorySlug?: string) {
  const normalized = query.trim().toLowerCase();
  const category = categorySlug ? getCategoryFromSlug(categorySlug) : undefined;

  return getLatestArticles().filter((article) => {
    const matchesCategory = category ? article.category === category : true;

    if (!normalized) {
      return matchesCategory;
    }

    const haystack = [
      article.title,
      article.excerpt,
      article.author,
      article.authorRole,
      article.source,
      article.location,
      article.category,
      article.tags.join(" "),
      article.content.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && haystack.includes(normalized);
  });
}

export function getCategorySlug(category: Category) {
  return category.toLowerCase();
}

export function getCategoryFromSlug(slug: string) {
  return categories.find((category) => getCategorySlug(category) === slug);
}

export function formatArticleDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatArticleDateTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image = articles[0]?.image,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      siteName,
      type: "website",
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
