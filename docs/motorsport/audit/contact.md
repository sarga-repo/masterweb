# Sarga Motorsport Contact — CMS ↔ Frontend Audit

Status: Phase A/B/C complete — 2026-08-29

Route: `/contact` and `/{locale}/contact`

Frontend entry: `frontend-motorsport/src/app/contact/page.tsx`

Primary CMS source: `api::motorsport-contact-page.motorsport-contact-page`

## Mapping

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Page metadata | Title/description/social metadata | Contact single type + SEO | `title`, hero fields, `seo.*` | Not wired | Contact has no `generateMetadata()`; add dedicated SEO consumption in Phase B. |
| Routing/governance | Canonical path/ownership | Contact single type | `routePath`, `routeAliases`, `siteScope` | Active/infrastructure | Alias redirect remains lifecycle-only. |
| Availability | Coming Soon state | Page Availability | all fields | Active | Controls disabled page. |
| Hero | Kicker/title/description/background | Page Hero | copy/media/show flags | Active | Passed to `PageHero`. |
| Information band | Inquiry-control copy/metrics | Page Information Band | copy, show flags, `metrics[]` | Active | Rendered through the shared adapter. |
| Inquiry form | Section header | Inquiry Form Section | heading/body/show flags | Active | Header is CMS-driven. |
| Inquiry form | Field labels/options/submission behavior | Contact Form component | no CMS fields | Fixed UI/system | The form schema, validation, privacy/anti-bot behavior, and status messages are application UI. |
| Contact channels | Sidebar labels/emails | Inquiry Form Section → Section Item | `items[].isActive`, `title`, `description`, `href` | Not wired | Current page hardcodes four email channels and a talent-programme note. Wire section items with safe mailto URLs in Phase B; retain fallback only for empty CMS content. |
| Final CTA | Eyebrow/title | Final CTA Section | `eyebrow`, `title`, `showEyebrow`, `showTitle` | Active/partially wired | Copy is active; show controls are not fully respected. |
| Final CTA | Main and secondary links | Final CTA Section | `ctaLabel`, `ctaUrl`, `ctaTarget`, `secondaryCtaLabel`, `secondaryCtaUrl`, `secondaryCtaTarget`, `showCta` | Partially wired | Values are used with fallbacks, but target and visibility controls are ignored. |
| Final CTA | Body copy | Final CTA Section | `body`, `showBody` | Not wired | The current layout has no body element. Wire it below the title when populated. |
| Legacy control section | No rendered element | Contact single type | `inquiryControlSection` | Retired | Removed from the schema, editor layout, and stored component links after repository-wide consumer verification. |
| Generic fields | Media/items/theme/legal | Shared Page Section | generic fields | Partially used | Items will be used for contact channels; media/theme/legal remain unused by this layout. |

## Changes planned for Phase B

- Add `generateMetadata()` and consume Contact SEO.
- Read contact channel items from the Inquiry Form section.
- Honor Final CTA show/target controls and render its optional body.
- Add Contact single-type help text.

No staging environment, remote CMS, or destructive migration was touched.

## Changes made

- Added Contact page metadata using the dedicated SEO component.
- Contact channel sidebar records now come from Inquiry Form section items
  when present, with the existing channels retained as empty-CMS fallbacks.
- Final CTA now honors CMS show/target controls and renders optional body copy.
- Added Contact single-type help text.

## Validation result

- Motorsport typecheck passed.
- CMS TypeScript check and JSON schema validation passed.
- No staging environment or remote CMS was touched.
