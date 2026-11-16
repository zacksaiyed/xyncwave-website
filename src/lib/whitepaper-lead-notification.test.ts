import { test } from "node:test";
import assert from "node:assert/strict";
import { buildLeadEmail, notifyWhitepaperLead, LEAD_NOTIFICATION_RECIPIENTS } from "./email-templates/whitepaper-lead-notification.server";

const d = { requestId: "r1", fullName: "Jane Doe", businessEmail: "jane@acme.com", phone: null, paperTitle: "Paper X", createdAt: "2026-11-12T06:30:00Z", sourcePage: "https://xyncwave.com/research/x", utmSource: null, marketingConsent: false };

test("notifies both Xyncwave addresses", () => {
  assert.deepEqual([...LEAD_NOTIFICATION_RECIPIENTS], ["aasiya@xyncwave.com", "arbaz@xyncwave.com"]);
});
test("subject and body follow the requested format", () => {
  const e = buildLeadEmail(d);
  assert.equal(e.subject, "New XWC White Paper Lead — Paper X");
  assert.ok(e.text.includes("- Phone: Not provided"));
  assert.ok(e.text.includes("- Marketing Consent: No"));
});
test("already-sent notifications are not sent again", async () => {
  const chain: any = { select: () => chain, eq: () => chain, maybeSingle: async () => ({ data: { id: "n1", status: "sent", attempts: 1 } }), insert: () => { throw new Error("should not insert"); } };
  const admin: any = { from: () => chain };
  const res = await notifyWhitepaperLead(admin, d);
  assert.ok(res.every((r: any) => r.duplicate === true));
});
