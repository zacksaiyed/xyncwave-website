# XWC design-refinement progress

Last updated: 2026-09-29 (Asia/Kolkata)

## Current batch summary

| Task                                                 | Status                         | Publication status                  |
| ---------------------------------------------------- | ------------------------------ | ----------------------------------- |
| 00 — Baseline and coverage map                       | Verified—awaiting owner review | Local only; not committed or pushed |
| 01 — Slightly rounded buttons and controls           | Verified—awaiting owner review | Local only; not committed or pushed |
| 02 — Typography and typesetting                      | Verified—awaiting owner review | Local only; not committed or pushed |
| 03 — Spacing, cards, surfaces and shadows            | Verified—awaiting owner review | Local only; not committed or pushed |
| 04 — Icons and useful SVGs                           | Verified—awaiting owner review | Local only; not committed or pushed |
| 05 — Approved hero image and composition             | Verified—awaiting owner review | Local only; not committed or pushed |
| 06 — Solutions and industries                        | Verified—awaiting owner review | Local only; not committed or pushed |
| 07 — Case-study listing and details                  | Verified—awaiting owner review | Local only; not committed or pushed |
| 08 — Insights listing                                | Verified—awaiting owner review | Local only; not committed or pushed |
| 09 — Individual article reading experience           | Verified—awaiting owner review | Local only; not committed or pushed |
| 10 — About, Why XWC and contact layouts              | Verified—awaiting owner review | Local only; not committed or pushed |
| 11 — Header, footer and navigation                   | Verified—awaiting owner review | Local only; not committed or pushed |
| 12 — Search and utility discovery                    | Verified—awaiting owner review | Local only; not committed or pushed |
| 13 — Forms, assessments and enquiry continuity       | Verified—awaiting owner review | Local only; not committed or pushed |
| 14 — Theme, responsive and accessibility consistency | Verified—awaiting owner review | Local only; not committed or pushed |
| 15 — Site-wide quality gate and handoff              | Verified—awaiting owner review | Local only; not committed or pushed |

Baseline/current repository commit: `b6d2327c3f4390502d9367581115a989ee244e57` (`main`, matching local `origin/main` when inspected). After Task 01, the owner explicitly instructed the complete remaining local batch to proceed without intermediate approval stops. Existing untracked `package-lock.json` was present before this batch and was not modified, staged, or removed.

## Task 00 — Baseline and coverage map

Status: **Verified—awaiting owner review**

### Repository and runtime baseline

- Package manager lockfile in version control: `bun.lock`. `package-lock.json` is a preserved, pre-existing untracked file.
- Framework: React 19 with TanStack Start/Router and Vite; Supabase integration remains unchanged.
- Available scripts: `dev`, `build`, `build:dev`, `preview`, `lint`, and `format`. No repository test script exists.
- Local review server used `http://127.0.0.1:8081` because port 8080 was already occupied. The port conflict is an environment condition, not a code defect.
- CSS import order in `src/routes/__root.tsx`: `src/styles.css` followed by `src/refinements.css`; later refinement rules therefore win on equal specificity.
- Manrope is loaded in weights 400, 500, 600, 700, and 800 with system fallbacks.
- Theme handling is centralized by `AppearanceProvider` with Light, Dark, and Auto modes and the SSR cookie `xwc-appearance`.
- Lucide is the active interface icon family through explicit imports; no second icon dependency was identified.
- Before Task 01, generic radius variables and rendered shared controls resolved to `0px`.
- Intermittent local logo fallback text appeared during screenshot capture when a development asset request did not resolve. The approved logo rendered on other loads. This is recorded as a local runtime limitation and was not addressed by Task 01.

### Coverage map

