export type AnalyticsEvent = "page_view" | "industry_page_view" | "cta_click" | "hero_cta_click" | "solution_select" | "industry_select" | "challenge_selected" | "pain_card_click" | "case_study_click" | "trigger_section_view" | "lead_form_view" | "lead_form_start" | "lead_form_field_complete" | "lead_form_abandon" | "lead_form_submit" | "thank_you_view" | "form_start" | "form_step" | "form_error" | "form_submit" | "assessment_start" | "assessment_step" | "assessment_complete" | "case_study_view" | "case_study_cta" | "article_view" | "toc_click" | "internal_link_click" | "diagram_interaction" | "video_play" | "lead_magnet_download" | "scheduler_click" | "outbound_click" | "lead_generated" | "whitepaper_preview_view" | "whitepaper_gate_open" | "whitepaper_form_start" | "whitepaper_request_success" | "whitepaper_request_failure";

export type RateCardAnalyticsEvent = "rate_card_cta_view" | "rate_card_cta_click" | "rate_card_popup_view" | "rate_card_popup_dismiss" | "rate_card_submit" | "rate_card_request_success" | "rate_card_email_sent" | "rate_card_download";

export function track(event: AnalyticsEvent | RateCardAnalyticsEvent, properties: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("xyncwave:analytics", { detail: { event, ...properties } }));
  const analyticsWindow = window as typeof window & { dataLayer?: Record<string, unknown>[] };
  analyticsWindow.dataLayer?.push({ event, ...properties });
}
/** Loads GA4 once, only when a measurement ID is configured. Existing track() calls then reach GA4 via dataLayer. */
export function initAnalytics() {
  if (typeof window === "undefined") return;
  const id = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY"] as string | undefined;
  const w = window as typeof window & { dataLayer?: unknown[]; __xwcGa?: boolean };
  if (!id || w.__xwcGa) return;
  w.__xwcGa = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  function gtag(..._args: unknown[]) { w.dataLayer!.push(arguments); }
  gtag("js", new Date());
  gtag("config", id, { send_page_view: true });
}
