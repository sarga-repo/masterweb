# CMS Live Preview MVP

## Status

- Phase: `MSR-CMS-LIVE-1`
- Status: Implemented locally on 2026-08-23
- Scope: Motorsport frontend and supported Motorsport Strapi Preview records
- Service decision: no paid Strapi feature or third-party service

## What “live” means in this phase

The existing Preview action still opens the selected draft in a secure Next.js
Draft Mode session. This phase adds automatic refresh after the editor saves a
change in Strapi. The preview frame polls a small server-side heartbeat every
two seconds, compares the selected document's revision marker, and calls the
Next App Router refresh when `updatedAt`, `publishedAt`, or preview status
changes.

The browser receives only the revision marker. The Strapi API token and draft
content remain server-side.

## Request flow

```text
Strapi Preview iframe
  -> /api/preview/heartbeat
  -> signed Preview cookie + Draft Mode validation
  -> Strapi exact document revision read
  -> browser compares fingerprint
  -> router.refresh() after a saved change
```

## Security and failure behavior

- The heartbeat requires both Next Draft Mode and the signed exact-document
  Motorsport Preview cookie.
- It resolves the collection from the approved UID map; the browser cannot
  provide an arbitrary collection or document ID.
- It reads only `updatedAt`, `publishedAt`, and `documentId` from Strapi.
- The server-only `STRAPI_API_TOKEN` is never sent to the browser.
- Requests outside Preview receive `401`.
- Temporary CMS failures pause the indicator and do not affect public pages.
- Polling pauses while the preview tab is hidden and resumes when visible.

## Supported behavior and limitation

This is live-on-save, which matches Strapi's persisted editorial state. It does
not yet render unsaved keystrokes from the Content Manager form. True
keystroke-level Live Preview would require a custom Strapi admin editor bridge,
origin-validated `postMessage` payloads, field/source maps, relation/media
normalization, and a separate dynamic-zone contract. That is a follow-up phase,
not a prerequisite for safe saved-draft Preview.

Changes to a related record are reflected when that related record is itself
the selected Preview target. The selected page's own saved revision is the
heartbeat boundary; a global dependency graph is intentionally not introduced
in this MVP.

## Verification

- Motorsport typecheck passed.
- Motorsport lint passed.
- Preview context tests passed.
- Live-preview fingerprint tests passed.
- Existing Preview and CMS revalidation contracts remain unchanged.

The public heartbeat boundary was also smoke-tested and returns `401` outside
Preview. Full authenticated Save → iframe refresh UAT remains a local/staging
operational gate because the local Strapi service became temporarily
unresponsive while the updated frontend service was being restarted.
