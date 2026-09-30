import { caseStudies } from "./case-studies";
import { campaignSlugs } from "./campaigns";
import { articles, industries, solutions } from "./content";
import { batchArticles } from "./insights-batch";
import { normalizePath } from "./site-config";

export type SitemapEntry = { path: string; lastmod?: string };

export const sitemapStaticPaths = [
  "/",
  "/about",
  "/why-xyncwave",
  "/solutions",
  "/industries",
  "/case-studies",
  "/case-studies/track-trace",
  "/case-studies/engineering-capacity",
  "/insights",
  "/contact",
  "/start-a-conversation",
  "/technology-partnership",
  "/digitalization-assessment",
  "/ai-opportunity-assessment",
  "/engineering-capacity-assessment",
] as const;

export const accessibleIndexablePathsNotInSitemap = ["/privacy", "/terms"] as const;
export const noindexExactPaths = ["/search"] as const;
export const noindexPathPrefixes = ["/thank-you/"] as const;

export function isNoindexPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return (
    noindexExactPaths.some((item) => item === path) ||
    noindexPathPrefixes.some((prefix) => path.startsWith(prefix))
  );
}

export function getSitemapEntries(): SitemapEntry[] {
  const articleModified = new Map(batchArticles.map((article) => [article.slug, article.modified]));
  const entries: SitemapEntry[] = [
    ...sitemapStaticPaths.map((path) => ({ path })),
    ...solutions.map((item) => ({ path: `/solutions/${item.slug}` })),
    ...industries.map((item) => ({ path: `/industries/${item.slug}` })),
    ...caseStudies.map((item) => ({ path: `/case-studies/${item.slug}` })),
    ...articles.map((item) => ({
      path: `/insights/${item.slug}`,
      lastmod: articleModified.get(item.slug),
    })),
    ...campaignSlugs.map((slug) => ({ path: `/lp/${slug}` })),
  ];

  return [...new Map(entries.map((entry) => [normalizePath(entry.path), entry])).values()].sort(
    (a, b) => a.path.localeCompare(b.path),
  );
}
