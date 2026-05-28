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
  content: string;
  author_id: string | null;
  author_name: string | null;
  status: SupabaseArticleStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SupabaseNewsletterSubscriber = {
  id: string;
  email: string;
  created_at: string;
};
