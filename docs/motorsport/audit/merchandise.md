# Sarga Motorsport Merchandise — CMS ↔ Frontend Audit

Status: Phase A/B/C complete — 2026-08-29

Route: `/merchandise` and `/{locale}/merchandise`

Frontend entry: `frontend-motorsport/src/app/merchandise/page.tsx`

Primary CMS source: `api::motorsport-merchandise-page.motorsport-merchandise-page`

Supporting CMS source: Motorsport Merchandise collection.

## Mapping

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Page metadata | Title/description/social metadata | Merchandise single type + SEO | `title`, hero fields, `seo.*` | Partially wired | Route metadata is static and does not consume `seo`; fix in Phase B. |
| Routing/governance | Canonical path/ownership | Merchandise single type | `routePath`, `routeAliases`, `siteScope` | Active/infrastructure | Alias redirect gap remains documented. |
| Availability | Coming Soon state | Page Availability | all fields | Active | Controls disabled page. |
| Hero | Kicker/title/description/background | Page Hero | copy/media/show flags | Active | Passed to `PageHero`. |
| Information band | Merch control copy/metrics | Page Information Band | copy, show flags, `metrics[]` | Active | Metrics are derived from collection values when CMS metrics are empty. |
| Catalogue | Section header | Catalogue Section | `indexLabel`, `eyebrow`, `title`, `body`, show flags | Active | Header is CMS-driven. |
| Catalogue | Product cards | Motorsport Merchandise collection | title, slug, description, image, price/availability, external URL | Active | Collection fields are mapped to `MerchandiseCard`; external URLs are safe-validated. |
| Final CTA | Eyebrow/title/body/link | Final CTA Section | `eyebrow`, `title`, `body`, `ctaLabel`, `ctaUrl` | Active with fallback | Copy is rendered, but show flags and target are not yet applied. |
| Merchandise control section | No rendered element | Merchandise single type | `merchControlSection` | Retired | Removed from the schema and editor layout; no stored links were present. |
| Generic section fields | Media/items/legal/secondary CTA/theme | Catalogue/Final CTA sections | shared page-section fields | Not wired | Shared fields remain until all Motorsport page consumers are audited. |
| Checkout/cart/account | No internal commerce | Frontend/CMS | none | Intentional exception | The page is a showcase and approved partner/direct-inquiry redirect only. |

## Changes planned for Phase B

- Wire Merchandise page metadata and SEO.
- Honor Final CTA show/target controls.
- Add Merchandise single-type help text.

No staging environment, remote CMS, or destructive migration was touched.

## Changes made

- Merchandise metadata now consumes the dedicated SEO component.
- Final CTA now honors CMS visibility and new-window target controls.
- Added Merchandise single-type help text.

## Validation result

- Motorsport typecheck passed.
- CMS TypeScript check and JSON schema validation passed.
- No staging environment or remote CMS was touched.
