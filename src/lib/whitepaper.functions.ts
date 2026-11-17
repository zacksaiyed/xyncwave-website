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

// Best-effort per-instance limiter (3 requests per email+report per hour). A database, when configured, adds a stronger limit.
const recent = new Map<string, number[]>();
function limited(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  if (hits.length >= 3) return true;
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear();
  return false;
}

/** Optional Supabase admin client (service-role). Returns null when it is not configured, so the flow never depends on it. */
async function getAdmin() {
  if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_SERVICE_ROLE_KEY"]) return null;
  try {
    return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
  } catch (error) {
    console.error("supabase admin unavailable", error instanceof Error ? error.message : error);
    return null;
  }
}

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
    if (limited(`${email}|${paper.assetId}`)) {
      return { ok: false, error: "This report was already requested recently. Please check your inbox, or try again later." };
    }

    // 1. Team notification (Resend). First and independent of everything else, so no white-paper lead is ever lost.
    try {
      const { sendTeamNotification, detailsTable, wrapHtml } = await import("./team-notify.server");
      await sendTeamNotification({
        subject: `New white paper request: ${paper.title}`,
        replyTo: email,
        html: wrapHtml(
          "New white paper request",
          detailsTable("Request", {
            "White paper": paper.title,
            Name: data.fullName,
            "Business email": email,
            Phone: data.phone,
            "Marketing consent": data.marketingConsent === true ? "Yes" : "No",
          }) + detailsTable("Attribution", data.attribution),
        ),
      });
    } catch (error) {
      console.error("whitepaper team notification error", error instanceof Error ? error.message : error);
    }

    // 2. Optional record in Supabase (only when the service-role key is configured). Never blocks the visitor.
    let recordId: string | null = null;
    try {
      const admin = await getAdmin();
      if (admin) {
        const attribution = { ...(data.attribution ?? {}) };
        delete attribution["email"];
        delete attribution["name"];
        delete attribution["phone"];
        const { data: row } = await admin
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
          .select("id")
          .single();
        recordId = row?.id ?? null;
      }
    } catch (error) {
      console.error("whitepaper_requests record failed", error instanceof Error ? error.message : error);
    }

    // 3. Deliver the report: signed 72-hour link, emailed to the visitor.
    const origin = new URL(getRequest().url).origin;
    const { pdfIsAvailable, signDownloadToken } = await import("./download-token.server");
    if (!(await pdfIsAvailable(origin, paper.pdfFilename))) {
      console.error("whitepaper PDF is not deployed at /downloads/", paper.pdfFilename);
      return { ok: false, error: "This report is being finalised. We've noted your request and our team will email it to you shortly." };
    }
    const token = await signDownloadToken("paper", paper.assetId);
    if (!token) return { ok: false, error: "We couldn't prepare your report right now. Please try again later." };
    const downloadUrl = `${origin}/research-download?token=${token}`;

    const { sendWhitepaperEmail } = await import("./visitor-mail.server");
    const sent = await sendWhitepaperEmail({
      to: email,
      firstName: data.fullName.trim().split(/\s+/)[0] ?? "",
      paperTitle: paper.title,
      paperDescription: paper.emailDescription,
      downloadUrl,
      enquiryUrl: `${origin}${paper.afterCtaTo}`,
      idempotencyKey: `whitepaper-${paper.assetId}-${recordId ?? `${email}-${Math.floor(Date.now() / 3_600_000)}`}`,
    });

    if (recordId) {
      try {
        const admin = await getAdmin();
        await admin?.from("whitepaper_requests").update({ status: sent ? "provider_accepted" : "direct_download" }).eq("id", recordId);
      } catch { /* record keeping is best-effort */ }
    }

    // If the email could not be sent, hand the visitor the same time-limited link directly.
    return sent ? { ok: true } : { ok: true, downloadUrl };
  });
