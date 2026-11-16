import { test } from "node:test";
import assert from "node:assert/strict";
import { DAY, DESKTOP_QUERY, EXIT_ROUTES, touchPromptEligible, exitEligible, isBusinessEmail, rateCardSchema, RATE_CARD_CTAS } from "./rate-card";
const now = 100 * DAY;
const base = { path: EXIT_ROUTES[0] ?? "", desktop: true, seconds: 20, scroll: 0, sessionShown: false, dismissedAt: 0, requestedAt: 0, now };
test("exit popup is restricted to three commercial pages and the seven rate-card Insights", () => {
  assert.deepEqual(EXIT_ROUTES, ["/solutions/engineering-capacity", "/industries/technology-it-services", "/case-studies/engineering-capacity", ...Object.keys(RATE_CARD_CTAS).map(slug => `/insights/${slug}`)]);
  assert.equal(EXIT_ROUTES.length, 10);
  for (const path of EXIT_ROUTES) assert.equal(exitEligible({ ...base, path }), true);
  for (const path of ["/", "/solutions/erpnext-implementation", "/products/tripops", "/case-studies/track-trace", "/insights", "/insights/erpnext-implementation-guide"]) assert.equal(exitEligible({ ...base, path }), false);
});
test("20 seconds or 40 percent engagement is required", () => {
  assert.equal(exitEligible({ ...base, seconds: 19, scroll: .39 }), false);
  assert.equal(exitEligible({ ...base, seconds: 20 }), true);
  assert.equal(exitEligible({ ...base, seconds: 0, scroll: .4 }), true);
});
test("mobile exit intent is disabled", () => assert.equal(exitEligible({ ...base, desktop: false }), false));
test("one popup per session", () => assert.equal(exitEligible({ ...base, sessionShown: true }), false));
test("dismissal cooldown is 14 days", () => {
  assert.equal(exitEligible({ ...base, dismissedAt: now - 14 * DAY + 1 }), false);
  assert.equal(exitEligible({ ...base, dismissedAt: now - 14 * DAY }), true);
});
test("successful request suppresses exit popup for 30 days", () => {
  assert.equal(exitEligible({ ...base, requestedAt: now - 30 * DAY + 1 }), false);
  assert.equal(exitEligible({ ...base, requestedAt: now - 30 * DAY }), true);
});
test("business email required; personal and disposable emails rejected", () => {
  for (const value of ["", "bad", "person@gmail.com", "person@MAILINATOR.COM", "person@sub.yopmail.com"]) assert.equal(isBusinessEmail(value), false);
  assert.equal(isBusinessEmail("person@xyncwave.com"), true);
});
test("phone optional, international number accepted; attribution whitelist excludes PII", () => {
  const input = { businessEmail: "person@xyncwave.com", sourcePage: "https://xyncwave.com/solutions/engineering-capacity", placement: "popup", requestId: "00000000-0000-4000-8000-000000000001", attribution: { utm_source: "search", email: "private" } };
  assert.equal(rateCardSchema.safeParse(input).success, true);
  assert.equal(rateCardSchema.safeParse({ ...input, phone: "+91 12345 67890" }).success, true);
  assert.deepEqual(rateCardSchema.parse(input).attribution, { utm_source: "search" });
});
test("inline CTA registry includes the seven approved Insights", () => assert.deepEqual(Object.keys(RATE_CARD_CTAS), ["staff-augmentation-vs-dedicated-team-vs-outsourcing", "white-label-software-development", "reduce-engineering-backlog", "it-consulting-delivery-margin-capacity-scope-handoffs", "fintech-what-to-outsource", "evaluate-software-engineering-partner", "fintech-scale-engineering-after-funding"]));
for (const [slug, section] of [
  ["it-consulting-delivery-margin-capacity-scope-handoffs", "partner-model"],
  ["fintech-what-to-outsource", "extend"],
  ["evaluate-software-engineering-partner", "scorecard"],
  ["fintech-scale-engineering-after-funding", "external-capacity"],
]) {
  test(`requested article ${slug} uses its contextual placement`, () => assert.equal(RATE_CARD_CTAS[slug ?? ""]?.after, section));
}test("exit popup screen threshold is 768px with a mouse", () => assert.match(DESKTOP_QUERY, /min-width: 768px/));
test("touch slide-in appears only after 60 percent scroll", () => {
  const t = { path: "/insights/fintech-what-to-outsource", scroll: .59, sessionShown: false, dismissedAt: 0, requestedAt: 0, now: Date.now() };
  assert.equal(touchPromptEligible(t), false);
  assert.equal(touchPromptEligible({ ...t, scroll: .6 }), true);
  assert.equal(touchPromptEligible({ ...t, scroll: .9, dismissedAt: Date.now() - DAY }), false);
  assert.equal(touchPromptEligible({ ...t, scroll: .9, path: "/insights" }), false);
});
