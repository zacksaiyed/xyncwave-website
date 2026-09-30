import assert from "node:assert/strict";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";

import { getBatchArticle } from "../src/lib/insights-batch";
import { isNoindexPath } from "../src/lib/public-routes";
import { canonicalUrl, ORGANIZATION_ID, SITE_ORIGIN, WEBSITE_ID } from "../src/lib/site-config";

const baseUrl = (
  process.argv[2] ??
  process.env.SEO_AUDIT_BASE_URL ??
  "http://127.0.0.1:8080"
).replace(/\/$/, "");
const failures: string[] = [];

function check(condition: unknown, message: string) {
  if (!condition) failures.push(message);
}

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function matchFirst(html: string, pattern: RegExp) {
  return decodeHtml(html.match(pattern)?.[1]?.trim() ?? "");
}

function inspectHead(html: string) {
  return {
    title: matchFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    description: matchFirst(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
    ),
    canonical: matchFirst(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i),
    ogUrl: matchFirst(
      html,
      /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    ),
    ogImage: matchFirst(
      html,
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    ),
    robots: matchFirst(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["'][^>]*>/i),
    h1Count: [...html.matchAll(/<h1\b/gi)].length,
  };
}

function extractJsonLd(html: string, path: string) {
  return [
    ...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ]
    .map((match, index) => {
      try {
        return JSON.parse(match[1]) as Record<string, unknown>;
      } catch (error) {
        failures.push(`${path} JSON-LD block ${index + 1} does not parse: ${String(error)}`);
        return undefined;
      }
    })
    .filter((value): value is Record<string, unknown> => Boolean(value));
}

function schemaNodes(values: Record<string, unknown>[]) {
  return values.flatMap((value) => {
    const graph = value["@graph"];
    return Array.isArray(graph) ? graph : [value];
  }) as Record<string, unknown>[];
}

async function fetchPath(path: string, productionHost = true) {
  const url = new URL(path, `${baseUrl}/`);
  const transport = url.protocol === "https:" ? httpsRequest : httpRequest;

  return new Promise<Response>((resolve, reject) => {
    const request = transport(
      url,
      { headers: productionHost ? { host: "xyncwave.com" } : undefined },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        response.on("end", () => {
          const headers = new Headers();
          for (const [name, value] of Object.entries(response.headers)) {
            if (Array.isArray(value)) value.forEach((item) => headers.append(name, item));
            else if (value !== undefined) headers.set(name, value);
          }
          resolve(
            new Response(Buffer.concat(chunks), {
              status: response.statusCode ?? 500,
              statusText: response.statusMessage,
              headers,
            }),
          );
        });
      },
    );
    request.on("error", reject);
    request.end();
  });
}

const sitemapResponse = await fetchPath("/sitemap.xml");
check(sitemapResponse.status === 200, `sitemap.xml returned ${sitemapResponse.status}`);
check(
  (sitemapResponse.headers.get("content-type") ?? "").includes("application/xml"),
  "sitemap.xml does not use an XML content type",
);
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
  decodeHtml(match[1]),
);
const sitemapPaths = sitemapUrls.map((url) => new URL(url).pathname);
check(sitemapUrls.length === 71, `expected 71 sitemap URLs, found ${sitemapUrls.length}`);
check(new Set(sitemapUrls).size === sitemapUrls.length, "sitemap contains duplicate URLs");
check(
  sitemapUrls.every((url) => url.startsWith(`${SITE_ORIGIN}/`)),
  "sitemap contains a non-production URL",
);

const pageResults = await Promise.all(
  sitemapPaths.map(async (path) => {
    try {
      const response = await fetchPath(path);
      const html = await response.text();
      return {
        path,
        status: response.status,
        contentType: response.headers.get("content-type") ?? "",
        html,
        head: inspectHead(html),
      };
    } catch (error) {
      return {
        path,
        status: 0,
        contentType: "",
        html: "",
        head: inspectHead(""),
        error: String(error),
      };
    }
  }),
);

