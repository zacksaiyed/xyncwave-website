import { createFileRoute } from "@tanstack/react-router";
import { articles, industries, solutions } from "../lib/content";
import { caseStudies } from "../lib/case-studies";
import { products } from "../lib/products";
import { researchPapers } from "../lib/research";
import { erpnextDocPaths } from "../lib/erpnext-docs";
import { isProductionHost } from "../lib/indexing";
import { SITE_ORIGIN as BASE } from "../lib/site-origin";

const staticPaths = ["/", "/about", "/why-xyncwave", "/solutions", "/solutions/erpnext-implementation", "/industries", "/case-studies", "/case-studies/track-trace", "/case-studies/engineering-capacity", "/insights", "/products", "/research", "/contact", "/start-a-conversation", "/technology-partnership", "/digitalization-assessment", "/ai-opportunity-assessment", "/engineering-capacity-assessment", "/privacy", "/terms"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        if (!isProductionHost(new URL(request.url).hostname)) return new Response("Not found", { status: 404 });
        const paths = [
          ...staticPaths,
          ...erpnextDocPaths,
          ...solutions.map((s) => `/solutions/${s.slug}`),
          ...industries.map((i) => `/industries/${i.slug}`),
          ...caseStudies.map((c) => `/case-studies/${c.slug}`),
          ...products.map((p) => `/products/${p.slug}`),
          ...articles.map((a) => `/insights/${a.slug}`),
          ...researchPapers.map((p) => `/research/${p.slug}`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...new Set(paths)].map((p) => `<url><loc>${BASE}${p}</loc></url>`).join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
