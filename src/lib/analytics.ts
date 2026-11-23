export type AnalyticsEvent = "page_view" | "industry_page_view" | "cta_click" | "hero_cta_click" | "solution_select" | "industry_select" | "challenge_selected" | "pain_card_click" | "case_study_click" | "trigger_section_view" | "lead_form_view" | "lead_form_start" | "lead_form_field_complete" | "lead_form_abandon" | "lead_form_submit" | "thank_you_view" | "form_start" | "form_step" | "form_error" | "form_submit" | "assessment_start" | "assessment_step" | "assessment_complete" | "case_study_view" | "case_study_cta" | "article_view" | "toc_click" | "internal_link_click" | "diagram_interaction" | "video_play" | "lead_magnet_download" | "scheduler_click" | "outbound_click" | "lead_generated" | "whitepaper_preview_view" | "whitepaper_gate_open" | "whitepaper_form_start" | "whitepaper_request_success" | "whitepaper_request_failure";

export type RateCardAnalyticsEvent = "rate_card_cta_view" | "rate_card_cta_click" | "rate_card_popup_view" | "rate_card_popup_dismiss" | "rate_card_submit" | "rate_card_request_success" | "rate_card_email_sent" | "rate_card_download";

import { isProductionHost } from "./indexing";

type AnalyticsProperties = Record<string, string | number | boolean | undefined>;
type AnalyticsWindow = typeof window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; __xwcGa?: boolean };

/**
 * GA4 measurement ID for xyncwave.com. Hardcoded on purpose (it is a public ID) so a code re-import
 * or a missing build variable can never silently switch tracking off. VITE_GA_MEASUREMENT_ID overrides it.
 */
export const GA4_MEASUREMENT_ID = (import.meta.env?.["VITE_GA_MEASUREMENT_ID"] as string | undefined) || "G-HPVJCS6BYR";

/** Events that count as a lead, also reported to GA4 as its standard `generate_lead` event. */
const LEAD_EVENTS = new Set<string>(["lead_form_submit", "whitepaper_request_success", "rate_card_request_success"]);

export function track(event: AnalyticsEvent | RateCardAnalyticsEvent, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("xyncwave:analytics", { detail: { event, ...properties } }));
  const gtag = (window as AnalyticsWindow).gtag;
  if (!gtag) return;
  // "page_view" is reserved for real page loads (see trackPageView); page-level detail events use another name.
  gtag("event", event === "page_view" ? "content_page_view" : event, properties);
  if (LEAD_EVENTS.has(event)) gtag("event", "generate_lead", properties);
}

/** Sends one GA4 page_view. Called on first load and on every client-side navigation. */
export function trackPageView() {
  if (typeof window === "undefined") return;
  const gtag = (window as AnalyticsWindow).gtag;
  if (!gtag) return;
  // Wait a tick so document.title already reflects the new route.
  window.setTimeout(() => {
    gtag("event", "page_view", { page_location: window.location.href, page_path: window.location.pathname + window.location.search, page_title: document.title });
  }, 100);
}

/** Loads GA4 once, on the production hosts only (previews and local builds are not tracked). */
export function initAnalytics() {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  if (w.__xwcGa || !isProductionHost(window.location.hostname)) return;
  w.__xwcGa = true;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // gtag.js only understands the `arguments` object, not plain arrays.
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  w.gtag("js", new Date());
  // Page views are sent explicitly by trackPageView so client-side navigation is counted exactly once.
  w.gtag("config", GA4_MEASUREMENT_ID, { send_page_view: false });
}
