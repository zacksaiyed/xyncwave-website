import { render } from "@react-email/render";
import { sendLovableEmail } from "@lovable.dev/email-js";
import { createElement } from "react";
import { WhitepaperDeliveryEmail } from "./whitepaper-delivery";

const SITE_NAME = "XWC / Xyncwave Corporation LLP";
// The verified sender FQDN reported by email domain setup (e.g. notify.xyncwave.com).
// Until the domain is verified, sends fail with a domain error and the caller handles it honestly.
const SENDER_DOMAIN = process.env["EMAIL_SENDER_DOMAIN"] ?? "notify.xyncwave.com";
const FROM_ADDRESS = `noreply@${SENDER_DOMAIN}`;

export interface SendWhitepaperEmailInput {
  to: string;
  firstName: string;
  paperTitle: string;
  paperDescription: string;
  downloadUrl: string;
  enquiryUrl: string;
  idempotencyKey: string;
}

export async function sendWhitepaperEmail(input: SendWhitepaperEmailInput): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return { sent: false, reason: "email_not_configured" };
  const html = await render(createElement(WhitepaperDeliveryEmail, input));
  const text = [
    `Hi ${input.firstName},`,
    "",
    `Thank you for requesting our research, ${input.paperTitle}.`,
    `Your full report is ready as a PDF: ${input.downloadUrl}`,
    "This secure link is personal to you and expires after 72 hours.",
    "",
    `If your team is reviewing a related initiative, you can start a conversation here: ${input.enquiryUrl}`,
    "",
    "Best regards,",
    `${SITE_NAME}`,
    "https://xyncwave.com",
  ].join("\n");
  try {
    await sendLovableEmail(
      {
        to: input.to,
        from: { name: "XWC Research", address: FROM_ADDRESS },
        sender_domain: SENDER_DOMAIN,
        subject: `Your XWC research report: ${input.paperTitle}`,
        html,
        text,
        purpose: "transactional",
        idempotency_key: input.idempotencyKey,
      },
      { apiKey, idempotencyKey: input.idempotencyKey },
    );
    return { sent: true };
  } catch (error) {
    const code = error instanceof Error && "code" in error ? String((error as { code?: string }).code) : "send_failed";
    return { sent: false, reason: code };
  }
}
