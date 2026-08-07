# Phase 2 — Shared CMS Three-Site Model

Read:

- `docs/multisite/03_shared_cms_content_sync_strategy.md`
- `docs/multisite/04_three_site_integration_strategy.md`
- `docs/horsesport/05_horsesport_content_model_extensions.md`
- `strapi/content-types.json`

Task:

Extend the shared Strapi CMS model to support Horse Sport without creating a second CMS.

Required changes:

- Add `horsesport` to all relevant `siteScope` enums.
- Add `showOnHorseSport` visibility flag where needed.
- Add Horse Sport event fields for discipline, race class, track type, hospitality, schedule, and stable access.
- Add Horse Sport news categories.
- Extend Ticket CTA filtering for Horse Sport.
- Update seed/demo content with at least one Horse Sport business, event, article, ticket CTA, and gallery item.
- Add typed API query helpers for `siteKey = horsesport`.
- Update `docs/PHASE_PROGRESS.md`.

Do not duplicate existing Motorsport collections.
