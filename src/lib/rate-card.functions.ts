import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { rateCardSchema, RATE_CARD_FILENAME } from "./rate-card";

export type RateCardResult = { ok: true } | { ok: false; error: string };

const UNAVAILABLE =
  "The rate card is not available by email yet. We've noted your request and our team will send it to you shortly, or you can contact Xyncwave to discuss your engineering requirements.";

// Best-effort per-instance limiter: 3 requests per email per hour, and one notification per request id.
const recent = new Map<string, number[]>();
const seen = new Set<string>();
function limited(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  if (hits.length >= 3) return true;
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear();
  return false;
}

export const requestRateCard = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => rateCardSchema.parse(input))
  .handler(async ({ data }): Promise<RateCardResult> => {
    // Honeypot: bots get a success response without anything being sent.
    if (data.website) return { ok: true };

    const email = data.businessEmail.toLowerCase();
    if (limited(email)) return { ok: false, error: "This rate card was already requested recently. Please check your inbox, or try again later." };

    // 1. Team notification (Resend), once per request id, independent of delivery.
    if (!seen.has(data.requestId)) {
      seen.add(data.requestId);
      if (seen.size > 5000) seen.clear();
      try {
        const { sendTeamNotification, detailsTable, wrapHtml } = await import("./team-notify.server");
        await sendTeamNotification({
          subject: `New rate card request: ${email}`,
          replyTo: email,
          html: wrapHtml(
            "New engineering rate card request",
            detailsTable("Request", {
              "Business email": email,
              Phone: data.phone,
              Placement: data.placement,
              "Source page": data.sourcePage,
            }) + detailsTable("Attribution", data.attribution),
          ),
        });
      } catch (error) {
        console.error("rate card team notification error", error instanceof Error ? error.message : error);
      }
    }

    // 2. Deliver the rate card: signed 72-hour link, emailed to the visitor. Fails honestly until the PDF is deployed.
    const origin = new URL(getRequest().url).origin;
    const { pdfIsAvailable, signDownloadToken } = await import("./download-token.server");
    if (!(await pdfIsAvailable(origin, RATE_CARD_FILENAME))) {
      console.error("rate card PDF is not deployed at /downloads/", RATE_CARD_FILENAME);
      return { ok: false, error: UNAVAILABLE };
    }
    const token = await signDownloadToken("ratecard", "rate-card");
    if (!token) return { ok: false, error: UNAVAILABLE };

    const { sendRateCardEmail } = await import("./visitor-mail.server");
    const sent = await sendRateCardEmail({
      to: email,
      downloadUrl: `${origin}/research-download?token=${token}`,
      enquiryUrl: `${origin}/contact`,
      idempotencyKey: `ratecard-${data.requestId}`,
    });
    return sent ? { ok: true } : { ok: false, error: "We couldn't email the rate card right now. Our team has your request and will send it to you shortly." };
  });
