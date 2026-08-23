# MSR-CMS-CLEAN-3 — Gallery legacy-field cleanup

Date: 2026-08-23
Status: completed

## What changed

- Removed the frontend read of legacy `gallery-intro` from the Gallery route.
- Gallery hero eyebrow and hero metric visibility now come from the canonical
  `motorsport.page-hero` component.
- Kept `archiveSection` as the only Gallery body section and preserved its
  existing visibility/copy/media behavior.
- Removed the legacy `gallery-intro` alias from the Single Type migration map;
  the migration still copies its old eyebrow into the canonical hero during
  migration for rollback-safe content continuity.
- Updated the static alignment audit so Gallery no longer reports a live legacy
  section dependency.

## Verification

- Motorsport typecheck passed.
- CMS typecheck passed.
- Motorsport lint passed with the two pre-existing warnings in Gallery and
  BrandLogo.
- Prettier and `git diff --check` passed.
- Static alignment audit passed with zero structural issues and 20 remaining
  documented findings across the wider cleansing scope.

## Limitations

- Live authenticated CMS preview/live comparison was not run in this phase.
- Existing legacy records are retained for rollback; no database content was
  deleted.
