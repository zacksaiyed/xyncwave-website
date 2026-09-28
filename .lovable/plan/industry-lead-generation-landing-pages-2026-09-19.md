# Industry Lead-Generation Landing Pages

## Goal
Turn all five existing industry pages into distinct, premium B2B conversion journeys that collect a prospect's name, work email, company, selected challenge, and business context without changing the approved visual identity, navigation, routes, or evidence standards.

## What will change

### 1. Five unique conversion configurations
Create a structured conversion model for Logistics, Manufacturing, Healthcare, Fintech, and Technology & IT Services. Each will define its own:
- Hero reassurance and CTA progression
- Self-identification heading and selectable problems
- Challenge dropdown options and optional follow-up fields
- Before/after framing and problem-to-intervention mapping
- Use-case framing, buying-trigger CTA, form heading, button, and reassurance
- Proof action and contextual thank-you recommendations

Existing long-form industry copy remains the source of truth; the new model organizes it for conversion rather than adding generic volume.

### 2. Industry-specific interactive journey
Replace the shared informational industry rendering with a dedicated client-side industry landing experience:
- Hero CTA scrolls to the short form; proof CTA retains the relevant proof destination
- Selectable problem situations save the visitor's choice and preselect the form
- Contextual micro-CTAs appear after consequence, solution mapping/proof, and buying triggers
- A restrained sticky CTA appears only after the introduction is passed and never covers mobile content
- Every CTA has a private source identifier for analytics and lead attribution

The content order will follow: relevance → recognition → consequence → future state → solution mapping → use cases → proof → triggers → engagement → form → FAQ.

### 3. Short contextual forms with progressive fields
Build a dedicated reusable industry form with four core inputs:
- Name
- Work email
- Company
- Industry-specific challenge selector
- Optional challenge description

Fintech adds an optional capacity timeframe; Technology & IT Services adds optional duration. Relevant conditional follow-up inputs appear only after applicable choices, such as ERP/integration or engineering capacity. Inputs receive client validation, length limits, accessible labels, clear errors, and server-compatible data shaping.

### 4. Attribution and lead intelligence
Extend the existing lead submission flow without changing the database schema:
- Store industry, selected challenge, selected problem card, CTA source/position, page URL, campaign values, referrer, landing page, device class, and session conversion path in existing JSON fields
- Preserve original UTM values for the session, even after in-page navigation
- Record conversion-ready intent signals while keeping scoring private
- Keep the existing secure lead table and row-level protections unchanged

### 5. Analytics lifecycle
Expand the analytics event model to cover industry page views, challenge/pain selections, CTA sources, proof clicks, trigger and form visibility, form start, meaningful field completion, abandonment, submission, and thank-you views. Event properties will include industry, challenge, campaign, CTA source, and device without exposing internal labels in the interface.

### 6. Contextual thank-you journeys
Use the existing `/thank-you/$type` route with industry-specific variants so each submission continues into relevant, verified material:
- Logistics: Track & Trace plus digitalization guidance
- Manufacturing: workflow/integration guidance
- Healthcare: operational workflow and modernization guidance
- Fintech: engineering-capacity model and software engineering content
- Technology Services: delivery partnership and engineering-capacity proof

No email automation will be added; the stored structure will be ready for later CRM and follow-up automation.

## Technical details
- Add focused `industry-conversion` content and component modules rather than expanding the already large general content file.
- Reuse approved Button, Input, Textarea, Select, typography, spacing, colors, and grey introductions.
- Keep all evidence within current verified boundaries. Albany/Skillnova will not be presented as proof unless a current approved source exists in the project.
- No new database table or migration is required because structured details and attribution already use JSON fields.
- Maintain unique existing metadata and canonical URLs for all five pages.

## Verification
- Submit one real industry form and confirm the saved lead includes challenge, CTA, campaign, and journey metadata.
- Test selectable problems, preselection, progressive fields, every CTA destination, and contextual thank-you content.
- Test all five pages at desktop and mobile sizes for early CTA visibility, one-handed form usability, sticky CTA clearance, text fit, overflow, and no runtime errors.
- Confirm existing solution pages and general contact forms remain unchanged.
- Recheck the build output and current route metadata before completion.
