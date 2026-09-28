export function pageHead(title: string, description: string, path: string, type = "website") {
  return {
    meta: [
      { title: `${title} | XWC` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | XWC` },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: path },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}
