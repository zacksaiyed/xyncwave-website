# Roadmap — ERPNext controlled expansion

## Engineering resource rate card — 15 November 2026
- [x] Extend the shared inline rate-card form to the four additional owner-selected consulting, partner-evaluation and fintech articles; all four verified at 1068px and mobile, with 13 rule tests passing.
- [x] Add three desktop exit-intent placements and three contextual Insight CTAs using one accessible form in unpublished preview.
- [x] Verify all six placements in the browser; desktop/tablet/mobile forms, validation, focus return, and no overflow; 12 rule/regression tests pass. Delivery remains disabled.
- [ ] Enable private v2 PDF entitlement, persisted requests and visitor/owner emails — blocked by missing approved v2 PDF and configured email domain; do not accept requests or claim delivery until ready.
- [ ] Verify real delivery to visitor, Aasiya and Arbaz, retries and unchanged white-paper workflow after dependencies are supplied.
- [ ] Production deployment — waiting for explicit owner approval.

## Premium case-study hardware presentations — 13 November 2026
- [x] Audit the existing 11 stories and prepare the device/background/placement inventory.
- [x] Establish Track & Trace, Brokerage and Hospital presentations, then extend to all 11 cases.
- [x] Replace shared card and detail artwork; remove visible concept labels while retaining one discreet demo-data note.
- [x] Verify homepage, listing and every detail on desktop/mobile; deliver artwork comparisons and resolution limitations (native masters 1920 × 1200; old rendered screenshots lost during pause).
- [ ] Production release — waiting for explicit owner approval; do not publish.

## Case-study interface artwork — 12 November 2026
- [x] Audit all 11 source stories and existing placements; narratives and unrelated imagery preserved.
- [x] Create and inspect 11 distinct white-first concepts; 1600/800 WebP pairs and staging inventory saved.
- [x] Integrate shared imagery and one labelled glimpse per detail page in preview only.
- [x] Verify desktop/mobile homepage, listing and every detail; no page errors, broken concepts, repeated detail images or overflow.
- [ ] Native 2400 × 1500 masters — blocked by image tool's 1920-pixel maximum; retained true 1920 × 1200 masters without upscaling.
- [ ] Production release — waiting for owner review and explicit approval; no publishing performed.

Source: owner ERPNext briefs, 12 November 2026. Preview only; production requires explicit approval.

- [x] Batch 0: inventory routes, content, canonical defects and dependencies (latest project inspected; ZIP and four Gemini research files not attached).
- [x] First review gate: integrate the complete supplied global pillar, contextual enquiry and ERP navigation/linking; desktop/mobile, SSR and real lead persistence verified.
- [x] Batch 1 continuation: German, GCC English and Arabic pages built in preview (native German/Arabic review still required before release).
- [x] Batch 2: C1–C6 Insights built in preview (shorter than 2,200-word target; deepen after owner review). Not yet listed on the Insights index page.
- [ ] Batch 3: C7–C13 market Insights — waiting for earlier batch review and native Arabic QA.
- [ ] Batch 4: full release QA — waiting for remaining content, native review and owner production signoff.

## Previous delivery roadmap (historical; reconciliation pending)

# 5 Content Assets (3 Insights + 2 White Papers)

Source: XWC_Lovable_Master_5_Assets brief (2026-11-06). Staging only; production held for approval.

## Phase A — Audit
- [ ] Inventory insights registry, routes, email/storage stack, privacy policy, GA4
- [ ] Check email domain status (sender verification)
- [ ] Confirm no topic cannibalization vs existing 30 Insights

## Phase B — Content
- [ ] Article 1: Fintech Partner Integration Launch Readiness (~2,400–3,200 words)
- [ ] Article 2: IT Consulting Delivery Margin (~2,400–3,200 words)
- [ ] Article 3: Multi-Site Manufacturing ERP Rollout Readiness Africa (~2,400–3,200 words)
- [ ] White Paper 1: Southern Africa Logistics Technology Outlook 2027 (~4,500 words)
- [ ] White Paper 2: US Fintech Engineering & Delivery Readiness Outlook 2027 (~4,500 words)

## Phase C — Pages & PDFs
- [ ] 3 article routes in Insights registry (existing renderer)
- [ ] 2 research landing pages + /research hub
- [ ] Generate 2 branded PDFs, QA visually, verify word counts

## Phase D — Gated delivery
- [ ] Private storage for PDFs (not public)
- [ ] Server-validated form: Full Name*, Business Email* (reject free-mail), Phone optional
- [ ] Lead capture table + RLS
- [ ] Transactional email with secure download link (attachments unsupported by platform — documented fallback per brief 6.1)
- [ ] Token-gated PDF download endpoint

## Phase E — Analytics, links, QA
- [ ] GA4 events via track() (no PII)
- [ ] Contextual internal links from related existing pages
- [ ] Sitemap, metadata, schema, breadcrumbs
- [ ] End-to-end test: form → email → download; free-email rejection; wrong-asset check

## Phase F — Report
- [ ] Final report: URLs, word counts, link map, lead-system proof, QA evidence, open blockers
