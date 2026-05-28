import { NewsletterSignup } from "@/components/newsletter-signup";
import { buildMetadata } from "@/lib/news";

export const metadata = buildMetadata({
  title: "About | NewsPressal",
  description:
    "Learn about NewsPressal, its newsroom mission, editorial approach, and coverage priorities.",
  path: "/about",
});

const principles = [
  {
    title: "Clarity over noise",
    description:
      "We design coverage for readers who want speed without losing substance, and depth without unnecessary friction.",
  },
  {
    title: "Range with discipline",
    description:
      "Our desks work across policy, markets, technology, sports, culture, and opinion while maintaining a coherent editorial standard.",
  },
  {
    title: "Digital-first presentation",
    description:
      "NewsPressal treats layout, scanning behavior, and mobile reading as part of the reporting product, not an afterthought.",
  },
];

export default function AboutPage() {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
              About
            </p>
            <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-none tracking-[-0.05em] text-[var(--text-primary)] sm:text-6xl">
              NewsPressal is built for readers who expect a premium news experience.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
              We combine breaking coverage, beat expertise, and a polished editorial product to help readers understand what matters now and why it matters next.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {principles.map((principle) => (
                <article
                  key={principle.title}
                  className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6"
                >
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                    {principle.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                    {principle.description}
                  </p>
                </article>
              ))}
            </div>

            <section className="mt-12 rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                Editorial mission
              </p>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
                Our newsroom is structured around the assumption that readers move fluidly between devices and between topic areas. The product therefore emphasizes strong homepage hierarchy, clear story packaging, and category pages that feel like dedicated desks rather than archive dumps.
              </p>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
                This demo uses mock reporting and placeholder imagery, but the information architecture, component system, metadata, and responsive behavior are built to translate directly into a production newsroom workflow.
              </p>
            </section>
          </section>

          <aside className="space-y-6">
            <NewsletterSignup />
            <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                Contact
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                Editorial inquiries
              </h2>
              <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
                Reach the newsroom at editor@newspressal.example for partnerships, corrections, syndication, or press questions.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
