import { sendLovableEmail } from "@lovable.dev/email-js";

// Internal operational notice to XWC staff; independent of the visitor's marketing consent.
export const LEAD_NOTIFICATION_RECIPIENTS = ["aasiya@xyncwave.com", "arbaz@xyncwave.com"] as const;
const SENDER_DOMAIN = process.env["EMAIL_SENDER_DOMAIN"] ?? "notify.xyncwave.com";
const MAX_ATTEMPTS = 5;

export interface LeadDetails {
  requestId: string;
  fullName: string;
  businessEmail: string;
  phone: string | null;
  paperTitle: string;
  createdAt: string;
  sourcePage: string;
  utmSource: string | null;
  marketingConsent: boolean;
}

export function buildLeadEmail(d: LeadDetails) {
  const when = new Date(d.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) + " IST";
  const rows: [string, string][] = [
    ["Name", d.fullName], ["Business Email", d.businessEmail], ["Phone", d.phone || "Not provided"],
    ["White Paper Requested", d.paperTitle], ["Date & Time", when], ["Source Page", d.sourcePage],
    ["Campaign Source", d.utmSource || "Not available"], ["Marketing Consent", d.marketingConsent ? "Yes" : "No"],
  ];
  const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  return {
    subject: `New XWC White Paper Lead — ${d.paperTitle}`,
    text: ["New white-paper lead received.", "", ...rows.map(([k, v]) => `- ${k}: ${v}`)].join("\n"),
    html: `<div style="font-family:Arial,sans-serif;color:#0B0D12;background:#ffffff;padding:20px"><p>New white-paper lead received.</p><ul>${rows.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join("")}</ul></div>`,
  };
}

type Admin = typeof import("@/integrations/supabase/client.server")["supabaseAdmin"];

async function sendOne(admin: Admin, d: LeadDetails, recipient: string) {
  // Claim the row; the unique (request_id, recipient) constraint prevents duplicates.
  const { data: existing } = await admin.from("whitepaper_lead_notifications").select("id,status,attempts").eq("request_id", d.requestId).eq("recipient", recipient).maybeSingle();
  if (existing?.status === "sent") return { recipient, sent: true, duplicate: true };
  if (existing && existing.attempts >= MAX_ATTEMPTS) return { recipient, sent: false, reason: "max_attempts" };
  let rowId = existing?.id;
  let attempts = existing?.attempts ?? 0;
  if (!rowId) {
    const { data: ins, error } = await admin.from("whitepaper_lead_notifications").insert({ request_id: d.requestId, recipient }).select("id").single();
    if (error || !ins) return { recipient, sent: false, reason: "claim_failed" };
    rowId = ins.id;
  }
  attempts += 1;
  const apiKey = process.env["LOVABLE_API_KEY"];
  let reason: string | null = null;
  if (!apiKey) reason = "email_not_configured";
  else {
    const { subject, html, text } = buildLeadEmail(d);
    const key = `wp-lead-${d.requestId}-${recipient}`;
    try {
      await sendLovableEmail({ to: recipient, from: { name: "XWC Website Leads", address: `noreply@${SENDER_DOMAIN}` }, sender_domain: SENDER_DOMAIN, subject, html, text, purpose: "transactional", idempotency_key: key }, { apiKey, idempotencyKey: key });
    } catch (e) {
      reason = e instanceof Error && "code" in e ? String((e as { code?: string }).code) : "send_failed";
    }
  }
  await admin.from("whitepaper_lead_notifications").update(reason ? { status: "failed", attempts, last_error: reason, updated_at: new Date().toISOString() } : { status: "sent", attempts, last_error: null, sent_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", rowId);
  return reason ? { recipient, sent: false, reason } : { recipient, sent: true };
}

/** Notifies every recipient separately; never throws. */
export async function notifyWhitepaperLead(admin: Admin, d: LeadDetails) {
  const results = await Promise.allSettled(LEAD_NOTIFICATION_RECIPIENTS.map(r => sendOne(admin, d, r)));
  return results.map((r, i) => r.status === "fulfilled" ? r.value : { recipient: LEAD_NOTIFICATION_RECIPIENTS[i], sent: false, reason: "error" });
}

/** Retries earlier failed notifications (called opportunistically on each new request). */
export async function retryFailedLeadNotifications(admin: Admin, titleFor: (assetId: string) => string, excludeRequestId?: string, limit = 10) {
  const { data } = await admin.from("whitepaper_lead_notifications").select("request_id,recipient,attempts").eq("status", "failed").lt("attempts", MAX_ATTEMPTS).neq("request_id", excludeRequestId ?? "00000000-0000-0000-0000-000000000000").order("updated_at").limit(limit);
  for (const n of data ?? []) {
    const { data: r } = await admin.from("whitepaper_requests").select("id,asset_id,full_name,business_email,phone,marketing_consent,attribution,created_at").eq("id", n.request_id).maybeSingle();
    if (!r) continue;
    await sendOne(admin, toDetails(r, titleFor(r.asset_id)), n.recipient).catch(() => null);
  }
}

export function toDetails(r: { id: string; full_name: string; business_email: string; phone: string | null; marketing_consent: boolean; attribution: unknown; created_at: string }, paperTitle: string): LeadDetails {
  const a = (r.attribution ?? {}) as Record<string, string>;
  const page = a["page"] ? `https://xyncwave.com${a["page"]}` : "Not available";
  return { requestId: r.id, fullName: r.full_name, businessEmail: r.business_email, phone: r.phone, paperTitle, createdAt: r.created_at, sourcePage: page, utmSource: a["utm_source"] ?? null, marketingConsent: r.marketing_consent };
}
