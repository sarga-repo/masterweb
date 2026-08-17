# MSR-THEME-4/5 — Vendor presets, UAT, and handover

Status: Completed 2026-08-16  
Scope: Motorsport-only visual implementation and release validation.

## Validation matrix

- Homepage, About, Events, News, Gallery, Merchandise, Tickets, Contact,
  Partners, Experience, detail pages, FIA, and IJTC routes.
- Desktop, mobile, English, and Indonesian.
- `current-motorsport`, `vendor-editorial`, and `vendor-night`.
- CMS draft Preview versus published live output.
- Header, footer, information bands, metric groups, cards, forms, ticket CTAs,
  media overlays, separators, hover states, focus states, and reduced motion.
- Motorsport Admin versus all other site roles.
- Production build, typecheck, lint, Docker smoke test, and cache revalidation.

## Vendor proposal acceptance checks

- Confirm deep navy/blue, warm cream/light, and charcoal/black sections render
  with the correct text contrast.
- Confirm full-bleed hero/media slots retain their CMS-selected images and use
  a readable theme scrim without replacing the media.
- Confirm crimson, orange, cyan, and yellow accents are used consistently for
  actions, eyebrows, metrics, focus, active states, and separators.
- Confirm the blue information band uses warm-white copy and cyan/bright
  metrics, including its `showMetricGroup` behavior.
- Confirm light sections use blue Owners Wide headings with red/orange
  Noto Sans eyebrows and dark body text.
- Confirm dark sections use warm-white Owners Wide headings with red/orange
  Noto Sans eyebrows and readable muted copy.
- Confirm thin-line and color-block separators remain visible and accessible.
- Confirm About keeps the image hero → blue information band → warm editorial
  content → dark timeline/footer surface sequence.
- Confirm Owners Wide and Noto Sans remain the display/body font assignments at
  desktop and mobile sizes without clipping or fallback drift.

## Handover

Document where Motorsport Admin selects the preset, how to publish it, how to
restore `current-motorsport`, and how to verify the result in both locales.

The phase is complete only when the PDF's color/composition direction is
visually matched without moving or removing the “Motion, Recorded” gallery
treatment.

## Completion record

- Implemented the vendor editorial and vendor night preset overrides using
  existing approved Motorsport brand values; no arbitrary editor CSS is
  accepted.
- Preserved full-bleed media, information-band metric controls, section
  visibility, typography, routes, and the out-of-scope gallery treatment.
- Validation completed: Motorsport lint, TypeScript, production build, CMS
  TypeScript compilation and production admin build, read-only CMS single-type
  API validation (all ten dedicated page endpoints returned HTTP 200), root
  theme-attribute smoke test, preview-context tests, and `git diff --check`.
- Authenticated browser UAT completed for all three CMS presets. Motorsport
  Admin changed and published `vendor-editorial`, `current-motorsport`, and
  `vendor-night`; the frontend rendered the matching root attributes
  (`theme-vendor-editorial`, `theme-current-motorsport`, and
  `theme-vendor-night`) after each publish. The final CMS value was restored to
  `current-motorsport`.
- Browser UAT also confirmed the homepage rendered without the invalid
  `StrapiPreviewFetchError` after the generated Next.js `.next` dev cache was
  rebuilt. `/api/revalidate` now resolves (GET returns the expected 405 rather
  than 404), and the root route returns HTTP 200.
