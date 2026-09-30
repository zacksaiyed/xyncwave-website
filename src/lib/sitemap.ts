import { getSitemapEntries } from "./public-routes";
import { canonicalUrl } from "./site-config";

const xmlEscape = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character] ?? character;
  });

export function renderSitemapXml(): string {
  const urls = getSitemapEntries()
    .map(
      ({ path, lastmod }) =>
        `  <url>\n    <loc>${xmlEscape(canonicalUrl(path))}</loc>${
          lastmod ? `\n    <lastmod>${xmlEscape(lastmod)}</lastmod>` : ""
        }\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
