# XWC visual system redesign

## Goal
Apply the attached XWC light-first visual system across the existing website while preserving all current navigation, content, page flow, CTA wording, buttons, links, forms, and functionality exactly as they are.

## What will change
- Replace the current dark, image-led visual direction with the reference’s quiet, editorial, light-first presentation.
- Apply the approved Carbon, White, Electric Blue, Slate, Graphite, and Mist palette through shared design tokens.
- Match the reference’s Inter typography, softer hierarchy, restrained blue accents, premium whitespace, gutters, borders, and reading widths.
- Restyle the shared header, menus, buttons, page introductions, editorial sections, cards, forms, assessments, related-content areas, closing invitation, footer, error states, and mobile action.
- Recompose existing sections visually where needed, without changing their order, words, destinations, or behavior.
- Retain the current approved logo assets and display them without distortion or substitution.
- Reduce decorative image dominance; keep existing imagery only where it supports the existing page content.

## Content-safety rules
- No copy changes, including visible labels, CTA text, metadata, and form messages.
- No route, navigation, link, page-order, CTA-strategy, or interaction changes.
- No new claims, metrics, products, sections, or functionality.
- No generated or redrawn logo artwork.

## Technical approach
- Update global semantic tokens and common utilities first so the new system is consistent sitewide.
- Update shared components next: buttons, shell, page sections, visual frames, forms, assessments, static layouts, and related-content blocks.
- Apply narrowly scoped route-level presentation adjustments only where shared styling cannot match the reference.
- Keep TanStack Start routing and all existing behavior intact.

## Verification
- Check all content routes retain their existing text and destinations.
- Validate desktop and mobile rendering at representative widths, including menu, forms, assessments, footer, and long pages.
- Check keyboard focus, reduced motion, text wrapping, horizontal overflow, images, console errors, and broken links.
- Confirm the latest preview build is clean before completion.
