import { notFound, redirect } from "next/navigation";
import { AdminArticleForm } from "@/components/admin-article-form";
import { AdminShell } from "@/components/admin-shell";
import { buildAdminMetadata } from "@/lib/admin";
import {
  canManageAllArticles,
  canManageDrafts,
  getAuthenticatedProfile,
  mapSupabaseArticleToAdminRecord,
} from "@/lib/articles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return buildAdminMetadata(`Edit Article | ${id}`, `/admin/articles/${id}/edit`);
}

export default async function EditAdminArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile, supabase } = await getAuthenticatedProfile();

  if (!user || !supabase || !canManageDrafts(profile?.role)) {
    redirect("/admin/login");
  }

  const { data } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();

  if (!data) {
    notFound();
  }

  if (!canManageAllArticles(profile?.role) && data.author_id !== user.id) {
    redirect("/admin/dashboard");
  }

  const article = mapSupabaseArticleToAdminRecord(data);

  return (
    <AdminShell
      title="Edit article"
      description="Refine the story package, tune metadata, update scheduling, and manage editorial presentation from one responsive workspace."
      showLogout
      eyebrow="Publishing Desk"
    >
      <AdminArticleForm
        key={`${article.id}:${article.updatedAt ?? article.coverImageUrl}`}
        article={article}
        submitLabel="Update article"
        mode="edit"
      />
    </AdminShell>
  );
}
