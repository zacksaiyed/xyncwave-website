import { createFileRoute } from "@tanstack/react-router";
import { ERPNextPillar } from "../components/erpnext-pillar";
import { pageHead } from "../lib/seo";
import { SITE_ORIGIN } from "../lib/site-origin";
import { ERP_ALTERNATES } from "../lib/erpnext-docs/types";

const description = "Plan ERPNext around real operations. XWC supports ERPNext implementation, Frappe customization, integrations, migrations and long-term engineering support worldwide.";
export const Route = createFileRoute("/solutions/erpnext-implementation")({
  head: () => { const base = pageHead("ERPNext Implementation, Customization & Frappe Development", description, "/solutions/erpnext-implementation"); return { ...base, links: [...base.links, ...ERP_ALTERNATES.map(a => ({ rel: "alternate", hrefLang: a.hreflang, href: `${SITE_ORIGIN}${a.path}` }))], scripts: [
    { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Service", name: "ERPNext Implementation, Customization & Frappe Engineering", description, url: `${SITE_ORIGIN}/solutions/erpnext-implementation`, inLanguage: "en", provider: { "@type": "Organization", name: "Xyncwave Corporation LLP", url: SITE_ORIGIN } }) },
    { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "ERP & Business Systems", item: `${SITE_ORIGIN}/solutions/erp-business-systems` },
      { "@type": "ListItem", position: 3, name: "ERPNext Implementation", item: `${SITE_ORIGIN}/solutions/erpnext-implementation` },
    ] }) },
  ] }; },
  component: ERPNextPillar,
});