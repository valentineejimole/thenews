import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { buildAdminMetadata } from "@/lib/admin";
import {
  canManageAllArticles,
  canManageDrafts,
  getAuthenticatedProfile,
  mapSupabaseArticleToAdminRecord,
} from "@/lib/articles";

export const metadata = buildAdminMetadata("Dashboard", "/admin/dashboard");

export default async function AdminDashboardPage() {
  const { user, profile, supabase } = await getAuthenticatedProfile();

  if (!user || !supabase || !canManageDrafts(profile?.role)) {
    redirect("/admin/login");
  }

  let query = supabase.from("articles").select("*").order("updated_at", { ascending: false });

  if (!canManageAllArticles(profile?.role)) {
    query = query.eq("author_id", user.id);
  }

  const { data } = await query;
  const adminArticles = (data ?? []).map(mapSupabaseArticleToAdminRecord);
  const publishedCount = adminArticles.filter((article) => article.status === "published").length;
  const draftCount = adminArticles.filter((article) => article.status === "draft").length;

  return (
    <AdminShell
      title="Publishing dashboard"
      description="Review story status, open existing drafts, and move quickly into the article editor."
      showLogout
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Articles</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{adminArticles.length}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Published</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{publishedCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Drafts</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{draftCount}</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)]">
            <div className="grid grid-cols-[minmax(0,1.2fr)_10rem_9rem_9rem] gap-4 border-b border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-soft)]">
              <span>Article</span>
              <span>Category</span>
              <span>Status</span>
              <span>Edit</span>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {adminArticles.length ? (
                adminArticles.slice(0, 10).map((article) => (
                  <div
                    key={article.id}
                    className="grid grid-cols-[minmax(0,1.2fr)_10rem_9rem_9rem] items-center gap-4 px-4 py-4 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[var(--text-primary)]">{article.title}</p>
                      <p className="mt-1 truncate text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
                        {article.author}
                      </p>
                    </div>
                    <span className="text-[var(--text-muted)]">{article.category}</span>
                    <span className="text-[var(--text-muted)]">{article.status}</span>
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="font-semibold text-[var(--accent)]"
                    >
                      Edit
                    </Link>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-sm text-[var(--text-muted)]">
                  No articles yet. Create your first draft to populate the dashboard.
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6">
            <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">Quick actions</h2>
            <div className="mt-5 grid gap-3">
              <Link
                href="/admin/articles/new"
                className="rounded-full bg-[var(--text-primary)] px-5 py-3 text-center text-sm font-semibold text-[var(--site-bg)] transition hover:bg-[var(--accent)]"
              >
                Create article
              </Link>
              <Link
                href="/admin/login"
                className="rounded-full border border-[var(--border-subtle)] px-5 py-3 text-center text-sm font-semibold text-[var(--text-primary)]"
              >
                Manage session
              </Link>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-raised)] p-6 text-sm leading-7 text-[var(--text-muted)]">
            Connected to Supabase Auth and the `articles` table. Admin and editor roles can manage all
            stories; authors see their own drafts and published work.
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
