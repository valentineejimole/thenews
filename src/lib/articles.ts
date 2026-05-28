import { cache } from "react";
import { articles as mockArticles, categories, type Article, type Category } from "@/lib/news-data";
import type { AdminArticleRecord } from "@/lib/admin";
import type { SupabaseArticleRow, SupabaseProfile, SupabaseProfileRole } from "@/lib/supa-types";
import { createSupabasePublicClient, createSupabaseServerClient } from "@/lib/supabase/server";

const fallbackImages = new Map<Category, string>(
  categories.map((category) => [
    category,
    mockArticles.find((article) => article.category === category)?.image ?? mockArticles[0].image,
  ]),
);

function isKnownCategory(value: string): value is Category {
  return categories.includes(value as Category);
}

function normalizeCategory(value: string): Category {
  return isKnownCategory(value) ? value : "Opinion";
}

function buildSourceLabel(category: Category) {
  if (category === "Tech") {
    return "NewsPressal Technology";
  }

  return `NewsPressal ${category} Desk`;
}

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.round(words / 180));
  return `${minutes} min read`;
}

function splitContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function buildExcerpt(content: string, excerpt?: string | null) {
  if (excerpt?.trim()) {
    return excerpt.trim();
  }

  const normalized = content.replace(/\s+/g, " ").trim();
  return normalized.length > 180 ? `${normalized.slice(0, 177)}...` : normalized;
}

function mapSupabaseArticle(row: SupabaseArticleRow, index: number): Article {
  const category = normalizeCategory(row.category);
  const content = splitContent(row.content);

  return {
    slug: row.slug,
    title: row.title,
    excerpt: buildExcerpt(row.content, row.excerpt),
    content: content.length ? content : [row.content],
    category,
    author: row.author_name?.trim() || "NewsPressal Staff",
    authorRole: "Staff Writer",
    authorBio:
      "NewsPressal contributors report across politics, business, technology, sports, culture, and opinion.",
    publishedAt: row.published_at ?? row.created_at,
    updatedAt: row.updated_at,
    readTime: estimateReadTime(row.content),
    image: row.cover_image_url?.trim() || fallbackImages.get(category) || mockArticles[0].image,
    imageAlt: row.title,
    source: buildSourceLabel(category),
    location: "Global Desk",
    featured: index === 0,
    breaking: index < 2,
    editorPick: index < 4,
    marketWatch: category === "Business" && index < 3,
    weekendRead: content.join(" ").length > 1200,
    video: false,
    trendingScore: Math.max(60, 100 - index),
    tags: [category.toLowerCase(), "newspressal", "analysis"],
  };
}

async function fetchPublishedSupabaseArticlesInternal() {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  return data as SupabaseArticleRow[];
}

export const fetchPublishedSupabaseArticles = cache(fetchPublishedSupabaseArticlesInternal);

export async function getPublicArticles() {
  const supabaseArticles = (await fetchPublishedSupabaseArticles()).map(mapSupabaseArticle);

  if (!supabaseArticles.length) {
    return mockArticles;
  }

  const supabaseSlugs = new Set(supabaseArticles.map((article) => article.slug));
  const remainingMockArticles = mockArticles.filter((article) => !supabaseSlugs.has(article.slug));
  return [...supabaseArticles, ...remainingMockArticles];
}

export async function getPublicArticleBySlug(slug: string) {
  const supabase = createSupabasePublicClient();

  if (supabase) {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (data) {
      return mapSupabaseArticle(data as SupabaseArticleRow, 0);
    }
  }

  return mockArticles.find((article) => article.slug === slug);
}

export async function getPublicRelatedArticles(article: Article, limit = 3) {
  const allArticles = await getPublicArticles();

  return allArticles
    .filter(
      (candidate) =>
        candidate.slug !== article.slug &&
        (candidate.category === article.category ||
          candidate.tags.some((tag) => article.tags.includes(tag))),
    )
    .slice(0, limit);
}

export async function searchPublicArticles(query: string, categorySlug?: string) {
  const allArticles = await getPublicArticles();
  const normalized = query.trim().toLowerCase();
  const category = categorySlug
    ? categories.find((candidate) => candidate.toLowerCase() === categorySlug)
    : undefined;

  return allArticles.filter((article) => {
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

export async function getSupabaseArticleSlugs() {
  const rows = await fetchPublishedSupabaseArticles();
  return rows.map((row) => row.slug);
}

export async function getAuthenticatedProfile() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { user: null, profile: null, supabase: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, supabase };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    profile: (profile as SupabaseProfile | null) ?? null,
    supabase,
  };
}

export function canManageAllArticles(role?: SupabaseProfileRole | null) {
  return role === "admin" || role === "editor";
}

export function canManageDrafts(role?: SupabaseProfileRole | null) {
  return role === "admin" || role === "editor" || role === "author";
}

export function slugifyArticleTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function mapSupabaseArticleToAdminRecord(row: SupabaseArticleRow): AdminArticleRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: normalizeCategory(row.category),
    excerpt: row.excerpt ?? "",
    coverImageUrl: row.cover_image_url ?? "",
    content: row.content,
    author: row.author_name ?? "",
    status: row.status,
    publishDate: (row.published_at ?? row.created_at).slice(0, 16),
  };
}
