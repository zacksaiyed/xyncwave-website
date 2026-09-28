# XWC — visual refinement and corrective review

Date: 29 September 2026
Reviewed parent: `62eae558e5f44d8504e0197f3f22f5e95af927d3`
Scope: owner-authorised broader visual refinement and direct, non-force update of `main`.

## What changed

- Simplified the Connected Architecture SVG: five matte geometric forms, an open frame, contained contact shadows and one connected blue path. Removed the generated decorative slogans and glow. No logo was generated or changed.
- Aligned the homepage hero with the existing 1280px content axis. Improved headline wrapping, readable paragraph width and primary/secondary CTA distinction without rewriting either CTA.
- Added four consistent Lucide capability icons and a 4/2/1-column responsive problem grid. All problem descriptions and destinations are unchanged.
- Separated the previously adjacent similar sections, framed the existing transformation diagram, balanced the case-study feature and made the two Insights features visually consistent. No sections or article banners were removed.
- Added a bounded stylesheet loaded after the existing design system. It also repairs inverse-section colour leakage into nested light forms and low-contrast primary-button hover states in dark mode. It does not change the logo, main blue fill token or font.
- Used a 1280px desktop navigation breakpoint consistently so laptop-width navigation does not compete with the logo and primary CTA. Added an accessible mobile Search entry. Repaired Escape focus restoration, hover-open Escape dismissal, focus/pointer interaction, Tab-away closing and resize focus recovery.
- Hardened appearance storage: Auto resolves the dark utility class, cookie writes tolerate blocked storage, local-storage migration and cross-tab changes keep the server cookie consistent, clear() is handled, session storage is ignored, and invalid cookies do not override valid local preferences.
- Fixed search de-duplication retaining the lower-ranked copy of a route and short substring matches such as `ai` in `paid`.
- Suppressed the persistent mobile enquiry strip on Search and confirmation routes; made existing breadcrumb wrapping and mobile safe-area spacing safer.

## Content and architecture safeguards

The editorial JSX and content properties in the homepage and root were compared against the exact GitHub blobs. Header/footer editorial text was also compared. These comparisons passed. The extra mobile Search link and accessible control behaviour are functional changes, not rewritten marketing copy.

No article registry, case-study registry, industry/solution content, author/team record, legal page, existing URL, backend contract, logo asset, image manifest, production origin or dependency declaration is changed by this patch. Manrope remains pending the separate Inter/Manrope decision. No blanket copy replacement was performed. Decorative text copied into the generated hero illustration is the only removed wording; it is not editorial content and was explicitly excluded in the approved implementation brief.

## Verification actually performed

- **Passed:** 16 isolated source-level regression tests covering appearance state/storage handling, search matching/de-duplication and navigation event handlers. Run with `node --test scripts/test-refinements.cjs` after installing existing dependencies. The harness compiles the actual modules with TypeScript and supplies explicit browser/library test doubles. This is not a React integration test.
- **Passed:** syntax parsing of all six changed TS/TSX modules. This is not the application's full type check.
- **Passed:** content comparisons described above.
- **Passed, fixture scope:** Chromium 144 offline render checks at 320, 390, 768, 1024, 1280 and 1440 CSS px in light/dark palettes. No horizontal overflow and no duplicate SVG IDs in those fixtures.
- **Passed, fixture scope:** reproduced inverse/nested-form and dark-button colour failures and verified the patched combinations. Normal form text on light surfaces improved from 1.00:1 to 19.43:1; nested blue links from 2.02:1 to 4.82:1; dark-mode primary-button hover from 1.23:1 to 6.38:1. These are the tested solid combinations, not a whole-site contrast or accessibility certification.

## Important verification limits

The connector supplied the actual private repository source. Direct GitHub/package-registry DNS access was unavailable. Chromium local-URL navigation was also blocked by the environment. No restrictions were disabled; offline set-content fixtures were used instead.

The visual fixtures use the changed source components with explicit routing/UI adapters, the available Tailwind 4.1.10 compiler and fallback fonts; the project declares Tailwind 4.2.1. They are **not** the running TanStack/React application or proof of hydration, all-route rendering or production performance. Missing approved logo binaries were represented only by labelled fixture placeholders, not by changes to production assets.

**Blocked/not run here:** full dependency installation, production build, repository-wide type check/lint, complete React/Radix integration, live asset delivery, genuine browser zoom/text-resize, manual screen-reader testing and field Core Web Vitals. No enquiries or external messages were submitted. No SEO production-domain/account settings, DNS or manual deployment was changed.

## Required release-environment checks

1. Install from the existing lockfile using the project's approved package manager. Run the normal production build, type check, focused lint and the included source-level regression suite.
2. Run actual desktop/mobile journeys: hover/click/Tab/Escape navigation, mobile dialog close and resize, themes across reload/route changes, form draft recovery, Search/Insights and Back/Forward.
3. Check real logo/portrait loading and Manrope wrapping. Compare every template using shared styles, especially nested forms in inverse sections and primary-button hover/focus.
4. Complete screen-reader, 200% text, 400% zoom, reduced-motion and authorized mocked-submission testing. The fixture results do not replace these checks.
5. Resolve the existing SEO production-origin/robots decisions and approved asset dependencies separately before claiming launch readiness.

## Rollback

Revert this correction commit with a new revert commit. Do not reset or force-push the connected branch. The patch introduces no migrations or new runtime dependency.
