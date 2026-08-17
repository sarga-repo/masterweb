# MSR-CMS-CLEAN-5 — Events Hub Single Type

Status: completed 2026-08-15.

Implementation: added the localized Events hub Single Type and named control,
programme, and calendar fields with published fallback compatibility.

## Goal

Move only the `/events` hub composition to a dedicated Single Type. Event and Motorsport Program records remain collections.

## Schema

Create `api::motorsport-events-page.motorsport-events-page` with Hero, Information Band, named `eventControlSection`, `programmesSection`, `calendarSection`, page availability, and SEO.

## Migration and frontend

- Migrate EN/ID hub fields and all enabled states.
- Seed band metrics appropriate to the hub; labels and values remain editable.
- Preserve Event dropdown behavior, programme cards, event/calendar data, ticket links, sorting, and canonical detail routes.
- Add exact Preview/revalidation/RBAC and dual-read support.

## Tests and gate

Test Hero, band, metric group, three named sections, empty Event/Program collections, menu dropdown links, Draft/Published EN/ID, immediate revalidation, keyboard navigation, desktop/mobile, and no regressions on detail routes. Proceed only when all pass.

## Rollback

Switch `/events` back to its legacy Site Page adapter; collections are unchanged.
