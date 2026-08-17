# Motorsport CMS Preview Phase 2 Implementation

## Document status

- Phase: 2 - homepage and global chrome draft propagation
- Status: Implemented
- Date: 2026-08-15
- Scope: Homepage aggregate reads, navigation, site chrome, and nested CMS relations

## What changed

### Explicit locale propagation

Homepage and shared shell reads now receive one request locale and pass it to
their CMS adapters:

- Homepage Site Page and nested components
- Homepage events
- Homepage news
- Homepage partners
- Homepage galleries
- Homepage ticket CTAs
- Site chrome
- Motorsport program dropdown data
- Homepage leadership and ecosystem site data

This prevents aggregate queries from independently resolving a different locale
than the visible route.

### Draft-aware fallback policy

Added `resolvePreviewCollection()` to distinguish Preview behavior from normal
public behavior.

In Draft Mode:

- CMS collections preserve returned records, including empty results.
- Empty events do not become placeholder events.
- Empty news does not become placeholder articles.
- Empty partners do not become placeholder partners.
- Empty galleries do not become fallback gallery media.
- Empty tickets do not become placeholder ticket CTAs.
- Empty program records do not recreate fallback event navigation.
- Empty navigation does not recreate repository navigation.
- Empty ecosystem site records do not recreate fallback connected records.
- Empty homepage discipline collections stay empty rather than showing curated
  discipline cards.

Outside Draft Mode, existing curated fallback behavior remains unchanged.

### Nested homepage relations

Homepage aggregate fetches retain explicit population for:

- Hero media and mobile media
- Hero video sources and posters
- Featured event media and ticket relations
- Race Control information band
- World of Motorsport discipline media
- Homepage ticket artwork
- Homepage editorial sections
- Events, news, partners, galleries, and ticket collections

All requests pass through the existing Draft Mode-aware Strapi client, which adds
`status=draft` and `cache: "no-store"` during Preview.

## Tests added

`content-policy.test.ts` verifies:

- Draft collections preserve CMS data.
- Empty draft collections remain empty.
- Published-mode collections retain curated fallbacks.
- Null CMS responses retain published-mode fallbacks.

Existing Preview path and origin tests continue to run in the same test command.

## Verification

- Motorsport Preview tests: 7/7 passed.
- Motorsport typecheck passed.
- Motorsport ESLint passed.
- Motorsport production build passed.
- Motorsport Preview formatting check passed.
- `git diff --check` passed.
- Local published Events API smoke check returned `200`.
- Local Indonesian Navigation API smoke check returned `200`.
- Local draft Events API smoke check returned `200`.
- Local draft Motorsport Site API smoke check returned `200`.

## Known limitations

- Browser-level mutation testing through Strapi Content Manager remains pending.
- Local CMS currently permits direct draft API reads; frontend Preview still
  requires server-only `STRAPI_API_TOKEN` by design.
- Site chrome field-level fallbacks remain for optional missing logos/statements;
  valid draft values override them.
- Homepage leadership and About route have separate fallback presentation logic;
  full relation UAT remains a later phase.
- Gateway and Horse Sport aggregate Preview remain out of scope.
