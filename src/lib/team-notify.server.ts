// Shared internal notification email (Resend). Server-only.
// Cloudflare runtime vars: RESEND_API_KEY (required), LEAD_EMAIL_FROM / LEAD_EMAIL_TO / LEAD_EMAIL_CC (optional).
const DEFAULT_FROM = "Xyncwave Website <noreply@mail.xyncwave.com>";
const DEFAULT_TO = ["aasiya@xyncwave.com"];
const DEFAULT_CC = ["arbaz@xyncwave.com", "zaid@xyncwave.com", "sanjay@xyncwave.com"];

const list = (value: string | undefined, fallback: string[]) =>
  value ? value.split(",").map((s) => s.trim()).filter(Boolean) : fallback;

export const esc = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Heading + two-column table. Empty values are skipped; returns "" when nothing to show. */
export function detailsTable(title: string, data?: Record<string, string | undefined | null>) {
  const entries = Object.entries(data ?? {}).filter(([, v]) => v);
  if (!entries.length) return "";
  const body = entries
    .slice(0, 40)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join("");
  return `<h3 style="margin:20px 0 6px">${esc(title)}</h3><table>${body}</table>`;
}

export function wrapHtml(heading: string, inner: string) {
  return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111"><h2 style="margin:0 0 12px">${esc(heading)}</h2>${inner}</div>`;
}

/** Sends the team notification. Never throws; returns whether Resend accepted it. */
export async function sendTeamNotification(opts: { subject: string; html: string; replyTo?: string }): Promise<boolean> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.error("[team-notify] RESEND_API_KEY is not set; skipping notification.");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env["LEAD_EMAIL_FROM"] || DEFAULT_FROM,
        to: list(process.env["LEAD_EMAIL_TO"], DEFAULT_TO),
        cc: list(process.env["LEAD_EMAIL_CC"], DEFAULT_CC),
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
        subject: opts.subject.replace(/[\r\n]+/g, " ").slice(0, 200),
        html: opts.html,
      }),
    });
    if (!res.ok) {
      console.error("[team-notify] Resend rejected the email:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[team-notify] Resend request failed:", error instanceof Error ? error.message : error);
    return false;
  }
}
