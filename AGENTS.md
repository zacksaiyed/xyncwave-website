- Final Insights authority content is grouped in one typed registry module and uses the shared article renderer; this keeps the 30-article programme consistent without duplicating page structure.
- Insight assessment thank-you context travels through one-use session storage after successful submission; this preserves article continuity without exposing submitted answers in a URL.
- Interactive styling tokens (hover underline colour, radius, font) are global in src/styles.css so every page stays visually consistent.
<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

Insight article bylines and author metadata resolve through the shared article-to-team mapping and About roster, so visible names, roles, portraits, and structured data stay consistent.
Long-form Insights batches extend the shared typed article data and assessment renderer; keep article-specific editorial content separate from the shared design so future batches retain the approved experience.
- Products live in one registry (src/lib/products.ts) that feeds the menu, /products hub and sitemap; adding a product needs no layout changes.
- Extra Solution/Industry decision depth lives in src/lib/solution-depth.ts and renders after existing sections; approved page copy stays untouched.
- Site analytics go through track() in src/lib/analytics.ts; GA4 loads only when a measurement ID is configured, so there is never a duplicate setup.
- Production URL metadata uses the shared site-origin module so canonicals, schema, robots and sitemap cannot drift to preview hosts.
- ERPNext is a dedicated static child route with editorial data separated from its renderer; this preserves the nine-solution registry and existing article system.
- ERPNext enquiries reuse submitLead with a validated contextual payload; confirmation follows persistence and analytics excludes personal details.
- ERPNext regional pages and ERPNext cluster articles share one typed doc format (src/lib/erpnext-docs) and one renderer; keeps languages, RTL and enquiry behaviour consistent.
- Case-study concepts use the central media registry's concept flag and shared glimpse renderer; this preserves full compositions and accessible labelling without changing photography consumers.
- Rate-card placements use one root dialog provider and a route/section allowlist; delivery fails closed until the exact approved private PDF and verified sender are available, without changing white-paper behaviour.
- Search indexing is hostname-allowlisted in src/lib/indexing.ts: only xyncwave.com hosts are indexable; every other host gets X-Robots-Tag plus robots meta, a sitemap-free robots.txt and a 404 sitemap, so shared code can never noindex production.
