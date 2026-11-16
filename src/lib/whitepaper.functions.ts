import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { getPaperByAssetId } from "./research";

const FREE_MAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "outlook.com", "hotmail.com", "hotmail.co.uk",
  "live.com", "msn.com", "icloud.com", "me.com", "mac.com", "aol.com", "proton.me", "protonmail.com",
  "gmx.com", "gmx.net", "mail.com", "zoho.com", "yandex.com", "rediffmail.com",
]);

const requestSchema = z.object({
  assetId: z.string().trim().min(1).max(80),
  fullName: z.string().trim().min(1, "Please enter your name.").max(100),
  businessEmail: z.string().trim().email("Please enter a valid business email.").max(255),
  phone: z.string().trim().max(40).optional(),
  marketingConsent: z.boolean().optional(),
  website: z.string().max(200).optional(), // honeypot — must stay empty
  attribution: z.record(z.string(), z.string().max(300)).optional(),
});

export type WhitepaperRequestResult =
  | { ok: true; downloadUrl?: string }
  | { ok: false; error: string };

export const requestWhitepaper = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => requestSchema.parse(input))
  .handler(async ({ data }): Promise<WhitepaperRequestResult> => {
    const paper = getPaperByAssetId(data.assetId);
    if (!paper) return { ok: false, error: "Unknown research report." };

    // Honeypot: silently accept bots without storing or sending.
    if (data.website) return { ok: true };

    const email = data.businessEmail.toLowerCase();
    const domain = email.split("@")[1] ?? "";
    if (FREE_MAIL_DOMAINS.has(domain)) {
      return { ok: false, error: "Please use your business email address." };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Rate limit: max 3 requests for the same email+asset per hour, 8 per email per day.
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recentSame } = await supabaseAdmin
      .from("whitepaper_requests")
      .select("id", { count: "exact", head: true })
      .eq("business_email", email)
      .eq("asset_id", paper.assetId)
      .gte("created_at", hourAgo);
    if ((recentSame ?? 0) >= 3) {
      return { ok: false, error: "This report was already requested recently. Please check your inbox, or try again later." };
    }
    const { count: recentAny } = await supabaseAdmin
      .from("whitepaper_requests")
      .select("id", { count: "exact", head: true })
      .eq("business_email", email)
      .gte("created_at", dayAgo);
    if ((recentAny ?? 0) >= 8) {
      return { ok: false, error: "We couldn't send your report right now. Please try again later." };
    }

    const attribution = { ...(data.attribution ?? {}) };
    delete attribution["email"];
    delete attribution["name"];
    delete attribution["phone"];

    const { data: row, error: insertError } = await supabaseAdmin
      .from("whitepaper_requests")
      .insert({
        asset_id: paper.assetId,
        full_name: data.fullName,
        business_email: email,
        phone: data.phone || null,
        marketing_consent: data.marketingConsent === true,
        attribution,
        status: "validated",
      })
      .select("id, download_token, full_name, business_email, phone, marketing_consent, attribution, created_at")
      .single();
    if (insertError || !row) {
      console.error("whitepaper_requests insert failed", insertError?.message);
      return { ok: false, error: "We couldn't send your report right now. Please try again." };
    }

    // Internal lead notification: after a successful insert, never blocks the visitor's request.
    try {
      const lead = await import("./email-templates/whitepaper-lead-notification.server");
      const results = await lead.notifyWhitepaperLead(supabaseAdmin, lead.toDetails(row, paper.title));
      for (const r of results) if (!r.sent) console.warn("whitepaper lead notification not sent", r.recipient, r.reason);
      await lead.retryFailedLeadNotifications(supabaseAdmin, (id) => getPaperByAssetId(id)?.title ?? id, row.id);
    } catch (error) {
      console.error("whitepaper lead notification error", error instanceof Error ? error.message : error);
    }

    const requestUrl = new URL(getRequest().url);
    const origin = requestUrl.origin;
    const downloadUrl = `${origin}/research-download?token=${row.download_token}`;
    const enquiryUrl = `${origin}${paper.afterCtaTo}`;
    const firstName = data.fullName.trim().split(/\s+/)[0] ?? "";

    const { sendWhitepaperEmail } = await import("./email-templates/send-whitepaper.server");
    const result = await sendWhitepaperEmail({
      to: email,
      firstName,
      paperTitle: paper.title,
      paperDescription: paper.emailDescription,
      downloadUrl,
      enquiryUrl,
      idempotencyKey: `whitepaper-${paper.assetId}-${row.id}`,
    });

    await supabaseAdmin
      .from("whitepaper_requests")
      .update({ status: result.sent ? "provider_accepted" : "direct_download" })
      .eq("id", row.id);

    if (!result.sent) {
      // Email delivery unavailable (e.g. sender domain not verified): give the requester a direct, time-limited link instead.
      console.warn("whitepaper email not sent, using direct download", result.reason);
      return { ok: true, downloadUrl };
    }
    return { ok: true };
  });
