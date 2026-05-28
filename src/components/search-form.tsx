import { categories } from "@/lib/news-data";
import { getCategorySlug } from "@/lib/news";

export function SearchForm({
  defaultValue = "",
  defaultCategory = "",
}: {
  defaultValue?: string;
  defaultCategory?: string;
}) {
  return (
    <form action="/search" className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_auto]">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search politics, markets, AI, sports..."
        className="h-12 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
      />
      <select
        name="category"
        defaultValue={defaultCategory}
        className="h-12 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
      >
        <option value="">All desks</option>
        {categories.map((category) => (
          <option key={category} value={getCategorySlug(category)}>
            {category}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
      >
        Search
      </button>
    </form>
  );
}
