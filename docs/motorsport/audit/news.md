# Sarga Motorsport News Hub — CMS ↔ Frontend Audit

Status: Phase A/B/C complete — 2026-08-29

Route: `/news` and `/{locale}/news`

Frontend entry: `frontend-motorsport/src/app/news/page.tsx`

Primary CMS source: `api::motorsport-news-page.motorsport-news-page`

Supporting CMS sources: Motorsport News Article collection and Media Gallery collection.

## Mapping

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Page metadata | Title, description, social metadata | News single type + SEO | `title`, hero fields, `seo.*` | Partially wired | Title/hero fallback are used; SEO fields are not passed to `createMetadata()`. Fix in Phase B. |
| Routing/governance | Canonical route and ownership | News single type | `routePath`, `routeAliases`, `siteScope` | Active/infrastructure | Aliases remain lifecycle-only; site scope is not public copy. |
| Availability | Coming Soon state | Page Availability | all fields | Active | Controls page visibility and disabled-page presentation. |
| Hero | Kicker/title/description/background | Page Hero | copy/media/show flags | Active | Passed to `PageHero`. |
| Hero archive metric | Published archive count and labels | Page Hero / Information Band | no direct count field; information-band metric labels | Partially hardcoded | Count is derived correctly from the live article collection, but “Published archive” and “Motorsport stories” are fixed labels. CMS metric labels can supply them with a fallback. |
| Information band | Editorial control copy and metrics | Page Information Band | copy, visibility flags, `metrics[]` | Active | Rendered through the shared information-band adapter; empty metrics use derived fallback values. |
| Lead story | Feature image, category, date, title, excerpt | Motorsport News Article | `coverImage`, `category`, `publishedDate`, `title`, `excerpt` | Active | First visible article is used as the lead. |
| Lead story CTA | Lead story action | Lead Story Section | `ctaLabel`, `ctaUrl`, `ctaTarget`, `showCta` | Not wired | “Read lead story” is hardcoded and section CTA fields are ignored. |
| Archive | Section eyebrow/title/order copy | Archive Intro Section | `eyebrow`, `title`, `body`, `showEyebrow`, `showTitle`, `showBody` | Partially active | Copy is active, but individual show flags are not applied. |
| Archive list | Article rows, images, metadata, links | Motorsport News Article | `title`, `slug`, `coverImage`, `category`, publication date, `excerpt` | Active | Articles are fetched from the dedicated collection and mapped. |
| News collection controls | No rendered element | News single type | `newsControlSection` | Retired | Removed from the schema, editor layout, and stored component links after repository-wide consumer verification. |
| Gallery CTA | Kicker/title/link | Gallery CTA Section | `eyebrow`, `title`, `ctaLabel`, `ctaUrl`, `show*`, `ctaTarget` | Partially active | Copy and safe internal URL are used; show flags and target are not fully respected. |
| Empty/fallback copy | No articles / CMS unavailable | Frontend fallback constants | no CMS field | Fallback only | Curated placeholders preserve renderability when local CMS is unavailable. |
| Generic section fields | Media/items/legal/secondary CTA/theme | Shared Page Section | generic fields | Not wired on this route | Do not delete globally before the rest of the page matrix is audited. |

## Changes planned for Phase B

- Pass SEO values to `createMetadata()`.
- Use CMS section CTA fields for the lead-story and gallery actions.
- Apply archive/gallery section display flags and CTA target.
- Use information-band metric labels for the hero archive labels when supplied.
- Keep the single-type schema focused on the rendered archive, editorial
  presentation, and publication controls.

No staging environment, remote CMS, or destructive migration was touched.

## Changes made

- News metadata now consumes the dedicated SEO component.
- Lead-story CTA now consumes its section label, URL, target, and visibility
  controls.
- Archive and gallery CTA presentation flags are now respected.
- Hero archive labels can be supplied by CMS metric labels while the count
  remains derived from the live article collection.
- Added News single-type help text and retired the unused legacy control
  section from schema, layout, and stored component links.

## Validation result

- Motorsport typecheck passed.
- CMS TypeScript check and JSON schema validation passed.
- No staging environment or remote CMS was touched.
