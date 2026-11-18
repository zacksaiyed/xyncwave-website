// Cloudflare cron keep-alive for the free Supabase plan.
// Free Supabase projects pause after a week without activity, which would make the enquiry form fail.
// A scheduled run (see "triggers" in wrangler.jsonc) reads one row so the project always counts as active.
// Public values only: the project URL and the publishable key are safe to ship.
const FALLBACK_URL = "https://ndxpmohzafhcwhzcrfsq.supabase.co";
const FALLBACK_KEY = "sb_publishable_aMtCG4si36LzaVNQTW77ew_vwX5GEsH";

type KeepaliveApp = {
  hooks: { hook: (name: "cloudflare:scheduled", handler: (event: { context: { waitUntil: (p: Promise<unknown>) => void } }) => void) => void };
};

export default (nitroApp: KeepaliveApp) => {
  nitroApp.hooks.hook("cloudflare:scheduled", ({ context }) => {
    const url = process.env["SUPABASE_URL"] || FALLBACK_URL;
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || FALLBACK_KEY;
    context.waitUntil(
      fetch(`${url}/rest/v1/keepalive?select=id&limit=1`, { headers: { apikey: key } })
        .then((res) => {
          if (!res.ok) console.error("[keepalive] Supabase ping failed:", res.status);
        })
        .catch((error) => console.error("[keepalive] Supabase ping error:", error instanceof Error ? error.message : error)),
    );
  });
};
