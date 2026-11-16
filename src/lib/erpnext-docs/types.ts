import type { PillarSection } from "../erpnext-pillar";
import type { ExploreItem } from "../../components/continue-exploring";

export type ERPLang = "en" | "de" | "ar";

/** One ERPNext regional landing page or cluster article; rendered by ERPNextDocument. */
export type ERPDoc = {
  path: string;
  lang: ERPLang;
  kind: "landing" | "article";
  eyebrow: string;
  title: string;
  seoTitle: string;
  description: string;
  tagline?: string;
  lead: string[];
  summary?: string;
  takeaways?: string[];
  sections: PillarSection[];
  faq: [string, string][];
  sources: [string, string][];
  cta: string;
  ctaBody: string;
  secondary?: { label: string; href: string };
  related: ExploreItem[];
  relatedTitle: string;
  breadcrumbs: { label: string; to?: string }[];
  author?: string;
  published?: string;
};

export const ERP_ALTERNATES = [
  { hreflang: "en", path: "/solutions/erpnext-implementation" },
  { hreflang: "de-DE", path: "/de/erpnext-implementierung" },
  { hreflang: "ar", path: "/ar/erpnext-implementation" },
  { hreflang: "x-default", path: "/solutions/erpnext-implementation" },
];
