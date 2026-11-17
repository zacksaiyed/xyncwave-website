import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Server-side lead notification email, sent through Resend (see team-notify.server.ts).
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

export const sendLeadEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => emailSchema.parse(input))
  .handler(async ({ data }) => {
    const { sendTeamNotification, detailsTable, wrapHtml, esc } = await import("./team-notify.server");
    const html = wrapHtml(
      `New website enquiry (${data.leadType})`,
      `${detailsTable("Contact", { Name: data.name, Email: data.workEmail, Company: data.company, Role: data.role, Challenge: data.problem })}
       ${data.message ? `<h3 style="margin:20px 0 6px">Message</h3><p style="white-space:pre-wrap">${esc(data.message)}</p>` : ""}
       ${detailsTable("Details", data.details)}
       ${detailsTable("Attribution", data.attribution)}`,
    );
    const ok = await sendTeamNotification({
      subject: `New enquiry: ${data.name}${data.company ? ` — ${data.company}` : ""} (${data.leadType})`,
      html,
      replyTo: data.workEmail,
    });
    return { ok };
  });
