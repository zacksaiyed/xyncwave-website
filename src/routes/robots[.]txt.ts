import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "../lib/site-origin";
import { isProductionHost } from "../lib/indexing";

// Staging allows crawling so search engines can see its noindex, but never advertises a sitemap.
export const Route = createFileRoute("/robots.txt")({ server: { handlers: { GET: ({ request }) => new Response(
  isProductionHost(new URL(request.url).hostname)
    ? `User-agent: *\nAllow: /\nDisallow: /thank-you/\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`
    : "User-agent: *\nAllow: /\n",
  { headers: { "Content-Type": "text/plain; charset=utf-8" } }) } } });