const titles = new Map<string, string[]>();
const descriptions = new Map<string, string[]>();
for (const page of pageResults) {
  check(page.status === 200, `${page.path} returned ${page.status}`);
  check(page.contentType.includes("text/html"), `${page.path} is not HTML`);
  check(Boolean(page.head.title), `${page.path} has no title`);
  check(Boolean(page.head.description), `${page.path} has no meta description`);
  check(page.head.canonical === canonicalUrl(page.path), `${page.path} has incorrect canonical`);
  check(page.head.ogUrl === canonicalUrl(page.path), `${page.path} has incorrect og:url`);
  check(
    page.head.ogImage.startsWith(`${SITE_ORIGIN}/`),
    `${page.path} has a missing or non-production og:image`,
  );
  check(
    !page.head.robots.toLowerCase().includes("noindex"),
    `${page.path} is unexpectedly noindex`,
  );
  check(page.head.h1Count === 1, `${page.path} has ${page.head.h1Count} h1 elements`);
  extractJsonLd(page.html, page.path);
  if (page.head.title)
    titles.set(page.head.title, [...(titles.get(page.head.title) ?? []), page.path]);
  if (page.head.description) {
    descriptions.set(page.head.description, [
      ...(descriptions.get(page.head.description) ?? []),
      page.path,
    ]);
  }
}

const pageByPath = new Map(pageResults.map((page) => [page.path, page]));
const homeSchema = schemaNodes(extractJsonLd(pageByPath.get("/")?.html ?? "", "/"));
const organization = homeSchema.find((node) => node["@type"] === "Organization");
const website = homeSchema.find((node) => node["@type"] === "WebSite");
check(organization?.["@id"] === ORGANIZATION_ID, "Home Organization schema has an incorrect @id");
check(organization?.url === `${SITE_ORIGIN}/`, "Home Organization schema has an incorrect URL");
check(website?.["@id"] === WEBSITE_ID, "Home WebSite schema has an incorrect @id");

const representativeArticlePath = "/insights/digital-transformation-fragmented-systems";
const representativeArticle = pageByPath.get(representativeArticlePath);
const articleSchema = schemaNodes(
  extractJsonLd(representativeArticle?.html ?? "", representativeArticlePath),
);
const articleNode = articleSchema.find((node) => node["@type"] === "Article");
const breadcrumbNode = articleSchema.find((node) => node["@type"] === "BreadcrumbList");
check(Boolean(articleNode), `${representativeArticlePath} is missing Article schema`);
check(Boolean(breadcrumbNode), `${representativeArticlePath} is missing BreadcrumbList schema`);
check(
  (articleNode?.mainEntityOfPage as { "@id"?: string } | undefined)?.["@id"] ===
    canonicalUrl(representativeArticlePath),
  `${representativeArticlePath} Article mainEntityOfPage is incorrect`,
);
check(
  (articleNode?.publisher as { "@id"?: string } | undefined)?.["@id"] === ORGANIZATION_ID,
  `${representativeArticlePath} Article publisher is incorrect`,
);
const directAnswer = getBatchArticle("digital-transformation-fragmented-systems")?.directAnswer;
check(
  Boolean(directAnswer && decodeHtml(representativeArticle?.html ?? "").includes(directAnswer)),
  `${representativeArticlePath} direct answer is missing from raw SSR HTML`,
);

for (const [title, paths] of titles) {
  check(paths.length === 1, `duplicate title on ${paths.join(", ")}: ${title}`);
}
for (const [description, paths] of descriptions) {
  check(paths.length === 1, `duplicate description on ${paths.join(", ")}: ${description}`);
}

const socialImagePaths = [
  ...new Set(
    pageResults
      .map((page) => page.head.ogImage)
      .filter((url) => url.startsWith(`${SITE_ORIGIN}/`))
      .map((url) => new URL(url).pathname),
  ),
];
const socialImageResults = await Promise.all(
  socialImagePaths.map(async (path) => {
    const response = await fetchPath(path);
    return {
      path,
      status: response.status,
      contentType: response.headers.get("content-type") ?? "",
    };
  }),
);
for (const image of socialImageResults) {
  check(image.status === 200, `social image ${image.path} returned ${image.status}`);
  check(image.contentType.startsWith("image/"), `social image ${image.path} is not an image`);
}

