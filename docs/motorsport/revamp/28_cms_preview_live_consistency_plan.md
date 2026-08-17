# Motorsport CMS Preview and Live Consistency Plan

Date: 2026-08-15  
Track: Motorsport CMS enhancement UAT  
Scope: `frontend-motorsport` and Motorsport-scoped Strapi records only

## Objective

Make a saved draft, its Strapi Preview, and the published Motorsport website
follow one deterministic content contract. A preview must render the selected
draft and locale without repository fallbacks; the live site must render only
the latest published state; a CMS read failure must never silently re-enable a
hidden section.

## Assessment outcome

The primary defect is a rejected frontend CMS credential combined with a
fail-open fallback policy.

- The token currently configured in `frontend-motorsport/.env.local` receives
  HTTP `403` for both draft and published Site Page reads.
- The same published About query succeeds anonymously with HTTP `200`.
- `fetchStrapiList()` retries an anonymous published request only after `401`,
  not `403`; draft requests correctly do not retry anonymously.
- Both failure paths return `null` without a diagnostic. Route templates then
  interpret missing data as permission to render repository fallback copy and
  fallback sections.
- The previous Preview UAT created a temporary read-only token and deleted it
  afterward. The local frontend retained the now-invalid token, leaving the
  next editor session unable to read drafts.

This explains the reported behavior directly. The published About record has:

- hero title `The Adrenaline Alchemist.`;
- a published hero image;
- `profile.enabled=false`;
- `team-intro.enabled=false`.

The live browser instead rendered fallback title `About Sarga Motorsport`, no
CMS hero media, and both `profile` and `team-intro`. The frontend therefore did
not render the published CMS document at all.

## Secondary defects and consistency gaps

1. Preview state carries route and draft mode but not the exact Strapi
   `documentId`; broad `pageKind`/`routePath` filters plus `limit=1` can select
   the wrong record when duplicates exist.
2. Two published campaign Site Page records currently share
   `/campaign/fia-rallycross-world-cup-indonesia-2026`, so campaign selection is
   already non-deterministic.
3. `isCmsSectionVisible(undefined)` and `isCmsPageVisible(undefined)` both
   return `true`. This is acceptable only for a deliberately optional control,
   not for a failed CMS request.
4. Preview fetch errors are swallowed, so editors cannot distinguish a missing
   record, invalid token, invalid locale, or upstream outage.
5. The About hero image and overlay do not establish an explicit stacking
   contract for their content. The copy needs a stable positioned `z-index`
   wrapper before hero media parity can be considered closed.
6. Route coverage is inconsistent:
   - News does not use page availability and lacks stable CMS markers.
   - News lead copy controls more than one visual block.
   - Gallery couples hero rendering to `gallery-intro` and always renders the
     archive.
   - Merchandise always renders the catalogue.
   - Tickets always renders the ticketed-events block when data exists.
   - Detail/campaign templates do not expose the same section-toggle contract
     as Site Pages.
7. Published collection reads still use 60- or 600-second revalidation in
   several adapters. A successful publish can therefore remain stale even
   after authentication is repaired.

## Phases and hard gates

| Phase | Purpose | Gate |
| --- | --- | --- |
| MSR-CMS-UAT-0 | Diagnosis and specification baseline | Complete when the failure is reproduced without mutation and the plan is approved |
| MSR-CMS-UAT-1 | CMS credential and fetch-state hardening | Draft and published probe tests pass; Preview never falls back silently |
| MSR-CMS-UAT-2 | Exact document, locale, and status contract | Saved draft Preview resolves the selected `documentId` and locale |
| MSR-CMS-UAT-3 | Route rendering and visibility parity | Every Motorsport route passes hero/text/toggle assertions independently |
| MSR-CMS-UAT-4 | Published cache invalidation and live parity | Publish/unpublish is reflected on live routes deterministically |
| MSR-CMS-UAT-5 | Authenticated cross-page UAT and handover | Full draft/published EN/ID desktop/mobile matrix passes and data is restored |

Do not start a later phase until the current phase has passed its automated and
browser acceptance checks. Do not combine schema, fetch, rendering, and cache
changes into one release.

## Phase specifications

- `29_cms_uat_phase1_fetch_auth_spec.md`
- `30_cms_uat_phase2_exact_preview_spec.md`
- `31_cms_uat_phase3_rendering_parity_spec.md`
- `32_cms_uat_phase4_publish_invalidation_spec.md`
- `33_cms_uat_phase5_cross_page_uat_spec.md`

## Non-goals

- No Gateway or Horse Sport behavior changes.
- No second CMS.
- No new paid service.
- No change to the approved Motorsport visual direction.
- No editor-content mutation during the assessment phase.

## MSR-CMS-UAT-0 evidence

- Local Strapi and Motorsport frontend were reachable.
- Authenticated Site Page query with the configured frontend token: HTTP `403`.
- Anonymous published Site Page query: HTTP `200`, one About record.
- Browser route sweep: all sampled Motorsport routes loaded, but About rendered
  repository fallback content and enabled markers contrary to published CMS.
- Source audit covered Preview URL construction, draft-mode activation,
  Strapi fetch behavior, Site Page mapping, navigation, and primary route
  visibility conditions.

