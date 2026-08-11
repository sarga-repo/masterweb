# 05 — GWR-CMS-4 i18n and Top-Navigation Assessment

Status: complete 2026-08-11; documentation and architecture only.

## Requested outcome

- Editors can author English and Indonesian public content in the shared CMS.
- Each Sarga site administrator can control which links appear in that site's
  desktop and mobile top navigation.
- One CMS, the existing per-site workspaces, and the existing public domains
  remain in place.

## Current-state findings

- Strapi 5.49 already includes its built-in `@strapi/i18n` package and the local
  database contains the default `en` locale.
- Indonesian (`id`) is not configured.
- None of the 20 API content types currently enables i18n; all schema
  `pluginOptions` are empty.
- Existing content rows contain Strapi's system `locale` column, but current
  records are not managed as localized documents.
- Gateway, Motorsport, and Horse Sport headers use separate hard-coded arrays.
- All three root layouts currently emit `lang="en"` and `en_US` Open Graph
  metadata. Strapi queries do not send a locale.
- The managed workspace roles have no explicit i18n action entries. Locale
  creation/deletion remains a Super Admin responsibility; site roles translate
  only content in their own `siteScope`.

## Feasibility

Feasible with the current stack and one CMS. No paid service, second database,
or external translation service is required. The material risk is data
migration: turning i18n on changes how Strapi groups and queries existing rows,
so it must first be exercised against a restored database copy.

## Recommended architecture target

### Locale and URL contract

- Supported locales: English `en` and Indonesian `id`.
- English remains the default and keeps every current unprefixed URL.
- Indonesian uses `/id` and `/id/...` on each of the three domains.
- The URL is authoritative. A `sarga-locale` cookie may remember an explicit
  switch, but browser language never silently overrides a requested URL.
- Slugs remain stable and non-localized in the first release. This avoids
  fragile cross-locale slug mapping while still providing localized page copy.
- Each localized page emits the correct `<html lang>`, canonical URL,
  `hreflang` (`en`, `id`, and `x-default`), Open Graph locale, and sitemap entry.

### Translation ownership

- Editorial content comes from localized Strapi documents.
- Interface copy such as Menu, Close, Previous, form validation, and empty
  states lives in typed per-frontend `en`/`id` dictionaries. It is not sensible
  to turn every application control into a CMS field.
- Missing Indonesian editorial content falls back to the complete English
  record, never field-by-field mixed language. Fallback Indonesian URLs are
  `noindex` until an Indonesian localization is published.
- Machine translation and automatic translation publishing are out of scope.

### Localization matrix

| Content family                                    | First-release decision           | Notes                                                                                                                                              |
| ------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage, Site Page, News, Event                  | Localize                         | Copy, SEO, labels, and descriptions localized; ownership/dates/relations remain structural                                                         |
| Ecosystem Business, Corporate Report, Job Vacancy | Localize                         | Stable slug/status/link fields remain structural                                                                                                   |
| Leadership Person, Timeline Item                  | Localize                         | Names remain stable; role, biography, and editorial copy localized                                                                                 |
| Media Gallery, Merchandise Item                   | Localize                         | Media relations/status remain structural; title/description/alt guidance localized                                                                 |
| Motorsport Program, Rider, Regulation             | Localize                         | Schedule/result identifiers, files, dates, and relationships remain structural                                                                     |
| Motorsport Standing                               | Do not localize                  | Position/points are operational data; translate table UI instead                                                                                   |
| Partner, Site, Ticket CTA                         | Keep structural in first release | Brand/legal names, domains, providers, and destinations must not drift between locales; localized CTA presentation belongs to page/navigation copy |
| Inquiry Submission, Newsletter Subscription       | Do not localize                  | Operational records retain a `sourceLocale` field instead                                                                                          |

The CMS implementation phase must verify Strapi's actual non-localized-field
behavior for relations, repeatable components, dynamic zones, and draft/publish
before applying the matrix to the shared database.

### CMS-managed top navigation

Add a localized, site-scoped `top-navigation-item` collection rather than
duplicating the three frontend headers.

| Field                         | Ownership                                       |
| ----------------------------- | ----------------------------------------------- |
| `internalName`                | Structural editor reference                     |
| `siteScope`                   | Server-assigned workspace ownership             |
| `label`, optional `ariaLabel` | Localized                                       |
| `href`                        | Structural; internal path or approved HTTPS URL |
| `linkType`                    | `internal`, `crossSite`, or `external`          |
| `enabled`                     | Structural global toggle across locales         |
| `displayOrder`                | Structural global order                         |
| `emphasis`                    | `default` or `primaryCta`                       |
| `openInNewTab`                | Structural; external/cross-site only            |

English is the structural master. Indonesian localizations translate labels;
they do not independently change URL, visibility, order, or CTA emphasis. The
CMS service must enforce that parity because relying on editor convention is
not sufficient.

Each site workspace receives a prefixed **Top Navigation** action. Its role can
manage only records matching its assigned scope. Super Admin can see all sites.
The language switch itself is a protected shell control and cannot be hidden by
a navigation record.

### Frontend resolution and failure behavior

1. Fetch the site's English master items and the requested locale labels.
2. Validate links, sort deterministically, and filter `enabled=false`.
3. If the CMS successfully returns a configured menu, respect it exactly—even
   when every item is disabled.
4. Use the repository's current static menu only when the CMS is unavailable or
   no published menu has ever been configured. Never merge disabled defaults
   back into a configured menu.
5. Apply the same resolved list to desktop and mobile navigation.

Limit the primary desktop menu to eight enabled items per site. Additional
destinations belong in the footer or a future secondary menu. Internal paths
must start with `/`; external/cross-site destinations must use HTTPS outside
local development. Unsafe URLs are omitted and logged.

## Risks and mitigations

| Risk                                                     | Mitigation                                                                                             |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Existing content becomes unavailable after enabling i18n | Encrypted backup, restore into staging copy, migration rehearsal, row/document counts before promotion |
| English and Indonesian structural data diverge           | English structural master plus CMS lifecycle/service parity enforcement                                |
| Hiding a menu item makes a page unreachable              | Hide affects header discovery only; route and sitemap policy remain separately controlled              |
| CMS outage removes navigation                            | Repository fallback used only for unavailable/unconfigured CMS                                         |
| Indonesian route publishes untranslated English          | Whole-record fallback with visible language state and `noindex`                                        |
| Header overflow from too many items                      | Eight-item validation plus responsive UAT at all target widths                                         |
| Role bypass across site or locale                        | Extend authenticated GWR-CMS UAT by role, locale, direct URL, and submitted scope                      |

## Effort estimate

Engineering estimate, excluding professional translation and editorial review:

| Phase                                                         |                   Estimate |
| ------------------------------------------------------------- | -------------------------: |
| GWR-CMS-5 — CMS schemas, migration rehearsal, RBAC, seeds/API |                   4–6 days |
| GWR-CMS-6 — Gateway locale routing, dictionaries, navigation  |                   3–5 days |
| GWR-CMS-7 — Motorsport and Horse Sport rollout                |                   4–6 days |
| GWR-CMS-8 — migration, full UAT, Docker/deployment handover   |                   3–5 days |
| **Total**                                                     | **14–22 engineering days** |

Translation inventory, translation writing, legal review, and final bilingual
content approval are separate business workstreams.

## GWR-CMS-4 acceptance

- Architecture and locale URL policy approved.
- Localization matrix approved.
- Navigation ownership/fallback behavior approved.
- Migration and content-translation responsibilities acknowledged.
- No runtime schema, database, seed, or frontend behavior changed in this phase.