const sitemapPathSet = new Set(sitemapPaths);
const internalTargets = new Set<string>();
const fragmentTargets: { source: string; path: string; hash: string }[] = [];
for (const page of pageResults) {
  for (const match of page.html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    const href = decodeHtml(match[1]);
    if (/^(?:mailto:|tel:|javascript:)/i.test(href)) continue;
    const resolved = new URL(href, `${SITE_ORIGIN}${page.path}`);
    if (resolved.origin === SITE_ORIGIN) internalTargets.add(resolved.pathname);
    if (resolved.origin === SITE_ORIGIN && resolved.hash) {
      fragmentTargets.push({
        source: page.path,
        path: resolved.pathname,
        hash: decodeURIComponent(resolved.hash.slice(1)),
      });
    }
  }
}

const internalResults = await Promise.all(
  [...internalTargets].map(async (path) => {
    const response = await fetchPath(path);
    return { path, status: response.status };
  }),
);
for (const result of internalResults) {
  check(result.status < 400, `internal link ${result.path} returned ${result.status}`);
}
for (const target of fragmentTargets) {
  const targetPage = pageByPath.get(target.path);
  if (!targetPage) continue;
  const escaped = target.hash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  check(
    new RegExp(`\\bid=["']${escaped}["']`, "i").test(targetPage.html),
    `${target.source} links to missing anchor ${target.path}#${target.hash}`,
  );
}
for (const path of sitemapPaths) {
  check(internalTargets.has(path), `${path} has no internal HTML link from a sitemap page`);
}

let imageCount = 0;
let imagesWithoutAlt = 0;
for (const page of pageResults) {
  const tags = [...page.html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  imageCount += tags.length;
  imagesWithoutAlt += tags.filter((tag) => !/\balt=["'][^"']*["']/i.test(tag)).length;
}
check(imagesWithoutAlt === 0, `${imagesWithoutAlt} rendered images are missing an alt attribute`);

for (const path of ["/search?q=data", "/thank-you/digitalization"]) {
  const response = await fetchPath(path);
  const html = await response.text();
  const head = inspectHead(html);
  check(response.status === 200, `${path} returned ${response.status}`);
  check(head.robots.toLowerCase().includes("noindex"), `${path} is missing noindex`);
  check(!sitemapPathSet.has(new URL(path, SITE_ORIGIN).pathname), `${path} appears in sitemap`);
  check(isNoindexPath(new URL(path, SITE_ORIGIN).pathname), `${path} is missing from route policy`);
}

const robotsResponse = await fetchPath("/robots.txt");
const robots = await robotsResponse.text();
check(robotsResponse.status === 200, `robots.txt returned ${robotsResponse.status}`);
check(
  (robotsResponse.headers.get("content-type") ?? "").includes("text/plain"),
  "robots.txt does not use text/plain",
);
check(robots.includes("User-agent: OAI-SearchBot"), "robots.txt omits OAI-SearchBot");
check(robots.includes(`${SITE_ORIGIN}/sitemap.xml`), "robots.txt has an incorrect sitemap URL");

const missingPath = `/seo-audit-missing-${Date.now()}`;
const missingResponse = await fetchPath(missingPath);
const missingHtml = await missingResponse.text();
check(missingResponse.status === 404, `unknown path returned ${missingResponse.status}, not 404`);
check(
  (missingResponse.headers.get("x-robots-tag") ?? "").includes("noindex"),
  "404 response is missing X-Robots-Tag noindex",
);
check(!inspectHead(missingHtml).canonical, "404 response has an accidental canonical URL");

const previewResponse = await fetchPath("/", false);
const previewHtml = await previewResponse.text();
check(
  (previewResponse.headers.get("x-robots-tag") ?? "").includes("noindex"),
  "preview host is missing X-Robots-Tag noindex",
);
check(
  inspectHead(previewHtml).robots.toLowerCase().includes("noindex"),
  "preview host is missing meta robots noindex",
);

const result = {
  baseUrl,
  sitemapUrls: sitemapUrls.length,
  crawledPages: pageResults.length,
  internalTargets: internalTargets.size,
  checkedFragmentLinks: fragmentTargets.length,
  renderedImages: imageCount,
  imagesWithoutAlt,
  checkedSocialImages: socialImageResults.length,
  failures,
};
console.log(JSON.stringify(result, null, 2));
assert.deepEqual(failures, []);
