import { articles, industries, solutions } from "./content";
import { caseStudies } from "./case-studies";

export type SearchResultType = "Solution" | "Industry" | "Case study" | "Insight" | "Company";
export type SearchDocument = {
  id: string;
  title: string;
  summary: string;
  type: SearchResultType;
  route: string;
  terms: string[];
};
export type RankedSearchDocument = SearchDocument & { score: number };

const companyPages: SearchDocument[] = [
  {
    id: "company-about",
    title: "About XWC",
    summary: "Technology should make the business easier to understand, operate, and change.",
    type: "Company",
    route: "/about",
    terms: ["company", "team", "Xyncwave Corporation LLP"],
  },
  {
    id: "company-why",
    title: "Why XWC",
    summary: "A stronger engagement makes the important decisions visible.",
    type: "Company",
    route: "/why-xyncwave",
    terms: ["approach", "principles", "delivery", "why Xyncwave"],
  },
  {
    id: "company-partnership",
    title: "Technology partnership",
    summary: "A technology partner for the work between strategy and delivery.",
    type: "Company",
    route: "/technology-partnership",
    terms: ["partner", "delivery", "strategy"],
  },
  {
    id: "company-contact",
    title: "Contact",
    summary: "Give us the context. You do not need to have the solution figured out yet.",
    type: "Company",
    route: "/contact",
    terms: ["conversation", "enquiry", "challenge"],
  },
];

const featuredCases: SearchDocument[] = [
  {
    id: "case-track-trace",
    title: "From fragmented field work to one connected operational platform.",
    summary:
      "Support, technician work, stock movement, communication, and job evidence needed one shared operational flow.",
    type: "Case study",
    route: "/case-studies/track-trace",
    terms: ["track trace", "logistics", "ERPNext", "Flutter", "field service"],
  },
  {
    id: "case-engineering-capacity",
    title: "Scaling delivery capacity around real demand.",
    summary:
      "Delivery needs can grow faster than permanent hiring without becoming predictable enough for fixed overhead.",
    type: "Case study",
    route: "/case-studies/engineering-capacity",
    terms: ["engineering pod", "staff augmentation", "delivery team"],
  },
];

export const searchDocuments: SearchDocument[] = [
  ...solutions.map((item) => ({
    id: `solution-${item.slug}`,
    title: item.title,
    summary: item.short,
    type: "Solution" as const,
    route: `/solutions/${item.slug}`,
    terms: [
      item.eyebrow,
      item.openingTitle,
      ...item.capabilities.map((capability) => capability.title),
    ],
  })),
  ...industries.map((item) => ({
    id: `industry-${item.slug}`,
    title: item.title,
    summary: item.short,
    type: "Industry" as const,
    route: `/industries/${item.slug}`,
    terms: [
      item.eyebrow,
      item.openingTitle,
      ...item.capabilities.map((capability) => capability.title),
    ],
  })),
  ...caseStudies.map((item) => ({
    id: `case-${item.slug}`,
    title: item.title,
    summary: item.cardProblem,
    type: "Case study" as const,
    route: `/case-studies/${item.slug}`,
    terms: [item.category, item.crumb, item.cardTransformation],
  })),
  ...featuredCases,
  ...articles.map((item) => ({
    id: `insight-${item.slug}`,
    title: item.title,
    summary: item.excerpt,
    type: "Insight" as const,
    route: `/insights/${item.slug}`,
    terms: [item.category, item.slug.replaceAll("-", " ")],
  })),
  ...companyPages,
];

export const searchResultTypes: SearchResultType[] = [
  "Solution",
  "Industry",
  "Case study",
  "Insight",
  "Company",
];

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function withinOneEdit(left: string, right: string) {
  if (Math.abs(left.length - right.length) > 1) return false;
  let i = 0,
    j = 0,
    edits = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (left.length > right.length) i += 1;
    else if (right.length > left.length) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }
  return edits + Number(i < left.length || j < right.length) <= 1;
}

export function searchContent(query: string, type?: SearchResultType): RankedSearchDocument[] {
  const phrase = normalize(query).slice(0, 120);
  if (!phrase) return [];
  const queryTokens = [...new Set(phrase.split(" ").filter(Boolean))].slice(0, 12);
  const ranked = searchDocuments.flatMap((document) => {
    if (type && document.type !== type) return [];
    const title = normalize(document.title);
    const summary = normalize(document.summary);
    const terms = normalize(document.terms.join(" "));
    const titleTokens = title.split(" ");
    const termTokens = terms.split(" ");
    const summaryTokens = summary.split(" ");
    let score = title === phrase ? 160 : ` ${title} `.includes(` ${phrase} `) ? 100 : 0;
    for (const token of queryTokens) {
      if (titleTokens.includes(token)) score += 30;
      else if (token.length >= 3 && titleTokens.some((word) => word.startsWith(token))) score += 18;
      else if (termTokens.includes(token)) score += 12;
      else if (summaryTokens.includes(token)) score += 7;
      else if (
        token.length >= 4 &&
        titleTokens.some((candidate) => candidate.length >= 4 && withinOneEdit(token, candidate))
      )
        score += 4;
    }
    return score > 0 ? [{ ...document, score }] : [];
  });
  // Keep the highest-ranked copy of a route, not the last (lowest) Map assignment.
  const seen = new Set<string>();
  return ranked
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .filter((item) => {
      if (seen.has(item.route)) return false;
      seen.add(item.route);
      return true;
    });
}
