# MSR-CMS-CLEAN-6 — News Hub Single Type

Status: completed 2026-08-15.

Implementation: added the localized News hub Single Type and named editorial
fields with the existing News Article collection left as the detail source.

## Goal

Move only `/news` to a dedicated Single Type. News detail remains driven by `News Article`.

## Schema

Create `api::motorsport-news-page.motorsport-news-page` with Hero, Information Band, named `newsControlSection`, `leadStorySection`, `archiveIntroSection`, `galleryCtaSection`, page availability, and SEO.

## Migration and frontend

- Migrate EN/ID hub fields, media, CTA values, and enabled states.
- Preserve article queries, lead-story selection, pagination/archive behavior, warm gradient design, decoration, and detail links.
- Add exact Preview/revalidation/RBAC and dual-read support.

## Tests and gate

Test all named controls, Hero and band independently, 0–3 metrics, empty/published/draft articles, pagination, localization, mobile/desktop, Preview/live parity, and immediate article/page invalidation. Proceed only when all pass.

## Rollback

Switch `/news` back to the legacy Site Page adapter; News Article records remain unchanged.
