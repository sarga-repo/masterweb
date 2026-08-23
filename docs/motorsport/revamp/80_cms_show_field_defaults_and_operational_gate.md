# CMS editorial `show*` defaults and operational gate

Phase: `MSR-CMS-OPS-1`
Status: Done — 2026-08-23

## Decision

All editorial boolean fields whose names begin with `show` default to `true`.
Existing null/missing values are backfilled to explicit `true` values so the
Strapi Content Manager does not display an ambiguous unselected toggle.

The fields `showOnGateway`, `showOnMotorsport`, and `showOnHorseSport` are not
editorial presentation toggles. They control cross-site distribution and keep
their intentional site-specific defaults to prevent accidental publication on
the wrong frontend.

## Implementation

- Reusable CMS schemas already declare `default: true` for all 21 editorial
  `show*` fields.
- `cms/src/migrations/motorsport-show-field-defaults.ts` runs from Strapi
  bootstrap only when `MOTORSPORT_SHOW_FIELD_DEFAULTS_MODE` is set to
  `dry-run`, `apply`, or `verify`.
- The migration is idempotent, updates only null/missing values, preserves
  explicit `false`, handles localized draft documents, and includes retained
  compatibility control components.
- `cms/scripts/audit-show-field-defaults.mjs` fails if a future editorial
  `show*` boolean lacks `default: true`.

## Runbook

```bash
MOTORSPORT_SHOW_FIELD_DEFAULTS_MODE=dry-run \
  docker compose --profile apps up -d --force-recreate strapi

MOTORSPORT_SHOW_FIELD_DEFAULTS_MODE=apply \
  docker compose --profile apps up -d --force-recreate strapi

MOTORSPORT_SHOW_FIELD_DEFAULTS_MODE=verify \
  docker compose --profile apps up -d --force-recreate strapi
```

After verification, restart with the normal Compose environment so the mode is
`off`. Take the normal database backup before applying this runbook in staging
or production.

## Evidence

- Local dry run found 20 page documents and 412 candidates; 12 unsupported
  `worldSection` keys were excluded during tracing.
- Local apply repaired 484 valid missing values without changing explicit
  `false` values.
- Local verify returned 20 documents, 0 missing values, and 0 writes.
- Static audit passed for 21 editorial toggles and preserved 6 distribution
  controls.
- Strict CMS/frontend alignment audit passed for all ten Motorsport pages.
- CMS and frontend production builds passed; local `/admin`, page API, and
  frontend home smoke checks returned HTTP 200.
- Authenticated browser UAT passed for all ten English and ten Indonesian page
  editors: every rendered `show*` control had an explicit True or False
  selection. Homepage Preview opened successfully with no console errors.

## Remaining operational gates

The implementation and local authenticated-editor gates are complete. Staging
still needs publish parity, desktop/mobile show/hide permutations, and the
release/rollback rehearsal.