| Surface              | Route/template authority                                                      | Shared coverage or exceptions                                                                                   |
| -------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Home                 | `src/routes/index.tsx`                                                        | Shared header/footer; bespoke hero and homepage sections                                                        |
| Solutions listing    | `ListingPage` in `src/components/commercial-pages.tsx`                        | Shared commercial listing treatment                                                                             |
| Solution details     | Shared commercial detail template + `src/lib/content.ts`                      | 9 generated details                                                                                             |
| Industries listing   | `ListingPage` in `src/components/commercial-pages.tsx`                        | Shared commercial listing treatment                                                                             |
| Industry details     | `IndustryLandingPage`, `src/lib/industry-conversion.ts`, `src/lib/content.ts` | 5 generated details                                                                                             |
| Case Studies listing | `src/routes/case-studies.index.tsx`                                           | Bespoke listing                                                                                                 |
| Case-study details   | `src/routes/case-studies.$slug.tsx` + `src/lib/case-studies.ts`               | 9 generated details; authored `track-trace` and `engineering-capacity` exceptions                               |
| Insights listing     | `src/routes/insights.index.tsx`                                               | Bespoke featured/filter/grid presentation                                                                       |
| Individual Insights  | Dynamic route using shared `LongFormInsight` and typed article registry       | 30 registry articles; legacy fallback remains in place                                                          |
| About                | About route sections + typed roster                                           | Shared team/author information                                                                                  |
| Why XWC              | Shared `StaticPage`                                                           | Static-layout consumer                                                                                          |
| Contact              | Shared `Hero` + `LeadForm`                                                    | Contact form path                                                                                               |
| Assessments          | Shared `AssessmentIntro` and assessment controls                              | Digitalization, AI opportunity, and engineering-capacity routes; thank-you context uses one-use session storage |
| Search               | `src/routes/search.tsx`                                                       | Bespoke query and filter controls                                                                               |
| Campaigns            | `src/routes/lp.$slug.tsx`                                                     | 3 data-driven layouts                                                                                           |
| Site chrome          | `SiteHeader`, `SiteFooter`, `StickyMobileCTA`                                 | Shared across public pages                                                                                      |
| Utilities            | robots, sitemap, privacy, terms, not-found                                    | Route-specific rendering/indexing behavior                                                                      |

Full content counts, URLs, integrity hashes, dates, and content authorities are recorded in `docs/xwc-design-content-baseline.md`.

### Baseline evidence

- `docs/evidence/task00-home-light-before-1440.jpg`
- `docs/evidence/task00-contact-light-before-1440.jpg`
- `docs/evidence/task00-contact-dark-before-1440.jpg`
- `docs/evidence/task00-assessment-dark-before-390.jpg`

### Baseline checks

- **Passed:** `npm run build`.
- **Passed:** `npx tsc --noEmit`.
- **Failed (pre-existing repository debt):** `npm run lint` reported 2,425 issues: 2,416 errors and 9 warnings, with 2,415 autofixable. No unrelated mass-formatting was performed.
- **Not tested:** automated test suite; the repository has no `test` script.

Existing build warnings: Vite notes that tsconfig paths are natively supported; a client chunk exceeds 500 kB; Nitro reports an `inlineDynamicImports` warning. None was introduced or changed in Task 01.

### Task 00 content result

Content registry and asset hashes were captured before application edits. The runtime sitemap contained 70 indexable URLs. No content, route, asset, metadata, dependency, production configuration, or backend contract was changed during Task 00.

## Task 01 — Slightly rounded buttons and controls

Status: **Verified—awaiting owner review**

### Scoped implementation

- Added the semantic `--control-radius`/`rounded-control` path with a 12px value instead of remapping global card/panel radii.
- Applied the shared family to button variants, inputs, textareas, select triggers/popups, and the small number of native/raw controls outside the UI primitives.
- Preserved intentional circles and text links.
- Kept minimum control heights at 44px or greater. Long button labels now wrap and center safely instead of being forced onto one line.
- Retained focus-visible, active/pressed, disabled, and motion behavior in the shared button primitive. The primary hover colour is now a semantic token and retains the existing foreground colour.
- Removed the late page-level primary-button hover exception that conflicted with shared behavior.
- Left generic card/panel radii at their existing values for Task 03 and left the homepage hero artwork/composition untouched.

### Files and affected templates

