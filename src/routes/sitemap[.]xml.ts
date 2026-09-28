import { createFileRoute } from "@tanstack/react-router";
import { articles, industries, solutions } from "../lib/content";
import { caseStudies } from "../lib/case-studies";

const BASE = "https://xyncwave-growth-engine.lovable.app";
const staticPaths = ["/", "/about", "/why-xyncwave", "/solutions", "/industries", "/case-studies", "/case-studies/track-trace", "/case-studies/engineering-capacity", "/insights", "/contact", "/start-a-conversation", "/technology-partnership", "/digitalization-assessment", "/ai-opportunity-assessment", "/engineering-capacity-assessment", "/privacy", "/terms"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const paths = [
          ...staticPaths,
          ...solutions.map((s) => `/solutions/${s.slug}`),
          ...industries.map((i) => `/industries/${i.slug}`),
          ...caseStudies.map((c) => `/case-studies/${c.slug}`),
          ...articles.map((a) => `/insights/${a.slug}`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...new Set(paths)].map((p) => `<url><loc>${BASE}${p}</loc></url>`).join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
