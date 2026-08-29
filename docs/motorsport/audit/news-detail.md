# Motorsport News Detail — CMS ↔ Frontend Audit

Route: `/news/[slug]`.

Implementation traced through `frontend-motorsport/src/app/news/[slug]/page.tsx`, `frontend-motorsport/src/lib/cms-data.ts`, and the `motorsport-news-article` schema.

## Mapping

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Metadata | title, description, canonical, article type, OG image | News Article / SEO | `title`, `excerpt`, `seo`, `coverImage` | actively used | `generateMetadata` uses article SEO with title/excerpt fallbacks. |
| Hero | kicker, title, description, background image | Motorsport Presentation → Hero | `motorsportPresentation.hero.*` | actively used / fallback | Hero presentation overrides article title/excerpt; category/date and article cover remain fallbacks. |
| Editorial note | eyebrow, title, description, metrics | Motorsport Presentation → Information Band | `informationBand.*` | actively used / fallback | Custom metrics are mapped; category, published date, and calculated reading time are fallback metrics. |
| Story cover | image and alt text | News Article identity | `coverImage`, media `alternativeText` | actively used | The mapped cover image is reused for the detail frame. |
| Story body | rich editorial article | News Article identity | `body` | actively used / fallback | Missing body displays a publication-state message rather than an empty article. |
| Story file | published date, category, read time | News Article identity | `publishedDate`, `category`, `body` | actively used / derived | Read time is calculated from CMS body length; labels are stable UI taxonomy. |
| Related stories | cards, title, category/date, image, links | News Article collection | `fetchArticles()` → `title`, `slug`, `coverImage`, `category`, `publishedDate`, `excerpt` | actively used | Related stories are the published article collection excluding the current article. |
| Navigation | All news and full archive links | Frontend route chrome | none | hardcoded in frontend | Stable route labels/destinations, not editorial article content. |
| Related card action | accessible “Read …” label | News Article identity | `title` | actively used | Accessible label is generated from the CMS title. |

## Field disposition

The active article fields are `title`, `slug`, `coverImage`, `excerpt`, `body`, `category`, `publishedDate`, `seo`, and the detail presentation component. `isHotTopic`, `author`, `relatedEvent`, `relatedGallery`, and `relatedBusinesses` are not rendered by this detail route or the current related-story query. They should be treated as candidate future/editorial integration fields, not removed from the collection until repository-wide usage and existing records have been checked.

`author` is particularly important to verify before removal because it may be intended for a future byline even though no current frontend element renders it. It is not silently exposed as a field on the page.

## Structure and cleanup decision

The presentation component correctly groups Hero and Information Band fields. Article content remains in the article identity group because it is also consumed by archive cards and metadata. Stable labels such as “Story file”, “Published”, and “Related stories” are interface chrome; changing them per article would add editor burden without representing article content.

No destructive schema change is approved in this phase. The remaining fallback strings are publication-state safety copy for incomplete records. Legacy or future-facing article relations remain documented as candidates pending a full cross-route consumer check.

## Validation

- `frontend-motorsport`: typecheck passed after the detail-route audit work.
- `cms`: TypeScript check passed.
- JSON schemas and `git diff --check` passed.
