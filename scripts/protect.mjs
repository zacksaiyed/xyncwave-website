// Protects the parts of the site that Lovable re-imports must never change.
// Runs before every build (Cloudflare build command and `npm run build`).
//  1. Brand assets (favicons, app icons, manifest) are copied from brand-lock/public over public/, so a Lovable
//     import that brings back its own favicon.ico cannot reach production.
//  2. Critical code is checked. If a Lovable import removed it, the build FAILS, so Cloudflare keeps serving the
//     previous good deployment instead of shipping a regression. Fix by restoring the code, then push again.
import { cpSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => (existsSync(join(root, file)) ? readFileSync(join(root, file), "utf8") : "");

// 1. Brand assets
const lockDir = join(root, "brand-lock", "public");
let copied = 0;
for (const name of readdirSync(lockDir)) {
  cpSync(join(lockDir, name), join(root, "public", name), { force: true });
  copied += 1;
}
console.log(`[protect] restored ${copied} brand asset(s) into public/`);

// 2. Critical code
const checks = [
  ["src/lib/leads.ts", "sendLeadEmail", "form submissions must email the team (lost when leads.ts is overwritten)"],
  ["src/lib/analytics.ts", "G-HPVJCS6BYR", "Google Analytics measurement ID"],
  ["src/lib/analytics.ts", "trackPageView", "GA4 page_view tracking"],
  ["src/routes/__root.tsx", "trackPageView", "GA4 page_view tracking wired into the root route"],
  ["src/routes/__root.tsx", "favicon-48x48.png", "XWC favicon links in the page head"],
  ["src/routes/__root.tsx", "apple-touch-icon", "XWC app icon link in the page head"],
  ["src/components/site-shell.tsx", 'to="/search"', "Search button in the site header"],
  ["src/routes/insights.index.tsx", "insight-keyword", "Insights search and topic filter"],
  ["src/routes/index.tsx", "siteIdentityGraph", "site name (WebSite) structured data on the homepage"],
  [".env", "ndxpmohzafhcwhzcrfsq", "site must use its own Supabase project, not the old Lovable Cloud one"],
  ["wrangler.jsonc", "keep_vars", "keeps Cloudflare variables (RESEND_API_KEY) across deploys"],
  ["vite.config.ts", "nitro-keepalive", "Supabase keep-alive plugin"],
];
const failures = checks.filter(([file, needle]) => !read(file).includes(needle));
if (failures.length) {
  console.error("\n[protect] BUILD STOPPED. A recent import removed protected code:");
  for (const [file, needle, why] of failures) console.error(`  - ${file}: missing "${needle}" (${why})`);
  console.error("\nThe live site keeps running the previous deployment. Restore the protected code, then push again.\n");
  process.exit(1);
}
console.log(`[protect] ${checks.length} code checks passed`);
