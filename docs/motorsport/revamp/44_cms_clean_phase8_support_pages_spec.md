# MSR-CMS-CLEAN-8 — Contact, Partners, and Experience Single Types

Status: completed 2026-08-15.

Implementation: added localized Contact, Partners, and Experience Single Types
with named support sections and existing collection fallbacks.

## Goal

Migrate the remaining low-risk top-level pages one at a time.

## Page types

- `api::motorsport-contact-page.motorsport-contact-page`: Hero, Information Band, `inquiryControlSection`, `inquiryFormSection`, `finalCtaSection`, availability, SEO.
- `api::motorsport-partners-page.motorsport-partners-page`: Hero, Information Band, `partnerControlSection`, `partnerNetworkSection`, `finalCtaSection`, availability, SEO. Partner records remain separate.
- `api::motorsport-experience-page.motorsport-experience-page`: Hero, Information Band, `experienceControlSection`, `pillarsSection`, `trackSection`, `finalCtaSection`, availability, SEO.

## Implementation order

Contact, then Partners, then Experience. Complete the full test gate and restoration check after each page before touching the next.

## Tests and gate

For each page: EN/ID migration, independent Hero/band/metric/section toggles, image/video, Preview/live parity, immediate revalidation, desktop/mobile, no overflow/errors, and relation/form behavior. Contact submission behavior and mail configuration must not change. Partner records and links must not be duplicated.

## Rollback

Each route can independently return to its legacy adapter.
