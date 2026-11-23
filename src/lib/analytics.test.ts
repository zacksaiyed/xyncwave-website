import { test } from "node:test";
import assert from "node:assert/strict";

type Call = unknown[];
function setup(hostname: string) {
  const scripts: { src?: string }[] = [];
  const timers: (() => void)[] = [];
  const g = globalThis as Record<string, unknown>;
  g["CustomEvent"] = class { type: string; detail: unknown; constructor(type: string, init?: { detail?: unknown }) { this.type = type; this.detail = init?.detail; } };
  g["window"] = {
    location: { hostname, href: `https://${hostname}/a?x=1`, pathname: "/a", search: "?x=1" },
    dispatchEvent: () => true,
    setTimeout: (fn: () => void) => { timers.push(fn); return 0; },
  };
  g["document"] = { title: "Page A", createElement: () => ({}) as { src?: string }, head: { appendChild: (s: { src?: string }) => scripts.push(s) } };
  return { scripts, flush: () => timers.splice(0).forEach((fn) => fn()), win: g["window"] as { dataLayer?: Call[]; gtag?: (...a: unknown[]) => void } };
}
const events = (dl: Call[] | undefined) => (dl ?? []).map((a) => Array.from(a as ArrayLike<unknown>)).filter((a) => a[0] === "event");

test("production host loads GA4 once and sends real events through gtag", async () => {
  const { scripts, flush, win } = setup("xyncwave.com");
  const a = await import("./analytics");
  a.initAnalytics();
  a.initAnalytics();
  assert.equal(scripts.length, 1);
  assert.match(scripts[0]!.src!, /googletagmanager\.com\/gtag\/js\?id=G-HPVJCS6BYR/);
  const config = (win.dataLayer ?? []).map((x) => Array.from(x as ArrayLike<unknown>)).find((x) => x[0] === "config");
  assert.deepEqual(config, ["config", "G-HPVJCS6BYR", { send_page_view: false }]);

  a.trackPageView();
  flush();
  a.track("lead_form_submit", { cta_position: "assessment" });
  a.track("page_view", { page: "/erpnext" });
  const sent = events(win.dataLayer);
  assert.deepEqual(sent[0]!.slice(0, 2), ["event", "page_view"]);
  assert.equal((sent[0]![2] as Record<string, unknown>)["page_path"], "/a?x=1");
  assert.deepEqual(sent.slice(1).map((e) => e[1]), ["lead_form_submit", "generate_lead", "content_page_view"]);
});

test("non-production hosts are not tracked", async () => {
  const { scripts, flush, win } = setup("preview-abc.lovable.app");
  const a = await import("./analytics");
  (globalThis as Record<string, unknown>)["window"] = win;
  delete (win as { __xwcGa?: boolean }).__xwcGa;
  a.initAnalytics();
  a.trackPageView();
  flush();
  assert.equal(scripts.length, 0);
  assert.equal(win.gtag, undefined);
});
