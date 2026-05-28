import { NextResponse } from "next/server";
import { categories } from "@/lib/news-data";
import { canManageAllArticles, getAuthenticatedProfile, slugifyArticleTitle } from "@/lib/articles";

type ArticlePayload = {
  title?: string;
  slug?: string;
  category?: string;
  excerpt?: string;
  coverImageUrl?: string;
  coverAlt?: string;
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
};

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
  const slug = (body.slug?.trim() || slugifyArticleTitle(title)).toLowerCase();
  const content = body.content?.trim() ?? "";
  const category = body.category?.trim() ?? "";
  const status = body.status === "published" ? "published" : "draft";
  const scheduledAt = toIsoOrNull(body.publishDate);
  const publishedAt =
    status === "published"
      ? scheduledAt ?? existing.published_at ?? new Date().toISOString()
      : null;

  if (!title || !content || !slug || !isValidCategory(category)) {
    return NextResponse.json({ error: "Title, slug, category, and content are required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("articles")
    .update({
      title,
      slug,
      category,
      excerpt: body.excerpt?.trim() || null,
      cover_image_url: body.coverImageUrl?.trim() || null,
      cover_alt: body.coverAlt?.trim() || null,
      content,
      author_name: body.author?.trim() || existing.author_name,
      status,
      seo_title: body.seoTitle?.trim() || null,
      seo_description: body.seoDescription?.trim() || null,
      is_featured: Boolean(body.featured),
      is_trending: Boolean(body.trending),
      scheduled_at: scheduledAt,
      reading_time: normalizeReadingTime(body.readingTime),
      editor_note: body.editorNote?.trim() || null,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    const duplicate = error.code === "23505";
    return NextResponse.json(
      { error: duplicate ? "That slug is already in use." : error.message },
      { status: duplicate ? 409 : 500 },
    );
  }

  return NextResponse.json({ success: "Article updated." }, { status: 200 });
}
