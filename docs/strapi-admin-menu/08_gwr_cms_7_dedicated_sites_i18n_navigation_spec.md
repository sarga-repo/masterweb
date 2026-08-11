# 08 — GWR-CMS-7 Motorsport and Horse Sport Rollout

## Goal

Apply the approved Gateway locale/navigation contract to both dedicated sites
without merging their distinct brand shells or components.

## Deliverables

- Add English-unprefixed and `/id` route resolution to both frontends.
- Add brand-appropriate but behaviorally consistent language controls.
- Replace hard-coded primary navigation with each site's scoped CMS menu while
  retaining repository fallbacks.
- Pass locale to all page, event, news, program, rider, merchandise, gallery,
  ticket, and metadata adapters covered by the localization matrix.
- Add typed interface dictionaries independently to each frontend.
- Localize canonical/hreflang/sitemap/structured-data behavior and normalize
  cross-site locale links.

## Verification

- Route and visual matrices for both locales across both sites.
- Programme subnavigation and operational standings remain functional.
- Ticket/merchandise/external-link safety is unchanged.
- Per-site CMS role cannot view or mutate another site's navigation or content
  in either locale.
- Header overflow, mobile menus, keyboard control, and reduced motion pass.

## Approval gate

Stop after both dedicated sites pass bilingual and navigation UAT. Do not
promote the migration to staging/production until approved.

## Implementation outcome — 2026-08-11

- Added visible `/id` routing, typed dictionaries, locale-aware internal links,
  and brand-specific language dropdowns to Motorsport and Horse Sport; the same
  clearer dropdown contract replaced the Gateway text-only control.
- Connected both dedicated headers to their site-scoped CMS navigation with
  repository fallback, localized labels, active-route normalization, enabled
  toggles, ordering, and CTA emphasis.
- Made Strapi reads, metadata, structured data, sitemap alternates,
  cross-domain ecosystem links, error controls, and public form provenance
  locale aware without sharing branded UI components between applications.
- Split the Motorsport contact form from its server-rendered page shell so CMS
  navigation remains server-only and the interactive form stays client-only.
- Removed the shared 60-second frontend cache from Top Navigation reads across
  all three sites. Published enable/disable and ordering changes now appear on
  the next page request; other editorial content retains its existing cache
  policy.

## Verification evidence

- Gateway, Motorsport, and Horse Sport TypeScript and lint passed.
- All three Next.js production builds passed. Gateway tests passed 36/36 and
  Horse Sport tests passed 10/10; focused CMS workspace tests passed 7/7.
- Browser UAT at 1280×720 and 390×844 confirmed CMS navigation, localized
  labels/links, language switching, canonical/hreflang, fallback `noindex`,
  cross-site `/id` preservation, mobile visibility, and no horizontal overflow.
- The visual pass found and fixed a Gateway 1280px brand-label/nav collision.

## Notes and phase boundary

- Indonesian editorial copy was not fabricated. Until the staging translation
  matrix is approved in GWR-CMS-8, Indonesian dedicated-site pages use the
  conservative fallback `noindex` policy.
- Horse Sport newsletter remains its existing local placeholder interaction;
  contact inquiries and Motorsport newsletter submissions capture
  `sourceLocale` in the shared CMS.
- Live authenticated `CMS_UAT_*` scripts were not rerun because those secrets
  are intentionally absent from the repository environment. The unchanged RBAC
  contract passed focused tests and its authenticated two-locale matrix is a
  mandatory GWR-CMS-8 staging gate.
- Stop here. GWR-CMS-8 has not started.
