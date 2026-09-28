export type AnalyticsEvent = "page_view" | "industry_page_view" | "cta_click" | "hero_cta_click" | "solution_select" | "industry_select" | "challenge_selected" | "pain_card_click" | "case_study_click" | "trigger_section_view" | "lead_form_view" | "lead_form_start" | "lead_form_field_complete" | "lead_form_abandon" | "lead_form_submit" | "thank_you_view" | "form_start" | "form_step" | "form_error" | "form_submit" | "assessment_start" | "assessment_step" | "assessment_complete" | "case_study_view" | "case_study_cta" | "article_view" | "toc_click" | "internal_link_click" | "diagram_interaction" | "video_play" | "lead_magnet_download" | "scheduler_click" | "outbound_click" | "lead_generated";

export function track(event: AnalyticsEvent, properties: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("xyncwave:analytics", { detail: { event, ...properties } }));
  const analyticsWindow = window as typeof window & { dataLayer?: Record<string, unknown>[] };
  analyticsWindow.dataLayer?.push({ event, ...properties });
}