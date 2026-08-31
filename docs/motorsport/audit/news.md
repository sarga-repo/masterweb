# Sarga Motorsport News Hub — CMS ↔ Frontend Audit

Status: Field-level audit refreshed — 2026-08-31

Route: `/news` and `/{locale}/news`

Frontend entry: `frontend-motorsport/src/app/news/page.tsx`

Primary CMS source: `api::motorsport-news-page.motorsport-news-page`

Supporting CMS sources: Motorsport News Article collection and Media Gallery collection.

## Audit conclusion

The News single type is connected to the frontend, but it is not yet true that every visible CMS field has a News-page consumer. The core page fields are wired. The remaining exceptions are mostly shared-component fields that are useful on other Motorsport pages but are not used by `/news`.

The previous gallery CTA issue was a real mapper mismatch: the page field was converted to `gallery-cta`, while the News renderer searched for `news-gallery-cta`. The mapper now uses `news-gallery-cta`, and the regression test confirms that `galleryCtaSection.isActive: false` hides the section.

## Mapping

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Page metadata | Title, description, social metadata | News single type + SEO | `title`, hero fields, `seo.*` | Active/fallback | Dedicated News metadata passes the SEO component to `createMetadata()`. `title` and Hero copy remain fallback sources. |
| Routing/governance | Canonical route and ownership | News single type | `routePath`, `routeAliases`, `siteScope` | Active/infrastructure | `routePath` participates in route registry/sitemap; aliases are migration/lifecycle-only; site scope is not public copy. |
| Availability | Coming Soon state | Page Availability | public copy/media fields | Partially active | `pageEnabled`, Coming Soon copy/media, and `launchTargetLabel` are used. `showNotifyCta` and `noIndexWhileDisabled` are not currently consumed by Motorsport News. |
| Hero | Kicker/title/description/background | Page Hero | copy/media/show flags | Partially active | Copy, desktop media, alt text, metric visibility, and basic show flags are passed to `PageHero`. Hero CTA fields and mobile background media are not rendered on this route. |
| Hero archive metric | Published archive count and labels | Page Hero | `showMetricGroup`, `metrics[].isActive`, `metrics[].label` | Partially active | Count is derived from the live article collection; the first two metric labels are editable. Metric values are not rendered by the News Hero. |
| Information band | Editorial control copy and metrics | Page Information Band | copy, visibility flags, `metrics[]` | Active | Rendered through the shared information-band adapter; empty metrics use derived fallback values. |
| Lead story | Feature image, category, date, title, excerpt | Motorsport News Article | `coverImage`, `category`, `publishedDate`, `title`, `excerpt` | Active | First visible article is used as the lead. |
| Lead story CTA | Lead story action | Lead Story Section | `ctaLabel`, `ctaUrl`, `ctaTarget`, `showCta` | Active | The lead CTA consumes the section label, URL, target, and visibility controls; it falls back to “Read lead story” when the label is empty. |
| Archive | Section eyebrow/title/order copy | Archive Intro Section | `eyebrow`, `title`, `body`, `showEyebrow`, `showTitle`, `showBody` | Active | Each of these fields is read by the News page. |
| Archive list | Article rows, images, metadata, links | Motorsport News Article | `title`, `slug`, `coverImage`, `category`, publication date, `excerpt` | Active | Articles are fetched from the dedicated collection and mapped. |
| News collection controls | No rendered element | News single type | `newsControlSection` | Retired | Removed from the schema, editor layout, and stored component links after repository-wide consumer verification. |
| Gallery CTA | Kicker/title/link | Gallery CTA Section | `isActive`, `eyebrow`, `title`, `ctaLabel`, `ctaUrl`, `show*`, `ctaTarget` | Active | The canonical `news-gallery-cta` mapping preserves section visibility and the renderer respects the section controls. |
| Empty/fallback copy | No articles / CMS unavailable | Frontend fallback constants | no CMS field | Fallback only | Curated placeholders preserve renderability when local CMS is unavailable. |
| Generic section fields | Media/items/legal/secondary CTA/theme/index/support | Shared Page Section | generic fields | Not wired on this route | The shared mapper preserves these fields for other pages, but the News renderer does not consume them. Do not delete globally before the rest of the page matrix is audited. |

## Field-level exceptions

### Hero fields not consumed by `/news`

`showPrimaryCta`, `showSecondaryCta`, `primaryCtaLabel`, `primaryCtaUrl`, `primaryCtaTarget`, `secondaryCtaLabel`, `secondaryCtaUrl`, and `secondaryCtaTarget` are mapped by the shared Hero adapter but no Hero CTA is rendered by the News page. `mobileBackgroundMedia` is populated and mapped, but the News page uses the generic `PageHero` with one desktop `backgroundImage` prop.

### Shared Page Section fields not consumed by `/news`

Across `leadStorySection`, `archiveIntroSection`, and `galleryCtaSection`, the following remain generic/shared fields with no News-page consumer: `sectionKey`, `showIndex`, `indexLabel`, `supportLabel`, `supportBody`, `showMedia`, `media`, `legalText`, `secondaryCtaLabel`, `secondaryCtaUrl`, `secondaryCtaTarget`, `items`, `theme`, `listLabel`, `itemCountLabel`, `publicationTabLabel`, `leadershipTabLabel`, and `ecosystemTabLabel`. The lead section also does not use its eyebrow/title/body fields; the archive section does not use CTA fields; the gallery CTA does not use body/media/items/secondary CTA/theme fields.

### Page Availability fields not consumed by Motorsport News

`showNotifyCta` and `noIndexWhileDisabled` are part of the shared `page-availability` component. They are consumed by Gateway code, so they must not be removed from the shared component based on the News audit alone. They can be hidden for this editor or wired deliberately for Motorsport in a separate cross-site change.

No staging environment, remote CMS, or destructive migration was touched.

## Changes made

- News metadata now consumes the dedicated SEO component.
- Lead-story CTA now consumes its section label, URL, target, and visibility
  controls.
- Archive and gallery CTA presentation flags are now respected.
- Corrected the News `galleryCtaSection` mapper key so `isActive: false`
  reliably removes the gallery CTA instead of rendering fallback copy.
- Hero archive labels can be supplied by CMS metric labels while the count
  remains derived from the live article collection.
- Added News single-type help text and retired the unused legacy control
  section from schema, layout, and stored component links.

## Validation result

- Motorsport typecheck passed.
- CMS TypeScript check and JSON schema validation passed.
- No staging environment or remote CMS was touched.
