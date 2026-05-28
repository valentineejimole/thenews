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
  const deskCount = new Set(adminArticles.map((article) => article.category)).size;
  const editorReadyCount = adminArticles.filter(
    (article) => article.status === "draft" && article.excerpt.trim() && article.slug.trim(),
  ).length;

  return (
    <AdminShell
      title="Publishing dashboard"
      description="Monitor the publishing pipeline, assess story movement, and move quickly between drafts, live stories, and newsroom actions."
      showLogout
      eyebrow="NewsPressal CMS"
    >
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Articles", value: adminArticles.length, note: "Total managed stories" },
            { label: "Live", value: publishedCount, note: "Currently published" },
            { label: "Drafts", value: draftCount, note: "Needs editorial action" },
            { label: "Desks", value: deskCount, note: "Active categories covered" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,rgba(179,143,69,0.14),rgba(255,255,255,0.98)_28%)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                {card.label}
              </p>
              <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                {card.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{card.note}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  Story Queue
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                  Drafts and live stories
                </h2>
              </div>
              <Link
                href="/admin/articles/new"
                className="rounded-full bg-[var(--text-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--site-bg)] transition hover:bg-[var(--accent)]"
              >
                Create article
              </Link>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)]">
              <div className="grid grid-cols-[minmax(0,1.4fr)_8rem_8rem_8rem_6rem] gap-4 border-b border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-soft)]">
                <span>Article</span>
                <span>Desk</span>
                <span>Status</span>
                <span>Schedule</span>
                <span>Edit</span>
              </div>
              <div className="divide-y divide-[var(--border-subtle)]">
                {adminArticles.length ? (
                  adminArticles.slice(0, 12).map((article) => (
                    <div
                      key={article.id}
                      className="grid grid-cols-[minmax(0,1.4fr)_8rem_8rem_8rem_6rem] items-center gap-4 px-4 py-4 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[var(--text-primary)]">{article.title}</p>
                        <p className="mt-1 truncate text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
                          {article.author}
                        </p>
                      </div>
                      <span className="text-[var(--text-muted)]">{article.category}</span>
                      <span className="text-[var(--text-muted)]">{article.status}</span>
                      <span className="text-[var(--text-muted)]">
                        {new Date(article.publishDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
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
            <div className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                Publishing cadence
              </h2>
              <div className="mt-5 grid gap-4">
                <div className="rounded-[1.35rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                    Live ratio
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                    {adminArticles.length ? Math.round((publishedCount / adminArticles.length) * 100) : 0}%
                  </p>
                </div>
                <div className="rounded-[1.35rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                    Desk health
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                    {editorReadyCount > 0
                      ? `${editorReadyCount} draft${editorReadyCount === 1 ? "" : "s"} appear ready for editorial review.`
                      : "Publishing rhythm is balanced across live and in-progress coverage."}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">Quick actions</h2>
              <div className="mt-5 grid gap-3">
                <Link
                  href="/admin/articles/new"
                  className="rounded-full bg-[var(--text-primary)] px-5 py-3 text-center text-sm font-semibold text-[var(--site-bg)] transition hover:bg-[var(--accent)]"
                >
                  Start new draft
                </Link>
                <Link
                  href="/admin/login"
                  className="rounded-full border border-[var(--border-subtle)] px-5 py-3 text-center text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  Review session
                </Link>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-raised)] p-6 text-sm leading-7 text-[var(--text-muted)]">
              Connected to Supabase Auth and the `articles` table. Featured/trending flags, SEO
              controls, and richer editorial metadata are staged in the CMS UI and ready for schema
              expansion.
            </div>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
