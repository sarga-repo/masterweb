# 04 — CMS Page Activation Contract

## Principle

Use the existing shared Strapi instance. Content is stored once and scoped with
`siteScope`; no Gateway-specific second CMS or duplicated sport content is
allowed.

## Sources of truth

- `Ecosystem Business` owns Sarga Venues, Sarga Media, Sarga Tech, Motorsport,
  Horse Sport, and future ecosystem entities.
- `Site Page` owns corporate/static page composition such as History and report
  landing pages where a dedicated collection is not required.
- `News Article` owns editorial and press-release content; Press Releases is a
  category/channel, not a second article collection.
- Existing shared Event and Ticket CTA models remain authoritative.

## Page availability control

Add a reusable, single CMS component such as `shared.page-availability` to
`Ecosystem Business` and `Site Page`:

| Field                   | Type                     | Purpose                                               |
| ----------------------- | ------------------------ | ----------------------------------------------------- |
| `pageEnabled`           | boolean, default `false` | Editor switch for full page vs. Coming Soon           |
| `comingSoonEyebrow`     | string                   | Short brand/context label                             |
| `comingSoonTitle`       | string                   | Coming Soon display title                             |
| `comingSoonDescription` | text                     | Public explanatory copy                               |
| `comingSoonMedia`       | image                    | Optional CMS-managed visual                           |
| `launchTargetLabel`     | string                   | Non-binding public timing label                       |
| `showNotifyCta`         | boolean                  | Enables the existing approved newsletter/contact path |
| `noIndexWhileDisabled`  | boolean, default `true`  | Search behaviour before launch                        |

The boolean is intentionally separate from `businessStatus`:

- `businessStatus` describes whether the portfolio entity is active,
  coming soon, or hidden.
- `pageEnabled` describes whether the full dedicated editorial page is ready.

This avoids marking an operational Sarga business as inactive merely because
its website content is incomplete.

`pageEnabled` is the authoritative launch switch. `businessStatus: hidden`
still removes a record, but a published `comingSoon` business may launch its
completed page by enabling this switch; editors do not need to change two
fields. The frontend completeness guard prevents an enabled record without an
overview and at least one managed capability/highlight from being promoted to
the full template. Hero/card media and related content are optional; the shared
template supplies branded gradient art direction when media is unavailable.

## Rendering precedence

1. Draft, unpublished, `hidden`, or `siteScope: hidden` → `404`; omit from
   navigation and sitemap.
2. External sport business with approved `dedicatedSiteUrl` → deep-link to its
   dedicated site; do not render a duplicate Gateway detail page.
3. Published internal business with `pageEnabled: false` → branded Coming Soon
   page at its canonical route.
4. Published internal business with `pageEnabled: true` and required content →
   full dedicated page.
5. Invalid/missing CMS data → safe CMS error/fallback state; never silently
   promote an incomplete page to live.

## Coming Soon template

- Uses the Gateway header/footer and reference typography.
- Shows business name, managed launch copy/media, optional timing label, a link
  back to the ecosystem, and optional existing newsletter/contact CTA.
- Does not display empty capability, gallery, or publication sections.
- Defaults to `noindex,follow` and is omitted from the XML sitemap.
- Is fully accessible and responsive; it is not a blank placeholder.

## Initial seed/migration state

- Sarga Venues: `pageEnabled: false`
- Sarga Media: `pageEnabled: false`
- Sarga Tech: `pageEnabled: false`
- Motorsport and Horse Sport: retain active external dedicated-site links

The three internal businesses already exist in seed and mock data, so their
existing slugs remain canonical and no content duplication is required.

## Admin experience

- Place availability fields together under a clear “Dedicated Page” section.
- Explain that disabling the page publishes Coming Soon, while unpublishing or
  hiding removes the route.
- Gateway editors may manage Gateway-scoped pages only; existing Super Admin
  visibility and site-role segregation remain unchanged.
- The component description tells editors to enable only after the content is
  complete. Required booleans are schema-validated and the public adapter adds
  a fail-closed completeness guard before rendering a full page.

## GWR-1 implementation status

Implemented on 2026-08-10 as `shared.page-availability` on `Ecosystem
Business` and `Site Page`. Existing editor values are never overwritten: the
seed creates the three Gateway corporate records only when absent and
backfills the component only when missing. Gateway, Motorsport, Horse Sport,
and Shared Library role boundaries continue to be inherited from the parent
record's existing `siteScope` permissions.

## GWR-5 implementation status

Implemented and validated on 2026-08-10. The three internal venture records now
receive missing overview and highlight content through an idempotent backfill;
existing editorial values and toggle decisions are never overwritten. Each
venture was verified in both disabled and enabled states, then the local CMS was
restored to the approved initial state (`pageEnabled: false`).

Dedicated sport destinations prefer deployment environment URLs and may fall
back to `dedicatedSiteUrl` only when it is a valid HTTPS URL (or localhost HTTP
in development). Internal CTAs accept same-site paths or safe HTTPS URLs. Unsafe
and credentialed destinations fail closed.