| File                                    | Effect                                                      |
| --------------------------------------- | ----------------------------------------------------------- |
| `src/styles.css`                        | Semantic control radius and primary hover token             |
| `src/refinements.css`                   | Removed superseded late button-hover exception only         |
| `src/components/ui/button.tsx`          | Shared button radius, safe wrapping, primary hover state    |
| `src/components/ui/input.tsx`           | Shared input radius                                         |
| `src/components/ui/textarea.tsx`        | Shared textarea radius                                      |
| `src/components/ui/select.tsx`          | Trigger/menu/item radius, touch height, and focus treatment |
| `src/components/appearance.tsx`         | Mobile appearance choices                                   |
| `src/components/assessment.tsx`         | Shared assessment choices                                   |
| `src/components/insight-assessment.tsx` | Article assessment choices                                  |
| `src/components/safety-checklist.tsx`   | Checklist controls                                          |
| `src/routes/insights.index.tsx`         | Native topic select                                         |
| `src/routes/search.tsx`                 | Raw search filter controls                                  |

Consumers include homepage hero actions, navigation CTA, contact and enquiry forms, assessment routes, article assessments, Insights filters, Search, appearance controls, and campaign/form paths that use the shared primitives.

### Rendered verification

| Surface                 | Result                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Home, Light, 1440px     | Nav CTA computed to 12px/48px; hero actions 12px/52px; unrelated homepage content card remained 0px; no horizontal overflow |
| Contact, Dark, 1440px   | Inputs 12px/48px; textarea 12px/128px; category Change control 12px/44px; submit action 12px/52px                           |
| Assessment, Dark, 390px | Long choices 12px/64px, wrapping retained; `scrollWidth` equalled 390px                                                     |
| Search, Light, 1024px   | Search input/button 12px/52px; filter controls 12px/44px; no horizontal overflow                                            |
| Insights, Light, 1024px | Native topic select computed to 12px/48px; no horizontal overflow                                                           |
| Keyboard focus          | A real rounded menu control retained a solid 3px Electric Blue outline with 4px offset                                      |
| Disabled state          | Industry enquiry submit remained 12px/52px, disabled, 50% opacity, and `not-allowed`                                        |
| Primary contrast        | Dark-mode primary CTAs retained white on Electric Blue; the locked `#FFFFFF`/`#0A66FF` pair computes to 4.82:1              |

After evidence:

- `docs/evidence/task01-home-light-after-1440.jpg`
- `docs/evidence/task01-contact-dark-after-1440.jpg`
- `docs/evidence/task01-assessment-dark-after-390.jpg`
- `docs/evidence/task01-search-light-after-1024.jpg`

### Task 01 checks

- **Passed:** focused Prettier run on changed application files.
- **Passed with one existing warning:** focused ESLint reported no errors and the existing React Fast Refresh export warning in `src/components/ui/button.tsx`.
- **Passed:** `npx tsc --noEmit` after the implementation.
- **Passed:** browser checks at representative desktop/mobile sizes in Light and Dark, including computed radius, touch height, long-label wrapping, and horizontal overflow.
- **Passed:** browser keyboard-focus, disabled-state, native select, and Dark-mode primary-colour checks. The shared active/pressed, disabled, and pending/loading paths remain present in source.
- **Passed:** 78-route local smoke check covering static, query/filter, campaign, generated detail, robot, and sitemap paths; all returned HTTP 200. Representative Home and long-form Insight pages each rendered one `<main>` landmark.
- **Passed:** final production build and diff integrity checks (see final verification entry below).
- **Not tested end-to-end:** loading/submission states against external services. No real lead, email, CRM action, or production request was created; state behavior was inspected in the shared implementation only.

### Content-preservation result

No visible copy, CTA wording, metadata, route, slug, content registry, article, date, claim, asset, link destination, field requirement, payload key, or backend contract was changed. `git diff` confirms that no `src/lib` registry or `src/assets` file changed, and the recomputed asset aggregate remains `be33dacee4a94b9391f55809d4f169287151bcb3321e4af66892e659b2e58596`.

### Remaining risks and owner decisions

- The repository-wide lint command remains red because of pre-existing formatting debt; Task 01 introduced no focused lint error.
- Intermittent development logo-asset fallback remains outside Task 01 scope.
- Chrome logged hydration mismatch warnings only for `data-new-gr-c-s-check-loaded` and `data-gr-ext-installed`, attributes injected by the installed Grammarly extension before React hydration. No application-origin browser error was observed in this review session.
- Visual acceptance is pending owner review.
- No commit, push, merge, production-config change, or deployment has occurred.

