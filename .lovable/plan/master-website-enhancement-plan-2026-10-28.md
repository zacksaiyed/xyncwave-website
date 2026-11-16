# Master Website Enhancement — Plan

Keep the current design (Manrope, square corners, colours, layouts). No redesign, no removed content, no invented proof.

## Phase 1 — Products & TripOps
- Add a "Products" item to the top menu (desktop mega-menu + mobile drawer), built from a small product list so future products can be added without redesign. No empty POV menu.
- New `/products` hub with a TripOps card.
- New `/products/tripops` page: hero ("Sign In to TripOps" → tripops.xyncwave.com/sign-in, plus "Discuss TripOps"), operational challenges, overview, workflow, capabilities, who it's for, final CTA.
- Features are written as the product's intended scope (trips, trip expenses, budget visibility, reconciliation) — no screenshots, integrations, customers or pricing claimed. You haven't confirmed TripOps features, so please review this wording before publishing.
- Light TripOps mentions: homepage (one small feature strip), Logistics industry page, ERP and Digital Transformation related links, footer.

## Phase 2 — Solutions & Industries depth
- For each of the 9 solution pages and 5 industry pages, add only missing sections: "When this makes sense", "What to evaluate before starting", technical/implementation considerations, and illustrative use cases (clearly labelled as illustrative). Existing text untouched; each page gets distinct wording.

## Phase 3 — Links & CTAs
- Re-check every link in the journey map against existing pages; add TripOps links where relevant.
- Apply page-specific button labels from the brief (e.g. "Discuss Your Logistics Workflows"); buttons still go to the existing forms with the interest pre-selected and source page recorded.

## Phase 4 — SEO & analytics
- Add the new pages to the sitemap; check every page has a unique title, description, canonical link and share tags; add breadcrumbs and product structured data (no ratings/prices).
- Analytics: prepare a single tracking helper and wire events (CTA clicks, form start, form success only after a real save, assessment completion, TripOps sign-in click). It stays switched off until you provide a Google Analytics ID. No personal form data is sent.
- Report what needs Search Console / Analytics access to confirm.

## Phase 5 — Homepage hero
- Add a calm "Connected Architecture" composition on the hero's right: precise light shapes, subtle depth, one blue connecting line, built in code (no photo), static with respect for reduced motion. Nothing else on the homepage changes.

## Finish
- Check new pages on desktop, phone and dark mode, run type checks, and give the final report the brief requests.

## Technical notes
- New: `src/lib/products.ts`, `src/routes/products.index.tsx`, `src/routes/products.tripops.tsx`, `src/lib/analytics.ts`, `src/lib/solution-depth.ts` (added sections), hero component.
- Edits: `site-shell.tsx`, `commercial-pages.tsx`, `journey-map.ts`, `sitemap[.]xml.ts`, `routes/index.tsx`, form components for events.
