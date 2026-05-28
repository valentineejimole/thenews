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

function formatShortDate(value?: string) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value?: string) {
  if (!value) {
    return "No recent updates";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function StatusChip({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "accent" | "success" | "signal";
}) {
  const styles =
    tone === "accent"
      ? "border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,white)] text-[var(--accent-strong)]"
      : tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : tone === "signal"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--text-soft)]";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${styles}`}>
      {label}
    </span>
  );
}

function WorkflowCard({
  title,
  eyebrow,
  articles,
  emptyMessage,
  tone = "default",
}: {
  title: string;
  eyebrow: string;
  articles: Array<{
    id: string;
    title: string;
    category: string;
    author: string;
    publishDate: string;
    updatedAt?: string;
  }>;
  emptyMessage: string;
  tone?: "default" | "accent" | "success" | "signal";
}) {
  return (
    <section className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            {title}
          </h2>
        </div>
        <StatusChip label={String(articles.length).padStart(2, "0")} tone={tone} />
      </div>

      <div className="mt-4 space-y-3">
        {articles.length ? (
          articles.slice(0, 4).map((article) => (
            <Link
              key={article.id}
              href={`/admin/articles/${article.id}/edit`}
              className="block rounded-[1.35rem] border border-[var(--border-subtle)] bg-white px-4 py-3 transition hover:border-[var(--accent)] hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
            >
              <p className="line-clamp-2 text-sm font-semibold leading-6 text-[var(--text-primary)]">
                {article.title}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-[var(--text-soft)]">
                <span>{article.category}</span>
                <span>{article.author}</span>
                <span>{formatShortDate(article.publishDate)}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-[1.35rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] px-4 py-6 text-sm leading-6 text-[var(--text-muted)]">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}

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
  // This dashboard is a request-time newsroom snapshot, so "now" must be evaluated once here.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  const draftArticles = adminArticles.filter((article) => article.status === "draft");
  const scheduledArticles = adminArticles.filter(
    (article) => article.status === "published" && new Date(article.publishDate).getTime() > now,
  );
  const liveArticles = adminArticles.filter(
    (article) => article.status === "published" && new Date(article.publishDate).getTime() <= now,
  );
  const featuredArticles = adminArticles.filter((article) => article.featured);
  const trendingArticles = adminArticles.filter((article) => article.trending);
  const breakingArticles = adminArticles.filter(
    (article) =>
      article.status === "published" &&
      Boolean(article.featured || article.trending) &&
      now - new Date(article.updatedAt ?? article.publishDate).getTime() < 1000 * 60 * 60 * 24,
  );
  const recentActivity = [...adminArticles]
    .sort(
      (a, b) =>
        new Date(b.updatedAt ?? b.publishDate).getTime() - new Date(a.updatedAt ?? a.publishDate).getTime(),
    )
    .slice(0, 5);

  const deskCount = new Set(adminArticles.map((article) => article.category)).size;
  const editorReadyCount = draftArticles.filter((article) => article.excerpt.trim() && article.slug.trim()).length;

  const metricCards = [
    { label: "Drafts", value: draftArticles.length, note: "Ready for assignment", tone: "default" as const },
    { label: "Scheduled", value: scheduledArticles.length, note: "Queued for release", tone: "accent" as const },
    { label: "Published", value: liveArticles.length, note: "Visible on the site", tone: "success" as const },
    { label: "Trending", value: trendingArticles.length, note: "Sidebar priority", tone: "accent" as const },
    { label: "Featured", value: featuredArticles.length, note: "Front-page lead pool", tone: "accent" as const },
    { label: "Desks", value: deskCount, note: "Active coverage lanes", tone: "default" as const },
  ];

  return (
    <AdminShell
      title="Publishing dashboard"
      description="Track the live file, review scheduling pressure, and move the next story into publication with a tighter editorial command center."
      showLogout
      eyebrow="Editorial CMS"
    >
      <div className="grid gap-6">
        <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-6">
          {metricCards.map((card) => (
            <div
              key={card.label}
              className="rounded-[1.7rem] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,rgba(179,143,69,0.12),rgba(255,255,255,0.96)_36%)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  {card.label}
                </p>
                <StatusChip label="Live" tone={card.tone} />
              </div>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                {card.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{card.note}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-6">
            <section className="rounded-[1.9rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                    Workflow
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                    Story queue
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusChip
                    label={
                      editorReadyCount
                        ? `${editorReadyCount} ready`
                        : "Queue clear"
                    }
                    tone={editorReadyCount ? "success" : "default"}
                  />
                  <Link
                    href="/admin/articles/new"
                    className="rounded-full bg-[var(--text-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--site-bg)] transition hover:bg-[var(--accent)]"
                  >
                    Create article
                  </Link>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)]">
                <div className="hidden grid-cols-[minmax(0,1.4fr)_7rem_7rem_7rem_5rem] gap-4 border-b border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)] md:grid">
                  <span>Story</span>
                  <span>Desk</span>
                  <span>Status</span>
                  <span>Publish</span>
                  <span>Edit</span>
                </div>
                <div className="divide-y divide-[var(--border-subtle)]">
                  {adminArticles.length ? (
                    adminArticles.slice(0, 10).map((article) => {
                      const isFuture = new Date(article.publishDate).getTime() > now;

                      return (
                        <div
                          key={article.id}
                          className="grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1.4fr)_7rem_7rem_7rem_5rem] md:items-center md:gap-4"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                              {article.title}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              {article.featured ? <StatusChip label="Featured" tone="accent" /> : null}
                              {article.trending ? <StatusChip label="Trending" tone="signal" /> : null}
                            </div>
                            <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[var(--text-soft)]">
                              {article.author}
                            </p>
                          </div>
                          <span className="text-sm text-[var(--text-muted)]">{article.category}</span>
                          <span className="text-sm text-[var(--text-muted)]">{article.status}</span>
                          <span className="text-sm text-[var(--text-muted)]">
                            {isFuture ? formatDateTime(article.publishDate) : formatShortDate(article.publishDate)}
                          </span>
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="text-sm font-semibold text-[var(--accent)]"
                          >
                            Edit
                          </Link>
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-4 py-8 text-sm leading-6 text-[var(--text-muted)]">
                      No articles yet. Start a draft to populate the publishing workflow.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
              <WorkflowCard
                title="Drafts"
                eyebrow="Open file"
                articles={draftArticles}
                emptyMessage="Draft queue is clear."
              />
              <WorkflowCard
                title="Scheduled"
                eyebrow="Timed release"
                articles={scheduledArticles}
                emptyMessage="No scheduled stories."
                tone="accent"
              />
              <WorkflowCard
                title="Published"
                eyebrow="Live site"
                articles={liveArticles}
                emptyMessage="No published stories yet."
                tone="success"
              />
              <WorkflowCard
                title="Trending"
                eyebrow="Priority rail"
                articles={trendingArticles}
                emptyMessage="No trending stories selected."
                tone="signal"
              />
              <WorkflowCard
                title="Featured"
                eyebrow="Front page"
                articles={featuredArticles}
                emptyMessage="No featured stories selected."
                tone="accent"
              />
              <WorkflowCard
                title="Breaking"
                eyebrow="Fast-moving"
                articles={breakingArticles}
                emptyMessage="No breaking stories flagged."
                tone="signal"
              />
            </section>
          </div>

          <aside className="grid gap-6 self-start">
            <section className="rounded-[1.8rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Quick actions
              </p>
              <div className="mt-4 grid gap-3">
                <Link
                  href="/admin/articles/new"
                  className="rounded-[1.35rem] bg-[var(--text-primary)] px-4 py-3 text-center text-sm font-semibold text-[var(--site-bg)] transition hover:bg-[var(--accent)]"
                >
                  Start a new draft
                </Link>
                <Link
                  href="/admin/login"
                  className="rounded-[1.35rem] border border-[var(--border-subtle)] bg-white px-4 py-3 text-center text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  Review session access
                </Link>
              </div>
              <div className="mt-5 rounded-[1.35rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-4">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Desk health</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {editorReadyCount
                    ? `${editorReadyCount} draft${editorReadyCount === 1 ? "" : "s"} have enough structure for editorial review.`
                    : "Draft intake is under control and ready for the next filing window."}
                </p>
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                    Scheduled file
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                    Upcoming releases
                  </h2>
                </div>
                <StatusChip label={String(scheduledArticles.length).padStart(2, "0")} tone="accent" />
              </div>
              <div className="mt-4 space-y-3">
                {scheduledArticles.length ? (
                  scheduledArticles.slice(0, 4).map((article) => (
                    <Link
                      key={article.id}
                      href={`/admin/articles/${article.id}/edit`}
                      className="block rounded-[1.35rem] border border-[var(--border-subtle)] bg-white px-4 py-3 transition hover:border-[var(--accent)]"
                    >
                      <p className="line-clamp-2 text-sm font-semibold leading-6 text-[var(--text-primary)]">
                        {article.title}
                      </p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[var(--text-soft)]">
                        {formatDateTime(article.publishDate)}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-[1.35rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] px-4 py-6 text-sm leading-6 text-[var(--text-muted)]">
                    No scheduled stories.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="border-b border-[var(--border-subtle)] pb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  Recent activity
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                  Last updates
                </h2>
              </div>
              <div className="mt-4 space-y-4">
                {recentActivity.length ? (
                  recentActivity.map((article) => (
                    <Link key={article.id} href={`/admin/articles/${article.id}/edit`} className="block">
                      <p className="line-clamp-2 text-sm font-semibold leading-6 text-[var(--text-primary)] transition hover:text-[var(--accent)]">
                        {article.title}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[var(--text-soft)]">
                        {article.category} • {formatDateTime(article.updatedAt ?? article.publishDate)}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-[var(--text-muted)]">No recent activity yet.</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
