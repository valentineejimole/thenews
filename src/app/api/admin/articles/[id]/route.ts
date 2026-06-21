import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { categories } from "@/lib/news-data";
import type { HomepagePlacement } from "@/lib/admin";
import {
  canManageAllArticles,
  getAuthenticatedProfile,
  normalizeArticleSlug,
  slugifyArticleTitle,
} from "@/lib/articles";

type ArticlePayload = {
  title?: string;
  slug?: string;
  category?: string;
  excerpt?: string;
  coverImageUrl?: string;
  cover_image_url?: string;
  coverAlt?: string;
  cover_image_alt?: string;
  content?: string;
  author?: string;
  status?: "draft" | "published";
  publishDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  trending?: boolean;
  readingTime?: number | null;
  editorNote?: string;
  showOnHomepage?: boolean;
  homepagePriority?: number | null;
  homepagePlacement?: HomepagePlacement;
};

const homepagePlacements: HomepagePlacement[] = [
  "none",
  "lead",
  "top_story",
  "latest",
  "trending",
  "editor_pick",
];

function isValidCategory(value: string) {
  return categories.includes(value as (typeof categories)[number]);
}

function toIsoOrNull(value?: string | null) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function normalizeReadingTime(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.round(value);
}

function normalizeCoverImageUrl(value?: string | null) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  if (
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:") ||
    trimmed.includes("localhost") ||
    trimmed.includes("127.0.0.1")
  ) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

function normalizeHomepagePriority(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 100;
  }

  return Math.max(0, Math.round(value));
}

function normalizeHomepagePlacement(value?: string | null): HomepagePlacement {
  return homepagePlacements.includes(value as HomepagePlacement) ? (value as HomepagePlacement) : "none";
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const { user, profile, supabase } = await getAuthenticatedProfile();

  if (!user || !supabase) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: existing, error: existingError } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (existingError || !existing) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  if (!canManageAllArticles(profile?.role) && existing.author_id !== user.id) {
    return NextResponse.json({ error: "You do not have access to edit this article." }, { status: 403 });
  }

  const body = (await request.json()) as ArticlePayload;
  const title = body.title?.trim() ?? "";
  const previousSlug = normalizeArticleSlug(existing.slug);
  const previousCategorySlug = existing.category?.trim().toLowerCase();
  const slug = normalizeArticleSlug(body.slug?.trim() || slugifyArticleTitle(title));
  const content = body.content?.trim() ?? "";
  const category = body.category?.trim() ?? "";
  const nextCategorySlug = category.toLowerCase();
  const status = body.status === "published" ? "published" : "draft";
  const scheduledAt = toIsoOrNull(body.publishDate);
  const publishedAt =
    status === "published"
      ? scheduledAt ?? existing.published_at ?? new Date().toISOString()
      : null;
  const homepagePlacement = normalizeHomepagePlacement(body.homepagePlacement);
  const showOnHomepage = Boolean(body.showOnHomepage);
  const coverImageUrl = normalizeCoverImageUrl(body.coverImageUrl ?? body.cover_image_url);
  const coverAlt = body.coverAlt ?? body.cover_image_alt;

  if (!title || !content || !slug || !isValidCategory(category)) {
    return NextResponse.json({ error: "Title, slug, category, and content are required." }, { status: 400 });
  }

  const { data: updatedArticle, error } = await supabase
    .from("articles")
    .update({
      title,
      slug,
      category,
      excerpt: body.excerpt?.trim() || null,
      cover_image_url: coverImageUrl,
      cover_alt: coverAlt?.trim() || null,
      content,
      author_name: body.author?.trim() || existing.author_name,
      status,
      seo_title: body.seoTitle?.trim() || null,
      seo_description: body.seoDescription?.trim() || null,
      is_featured: Boolean(body.featured),
      is_trending: Boolean(body.trending),
      show_on_homepage: showOnHomepage,
      homepage_priority: normalizeHomepagePriority(body.homepagePriority),
      homepage_placement: showOnHomepage ? homepagePlacement : "none",
      scheduled_at: scheduledAt,
      reading_time: normalizeReadingTime(body.readingTime),
      editor_note: body.editorNote?.trim() || null,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, slug, cover_image_url, updated_at")
    .single();

  if (error) {
    const duplicate = error.code === "23505";
    return NextResponse.json(
      { error: duplicate ? "That slug is already in use." : error.message },
      { status: duplicate ? 409 : 500 },
    );
  }

  console.info("[article-cover] saved database value", {
    articleId: updatedArticle.id,
    slug: updatedArticle.slug,
    cover_image_url: updatedArticle.cover_image_url,
    updated_at: updatedArticle.updated_at,
  });

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/article/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/article/${previousSlug}`);
  }
  if (previousCategorySlug) {
    revalidatePath(`/category/${previousCategorySlug}`);
  }
  revalidatePath(`/category/${nextCategorySlug}`);

  return NextResponse.json({ success: "Article updated.", article: updatedArticle }, { status: 200 });
}
