# MSR-CMS-CLEAN-4 — About Page Single Type

Status: completed 2026-08-15.

Implementation: added the localized About Single Type, named profile/team/CTA
fields, capabilities preservation, and new-first adapter with RBAC isolation.

## Goal

Move About to a dedicated localized Single Type without changing leadership data, Coming Soon behavior, or the approved layout.

## Schema

Create `api::motorsport-about-page.motorsport-about-page` with:

- internal title;
- Hero;
- Information Band;
- named `profileSection`;
- existing About capabilities component;
- named `teamSection`, `contactCtaSection`, and `ecosystemCtaSection`;
- page availability;
- SEO.

Leadership people remain in `Leadership Person` and are not duplicated.

## Migration and frontend

- Migrate EN/ID hero, `profile`, capabilities, `team-intro`, `contact-cta`, `ecosystem-cta`, availability, and SEO.
- Seed approved Information Band copy and up to three metrics.
- Add exact Preview/revalidation/RBAC support.
- Use new-first/legacy-second published reads.
- Preserve hero stacking, colored leadership portraits, four-column desktop grid, CTA routing, and current visual composition.

## Tests and gate

Test every named section independently, hero image/video and copy, band metric group, leadership relation updates, page availability, EN/ID, Draft/Published parity, desktop/mobile, and immediate revalidation. Proceed only when all pass.

## Rollback

Switch About back to the legacy Site Page adapter.
