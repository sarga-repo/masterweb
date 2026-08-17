# MSR-CMS-UAT-2 — Exact Preview Document, Locale, and Status

Status: completed 2026-08-15.

## Goal

Ensure the Strapi Preview button renders the exact record the editor saved.

## Implementation

- Include approved UID, `documentId`, locale, status, and canonical route in the
  server-signed Preview activation contract.
- Store only a short-lived, signed, HTTP-only Preview context; reject unknown
  UIDs, routes, locales, or mismatched signatures.
- Fetch the selected Site Page by `documentId` during Preview instead of using
  broad `pageKind` plus `limit=1` selection.
- Keep related collections in draft mode while preserving site-scope filters.
- Make locale exact in Preview. A missing Indonesian localization must produce
  an editor diagnostic rather than silently showing English as if it were the
  saved Indonesian draft.
- Reconcile duplicate FIA campaign Site Pages and retain one canonical
  `/events/fia-rallycross-world-cup-indonesia-2026` ownership record.
- Disable Draft Mode cleanly when a published Preview is requested or the
  session exits.

## Tests

- Two records with the same page kind cannot cross-render.
- English and Indonesian drafts resolve their own `documentId`.
- Saved draft changes appear in Preview while live remains published.
- Invalid or expired Preview context returns a safe error and sets no draft
  cookie.

## Exit gate

Do not start MSR-CMS-UAT-3 until the saved About hero image, title, description,
and two representative section toggles pass exact-record Preview checks.

## Implementation result

- Strapi passes UID/document ID/locale/status and the frontend stores a signed,
  30-minute HTTP-only preview context.
- The selected collection is filtered by exact `documentId`; missing or
  mismatched records fail closed, and locale fallback is disabled in Preview.
- A reversible enabled-About check rendered its saved hero title, description,
  and image while both disabled sections remained absent; the original page
  availability was restored.
- Legacy FIA campaign Site Pages preview through the canonical Event route,
  resolving the known duplicate-route ambiguity without deleting editor data.
