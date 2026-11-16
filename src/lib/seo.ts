import { SITE_ORIGIN as SITE } from "./site-origin";
const abs = (p: string) => (p.startsWith("http") ? p : `${SITE}${p === "/" ? "/" : p}`);

export function pageHead(title: string, description: string, path: string, type = "website") {
  return {
    meta: [
      { title: `${title} | Xyncwave` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | Xyncwave` },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: abs(path) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: abs(path) }],
  };
}