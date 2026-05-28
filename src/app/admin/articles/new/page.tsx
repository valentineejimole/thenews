import { redirect } from "next/navigation";
import { AdminArticleForm } from "@/components/admin-article-form";
import { AdminShell } from "@/components/admin-shell";
import { buildAdminMetadata, getEmptyAdminArticle } from "@/lib/admin";
import { canManageDrafts, getAuthenticatedProfile } from "@/lib/articles";

export const metadata = buildAdminMetadata("New Article", "/admin/articles/new");

export default async function NewAdminArticlePage() {
  const { profile } = await getAuthenticatedProfile();

  if (!canManageDrafts(profile?.role)) {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      title="Create article"
      description="Compose, package, optimize, and schedule a new NewsPressal story from a newsroom-grade editing workspace."
      showLogout
      eyebrow="Publishing Desk"
    >
      <AdminArticleForm article={getEmptyAdminArticle()} submitLabel="Create article" mode="create" />
    </AdminShell>
  );
}
