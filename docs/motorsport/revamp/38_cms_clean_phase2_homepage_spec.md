# MSR-CMS-CLEAN-2 — Homepage Single Type Pilot

Status: completed 2026-08-15.

Implementation: added the localized `motorsport-home-page` Single Type,
idempotent opt-in migration, public read permission, exact Preview mapping,
revalidation target, and new-first/legacy-second homepage adapter.

## Goal

Move `/` and `/id` to a dedicated localized `Motorsport Home Page` Single Type while preserving the carousel, information band, World section, ticket card, visibility controls, and all current homepage behavior.

## CMS schema

Create `api::motorsport-home-page.motorsport-home-page` with named fields only:

- internal title;
- homepage hero/carousel component;
- `informationBand` using the new shared band;
- existing World of Motorsport component;
- existing homepage ticket component;
- named visibility/content fields for upcoming events, latest news, connected records, and gallery;
- page availability;
- SEO.

Do not include `siteScope`, `pageKind`, `routePath`, unrelated standard hero fields, or arbitrary dynamic-zone keys.

## Migration

1. Copy EN and ID data from the current Motorsport home Site Page.
2. Preserve every media document, relation, order, enabled state, CTA, and localized value.
3. Make migration idempotent and log field counts, never secrets or content bodies.
4. Add dual-read: new Single Type first, legacy home Site Page only when no published new entry exists.

## Preview and revalidation

- Map the new UID exactly to `/` or `/id`.
- Preview selected Draft document and locale only.
- Revalidate home for both locales on create/update/publish/unpublish.
- Update API token and Motorsport Admin permissions.

## Tests

- Reversible toggles for hero, information band, metric group, each homepage section, and ticket card.
- Hero slide image/video and mobile fallback.
- All Information Band labels/values editable; 0–3 active metrics.
- Ticket image/copy/URL behavior unchanged.
- Draft differs from live until publish; publish/unpublish invalidates immediately.
- EN/ID desktop and mobile browser comparison against pre-migration screenshots.

## Exit gate

The homepage must be visually equivalent before and after migration, except for editor-form simplification. Keep the legacy home record unchanged.

## Rollback

Disable the new home adapter and return to the legacy Site Page read.