## Task 02 — Typography and typesetting

Status: **Verified—awaiting owner review**

- Kept Manrope and its loaded 400/500/600/700/800 weights. Introduced shared page-title, section-title, card-title, lead, body, metadata, eyebrow, and reading-measure roles in `src/styles.css`.
- Page titles now scale from approximately 34–42px on narrow screens to 48–68px on desktop; section headings scale from approximately 26–32px to 30–42px. Body rhythm is 1.65 and long-form copy is capped near 68 characters.
- Applied the roles through `page-sections.tsx`, `commercial-pages.tsx`, `static-page.tsx`, `long-form-insight.tsx`, `about-sections.tsx`, `continue-exploring.tsx`, the homepage, listing routes, campaigns, Search, contact/enquiry, thank-you, and legacy Insight fallback.
- **Passed:** browser checks of short and long titles at 320, 390, 768, 1024, and 1440px found no clipped or horizontally overflowing headings. The 1440px page-title token computed to 68px and the 320px homepage title to 34px.
- **Passed:** no visible wording, metadata, route, slug, or registry changed. Next executed task: Task 03.

## Task 03 — Spacing, cards, surfaces and shadows

Status: **Verified—awaiting owner review**

- Added the semantic `--card-radius`/`rounded-card` path at 18px without remapping every radius utility. Applied it to genuine cards, assessment/results panels, visual/media wrappers, form panels, and content panels.
- Preserved more restrained full-width sections and tables. Removed hover/lift signaling from static homepage and case-study panels while retaining explicit interactive links and their focus/hover states.
- Affected shared files include `src/components/ui/card.tsx`, `page-sections.tsx`, `digital-visuals.tsx`, `assessment.tsx`, `insight-assessment.tsx`, `industry-landing-page.tsx`, `about-sections.tsx`, `commercial-pages.tsx`, `continue-exploring.tsx`, and the Home, Case Studies, Insights, campaign, and enquiry routes.
- **Passed:** rendered content cards compute to 18px, nested/inverse surfaces remain legible, and the responsive matrix has no page-level horizontal overflow. All content remains visible without line clamping. Next executed task: Task 04.

### Owner-feedback iteration — homepage transformation story

- The owner rejected the initial three-column System Map presentation. It was replaced with a calmer paired-flow composition: one five-stage transformation rail and four direct problem-to-outcome paths.
- Files: `src/components/digital-visuals.tsx`, `src/routes/index.tsx`, `src/styles.css`, and `src/refinements.css`.
- Existing section copy and all eight node labels remain unchanged. No raster/SVG asset, content registry, link, or route changed.
- **Passed:** actual Light and Dark desktop review and a 390px Light mobile review. The mobile stage rail fits without truncation; document `scrollWidth` equals viewport width. Production build, TypeScript, focused ESLint (zero errors; three existing Fast Refresh warnings), and `git diff --check` pass.

## Task 04 — Icons and useful SVGs

Status: **Verified—awaiting owner review**

- No application edit was necessary. Source inspection confirms explicit Lucide imports, no second icon family, decorative icon hiding where appropriate, and visible-label or accessible-name coverage for icon-only shared controls.
- The connected architecture SVG retains a `viewBox`, presentation semantics, scalable theme-aware colours, and `useId()`-derived unique identifiers. Browser checks found no duplicate IDs on representative pages, including diagram- and article-heavy templates.
- Existing reduced-motion and forced-colour rules remain in the shared stylesheets. No new graphic was added merely for decoration. Next executed task: Task 05.

## Task 05 — Approved hero image and composition

Status: **Verified—awaiting owner review**

- After the owner explicitly requested a more original generated hero direction, replaced the temporary geometric SVG with the transparent 1448×1086 transformation sculpture documented in the owner follow-up below. Visible copy, actions, destinations, and semantic structure remain unchanged.
- The composition uses intrinsic dimensions, a stable aspect ratio, high fetch priority, and a transparent theme-flexible cutout rather than duplicating separate light/dark raster files.
- **Passed:** the composition reflows without horizontal overflow at 390 and 1470px in reviewed Auto/Light/Dark states; final owner visual acceptance remains pending. Next executed task: Task 06.

