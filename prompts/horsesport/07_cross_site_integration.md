# Phase 7 — Cross-Site Integration

Read:

- `docs/multisite/04_three_site_integration_strategy.md`
- `docs/horsesport/05_horsesport_content_model_extensions.md`

Task:

Connect Gateway, Motorsport, and Horse Sport routing.

Required changes:

- Gateway Sarga Horse Sport ecosystem card links to Horse Sport dedicated site.
- Gateway Horse Sport news/events/tickets open on Horse Sport when canonical.
- Motorsport cross-ecosystem links can route to Horse Sport where configured.
- Add/update URL builder utilities for `gateway`, `motorsport`, and `horsesport`.
- Add env vars for Horse Sport URLs in Gateway and Motorsport.
- Update tests or smoke checks for cross-site routes.
- Update `docs/PHASE_PROGRESS.md`.

Do not duplicate Horse Sport pages in Gateway.
