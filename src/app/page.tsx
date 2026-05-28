import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { FeaturedStory } from "@/components/featured-story";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { SectionHeading } from "@/components/section-heading";
import { TrendingList } from "@/components/trending-list";
import { getPublicArticles } from "@/lib/articles";
import type { Article } from "@/lib/news-data";
import { buildMetadata, formatArticleDateTime, getCategorySlug } from "@/lib/news";

export const metadata = buildMetadata({
  title: "NewsPressal | Independent. Insightful. In real time.",
  description:
    "Breaking coverage, deep reporting, and sharp analysis across politics, business, technology, sports, entertainment, and opinion.",
});

const marketSnapshot = [
  { asset: "S&P Futures", label: "Futures", price: "5,274.20", change: "+0.72%", tone: "text-emerald-600" },
  { asset: "Nasdaq 100", label: "Futures", price: "18,912.40", change: "+0.95%", tone: "text-emerald-600" },
  { asset: "Brent Crude", label: "Commodities", price: "$82.40", change: "-0.44%", tone: "text-rose-600" },
  { asset: "Bitcoin", label: "Crypto", price: "$68,200", change: "+1.18%", tone: "text-emerald-600" },
];

function dedupeArticles(articles: Article[]) {
  const seen = new Set<string>();

  return articles.filter((article) => {
    if (seen.has(article.slug)) {
      return false;
    }

    seen.add(article.slug);
    return true;
  });
}

