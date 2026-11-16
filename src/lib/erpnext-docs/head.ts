import { pageHead } from "../seo";
import { SITE_ORIGIN } from "../site-origin";
import { ERP_ALTERNATES, type ERPDoc } from "./types";

const localeOf = { en: "en_US", de: "de_DE", ar: "ar_AR" } as const;

export function erpDocHead(doc: ERPDoc) {
  const base = pageHead(doc.seoTitle.replace(/\s*\|\s*(XWC|Xyncwave)$/, ""), doc.description, doc.path, doc.kind === "article" ? "article" : "website");
  const url = `${SITE_ORIGIN}${doc.path}`;
  const paired = ERP_ALTERNATES.some(a => a.path === doc.path);
  const crumbs = doc.breadcrumbs.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.label, item: `${SITE_ORIGIN}${b.to ?? doc.path}` }));
  const main = doc.kind === "article"
    ? { "@context": "https://schema.org", "@type": "Article", headline: doc.title, description: doc.description, inLanguage: doc.lang, url, mainEntityOfPage: url, ...(doc.published ? { datePublished: doc.published, dateModified: doc.published } : {}), ...(doc.author ? { author: { "@type": "Person", name: doc.author } } : {}), publisher: { "@type": "Organization", name: "Xyncwave Corporation LLP", url: SITE_ORIGIN } }
    : { "@context": "https://schema.org", "@type": "Service", name: doc.title, description: doc.description, inLanguage: doc.lang, url, provider: { "@type": "Organization", name: "Xyncwave Corporation LLP", url: SITE_ORIGIN } };
  return {
    meta: [...base.meta, { property: "og:locale", content: localeOf[doc.lang] }],
    links: [...base.links, ...(paired ? ERP_ALTERNATES.map(a => ({ rel: "alternate", hrefLang: a.hreflang, href: `${SITE_ORIGIN}${a.path}` })) : [])],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(main) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs }) },
    ],
  };
}