## Task 06 — Solutions and industries

Status: **Verified—awaiting owner review**

- Shared commercial listings/details and industry conversion layouts now consume the common hierarchy, card, and control roles. Informational panels use static surfaces; actionable items retain explicit link affordance.
- Files: `src/components/commercial-pages.tsx`, `industry-landing-page.tsx`, `page-sections.tsx`, `continue-exploring.tsx`, `digital-visuals.tsx`, and shared styles.
- **Passed:** browser review covered the long `Cloud & Platform Engineering` detail and the content-heavy Logistics industry template at desktop, tablet, and narrow widths. Original capability, outcome, conversion, and related-link content remains present. Next executed task: Task 07.

## Task 07 — Case-study listing and details

Status: **Verified—awaiting owner review**

- Refined listing hierarchy, metadata, card surfaces, title measures, and static-versus-interactive signaling in `src/routes/case-studies.index.tsx` and shared case/detail components.
- **Passed:** the shared-registry `digital-brokerage-platform` detail and separately authored case-study routes are included in the 78-route smoke matrix. Browser review covered the listing and data-driven detail at 1024/1440px with no clipping, duplicate IDs, or horizontal overflow.
- Claims, numbers, diagrams, Solution Outcome content, return paths, and related links were not edited. Next executed task: Task 08.

## Task 08 — Insights listing

Status: **Verified—awaiting owner review**

- Refined featured/grid surfaces and title/metadata roles in `src/routes/insights.index.tsx`; existing filter/search architecture and URL state are unchanged.
- **Passed:** default and filtered (`q=data&topic=Healthcare`) layouts were reviewed at 1024px and narrow widths. The implementation continues to separate the featured article from the remaining result set and does not line-clamp titles or summaries.
- All 30 baseline articles remain in the typed registry and are included in route smoke coverage. Next executed task: Task 09.

## Task 09 — Individual article reading experience

Status: **Verified—awaiting owner review**

- `src/components/long-form-insight.tsx` now uses the shared hierarchy and 68-character reading measure; direct answers, takeaways, and assessments use deliberate surfaces. The desktop table of contents is sticky at 112px with bounded vertical scrolling, while the mobile table of contents remains a normal disclosure.
- **Passed:** a table-heavy 18-minute healthcare article and assessment-heavy fintech article were reviewed at 390, 768, and 1440px. Article copy rendered at approximately 705px on desktop. Both real tables stay inside keyboard-focusable horizontal-scroll regions; document width remains equal to viewport width.
- **Passed:** no duplicate anchor IDs, one `<main>` landmark, intact sections/FAQs/sources/assessment, and no collapsed or rewritten copy. Next executed task: Task 10.

## Task 10 — About, Why XWC and contact layouts

Status: **Verified—awaiting owner review**

- Applied the shared type and surface roles in `src/components/about-sections.tsx`, `static-page.tsx`, `lead-form.tsx`, and `src/routes/start-a-conversation.tsx`.
- **Passed:** About, Why XWC, Contact, and Start a Conversation were reviewed in the responsive route/browser matrix. Team names, roles, portraits, biographies, contact alternatives, legal text, field requirements, and CTA wording were preserved.
- The local Lovable asset endpoint intermittently displays the existing development-only approved-asset fallback for logo/team descriptor assets; ordinary repository media loads correctly. This is an environment limitation, not a replacement-asset change. Next executed task: Task 11.

## Task 11 — Header, footer and navigation

Status: **Verified—awaiting owner review**

- No structural rewrite was required. The existing 1280px fit breakpoint, direct parent links, shared Search/Appearance/CTA controls, mobile Sheet behavior, footer grouping, and fixed-mobile-CTA exclusions were preserved.
- **Passed:** mobile menu pointer opening, Escape dismissal, focus return to the menu trigger, scroll-lock release, and desktop-breakpoint cleanup. Desktop navigation exposes `aria-current="page"`; mobile controls meet the 44px preferred target in the reviewed pages.
- **Passed:** fixed mobile CTA/footer/form coexistence was reviewed without control overlap. Approved logo proportions and source descriptors were unchanged. Next executed task: Task 12.

