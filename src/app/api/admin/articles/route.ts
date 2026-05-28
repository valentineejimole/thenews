import { NextResponse } from "next/server";
import { categories } from "@/lib/news-data";
import type { HomepagePlacement } from "@/lib/admin";
import { getAuthenticatedProfile, slugifyArticleTitle } from "@/lib/articles";

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

function normalizeHomepagePriority(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 100;
  }

  return Math.max(0, Math.round(value));
}

function normalizeHomepagePlacement(value?: string | null): HomepagePlacement {
  return homepagePlacements.includes(value as HomepagePlacement) ? (value as HomepagePlacement) : "none";
}

export async function POST(request: Request) {
  const { user, profile, supabase } = await getAuthenticatedProfile();

  if (!user || !supabase) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as ArticlePayload;
  const title = body.title?.trim() ?? "";
  const slug = (body.slug?.trim() || slugifyArticleTitle(title)).toLowerCase();
  const content = body.content?.trim() ?? "";
  const category = body.category?.trim() ?? "";
  const status = body.status === "published" ? "published" : "draft";
  const scheduledAt = toIsoOrNull(body.publishDate);
  const publishedAt = status === "published" ? scheduledAt ?? new Date().toISOString() : null;
  const homepagePlacement = normalizeHomepagePlacement(body.homepagePlacement);
  const showOnHomepage = Boolean(body.showOnHomepage);

  if (!title || !content || !slug || !isValidCategory(category)) {
    return NextResponse.json({ error: "Title, slug, category, and content are required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("articles")
    .insert({
      title,
      slug,
      category,
      excerpt: body.excerpt?.trim() || null,
      cover_image_url: body.coverImageUrl?.trim() || null,
      cover_alt: body.coverAlt?.trim() || null,
      content,
      author_id: user.id,
      author_name: body.author?.trim() || profile?.full_name || user.email || "NewsPressal Staff",
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
    })
    .select("id")
    .single();

  if (error) {
    const duplicate = error.code === "23505";
    return NextResponse.json(
      { error: duplicate ? "That slug is already in use." : error.message },
      { status: duplicate ? 409 : 500 },
    );
  }

  return NextResponse.json(
    {
      success: "Article created.",
      articleId: data.id,
    },
    { status: 200 },
  );
}
