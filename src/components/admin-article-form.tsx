"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/news-data";
import type { AdminArticleRecord } from "@/lib/admin";

export function AdminArticleForm({
  article,
  submitLabel,
  mode,
}: {
  article: AdminArticleRecord;
  submitLabel: string;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [category, setCategory] = useState(article.category);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [coverImageUrl, setCoverImageUrl] = useState(article.coverImageUrl);
  const [content, setContent] = useState(article.content);
  const [author, setAuthor] = useState(article.author);
  const [status, setStatus] = useState(article.status);
  const [publishDate, setPublishDate] = useState(article.publishDate);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    const payload = {
      title,
      slug,
      category,
      excerpt,
      coverImageUrl,
      content,
      author,
      status,
      publishDate,
    };

    const endpoint =
      mode === "create" ? "/api/admin/articles" : `/api/admin/articles/${article.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        error?: string;
        success?: string;
        articleId?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Unable to save this article.");
        return;
      }

      if (mode === "create") {
        router.replace("/admin/dashboard");
        router.refresh();
        return;
      }

      setMessage(data.success ?? "Article updated.");
      router.refresh();
    } catch {
      setError("Unable to save this article.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Story details
          </h2>
          <div className="mt-5 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Title</span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter headline"
                className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Slug</span>
              <input
                type="text"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="story-slug"
                className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Excerpt</span>
              <textarea
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder="Short dek for cards and previews"
                rows={4}
                className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm leading-7 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Cover image URL</span>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(event) => setCoverImageUrl(event.target.value)}
                placeholder="https://example.com/image.jpg"
                className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Content / body</span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Write the article body"
                rows={14}
                className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-white px-4 py-4 text-sm leading-7 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Publishing
          </h2>
          <div className="mt-5 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as (typeof categories)[number])}
                className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              >
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Author</span>
              <input
                type="text"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="Reporter name"
                className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Status</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as "draft" | "published")}
                className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Publish date</span>
              <input
                type="datetime-local"
                value={publishDate}
                onChange={(event) => setPublishDate(event.target.value)}
                className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-4 text-sm leading-7 text-[var(--text-muted)]">
            TODO: extend this editor with Supabase Storage uploads, richer role-based workflow, and
            moderation/review states once the newsroom model expands.
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[var(--text-primary)] px-5 py-3 text-sm font-semibold text-[var(--site-bg)] transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>

          <p aria-live="polite" className="mt-4 text-sm text-emerald-600">
            {message}
          </p>
          <p aria-live="polite" className="mt-2 text-sm text-[var(--signal)]">
            {error}
          </p>
        </section>
      </div>
    </form>
  );
}
