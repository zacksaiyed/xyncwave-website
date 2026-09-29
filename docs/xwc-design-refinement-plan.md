# XWC site-wide design and UX refinement plan

## Execution contract

This record governs the refinement of the existing XWC website on `main`. Work normally proceeds one numbered task at a time: inspect, scope, implement, inspect the rendered result, test, and report. On 2026-09-29 the owner explicitly superseded the stop-after-each-task cadence with “do all tasks dont wait for approval”; Tasks 02–15 therefore form one authorized local implementation and verification batch. The publication boundary remains separate.

Local implementation is permitted for the active task. Pushing, merging, publishing, or changing production configuration requires separate, explicit owner authorization. Published history must not be rewritten.

## Locked constraints

- Existing visible and metadata content is locked word for word. Layout must adapt to the content; content must not be shortened, regenerated, hidden, line-clamped, or collapsed for visual convenience.
- XWC brand identity, approved logos, legal name, domain, tagline, product names, and semantic palette are locked.
- The installed framework, router, routes, slugs, data model, integrations, dependency versions, SEO relationships, and working features are locked.
- The current font family and Lucide icon family remain in use. No additional icon pack or design framework is introduced.
- The homepage hero artwork is a separate approval decision. Existing artwork is preserved until the owner identifies an approved replacement asset.
- Unrelated working-tree changes are preserved. Credentials and personal data must not enter evidence or logs.

## Evidence and status rules

Each task records its baseline commit, status, files/templates, before/after evidence, content check, test results, dependencies, and next task. Permitted statuses are: Not started; In progress; Implemented—awaiting verification; Verified—awaiting owner review; Accepted; Blocked.

Test results are recorded as Passed, Failed, Blocked, or Not tested. Source inspection is not represented as a browser test. A successful edit, successful build, visual approval, commit, push, and deployment are distinct outcomes.

## Task register

| ID  | Task                                            | Status                         |
| --- | ----------------------------------------------- | ------------------------------ |
| 00  | Baseline and coverage map                       | Verified—awaiting owner review |
| 01  | Slightly rounded buttons and controls           | Verified—awaiting owner review |
| 02  | Typography and typesetting                      | Verified—awaiting owner review |
| 03  | Spacing, cards, surfaces and shadows            | Verified—awaiting owner review |
| 04  | Icons and useful SVGs                           | Verified—awaiting owner review |
| 05  | Approved hero image and composition             | Blocked                        |
| 06  | Solutions and industries                        | Verified—awaiting owner review |
| 07  | Case-study listing and details                  | Verified—awaiting owner review |
| 08  | Insights listing                                | Verified—awaiting owner review |
| 09  | Individual article reading experience           | Verified—awaiting owner review |
| 10  | About, Why XWC and contact layouts              | Verified—awaiting owner review |
| 11  | Header, footer and navigation                   | Verified—awaiting owner review |
| 12  | Search and utility discovery                    | Verified—awaiting owner review |
| 13  | Forms, assessments and enquiry continuity       | Verified—awaiting owner review |
| 14  | Theme, responsive and accessibility consistency | Verified—awaiting owner review |
| 15  | Site-wide quality gate and handoff              | Verified—awaiting owner review |

## Task boundaries

### Task 00 — Baseline and coverage map

Inspect the repository instructions, branch, current commit, worktree, scripts, lockfile, route/template coverage, content sources, assets, fonts, icon imports, theme handling, tokens, CSS cascade, and available checks. Run the application locally, capture representative desktop/mobile light/dark evidence, and establish a content baseline without modifying the application.

### Task 01 — Slightly rounded buttons and controls

Introduce a semantic 12px radius for shared primary, secondary, and quiet buttons and for related inputs/selects. Preserve intentional circles and text links. Correct the actual CSS cascade; retain readable padding, safe wrapping, 44px minimum primary touch targets, visible focus, and existing interaction states. Verify hero actions, navigation CTA, contact form, assessment controls, and search in representative light/dark views. Do not redesign pages or alter the hero artwork.

### Tasks 02–15

The remaining tasks cover, in order: typography; spacing/cards/surfaces; icons/SVGs; an owner-approved hero asset; solution/industry templates; case studies; Insights listing; article reading; About/Why XWC/Contact; navigation; search; forms/assessments; consolidated theme/responsive/accessibility checks; and the final site-wide quality gate. The owner explicitly authorized this complete local batch after Task 01. Task 05 remains blocked because no exact hero asset was approved; the current artwork is deliberately preserved rather than replaced with an invented substitute.

## Publication boundary

The complete refinement batch is local and uncommitted. No push or deployment is authorized. If publication is later approved, recheck the remote branch, preserve collaborator changes, use a normal commit, and push without force or history rewriting.