function sortEditorially(articles: Article[]) {
  return [...articles].sort((a, b) => {
    const priorityDiff = (a.homepagePriority ?? 100) - (b.homepagePriority ?? 100);

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export default async function HomePage() {
  const publicArticles = await getPublicArticles();
  const managedHomepageArticles = publicArticles.filter((article) => article.showOnHomepage);
  const placementArticles = (placement: NonNullable<Article["homepagePlacement"]>) =>
    sortEditorially(
      managedHomepageArticles.filter((article) => article.homepagePlacement === placement),
    );

  const featuredArticle =
    placementArticles("lead")[0] ?? publicArticles.find((article) => article.featured) ?? publicArticles[0];
  const topStories = dedupeArticles(
    placementArticles("top_story").concat(
      sortEditorially(
        publicArticles.filter(
          (article) =>
            article.slug !== featuredArticle.slug &&
            article.showOnHomepage &&
            article.homepagePlacement === "latest",
        ),
      ),
    ),
  ).slice(0, 3);
  const latestArticles = dedupeArticles(
    placementArticles("latest").concat(
      publicArticles.filter((article) => article.slug !== featuredArticle.slug),
    ),
  ).slice(0, 6);
  const trendingArticles = dedupeArticles(
    placementArticles("trending").concat(
      [...publicArticles]
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .filter((article) => article.slug !== featuredArticle.slug),
    ),
  ).slice(0, 5);
  const editorPicks = dedupeArticles(
    placementArticles("editor_pick").concat(
      publicArticles.filter(
        (article) => article.slug !== featuredArticle.slug && (article.editorPick || article.featured),
      ),
    ),
  ).slice(0, 4);
  const marketWatch = publicArticles
    .filter((article) => article.marketWatch || article.category === "Business")
    .slice(0, 3);
  const opinion = publicArticles.filter((article) => article.category === "Opinion").slice(0, 3);
  const weekendReads = publicArticles
    .filter((article) => article.weekendRead || article.content.join(" ").length > 1200)
    .slice(0, 3);
  const videoArticles = publicArticles.filter((article) => article.video).slice(0, 3);
  const politics = publicArticles.filter((article) => article.category === "Politics").slice(0, 2);
  const tech = publicArticles.filter((article) => article.category === "Tech").slice(0, 2);
  const business = publicArticles.filter((article) => article.category === "Business").slice(0, 2);
  const sports = publicArticles.filter((article) => article.category === "Sports").slice(0, 2);
  const headlineStrip = dedupeArticles(
    placementArticles("latest").concat(
      publicArticles.filter((article) => article.slug !== featuredArticle.slug),
    ),
  ).slice(0, 5);

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-[78rem] px-4 pb-12 pt-4 sm:px-6 sm:pb-14 sm:pt-5 lg:px-8">
        <section className="mb-8 sm:mb-9">
          <div className="mb-4 grid items-end gap-3 border-b border-[var(--border-subtle)] pb-4 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)] sm:text-xs sm:tracking-[0.34em]">
                Front Page
              </p>
              <h1 className="mt-2 max-w-4xl text-[clamp(2rem,9vw,4rem)] font-semibold leading-[1] tracking-[-0.05em] text-[var(--text-primary)] [text-wrap:pretty]">
                A premium newsroom for power, markets, technology, sports, and culture.
              </h1>
            </div>
            <div className="flex items-end self-end">
              <p className="max-w-md text-[14px] leading-6 text-[var(--text-muted)] sm:text-sm">
                Live headlines, sharp context, and a reading experience designed to feel like a daily habit rather than a demo.
              </p>
            </div>
          </div>

          <div className="mb-5 sm:hidden">
            <FeaturedStory article={featuredArticle} />
          </div>

          <div className="mb-5 overflow-hidden rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)]">
            <div className="grid gap-0 md:grid-cols-[11rem_minmax(0,1fr)]">
              <div className="border-b border-[var(--border-subtle)] px-4 py-3 md:border-b-0 md:border-r">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)] sm:text-xs sm:tracking-[0.28em]">
                  Latest Headlines
                </p>
              </div>
              <div className="grid gap-0 md:grid-cols-5">
                {headlineStrip.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/article/${article.slug}`}
                    className="border-t border-[var(--border-subtle)] px-4 py-3.5 transition hover:bg-[var(--surface-subtle)] hover:text-[var(--accent)] md:border-l md:border-t-0"
                  >
                    <p className="headline-clamp-2 text-[14px] font-semibold leading-6 text-[var(--text-primary)]">
                      {article.title}
                    </p>
                    <p className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--text-soft)]">
                      {article.category} • {formatArticleDateTime(article.updatedAt ?? article.publishedAt)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {topStories.length ? (
            <div className="mb-5 grid gap-4 sm:hidden">
              {topStories.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="compact" />
              ))}
            </div>
          ) : null}

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="min-w-0 space-y-6">
              <div className="hidden items-start gap-6 sm:grid 2xl:grid-cols-[minmax(0,1fr)_17rem]">
                <FeaturedStory article={featuredArticle} />
                <div className="self-start rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                    Latest now
                  </p>
                  <div className="mt-4 space-y-4">
                    {latestArticles.slice(0, 3).map((article) => (
                      <div
                        key={article.slug}
                        className="border-b border-[var(--border-subtle)] pb-4 last:border-b-0 last:pb-0"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                          {article.source}
                        </p>
                        <Link
                          href={`/article/${article.slug}`}
                          className="mt-2 block text-base font-semibold leading-6 text-[var(--text-primary)] transition hover:text-[var(--accent)]"
                        >
                          {article.title}
                        </Link>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
                          {formatArticleDateTime(article.updatedAt ?? article.publishedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
                {(topStories.length ? topStories : latestArticles.slice(0, 3)).map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="compact" />
                ))}
              </div>

              <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
                {latestArticles.slice(0, 3).map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="minimal" />
                ))}
              </div>
            </div>
            <aside className="self-start">
              <TrendingList articles={trendingArticles} />
            </aside>
          </div>
        </section>

        <section className="editorial-divider mb-9 grid items-start gap-6 pt-6 sm:mb-11 sm:pt-7 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <div>
            <SectionHeading eyebrow="Latest News" title="The stories moving now" />
            <div className="mt-5 grid gap-4">
              {latestArticles.slice(3, 6).map((article) => (
                <ArticleCard key={article.slug} article={article} variant="horizontal" />
              ))}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Editor's Picks" title="Selected by the newsroom" />
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              {editorPicks.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="compact" />
              ))}
            </div>
          </div>
        </section>

        <section className="editorial-divider mb-9 grid items-start gap-6 pt-6 sm:mb-11 sm:pt-7 xl:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="self-start rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  Live Snapshot
                </p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                  Market Watch
                </h3>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                US Open
              </span>
            </div>
            <div className="mt-4 grid grid-cols-[minmax(0,1.15fr)_auto_auto] gap-x-3 gap-y-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
              <span>Asset</span>
              <span className="text-right">Price</span>
              <span className="text-right">Change</span>
            </div>
            <div className="mt-3 space-y-3">
              {marketSnapshot.map((item) => (
                <div
                  key={item.asset}
                  className="grid grid-cols-[minmax(0,1.15fr)_auto_auto] items-center gap-x-3 rounded-2xl border border-[var(--border-subtle)] px-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{item.asset}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[var(--text-soft)]">
                      {item.label}
                    </p>
                  </div>
                  <span className="text-right text-sm font-semibold text-[var(--text-primary)]">
                    {item.price}
                  </span>
                  <span className={`text-right text-sm font-semibold ${item.tone}`}>{item.change}</span>
                </div>
              ))}
            </div>
          </aside>
          <div>
            <SectionHeading eyebrow="Market Watch" title="Markets, credit, and corporate signals" />
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {marketWatch.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="compact" />
              ))}
            </div>
          </div>
        </section>

        <section className="editorial-divider mb-9 grid items-start gap-6 pt-6 sm:mb-11 sm:pt-7 xl:grid-cols-[minmax(0,1fr)_17rem]">
          <div>
            <SectionHeading eyebrow="Newsroom Clock" title="The latest signals across the desks" />
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {marketWatch.concat(videoArticles).slice(0, 3).map((article) => (
                <ArticleCard key={article.slug} article={article} variant="compact" />
              ))}
            </div>
          </div>
          <aside className="self-start rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              Newsroom Clock
            </p>
            <div className="mt-4 space-y-4">
              {trendingArticles.slice(0, 4).map((article) => (
                <div key={article.slug} className="border-b border-[var(--border-subtle)] pb-4 last:border-b-0 last:pb-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                    {article.source}
                  </p>
                  <Link
                    href={`/article/${article.slug}`}
                    className="mt-2 block text-base font-semibold leading-6 text-[var(--text-primary)] transition hover:text-[var(--accent)]"
                  >
                    {article.title}
                  </Link>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
                    {formatArticleDateTime(article.updatedAt ?? article.publishedAt)}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="editorial-divider mb-9 grid items-start gap-6 pt-6 sm:mb-11 sm:pt-7 xl:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Opinion" title="Arguments worth reading" href={`/category/${getCategorySlug("Opinion")}`} />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {opinion.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="minimal" />
              ))}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Weekend Reads" title="Longer pieces for slower reading" />
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {weekendReads.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="compact" />
              ))}
            </div>
          </div>
        </section>

        <section className="editorial-divider mb-9 pt-6 sm:mb-11 sm:pt-7">
          <SectionHeading eyebrow="Stories by Desk" title="Politics, business, technology, and sports" />
          <div className="mt-5 grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[...politics, ...business, ...tech, ...sports].slice(0, 4).map((article) => (
              <ArticleCard key={article.slug} article={article} variant="compact" />
            ))}
          </div>
        </section>

        <section className="editorial-divider grid items-start gap-6 pt-6 sm:pt-7 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <SectionHeading eyebrow="Video" title="Visual reporting and studio analysis" />
            <div className="mt-5 grid items-start gap-4 md:grid-cols-3">
              {videoArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="compact" />
              ))}
            </div>
          </div>
          <aside className="self-start space-y-5">
            <NewsletterSignup />
          </aside>
        </section>
      </div>
    </div>
  );
}
