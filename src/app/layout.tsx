import type { Metadata } from "next";
import Script from "next/script";
import { Newsreader, Public_Sans } from "next/font/google";
import { BreakingTicker } from "@/components/breaking-ticker";
import { ReadingProgress } from "@/components/reading-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublicArticles } from "@/lib/articles";
import { buildMetadata, siteDescription, siteName } from "@/lib/news";
import "./globals.css";

const bodyFont = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const headingFont = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = buildMetadata({
  title: `${siteName} | Independent. Insightful. In real time.`,
  description: siteDescription,
  image: "/logo.png",
});

metadata.icons = {
  icon: [
    { url: "/favicon.ico" },
    { url: "/favicon.png", type: "image/png" },
  ],
  shortcut: "/favicon.ico",
  apple: "/apple-touch-icon.png",
};

const themeScript = `
  (() => {
    const saved = localStorage.getItem("newspressal-theme");
    document.documentElement.dataset.theme = saved ?? "light";
  })();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publicArticles = await getPublicArticles();
  const breakingArticles = publicArticles.filter((article) => article.breaking).slice(0, 6);
  const tickerArticles = breakingArticles.length ? breakingArticles : publicArticles.slice(0, 6);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${headingFont.variable} bg-[var(--site-bg)] text-[var(--text-primary)] antialiased`}>
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <ReadingProgress />
        <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(179,147,72,0.18),transparent_58%)]" />
        <BreakingTicker articles={tickerArticles} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
