import { articles } from "./content";
import { erpnextDocs } from "./erpnext-docs";
import { getInsightAuthor } from "./insight-authors";
import { getInsightMedia, erpnextArticleMedia, type MediaEntry } from "./media-registry";

export type InsightCard = { key: string; to: string; lang: string; category: string; title: string; excerpt: string; author?: string | undefined; date: string; media?: MediaEntry | undefined; erp: boolean };

const general: Omit<InsightCard, "date">[] = articles.map(a => ({ key: a.slug, to: `/insights/${a.slug}`, lang: "en", category: a.category, title: a.title, excerpt: a.excerpt, author: getInsightAuthor(a.slug)?.name, media: getInsightMedia(a.slug, a.category), erp: false }));
const erp: Omit<InsightCard, "date">[] = erpnextDocs.filter(d => d.kind === "article").map(d => ({ key: d.path, to: d.path, lang: d.lang, category: d.eyebrow.replace(/^Insights · /, ""), title: d.title, excerpt: d.description, author: d.author?.split(" — ")[0], media: erpnextArticleMedia[d.path], erp: true }));

// Mix ERPNext articles through the list (one in every few cards), newest first.
const mixed: Omit<InsightCard, "date">[] = [];
let e = 0;
general.forEach((g, i) => { mixed.push(g); if ((i + 1) % 5 === 2 && e < erp.length) mixed.push(erp[e++]!); });
while (e < erp.length) mixed.push(erp[e++]!);

// Publishing sequence: newest on 12 Nov 2026, then one every 4 days going back.
const start = Date.UTC(2026, 10, 12);
export const insightCards: InsightCard[] = mixed.map((c, i) => ({ ...c, date: new Date(start - i * 4 * 86400000).toISOString().slice(0, 10) }));
export const formatInsightDate = (iso: string) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
