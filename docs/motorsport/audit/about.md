# Sarga Motorsport About — CMS ↔ Frontend Audit

Status: Phase A/B/C complete — 2026-08-29

Route: `/about` and `/{locale}/about`

Frontend entry: `frontend-motorsport/src/app/about/page.tsx`

Primary CMS source: `api::motorsport-about-page.motorsport-about-page`, resolved through `fetchSitePage("about")`

Supporting CMS sources: Motorsport Leadership collection and the dedicated Motorsport page components.

## Mapping

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Page routing | Canonical route | About single type | `routePath` | Active / infrastructure | Used by dedicated page resolution and route registry. |
| Page routing | Alias lifecycle | About single type | `routeAliases` | Lifecycle-only | Maintained by CMS route registry; frontend does not currently redirect aliases. |
| Page identity | Metadata title | About single type | `title` | Active | Used by `generateMetadata()`; the hero uses the hero component title. |
| Header navigation | Nav label | About single type | `navigationLabel` | Not wired | Motorsport header reads the dedicated Top Navigation collection. |
| Governance | Site filter | About single type | `siteScope` | Infrastructure/private | Not public copy. |
| Availability | Coming Soon page | Page Availability | all fields | Active | Controls full-page visibility and fallback media/copy. |
| SEO | Search/social metadata | SEO component | all fields | Active | About `generateMetadata()` maps the SEO component. |
| Hero | Kicker, H1, description, media, alt text | Page Hero | `eyebrow`, `title`, `description`, `backgroundMedia`, `backgroundAlt` | Active | Rendered by `PageHero`; the page passes hero visibility flags. |
| Hero | Metric group | Page Hero → Metric Group Item | `showMetricGroup`, `metrics[]` | Active | Empty values fall back to fixed Motorsport platform metrics. |
| Hero | Hero mobile media / CTAs | Page Hero | `mobileBackgroundMedia`, `primaryCta*`, `secondaryCta*` | Not wired on About | `PageHero` receives only the desktop image and no action props. These are shared fields and remain a compatibility gap. |
| Profile | Image | Profile Section | `media`, `showMedia` | Not wired | The implementation currently uses the page hero image instead of `profileSection.media`. This is a real field-to-frontend mismatch. |
| Profile | Caption/index/title/body | Profile Section | `supportLabel`, `indexLabel`, `title`, `body`, `showIndex`, `showTitle`, `showBody` | Active | Rendered in the profile story. |
| Profile | Operating idea and CTA | Profile Section | `supportBody`, `ctaLabel`, `ctaUrl`, `showCta` | Active with fallback | Support body and CTA are rendered; fallback copy is used if empty. |
| Capabilities | Section heading/copy/visibility | About Capabilities | `enabled`, `showIndex`, `indexLabel`, `showEyebrow`, `showTitle`, `showDescription`, `eyebrow`, `title`, `description` | Active | Passed through `mapAboutCapabilities()` to `SectionHeader`. |
| Capabilities | Capability cards | About Capability Card | `enabled`, `indexLabel`, `title`, `description`, `sortOrder`, `accent` | Active | Active cards are sorted and rendered. |
| Capabilities | Editor key | About Capability Card | `internalName` | Runtime/editor-only | Required for stable identification but not rendered. |
| Team | Section heading/copy/visibility | Team Section | `indexLabel`, `eyebrow`, `title`, `body`, `showIndex`, `showEyebrow`, `showTitle`, `showBody`, `isActive` | Active | Section controls and header copy are rendered. |
| Team | People/cards | Motorsport Leadership collection | `name`, `role`, `group`, `summary`, `portrait`, active/order fields | Active | People are fetched separately and rendered in the team grid. |
| Team | Team section media/items | Team Section | `media`, `items`, `showMedia` | Not wired | The team grid is collection-backed; these generic presentation fields do not reach the frontend. |
| Contact CTA | CTA section visibility | Contact CTA Section | `isActive` | Active | Controls the contact article. |
| Contact CTA | Kicker/title/body/link | Contact CTA Section | `eyebrow`, `title`, `body`, `ctaLabel`, `ctaUrl` | Active with fallback | Values are rendered, but individual show flags and target are not fully respected yet. |
| Contact CTA | Presentation controls | Contact CTA Section | `showEyebrow`, `showTitle`, `showBody`, `showCta`, `ctaTarget` | Partially wired | Visibility and target should be applied in this phase. |
| Ecosystem CTA | Kicker/title/body/link | Ecosystem CTA Section | `eyebrow`, `title`, `body`, `ctaLabel`, `ctaUrl` | Active with fallback | Values are rendered; CTA is currently only shown for a safe internal URL. |
| Ecosystem CTA | Presentation controls | Ecosystem CTA Section | `showEyebrow`, `showTitle`, `showBody`, `showCta`, `ctaTarget` | Partially wired | Visibility and target should be applied in this phase. |
| CTA group | Generic media/items/legal/secondary CTA | Contact/Ecosystem CTA Sections | `media`, `items`, `legalText`, `secondaryCta*`, `theme` | Not wired | Shared presentation-section fields are not used by this About layout. They should not be removed globally until all other page consumers are audited. |

## About cleanup decision

Keep the dedicated About single type and its named section components. Do not split the page into additional types. The safe cleanup is adapter-level: consume the existing Profile section media and honor existing presentation flags for the two CTA sections. Shared unused fields remain documented until the remaining pages have been audited; deleting them now would risk other consumers and existing stored content.

## Changes made

- Profile now uses `profileSection.media` when present, with the existing hero
  image retained as a fallback.
- Contact and ecosystem CTA blocks now honor their CMS eyebrow, title, body,
  CTA visibility, and new-window target controls.
- Added About single-type and capability-component help text.

## Validation target

- About page typecheck, lint, production build, and route render.
- CMS TypeScript/build and JSON schema validation.
- Confirm no changes to staging or remote CMS.

## Validation result

- Motorsport typecheck and production build passed.
- Motorsport ESLint passed with two pre-existing warnings outside this phase.
- CMS TypeScript check passed.
- JSON schema validation and `git diff --check` passed.
- Build logs show expected local CMS-unavailable fallback behavior; no remote
  or staging endpoint was modified.
