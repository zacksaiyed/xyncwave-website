# Xyncwave Enterprise Demand-Generation Platform

## Goal
Build the complete Xyncwave website as a global, enterprise-grade demand-generation platform: problem-led positioning, distributed proof, clear conversion paths, scalable content, and secure lead capture. The approved brand artwork, colors, typography, tagline, and logo rules remain locked.

## 1. Brand and design foundation
- Extract and use the exact approved horizontal, stacked, and monogram artwork from the supplied v4 brand guide; create the favicon from the approved monogram without redrawing it.
- Establish the approved Carbon, White, Electric Blue, Slate, Graphite, and Mist palette as semantic tokens, with Inter throughout.
- Create a restrained architectural visual language using grid lines, diagonal geometry, connected-system diagrams, dark/light transitions, and selective motion with reduced-motion support.
- Build responsive foundations for desktop and mobile, including visible focus states, keyboard-safe navigation, concise mobile menus, and contextual mobile CTAs.

## 2. Scalable content and component system
- Define structured models for solutions, industries, case studies, insights, FAQs, CTAs, testimonials, lead magnets, and campaign pages.
- Build shared site elements: header and meaningful mega menus, footer, breadcrumbs, heroes, proof blocks, problem selectors, process/trigger/objection sections, case-study and insight modules, FAQ, conversion sections, and mobile CTA.
- Build reusable commercial templates so content is consistent without making pages repetitive or template-like.
- Add a reusable metadata and structured-data layer for Organization, WebSite, Service, Article, and BreadcrumbList where appropriate.

## 3. Core routes and conversion architecture
- Build `/`, `/solutions`, `/industries`, `/case-studies`, `/insights`, `/about`, `/why-xyncwave`, `/contact`, `/start-a-conversation`, `/technology-partnership`, `/privacy`, and `/terms`.
- Build all nine solution pages:
  - Software Engineering
  - AI & Intelligent Automation
  - Cloud & Platform Engineering
  - Digital Transformation
  - Application Modernization
  - Data Engineering & Analytics
  - API & System Integration
  - Engineering Capacity
  - ERP / Business Systems
- Build all five industry pages:
  - Logistics & Supply Chain
  - Manufacturing
  - Healthcare
  - Fintech
  - Technology & IT Services
- Build the Track & Trace and Engineering Capacity case-study pages, using only supplied facts and explicit verification placeholders where evidence is missing.
- Build an insights system with a focused initial set of substantial decision-stage articles rather than thin filler content.

## 4. Homepage
- Implement the approved problem-first positioning and one dominant conversion path.
- Include immediate credibility, pain recognition, outcome framing, strongest available proof, interactive buyer-path routing, prioritized capabilities, industry intelligence, delivery approach, objections, useful insights, and the final conversion section.
- Use the official tagline only at deliberate brand moments.
- Replace unsupported testimonials, metrics, CEO quotes, portraits, and client details with polished editorial placeholders clearly marked for approval.

## 5. Lead capture and assessments
- Enable Lovable Cloud for secure lead storage and server-side form processing.
- Build a progressive general conversation flow that branches for digitalization, engineering capacity, AI, and partnership intent.
- Build three assessments: Digitalization Readiness, Engineering Capacity, and AI Opportunity, each providing useful non-diagnostic results before final contact capture.
- Validate every field in the browser and on the server; add length limits, honeypot readiness, safe error states, and no exposed credentials.
- Store attribution and qualification context: landing/current/referring page, UTM fields, CTA label and placement, industry, solution, lead type, assessment result, and conversion path.
- Add contextual thank-you pages for general, digitalization, engineering, AI, and partnership leads.
- Keep CRM delivery behind an adapter so HubSpot, Salesforce, Zoho, Pipedrive, webhooks, or another CRM can be added later without rebuilding forms.

## 6. Campaign landing-page engine
- Create a reusable minimal-navigation campaign template with one audience, one problem, one offer, one primary CTA, contextual proof, objections, and a matching form.
- Populate the initial campaign routes for logistics digitalization, manufacturing digitalization, software-agency engineering capacity, white-label development, fintech engineering, AI automation, and application modernization.

## 7. Analytics, SEO, and discoverability
- Add a reusable analytics event abstraction for page views, CTA interactions, selectors, form and assessment steps, case-study engagement, article views, video actions, downloads, scheduler intent, outbound links, and generated leads.
- Leave Google Analytics, Tag Manager, LinkedIn, Meta, CRM, and scheduling IDs unconfigured until real values are supplied.
- Add unique route metadata, canonical URLs, social metadata, semantic headings, descriptive links, internal relationships, and relevant JSON-LD.
- Add crawl-ready robots handling and generate a sitemap once a public domain exists; avoid baking the preview URL into production SEO.

## 8. Verification and refinement
- Test every route, navigation path, CTA, form branch, assessment, validation state, and thank-you flow.
- Review key desktop and mobile sizes for overlap, hierarchy, readability, CTA access, and responsive behavior.
- Check diagnostics, accessibility fundamentals, metadata, broken links, content duplication, unsupported claims, proof frequency, and conversion dead ends.
- Run a final CRO critique from executive, operations, technology, agency, procurement, mobile, search, and AI-summary perspectives, then refine weak areas before completion.

## Content constraints
- No invented metrics, customers, testimonials, certifications, awards, partnerships, executive quotes, addresses, phone numbers, or email addresses.
- Missing verified material will appear only in clearly labeled editorial placeholders that are easy to replace.
- No production analytics, CRM, scheduling, social, or video integration is activated without approved IDs or URLs.

## Technical notes
- Keep TanStack Start routing and create every linked page as a real route.
- Use Tailwind v4 semantic tokens and shared variants; no scattered brand color values in page code.
- Use server functions with schema validation for lead submissions and Cloud policies/grants appropriate to the stored data.
- Keep imagery local/CDN-backed, optimized, lazy-loaded where appropriate, and never hotlinked.
