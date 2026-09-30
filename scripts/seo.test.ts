import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

import { caseStudies } from "../src/lib/case-studies";
import { campaigns, campaignSlugs } from "../src/lib/campaigns";
import { articles, industries, solutions } from "../src/lib/content";
import { batchArticles } from "../src/lib/insights-batch";
import {
  accessibleIndexablePathsNotInSitemap,
  getSitemapEntries,
  isNoindexPath,
} from "../src/lib/public-routes";
import { renderRobotsTxt } from "../src/lib/robots";
import { noindexHead, pageHead } from "../src/lib/seo";
import {
  absoluteUrl,
  canonicalUrl,
  ORGANIZATION_ID,
  SITE_ORIGIN,
  WEBSITE_ID,
} from "../src/lib/site-config";
import { renderSitemapXml } from "../src/lib/sitemap";
import { breadcrumbSchema, siteIdentityGraph } from "../src/lib/structured-data";

const projectRoot = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

function metaContent(head: ReturnType<typeof pageHead>, key: "name" | "property", value: string) {
  return head.meta.find((item) => key in item && item[key] === value)?.content;
}

function filesUnder(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

test("the production origin and canonical policy are deterministic", () => {
  assert.equal(SITE_ORIGIN, "https://xyncwave.com");
  assert.equal(canonicalUrl("/"), "https://xyncwave.com/");
  assert.equal(canonicalUrl("/about/"), "https://xyncwave.com/about");
  assert.equal(
    canonicalUrl("https://preview.example/insights/example/?utm_source=test#section"),
    "https://xyncwave.com/insights/example",
  );
  assert.equal(absoluteUrl("/contact"), "https://xyncwave.com/contact");
});

test("every intended dynamic route is represented once in the sitemap inventory", () => {
  const entries = getSitemapEntries();
  const paths = entries.map((entry) => entry.path);

  assert.equal(solutions.length, 9);
  assert.equal(industries.length, 5);
  assert.equal(caseStudies.length, 9);
  assert.equal(articles.length, 30);
  assert.equal(batchArticles.length, 30);
  assert.equal(campaignSlugs.length, 3);
  assert.equal(entries.length, 71);
  assert.equal(new Set(paths).size, paths.length);

  for (const item of solutions) assert.ok(paths.includes(`/solutions/${item.slug}`));
  for (const item of industries) assert.ok(paths.includes(`/industries/${item.slug}`));
  for (const item of caseStudies) assert.ok(paths.includes(`/case-studies/${item.slug}`));
  for (const item of articles) assert.ok(paths.includes(`/insights/${item.slug}`));
  for (const slug of campaignSlugs) assert.ok(paths.includes(`/lp/${slug}`));

  assert.deepEqual(
    new Set(articles.map((item) => item.slug)),
    new Set(batchArticles.map((item) => item.slug)),
  );
  assert.ok(entries.every((entry) => !isNoindexPath(entry.path)));
  assert.ok(accessibleIndexablePathsNotInSitemap.every((path) => !paths.includes(path)));
});

test("sitemap XML contains only canonical production URLs and evidence-backed dates", () => {
  const xml = renderSitemapXml();
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);

  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(locations.length, 71);
  assert.equal(new Set(locations).size, locations.length);
  assert.ok(locations.every((url) => url.startsWith(`${SITE_ORIGIN}/`)));
  assert.ok(locations.every((url) => !/[?#]/.test(url)));
  assert.ok(!xml.includes("lovable.app"));
  assert.ok(!xml.includes("workers.dev"));
  assert.ok(!xml.includes("/search"));
  assert.ok(!xml.includes("/thank-you/"));

  const expectedLastmods = new Set(batchArticles.map((article) => article.modified));
  const actualLastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1]);
  assert.equal(actualLastmods.length, batchArticles.length);
  assert.ok(actualLastmods.every((date) => expectedLastmods.has(date)));
});

test("robots.txt has one authoritative source and permits search and answer-engine crawlers", () => {
  const robots = renderRobotsTxt();
  assert.equal(existsSync(join(projectRoot, "public/robots.txt")), false);
  assert.match(robots, /User-agent: OAI-SearchBot\nAllow: \//);
  assert.match(robots, /User-agent: Googlebot\nAllow: \//);
  assert.match(robots, /User-agent: Bingbot\nAllow: \//);
  assert.match(robots, /User-agent: \*\nAllow: \//);
  assert.match(robots, /Sitemap: https:\/\/xyncwave\.com\/sitemap\.xml/);
  assert.doesNotMatch(robots, /Disallow:/);
  assert.doesNotMatch(robots, /GPTBot/);
});

test("shared metadata emits absolute, matching canonical and social URLs", () => {
  const head = pageHead("About", "Company description", "/about");
  assert.deepEqual(head.links, [{ rel: "canonical", href: "https://xyncwave.com/about" }]);
  assert.equal(metaContent(head, "property", "og:url"), "https://xyncwave.com/about");
  assert.match(metaContent(head, "property", "og:image") ?? "", /^https:\/\/xyncwave\.com\//);
  assert.equal(metaContent(head, "name", "twitter:card"), "summary_large_image");
  assert.equal(head.meta.filter((item) => "title" in item).length, 1);
  assert.equal(head.meta.filter((item) => "name" in item && item.name === "description").length, 1);

  const hidden = noindexHead("Search", "Search results", "/search");
  assert.equal(metaContent(hidden, "name", "robots"), "noindex,follow");
  assert.equal(hidden.links[0]?.href, "https://xyncwave.com/search");
});

test("organization and breadcrumb structured data use stable absolute identities", () => {
  const graph = siteIdentityGraph();
  const organization = graph["@graph"].find((item) => item["@type"] === "Organization");
  const website = graph["@graph"].find((item) => item["@type"] === "WebSite");

  assert.equal(organization?.["@id"], ORGANIZATION_ID);
  assert.equal(organization?.url, "https://xyncwave.com/");
  assert.equal(organization?.email, "aasiya@xyncwave.ceo");
  assert.equal(organization?.telephone, "+919081908145");
  assert.equal(organization?.address.addressLocality, "Vadodara");
  assert.equal(organization?.address.postalCode, "390021");
  assert.match(organization?.logo ?? "", /^https:\/\/xyncwave\.com\//);
  assert.equal(website?.["@id"], WEBSITE_ID);
  assert.deepEqual(website?.publisher, { "@id": ORGANIZATION_ID });

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
  ]);
  assert.deepEqual(
    breadcrumbs.itemListElement.map((item) => item.item),
    ["https://xyncwave.com/", "https://xyncwave.com/insights"],
  );
});

test("insight evidence and author assignments remain complete", () => {
  for (const article of batchArticles) {
    assert.match(article.published, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(article.modified, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(
      article.directAnswer.length > 80,
      `${article.slug} needs a substantive direct answer`,
    );
    assert.ok(article.sources.length > 0, `${article.slug} needs sources`);
    assert.ok(article.faq.length > 0, `${article.slug} needs FAQ content`);
  }

  const authorsSource = readFileSync(join(projectRoot, "src/lib/insight-authors.ts"), "utf8");
  const aboutSource = readFileSync(join(projectRoot, "src/lib/about-content.ts"), "utf8");
  for (const article of articles) {
    assert.match(authorsSource, new RegExp(`"${article.slug}"\\s*:`));
  }
  const assignedNames = [...authorsSource.matchAll(/:\s*"([^"]+)",/g)].map((match) => match[1]);
  for (const name of assignedNames) {
    assert.ok(aboutSource.includes(`name: "${name}"`), `About roster is missing ${name}`);
  }
});

test("production SEO source does not leak retired preview origins", () => {
  const sourceRoot = join(projectRoot, "src");
  const excluded = "src/integrations/supabase/previewAuthStorage.ts";
  const offenders = filesUnder(sourceRoot)
    .filter((path) => /\.(?:ts|tsx)$/.test(path))
    .filter((path) => relative(projectRoot, path) !== excluded)
    .filter((path) =>
      /xyncwave-growth-engine\.lovable\.app|\.workers\.dev/.test(readFileSync(path, "utf8")),
    )
    .map((path) => relative(projectRoot, path));
  assert.deepEqual(offenders, []);

  assert.equal(Object.keys(campaigns).length, 3);
});
