import { companyContact } from "./company-contact";
import {
  absoluteUrl,
  APPROVED_LOGO_PATH,
  canonicalUrl,
  ORGANIZATION_ID,
  SITE_ALTERNATE_NAME,
  SITE_NAME,
  SITE_ORIGIN,
  WEBSITE_ID,
} from "./site-config";

export type BreadcrumbSchemaItem = { name: string; path: string };

export function siteIdentityGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        legalName: companyContact.name,
        alternateName: SITE_ALTERNATE_NAME,
        url: `${SITE_ORIGIN}/`,
        logo: absoluteUrl(APPROVED_LOGO_PATH),
        email: companyContact.email,
        telephone: companyContact.phoneHref,
        contactPoint: {
          "@type": "ContactPoint",
          email: companyContact.email,
          telephone: companyContact.phoneHref,
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "F-19, Sharnam Fortune, Race Course, Alkapuri",
          addressLocality: "Vadodara",
          addressRegion: "Gujarat",
          postalCode: "390021",
          addressCountry: "IN",
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAME,
        url: `${SITE_ORIGIN}/`,
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}

export function breadcrumbSchema(items: BreadcrumbSchemaItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function jsonLdScript(value: unknown) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(value),
  };
}
