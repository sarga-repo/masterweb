# MSR-CMS-UAT-4 — Publish Invalidation and Live Parity

Status: completed 2026-08-15.

## Goal

Make the live Motorsport site reflect publication actions without arbitrary
60- or 600-second inconsistency windows.

## Implementation

- Tag Motorsport CMS fetches by content type, document, locale, and affected
  route.
- Add a server-only revalidation endpoint protected by an independent secret.
- Trigger revalidation from approved Strapi lifecycle/webhook events for
  publish, update, unpublish, and delete.
- Revalidate all affected routes for shared records such as navigation,
  leadership, tickets, gallery, and site chrome.
- Keep Preview `no-store`; never let Preview invalidate or overwrite published
  cache entries.
- Define retry, timeout, audit-log, and failure behavior without logging content
  secrets.

## Tests

- Saving a draft changes Preview only.
- Publishing changes live English/Indonesian affected routes.
- Unpublishing removes live content and leaves no stale detail route.
- A failed revalidation call is observable and safely retryable.
- Unrelated Gateway and Horse Sport paths are not invalidated by this phase.

## Exit gate

Do not start MSR-CMS-UAT-5 until publish/unpublish tests pass repeatedly without
manual cache clearing, frontend restart, or browser hard refresh.

## Implementation result

- Published Motorsport fetches now carry site, collection, locale, and optional
  document cache tags; Preview remains `no-store`.
- A server-only `/api/revalidate` endpoint validates a dedicated shared secret,
  derives an allow-listed Motorsport route set, expires matching tags
  immediately, and revalidates affected pages.
- Strapi lifecycle notifications cover Motorsport Site Pages, navigation,
  programmes, events, articles, media, tickets, merchandise, people, partners,
  standings, regulations, and reports with three bounded attempts and sanitized
  failure logging.
- Draft saves invalidate only published cache entries and cannot leak Draft
  data; the next live read still requests Strapi's published view.
- A reversible News Site Page test proved Draft-only Preview, immediate publish
  propagation, and exact restoration. A temporary article proved immediate
  publish and unpublish/404 propagation, then was removed.
- `revalidateTag(..., { expire: 0 })` is intentional: the earlier `max` profile
  allowed one stale response after unpublish and failed the phase gate.
