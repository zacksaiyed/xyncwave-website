// Emails to the visitor (PDF delivery), sent through Resend from the verified mail.xyncwave.com domain. Server-only.
import { esc } from "./team-notify.server";

const FROM = "XWC Research <noreply@mail.xyncwave.com>";
const REPLY_TO = "aasiya@xyncwave.com";

async function sendVisitor(opts: { to: string; subject: string; html: string; text: string; idempotencyKey: string }): Promise<boolean> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.error("[visitor-mail] RESEND_API_KEY is not set; email not sent.");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": opts.idempotencyKey },
      body: JSON.stringify({
        from: process.env["VISITOR_EMAIL_FROM"] || FROM,
        to: [opts.to],
        reply_to: REPLY_TO,
        subject: opts.subject.replace(/[\r\n]+/g, " ").slice(0, 200),
        html: opts.html,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      console.error("[visitor-mail] Resend rejected the email:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[visitor-mail] Resend request failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

const shell = (preview: string, inner: string) => `<!doctype html><html lang="en"><body style="margin:0;background:#ffffff;font-family:Arial,sans-serif">
<span style="display:none;max-height:0;overflow:hidden">${esc(preview)}</span>
<div style="max-width:560px;padding:32px 28px;color:#242A35;font-size:15px;line-height:24px">${inner}
<p style="margin:24px 0 0">Best regards,<br>XWC / Xyncwave Corporation LLP<br><a href="https://xyncwave.com" style="color:#0A66FF">https://xyncwave.com</a></p>
<p style="color:#6B7280;font-size:13px;line-height:20px">You received this email because you requested this document on the Xyncwave website. Your details are handled according to our privacy policy.</p>
</div></body></html>`;

const button = (href: string, label: string) =>
  `<p><a href="${esc(href)}" style="display:inline-block;background:#0A66FF;color:#ffffff;font-size:15px;font-weight:600;padding:12px 22px;text-decoration:none">${esc(label)}</a></p>`;

export function sendWhitepaperEmail(input: { to: string; firstName: string; paperTitle: string; paperDescription: string; downloadUrl: string; enquiryUrl: string; idempotencyKey: string }) {
  const html = shell(
    "Your requested XWC research report is ready",
    `<h2 style="margin:0 0 12px;color:#0B0D12;font-size:22px;line-height:30px">Your XWC research report</h2>
<p>Hi ${esc(input.firstName || "there")},</p>
<p>Thank you for requesting our research, <strong>${esc(input.paperTitle)}</strong>.</p>
<p>Your full report is ready as a PDF. It examines ${esc(input.paperDescription)} and includes practical decision frameworks for evaluating the challenge.</p>
${button(input.downloadUrl, "Download the full report (PDF)")}
<p style="color:#6B7280;font-size:13px;line-height:20px">This secure download link is personal to you and expires after 72 hours. If it expires, simply request the report again from the same page.</p>
<p>If your team is currently reviewing a related initiative, you can share the situation with XWC here: <a href="${esc(input.enquiryUrl)}" style="color:#0A66FF">start a conversation</a>.</p>`,
  );
  const text = [
    `Hi ${input.firstName || "there"},`,
    "",
    `Thank you for requesting our research, ${input.paperTitle}.`,
    `Your full report is ready as a PDF: ${input.downloadUrl}`,
    "This secure link is personal to you and expires after 72 hours.",
    "",
    `If your team is reviewing a related initiative, you can start a conversation here: ${input.enquiryUrl}`,
    "",
    "Best regards,",
    "XWC / Xyncwave Corporation LLP",
    "https://xyncwave.com",
  ].join("\n");
  return sendVisitor({ to: input.to, subject: `Your XWC research report: ${input.paperTitle}`, html, text, idempotencyKey: input.idempotencyKey });
}

export function sendRateCardEmail(input: { to: string; downloadUrl: string; enquiryUrl: string; idempotencyKey: string }) {
  const html = shell(
    "Your Xyncwave engineering rate card",
    `<h2 style="margin:0 0 12px;color:#0B0D12;font-size:22px;line-height:30px">Your Engineering Resource Rate Card</h2>
<p>Hi there,</p>
<p>Thank you for your interest. Your copy of Xyncwave's Engineering Resource Rate Card, with indicative monthly pricing for Junior, Mid-Level and Senior developers, is ready as a PDF.</p>
${button(input.downloadUrl, "Download the rate card (PDF)")}
<p style="color:#6B7280;font-size:13px;line-height:20px">This secure download link is personal to you and expires after 72 hours. If it expires, simply request the rate card again from our website.</p>
<p>If you are planning engineering capacity, you can share your requirements with us here: <a href="${esc(input.enquiryUrl)}" style="color:#0A66FF">start a conversation</a>.</p>`,
  );
  const text = [
    "Hi there,",
    "",
    "Thank you for your interest. Your copy of Xyncwave's Engineering Resource Rate Card is ready as a PDF:",
    input.downloadUrl,
    "This secure link is personal to you and expires after 72 hours.",
    "",
    `Planning engineering capacity? Start a conversation: ${input.enquiryUrl}`,
    "",
    "Best regards,",
    "XWC / Xyncwave Corporation LLP",
    "https://xyncwave.com",
  ].join("\n");
  return sendVisitor({ to: input.to, subject: "Your Xyncwave Engineering Resource Rate Card", html, text, idempotencyKey: input.idempotencyKey });
}
