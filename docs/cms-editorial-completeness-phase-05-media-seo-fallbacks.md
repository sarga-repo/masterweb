# CMS Editorial Completeness — Phase 05 Media, SEO, and Fallbacks

## Objective

Ensure no editorial media, SEO data, or fallback behavior bypasses CMS contracts.

## Scope

- Media field/populate coverage.
- Alt text and caption requirements.
- Open Graph/social images.
- Locale parity and whole-record fallback.
- Missing-record vs missing-field behavior.
- Observability for CMS failures.

## Acceptance Criteria

- [x] Every rendered editorial image has CMS source or documented outage fallback.
- [x] Every public page has CMS SEO or approved system fallback.
- [x] Fallbacks cannot silently replace incomplete successful CMS records.
- [x] Locale behavior remains whole-record, not mixed-field.

## Implementation Notes

- Horse Sport page queries now populate `seo.ogImage` and expose CMS SEO overrides.
- Horse Sport hero, event-card, and news-card media use resilient image fallbacks.
- Horse Sport Strapi failures emit development-only collection diagnostics.
- Gateway and Motorsport existing localized clients already enforce whole-record
  locale fallback and CMS SEO population.
