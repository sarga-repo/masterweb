# MSR-CMS-UAT-1 — CMS Credential and Fetch-State Hardening

Status: completed 2026-08-15.

## Goal

Restore durable authenticated draft reads and prevent any CMS error from being
misrepresented as valid empty content.

## Implementation

- Provision one persistent, read-only Motorsport Preview API token with only
  the approved content-type `find`/`findOne` permissions.
- Store it as a server-only deployment secret; document rotation and a local
  setup check. Never expose it through `NEXT_PUBLIC_*`.
- Separate published and preview request policy:
  - draft: authenticated, `status=draft`, `cache=no-store`, fail closed;
  - published: published-only and resilient to a rejected optional credential.
- Treat both `401` and `403` as rejected credentials. Published reads may retry
  through the approved public read contract; draft reads may not.
- Replace `null`-for-everything with a typed result that distinguishes
  `success`, `empty`, `unauthorized`, `forbidden`, `unavailable`, and `invalid`.
- In Preview, render a clear editor-only diagnostic instead of repository
  fallback content. Do not include tokens or upstream response bodies.
- Add a repeatable preflight that checks one published and one draft Site Page
  read before Preview UAT begins.

## Tests

- Valid token draft read returns the saved About document.
- Revoked token returns the Preview diagnostic and no fallback sections.
- Published read still resolves after a rejected optional credential.
- Network failure and empty collection are distinguishable.
- No secret appears in client bundles, logs, HTML, or error UI.

## Exit gate

Do not start MSR-CMS-UAT-2 until authenticated draft and published probes pass
from the actual running frontend process and the browser shows CMS About copy,
media, and disabled sections correctly.

## Implementation result

- The persistent read-only token now includes all Motorsport preview read
  collections and passed published/Draft preflight probes.
- CMS responses use explicit fetch states; Draft failures throw into an
  editor-safe diagnostic boundary and published 401/403 failures retry through
  the approved public contract.
- The invalid Site chrome populate query discovered during the gate was fixed.
- About is currently CMS-disabled, so browser parity correctly resolves to its
  Coming Soon state while Draft inspection confirms its saved hero/media and
  disabled section configuration.
