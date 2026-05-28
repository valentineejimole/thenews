import { NextResponse } from "next/server";
import { categories } from "@/lib/news-data";
import { getAuthenticatedProfile, slugifyArticleTitle } from "@/lib/articles";

type ArticlePayload = {
  title?: string;
  slug?: string;
  category?: string;
  excerpt?: string;
  coverImageUrl?: string;
  content?: string;
  author?: string;
  status?: "draft" | "published";
  publishDate?: string;
};

function isValidCategory(value: string) {
  return categories.includes(value as (typeof categories)[number]);
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
      content,
      author_id: user.id,
      author_name: body.author?.trim() || profile?.full_name || user.email || "NewsPressal Staff",
      status,
      published_at:
        status === "published"
          ? body.publishDate
            ? new Date(body.publishDate).toISOString()
            : new Date().toISOString()
          : null,
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
