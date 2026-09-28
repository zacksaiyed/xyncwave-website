import type { Json } from "../integrations/supabase/types";
import { supabase } from "../integrations/supabase/client";
import { z } from "zod";

export type LeadType = "general" | "digitalization" | "engineering" | "ai" | "partnership";

export type LeadPayload = {
  name: string;
  workEmail: string;
  company: string;
  role?: string;
  leadType: LeadType;
  problem: string;
  message?: string;
  details?: Record<string, string>;
  attributionContext?: Record<string, string>;
};

const leadSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Name must be 100 characters or fewer."),
  workEmail: z.string().trim().email("Please enter a valid work email.").max(255),
  company: z.string().trim().min(1, "Please enter your company.").max(160),
  role: z.string().trim().max(120).optional(),
  leadType: z.enum(["general", "digitalization", "engineering", "ai", "partnership"]),
  problem: z.string().trim().min(1, "Please select the challenge you want to improve.").max(200),
  message: z.string().trim().max(3000).optional(),
  details: z.record(z.string(), z.string().max(500)).optional(),
  attributionContext: z.record(z.string(), z.string().max(500)).optional(),
});

function attribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const query = new URLSearchParams(window.location.search);
  let landing = window.location.pathname;
  try {
    const stored = window.sessionStorage.getItem("xw_landing_page");
    if (stored) landing = stored;
    else window.sessionStorage.setItem("xw_landing_page", landing);
  } catch { /* storage unavailable */ }
  const values: Record<string, string> = {
    landing_page: landing,
    current_page: window.location.pathname,
    referring_page: document.referrer,
  };
  const campaign: Record<string, string> = {};
  try {
    const stored = window.sessionStorage.getItem("xw_campaign_attribution");
    if (stored) Object.assign(campaign, JSON.parse(stored) as Record<string, string>);
  } catch { /* storage unavailable */ }
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = query.get(key);
    if (value) campaign[key] = value;
  }
  Object.assign(values, campaign);
  try { window.sessionStorage.setItem("xw_campaign_attribution", JSON.stringify(campaign)); } catch { /* storage unavailable */ }
  return values;
}


export async function submitLead(payload: LeadPayload) {
  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Please check the form and try again.");
  const valid = parsed.data;
  const qualification = valid.problem === "not-sure" ? "early_intent" : valid.message ? "high_intent" : "medium_intent";
  const { error } = await supabase.from("lead_submissions").insert({
    name: valid.name,
    work_email: valid.workEmail.toLowerCase(),
    company: valid.company,
    role: valid.role || null,
    lead_type: valid.leadType,
    problem: valid.problem,
    message: valid.message || null,
    details: (valid.details ?? {}) as Json,
    attribution: { ...attribution(), ...(valid.attributionContext ?? {}) } as Json,
    qualification,
  });
  if (error) throw new Error("We couldn't send your message. Please try again.");
}

export interface CrmAdapter {
  sync(payload: LeadPayload): Promise<void>;
}

export const crmAdapter: CrmAdapter = {
  async sync() { return Promise.resolve(); },
};