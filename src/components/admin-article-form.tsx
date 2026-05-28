"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminRichTextEditor } from "@/components/admin-rich-text-editor";
import { slugifyAdminTitle, type AdminArticleRecord } from "@/lib/admin";
import { categories } from "@/lib/news-data";

const authorOptions = [
  "NewsPressal Staff",
  "Maya Bennett",
  "Julian Park",
  "Sana Iqbal",
  "Nora Ellis",
];

function formatPreviewContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .slice(0, 3);
}

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
  const [manualSlug, setManualSlug] = useState(article.slug);
  const [slugEdited, setSlugEdited] = useState(Boolean(article.slug));
  const [category, setCategory] = useState(article.category);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [coverImageUrl, setCoverImageUrl] = useState(article.coverImageUrl);
  const [content, setContent] = useState(article.content);
  const [author, setAuthor] = useState(article.author || authorOptions[0]);
  const [status, setStatus] = useState(article.status);
  const [publishDate, setPublishDate] = useState(article.publishDate);
  const [manualSeoTitle, setManualSeoTitle] = useState(article.seoTitle ?? "");
  const [seoTitleEdited, setSeoTitleEdited] = useState(Boolean(article.seoTitle));
  const [manualSeoDescription, setManualSeoDescription] = useState(article.seoDescription ?? "");
  const [seoDescriptionEdited, setSeoDescriptionEdited] = useState(Boolean(article.seoDescription));
  const [featured, setFeatured] = useState(Boolean(article.featured));
  const [trending, setTrending] = useState(Boolean(article.trending));
  const [coverPreview, setCoverPreview] = useState(article.coverImageUrl);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slug = slugEdited ? manualSlug : slugifyAdminTitle(title);
  const seoTitle = seoTitleEdited ? manualSeoTitle : title;
  const seoDescription = seoDescriptionEdited ? manualSeoDescription : excerpt;

  const previewBlocks = useMemo(() => formatPreviewContent(content), [content]);

  function handleCoverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCoverPreview(objectUrl);
    setMessage("Local cover preview loaded. TODO: connect file upload to Supabase Storage.");
  }

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
      seoTitle,
      seoDescription,
      featured,
      trending,
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
    <form className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_25rem]" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Story Setup
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                Article composition
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--border-subtle)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                {status}
              </span>
              {featured ? (
                <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  Featured
                </span>
              ) : null}
              {trending ? (
                <span className="rounded-full bg-[var(--text-primary)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--site-bg)]">
                  Trending
                </span>
              ) : null}
            </div>
          </div>

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

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_12rem]">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[var(--text-primary)]">Slug</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(event) => {
                    setSlugEdited(true);
                    setManualSlug(event.target.value);
                  }}
                  placeholder="story-slug"
                  className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                />
              </label>
              <div className="rounded-[1.35rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                  Live URL
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                  /article/{slug || "story-slug"}
                </p>
              </div>
            </div>

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

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_15rem]">
              <div className="grid gap-2">
                <span className="text-sm font-semibold text-[var(--text-primary)]">Rich text editor</span>
                <AdminRichTextEditor value={content} onChange={setContent} />
              </div>
              <div className="space-y-5">
                <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                    Writing cues
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-muted)]">
                    <li>Lead with the latest development.</li>
                    <li>Break long analysis into short sections.</li>
                    <li>Use quotes or bullet lists sparingly.</li>
                  </ul>
                </div>
                <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                    Preview summary
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                    {content.trim().split(/\s+/).filter(Boolean).length} words
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                    {Math.max(3, Math.round(content.trim().split(/\s+/).filter(Boolean).length / 180))} min read
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Search & Preview
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                SEO and story packaging
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">SEO title</span>
              <input
                type="text"
                value={seoTitle}
                onChange={(event) => {
                  setSeoTitleEdited(true);
                  setManualSeoTitle(event.target.value);
                }}
                placeholder="Search result headline"
                className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">SEO description</span>
              <textarea
                value={seoDescription}
                onChange={(event) => {
                  setSeoDescriptionEdited(true);
                  setManualSeoDescription(event.target.value);
                }}
                placeholder="Search result summary"
                rows={4}
                className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm leading-7 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
              Search preview
            </p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-[#1a0dab]">
              {seoTitle || title || "Untitled article"}
            </p>
            <p className="mt-1 text-xs text-emerald-700">newspressal.example/article/{slug || "story-slug"}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              {seoDescription || excerpt || "Meta description preview will appear here."}
            </p>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Publishing Workflow
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Desk controls
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
              <select
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              >
                {authorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Draft / published</span>
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
              <span className="text-sm font-semibold text-[var(--text-primary)]">Publish date scheduler</span>
              <input
                type="datetime-local"
                value={publishDate}
                onChange={(event) => setPublishDate(event.target.value)}
                className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center justify-between rounded-[1.35rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-4 py-3">
                <span>
                  <span className="block text-sm font-semibold text-[var(--text-primary)]">Featured article</span>
                  <span className="block text-xs text-[var(--text-soft)]">Homepage lead eligibility</span>
                </span>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) => setFeatured(event.target.checked)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
              </label>
              <label className="flex items-center justify-between rounded-[1.35rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-4 py-3">
                <span>
                  <span className="block text-sm font-semibold text-[var(--text-primary)]">Trending priority</span>
                  <span className="block text-xs text-[var(--text-soft)]">Boost story prominence</span>
                </span>
                <input
                  type="checkbox"
                  checked={trending}
                  onChange={(event) => setTrending(event.target.checked)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Cover Art
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Visual package
          </h2>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Cover image URL</span>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(event) => {
                  setCoverImageUrl(event.target.value);
                  setCoverPreview(event.target.value);
                }}
                placeholder="https://example.com/image.jpg"
                className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Article cover upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] px-4 py-3 text-sm text-[var(--text-muted)]"
              />
            </label>

            <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-subtle)]">
              <div className="aspect-[16/10] bg-[linear-gradient(135deg,rgba(179,143,69,0.18),rgba(23,48,79,0.08))]">
                {coverPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverPreview}
                    alt="Article cover preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[var(--text-soft)]">
                    Cover preview appears here. Upload support is staged for Supabase Storage next.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Story Preview
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Live editorial preview
          </h2>

          <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] bg-white">
            <div className="border-b border-[var(--border-subtle)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                {category}
              </p>
              <h3 className="mt-2 text-[1.7rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--text-primary)]">
                {title || "Untitled article"}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                {excerpt || "A concise article excerpt will appear here for cards, homepage modules, and previews."}
              </p>
            </div>
            <div className="space-y-4 px-4 py-4">
              {previewBlocks.length ? (
                previewBlocks.map((block) => (
                  <p key={block} className="text-sm leading-7 text-[var(--text-muted)]">
                    {block}
                  </p>
                ))
              ) : (
                <p className="text-sm leading-7 text-[var(--text-soft)]">
                  Story body preview will render here as you write.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-4 text-sm leading-7 text-[var(--text-muted)]">
            TODO: persist featured/trending flags, SEO fields, author assignment, and cover uploads in
            Supabase schema and storage when the newsroom data model expands.
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[var(--text-primary)] px-5 py-3 text-sm font-semibold text-[var(--site-bg)] transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className="rounded-full border border-[var(--border-subtle)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Back to dashboard
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
