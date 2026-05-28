export type SupabaseProfileRole = "admin" | "editor" | "author";

export type SupabaseProfile = {
  id: string;
  email: string | null;
  role: SupabaseProfileRole | null;
  full_name: string | null;
  created_at: string;
};

export type SupabaseArticleStatus = "draft" | "published";

export type SupabaseArticleRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_alt: string | null;
  content: string;
  author_id: string | null;
  author_name: string | null;
  status: SupabaseArticleStatus;
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean | null;
  is_trending: boolean | null;
  show_on_homepage: boolean | null;
  homepage_priority: number | null;
  homepage_placement: "none" | "lead" | "top_story" | "latest" | "trending" | "editor_pick" | null;
  scheduled_at: string | null;
  reading_time: number | null;
  editor_note: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SupabaseNewsletterSubscriber = {
  id: string;
  email: string;
  created_at: string;
};
