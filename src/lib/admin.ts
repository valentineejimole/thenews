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
