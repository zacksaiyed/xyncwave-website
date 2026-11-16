import { z } from "zod";

export const RATE_CARD_ASSET = "engineering-resource-rate-card";
export const RATE_CARD_FILENAME = "XWC_Global_Engineering_Resource_Rate_Card_USD_2026_v2.pdf";
export const EXIT_ROUTES = ["/solutions/engineering-capacity", "/industries/technology-it-services", "/case-studies/engineering-capacity", ...["staff-augmentation-vs-dedicated-team-vs-outsourcing", "white-label-software-development", "reduce-engineering-backlog", "it-consulting-delivery-margin-capacity-scope-handoffs", "fintech-what-to-outsource", "evaluate-software-engineering-partner", "fintech-scale-engineering-after-funding"].map(slug => `/insights/${slug}`)];
export const DAY = 86_400_000;
export const DESKTOP_QUERY = "(min-width: 768px) and (hover: hover) and (pointer: fine)";
const blockedDomains = new Set(["gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "outlook.com", "hotmail.com", "hotmail.co.uk", "live.com", "msn.com", "icloud.com", "me.com", "mac.com", "aol.com", "proton.me", "protonmail.com", "gmx.com", "gmx.net", "mail.com", "yandex.com", "rediffmail.com", "mailinator.com", "guerrillamail.com", "tempmail.com", "10minutemail.com", "yopmail.com", "trashmail.com", "dispostable.com", "getnada.com", "sharklasers.com"]);
export function isBusinessEmail(email: string) {
  if (!z.string().email().safeParse(email.trim()).success) return false;
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return domain.includes(".") && ![...blockedDomains].some(blocked => domain === blocked || domain.endsWith(`.${blocked}`));
}
export const rateCardSchema = z.object({
  businessEmail: z.string().trim().max(255).refine(isBusinessEmail, "Please use a valid business email, rather than a personal or disposable address."),
  phone: z.string().trim().max(40).optional(),
  sourcePage: z.string().url().max(1000),
  placement: z.enum(["popup", "inline"]),
  requestId: z.string().uuid(),
  website: z.string().max(200).optional(),
  attribution: z.object({ utm_source: z.string().max(300).optional(), utm_medium: z.string().max(300).optional(), utm_campaign: z.string().max(300).optional(), utm_content: z.string().max(300).optional() }).optional(),
});
export function exitEligible({ path, desktop, seconds, scroll, sessionShown, dismissedAt, requestedAt, now }: { path: string; desktop: boolean; seconds: number; scroll: number; sessionShown: boolean; dismissedAt: number; requestedAt: number; now: number }) {
  return EXIT_ROUTES.includes(path) && desktop && (seconds >= 20 || scroll >= .4) && !sessionShown && !(dismissedAt > 0 && now - dismissedAt < 14 * DAY) && !(requestedAt > 0 && now - requestedAt < 30 * DAY);
}
export function touchPromptEligible({ path, scroll, sessionShown, dismissedAt, requestedAt, now }: { path: string; scroll: number; sessionShown: boolean; dismissedAt: number; requestedAt: number; now: number }) {
  return EXIT_ROUTES.includes(path) && scroll >= .6 && !sessionShown && !(dismissedAt > 0 && now - dismissedAt < 14 * DAY) && !(requestedAt > 0 && now - requestedAt < 30 * DAY);
}
export const RATE_CARD_CTAS: Record<string, { after: string; heading: string; body: string; button: string }> = {
  "staff-augmentation-vs-dedicated-team-vs-outsourcing": { after: "comparison", heading: "Comparing Engineering Engagement Costs?", body: "Explore Xyncwave's indicative monthly engineering resource rates to support your capacity-planning decisions.", button: "Get the Engineering Rate Card" },
  "white-label-software-development": { after: "comparisons", heading: "Planning White-Label Engineering Capacity?", body: "Review indicative monthly engineering rates when evaluating additional delivery capabilities for your client projects.", button: "View Engineering Rate Card" },
  "reduce-engineering-backlog": { after: "model", heading: "When Additional Engineering Capacity Makes Sense", body: "If your team has identified a genuine capability or delivery-capacity gap, our rate card can help with initial resource budgeting.", button: "Get Monthly Engineering Rates" },
  "it-consulting-delivery-margin-capacity-scope-handoffs": { after: "partner-model", heading: "Budgeting External Engineering Capacity?", body: "Review indicative monthly engineering resource rates alongside your scope, staffing and handoff assumptions.", button: "Get the Engineering Rate Card" },
  "fintech-what-to-outsource": { after: "extend", heading: "Planning Specialist Engineering Support?", body: "Explore indicative monthly engineering rates for the delivery capabilities you choose to extend while retaining internal ownership.", button: "View Engineering Rate Card" },
  "evaluate-software-engineering-partner": { after: "scorecard", heading: "Comparing Engineering Partner Costs?", body: "Use indicative monthly engineering resource rates as one input alongside technical fit, governance and delivery continuity.", button: "Get the Engineering Rate Card" },
  "fintech-scale-engineering-after-funding": { after: "external-capacity", heading: "Budgeting Engineering Capacity After Funding?", body: "Review indicative monthly engineering rates when weighing specialist support and temporary capacity against permanent hiring.", button: "Get Monthly Engineering Rates" },
};