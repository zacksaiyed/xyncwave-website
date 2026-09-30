import { absoluteUrl, APPROVED_LOGO_PATH, canonicalUrl, SITE_NAME } from "./site-config";

type PageHeadOptions = {
  type?: "website" | "article";
  image?: string;
  robots?: string;
  canonical?: boolean;
};

export function pageHead(
  title: string,
  description: string,
  path: string,
  typeOrOptions: PageHeadOptions["type"] | PageHeadOptions = {},
) {
  const options = typeof typeOrOptions === "string" ? { type: typeOrOptions } : typeOrOptions;
  const type = options.type ?? "website";
  const documentTitle = /\|\s*(?:XWC|Xyncwave)$/i.test(title) ? title : `${title} | XWC`;
  const canonical = canonicalUrl(path);
  const image = absoluteUrl(options.image ?? APPROVED_LOGO_PATH);

  return {
    meta: [
      { title: documentTitle },
      { name: "description", content: description },
      ...(options.robots ? [{ name: "robots", content: options.robots }] : []),
      { property: "og:title", content: documentTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: canonical },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: documentTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: options.canonical === false ? [] : [{ rel: "canonical", href: canonical }],
  };
}

export function noindexHead(title: string, description: string, path?: string) {
  return pageHead(title, description, path ?? "/", {
    robots: "noindex,follow",
    canonical: Boolean(path),
  });
}