### Owner follow-up — approved v4.0 logo integration

- Replaced the local-preview-only Lovable logo descriptors with the exact web exports from `public/Xyncwave_Brand_Kit_Exact_Approved_v4.0/02_WEB_APP/Logos`.
- The header now uses `logo-header-light-background.png` on light surfaces and `logo-header-dark-background.png` when the effective appearance is dark, including device-driven Auto mode. The permanent dark footer uses the dedicated `logo-footer-dark-background-with-tagline.png` asset.
- Selected PNG exports because the supplied SVG files contain embedded PNG data and are larger; using the PNGs preserves the approved artwork without implying vector scalability. The former white backing plate was removed so each approved contrast variant sits directly on its intended surface.
- Limited source-control inclusion to those three runtime PNGs. The complete 79 MB/238-file source kit remains available locally but is not published with the website.

## Task 12 — Search and utility discovery

Status: **Verified—awaiting owner review**

- Existing safe React rendering, 120-character query bound, type validation, URL state, result hierarchy, and reset flow were preserved. Task 01 control styling and Task 02 typography now apply consistently to Search.
- **Passed:** typing did not update the URL before submission; submitting `zzzz-no-xwc-result` produced a recoverable no-results state; Reset returned to `/search?q=`. `engineering` returned 26 results with typed labels and safely highlighted matches.
- **Passed:** Search and filtered Insights query routes return HTTP 200 and retain state across reload/navigation. No backend, AI-answer system, analytics query capture, or fabricated result was added. Next executed task: Task 13.

## Task 13 — Forms, assessments and enquiry continuity

Status: **Verified—awaiting owner review**

- Shared form panels now use the semantic card radius while preserving labels, required fields, payload keys, destinations, pending/error paths, and one-use Insight thank-you session context.
- Repaired a real Back-state defect in `src/components/assessment.tsx` and `src/components/insight-assessment.tsx`: previous answers now remain visibly selected and are replaced correctly if changed, instead of being discarded or double-counted.
- **Passed:** synthetic enquiry values survived category changes, including category-specific detail; both standalone and embedded Insight assessments retained answers after Back. No real form was submitted and no personal data, lead, email, CRM entry, or production request was created.
- **Not tested end-to-end:** intercepted success/error/retry delivery was unavailable in the browser-control harness. Source inspection confirms guarded duplicate submit, pending, error, retry, and draft-state paths; backend acceptance and downstream email/CRM delivery remain unverified. Next executed task: Task 14.

## Task 14 — Theme, responsive and accessibility consistency

Status: **Verified—awaiting owner review**

| Coverage              | Checked result                                                                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Viewports             | 320, 390, 768, 1024, and 1440 CSS px across representative templates                                                                            |
| Themes                | Auto/Dark representative pages; manual Light selection persisted after reload; restored to Auto                                                 |
| Reflow                | No page-level horizontal overflow or heading clipping in the recorded matrix                                                                    |
| Landmarks/IDs         | One `<main>` on representative SSR/browser pages; no duplicate IDs in the browser matrix                                                        |
| Controls              | Visible `button`, `input`, `select`, and `textarea` controls were at least 44×44px in sampled narrow Home, Contact, and long-form article pages |
| Tables                | Semantic tables contained in focusable horizontal-scroll regions; whole page does not scroll sideways                                           |
| Keyboard              | Visible focus was checked in Task 01; mobile menu Escape/focus return and assessment/search operation passed                                    |
| Motion/forced colours | Shared `prefers-reduced-motion` and `forced-colors` rules inspected in source                                                                   |

- **Not tested:** VoiceOver/NVDA/JAWS, a physical touch device, 200% browser text-only enlargement, 400% browser zoom, cross-tab device-theme changes, restricted-storage mode, and OS forced-colour rendering. No blanket WCAG compliance claim is made.
- Chrome reported hydration mismatch text only for Grammarly-injected `data-new-gr-c-s-check-loaded`/`data-gr-ext-installed` body attributes. No application-origin console error was observed. Next executed task: Task 15.

