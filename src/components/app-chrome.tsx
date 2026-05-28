"use client";

import { usePathname } from "next/navigation";
import { BreakingTicker } from "@/components/breaking-ticker";
import { ReadingProgress } from "@/components/reading-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Article } from "@/lib/news-data";

export function AppChrome({
  children,
  tickerArticles,
}: {
  children: React.ReactNode;
  tickerArticles: Article[];
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <main>{children}</main>;
  }

  return (
    <>
      <ReadingProgress />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(179,147,72,0.18),transparent_58%)]" />
      <BreakingTicker articles={tickerArticles} />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
