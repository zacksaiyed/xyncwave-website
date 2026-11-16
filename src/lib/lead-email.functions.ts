import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Server-side lead notification email, sent through Resend.
// Cloudflare env vars: RESEND_API_KEY (required), LEAD_EMAIL_FROM / LEAD_EMAIL_TO / LEAD_EMAIL_CC (optional).
const DEFAULT_FROM = "Xyncwave Website <noreply@mail.xyncwave.com>";
const DEFAULT_TO = ["aasiya@xyncwave.com"];
const DEFAULT_CC = ["arbaz@xyncwave.com", "zaid@xyncwave.com", "sanjay@xyncwave.com"];

const emailSchema = z.object({
  name: z.string().trim().min(1).max(100),
  workEmail: z.string().trim().email().max(255),
  company: z.string().trim().max(160),
  role: z.string().trim().max(120).optional(),
  leadType: z.string().trim().max(40),
  problem: z.string().trim().max(200),
  message: z.string().trim().max(3000).optional(),
  details: z.record(z.string(), z.string().max(500)).optional(),
  attribution: z.record(z.string(), z.string().max(500)).optional(),
});

const list = (value: string | undefined, fallback: string[]) =>
  value ? value.split(",").map((s) => s.trim()).filter(Boolean) : fallback;

const esc = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function table(title: string, data?: Record<string, string>) {
  const entries = Object.entries(data ?? {}).filter(([, v]) => v);
  if (!entries.length) return "";
  const body = entries
    .slice(0, 40)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join("");
  return `<h3 style="margin:20px 0 6px">${esc(title)}</h3><table>${body}</table>`;
}

export const sendLeadEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => emailSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) {
      console.error("[lead-email] RESEND_API_KEY is not set; skipping notification.");
      return { ok: false as const };
    }

    const row = (label: string, value: string | undefined) =>
      `<tr><td style="padding:4px 12px 4px 0;color:#666">${label}</td><td>${esc(value)}</td></tr>`;
    const html = `
      <div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
        <h2 style="margin:0 0 12px">New website enquiry (${esc(data.leadType)})</h2>
        <table>
          ${row("Name", data.name)}
          <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td><a href="mailto:${esc(data.workEmail)}">${esc(data.workEmail)}</a></td></tr>
          ${row("Company", data.company)}
          ${row("Role", data.role)}
          ${row("Challenge", data.problem)}
        </table>
        ${data.message ? `<h3 style="margin:20px 0 6px">Message</h3><p style="white-space:pre-wrap">${esc(data.message)}</p>` : ""}
        ${table("Details", data.details)}
        ${table("Attribution", data.attribution)}
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env["LEAD_EMAIL_FROM"] || DEFAULT_FROM,
        to: list(process.env["LEAD_EMAIL_TO"], DEFAULT_TO),
        cc: list(process.env["LEAD_EMAIL_CC"], DEFAULT_CC),
        reply_to: data.workEmail,
        subject: `New enquiry: ${data.name}${data.company ? ` — ${data.company}` : ""} (${data.leadType})`.replace(/[\r\n]+/g, " "),
        html,
      }),
    });
    if (!res.ok) {
      console.error("[lead-email] Resend rejected the email:", res.status, await res.text());
      return { ok: false as const };
    }
    return { ok: true as const };
  });
