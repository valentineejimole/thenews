import { categories, type Category } from "@/lib/news-data";
import { buildMetadata } from "@/lib/news";

export type ArticleStatus = "draft" | "published";

export type AdminArticleRecord = {
  id: string;
  title: string;
  slug: string;
  category: Category;
  excerpt: string;
  coverImageUrl: string;
  content: string;
  author: string;
  status: ArticleStatus;
  publishDate: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  trending?: boolean;
};

export function getEmptyAdminArticle(): AdminArticleRecord {
  return {
    id: "new",
    title: "",
    slug: "",
    category: categories[0],
    excerpt: "",
    coverImageUrl: "",
    content: "",
    author: "",
    status: "draft",
    publishDate: new Date().toISOString().slice(0, 16),
    seoTitle: "",
    seoDescription: "",
    featured: false,
    trending: false,
  };
}

export function buildAdminMetadata(title: string, path: string) {
  return buildMetadata({
    title: `${title} | NewsPressal Admin`,
    description: "NewsPressal article publishing workspace.",
    path,
    image: "/logo.png",
  });
}

export function slugifyAdminTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
