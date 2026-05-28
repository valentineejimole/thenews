import { ArticleCard } from "@/components/article-card";
import { SearchForm } from "@/components/search-form";
import { TrendingList } from "@/components/trending-list";
import { getPublicArticles, searchPublicArticles } from "@/lib/articles";
import { buildMetadata } from "@/lib/news";

export const metadata = buildMetadata({
  title: "Search | NewsPressal",
  description: "Search the latest reporting and analysis across every NewsPressal desk.",
  path: "/search",
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const results = await searchPublicArticles(query, category);
  const trendingArticles = (await getPublicArticles())
    .slice()
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 5);

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-[78rem] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <section className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              Search
            </p>
            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-6xl">
              Find the story.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[var(--text-muted)]">
              Search the archive by topic, category, source desk, author, or keyword.
            </p>
            <div className="mt-8">
              <SearchForm defaultValue={query} defaultCategory={category} />
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {query || category ? "Search results" : "Latest stories"}
              </h2>
              <p className="text-sm text-[var(--text-soft)]">
                {results.length} {results.length === 1 ? "story" : "stories"}
              </p>
            </div>

            {results.length ? (
              <div className="mt-6 grid gap-5">
                {results.map((article, index) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    variant={index === 0 ? "horizontal" : "compact"}
                    priority={index === 0}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[2rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-raised)] p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                  No results
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                  No stories matched that search.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-muted)]">
                  Try a broader keyword, remove the desk filter, or search by author, company, or category topic instead.
                </p>
              </div>
            )}
          </section>
          <aside className="space-y-6 self-start">
            <TrendingList articles={trendingArticles} />
          </aside>
        </div>
      </div>
    </div>
  );
}