## Task 15 — Site-wide quality gate and handoff

Status: **Verified—awaiting owner review**

- Expert review (not user testing) covered every unique template family and 78 static, query, campaign, generated-detail, robot, and sitemap paths. All returned HTTP 200; representative Home and long-form Insight responses contained one `<main>`.
- Content/architecture comparison: `src/lib` has no diff. The only new application media is the owner-requested homepage hero; approved header/footer logo exports come from the supplied v4.0 brand kit. Route counts remain 9 solutions, 5 industries, 11 case-study experiences, 30 Insights, and 70 sitemap URLs.
- File groups changed: global system (`src/styles.css`, `src/refinements.css`); shared UI/control and page-section components; commercial, industry, article, assessment, About/static, form, and visual components; Home, Case Studies, Insights, Search, campaign, enquiry, thank-you, and legacy Insight route templates; this plan/progress/evidence record.
- Rollback boundaries are separable: (1) semantic CSS tokens/utilities, (2) shared component class adoption, (3) route-template class adoption, (4) assessment Back-state repair, (5) approved branding/hero media, and (6) documentation/evidence. No content registry, dependency, backend, Supabase, SEO, or production configuration is included.
- File-based before/after evidence remains in `docs/evidence/` for the baseline and Task 01. Final Task 02–15 Home/case-study/article views were inspected as actual local browser screenshots at matching review sizes, but the browser harness did not export additional files into the repository; that missing persisted evidence is explicit.
- Remaining approval: visual acceptance and publication approval remain owner decisions.

### Owner follow-up — homepage hero visual

- Replaced the temporary code-drawn architectural blocks with an original transparent 3D transformation sculpture generated specifically for the homepage. The composition uses one electric-blue signal path, a central transformation core, fragmented source structures, and a connected modular destination without adding labels, claims, or stock imagery.
- After owner feedback, refined the concept into a more minimalist v3 composition: three offset source monoliths, an incomplete transformation arc, one glass frame, one layered destination, and a single hairline Electric Blue route. This removes the earlier mechanical branches, neon-tube effect, and accidental letter-like geometry.
- Following the next owner direction, replaced the architectural v3 with a simpler futuristic wave system using only the approved Carbon/White/Electric Blue/Slate/Graphite/Mist palette. Saved the 1448×1086 RGBA layer as `src/assets/media/home-xyncwave-purpose-waves-v4.png`.
- Kept all meaningful content out of the raster layer. The official `LET'S CONNECT. DIGITALLY.` tagline and three purpose nodes—`Connect systems`, `Modernize operations`, and `Build what's next`—render as accessible HTML with Lucide icons, remain sharp at every density, and adapt independently to Light, Dark, forced-colour, and mobile layouts.
- The browser receives intrinsic dimensions, eager loading, asynchronous decoding, and high fetch priority because the visual is above the fold. Existing heading, description, actions, and destinations remain unchanged.

## Final verification entry

- **Passed:** `npm run build` after the complete local refinement batch. Existing tsconfig-paths, large-chunk, and Nitro `inlineDynamicImports` warnings remain.
- **Passed:** `npx tsc --noEmit`.
- **Passed:** Prettier check for every changed application/documentation text file.
- **Passed with four existing warnings:** focused ESLint reported zero errors; `react-refresh/only-export-components` remains in the button and digital-visual modules.
- **Passed:** `git diff --check`.
- **Failed, pre-existing repository debt:** repository-wide `npm run lint` reports 2,296 errors and 9 warnings, overwhelmingly existing Prettier violations outside this scoped batch. Focused lint of every changed TSX file reports zero errors.
- **Not tested:** no automated suite is available under a `test` script.
- Working tree: only the local refinement application changes, documentation/evidence, and the preserved pre-existing untracked `package-lock.json`; nothing is staged or committed.
- Browser review was returned to Appearance `Auto` and its normal viewport after testing.
- No later task remains unstarted and no implementation dependency remains blocked. No commit, push, merge, production configuration change, or deployment was performed in this batch.
