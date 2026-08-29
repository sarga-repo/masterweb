# Motorsport Program Collections — CMS ↔ Frontend Audit

This document covers the canonical `motorsport-program` collection and its program-owned relations. Consumer traces were taken from `cms-data.ts`, `ijtc-data.ts`, the FIA campaign route, and all IJTC routes.

| Collection / field group | Frontend consumers | Status | Notes |
| --- | --- | --- | --- |
| `motorsport-program.title`, `slug`, `programType`, `programStatus`, `seasonLabel`, `summary`, `mainHeadline`, dates, `venue` | Event menu, program hub, FIA campaign, IJTC pages, metadata | actively used | Core program identity and lifecycle. |
| `motorsportPresentation` | Event/program/news detail Hero and Information Band | actively used | Shared presentation component; keeps first-fold fields together. |
| `heroMedia` | Non-Rallycross programme image fallback | fallback | Retained for older IJTC/non-Rallycross records; hidden for FIA because `motorsportPresentation.hero.backgroundMedia` is canonical. FIA top-level media relations were retired locally. |
| `presentationSections` | Non-Rallycross programme sections and compatibility ticket sections | actively used / fallback | Hidden for FIA; current FIA links were retired after `fiaRallycrossContent` became canonical. Retained because shared/non-FIA consumers still use the field. |
| `bannerSlides` | FIA campaign slider | actively used by FIA only | Visible only for Rallycross through a native `programType` condition; stale IJTC rows were retired. |
| `rundown` | IJTC schedule | actively used by IJTC; hidden for Rallycross | FIA rows were removed after grouped content was verified. The shared field remains for IJTC. |
| `eventRules` | none after grouped cutover | retired | Removed from the schema/layout and deleted from program component links; use `fiaRallycrossContent.raceDayGuideSection.ruleItems[]`. |
| `relatedTicketCtas` | FIA campaign and event/program ticket areas | actively used | Approved external destination; no internal checkout. |
| `becomeRidersLabel`, `becomeRidersUrl` | IJTC hero/CTA links | actively used by IJTC only | IJTC-specific CTA fields. |
| `riders` | IJTC rider catalogue/detail | actively used by IJTC only; hidden for FIA | Related `motorsport-rider` records. Native `programType = juniorTalentCup` condition keeps the empty FIA relation out of the FIA editor. |
| `standings` | IJTC standings | actively used by IJTC only; hidden for FIA | Related `motorsport-standing` records. Native `programType = juniorTalentCup` condition keeps the empty FIA relation out of the FIA editor. |
| `regulations` | IJTC regulation | actively used by IJTC only; hidden for FIA | Related `motorsport-regulation` records. Native `programType = juniorTalentCup` condition keeps the empty FIA relation out of the FIA editor. |
| `relatedEvents` | no current public render | unused/not wired | Candidate for future cross-linking; retained until repository-wide migration decision. |
| `primaryCtaLabel`, `primaryCtaUrl` | program hub fallback CTA and FIA fallback ticket destination | actively used / fallback | Safe fallback for incomplete presentations. |
| `eventMenuLabel`, `eventMenuEnabled` | global Motorsport Event menu | actively used | Navigation index fields. |
| `siteScope`, `sites`, `seo` | multisite filtering and metadata | actively used | Keep as shared governance fields. |

## Recommended architecture

Keep the single canonical collection and use editor guidance/conditional admin UX keyed by `programType`:

- Rallycross editors see `bannerSlides`, `fiaRallycrossContent` (Format, Rundown, Race-day Guide), ticket relations, and shared identity/presentation.
- IJTC editors see rider/standing/regulation relations, rider CTA fields, IJTC sections, shared `rundown`, and shared identity/presentation.
- Both program types need identity, status, navigation, SEO, scope, and ticket governance.

The editor conditions use Strapi Content Manager JSON Logic directly (for
example, `{ "==": [{ "var": "programType" }, "juniorTalentCup"] }`). This is
important because the Content Manager evaluates `conditions.visible` as JSON
Logic; the shorthand `dependsOn`/`operator`/`value` form is not a runtime
visibility rule.

Do not physically split the collection in this cleanup. A split would require additive migration of localized records and relations, canonical redirects, ticket ownership changes, and regression verification across the event menu. Conditional field visibility and a documented section-key vocabulary provide the same editor clarity with materially lower migration risk.

## Supporting collection disposition

| Collection | Active frontend fields | Candidate fields |
| --- | --- | --- |
| `motorsport-rider` | name, slug, portrait, bio, program, number, team, region, nationality, isActive, sortOrder | shared presentation/SEO are not used by the rider detail route; retain until cross-route use is ruled out. |
| `motorsport-standing` | program, seasonLabel, roundLabel, rider, position, points, resultSummary, resultDate | none identified in current render path. |
| `motorsport-regulation` | program, title, version, effectiveDate, pdfFile, summary, isActive | none identified in current render path. |
| `motorsport-ticket-cta` | title/label/provider copy, CTA type/URL/config, active window, artwork, related event/program | private embed code is not editor-visible; tracking JSON should remain operational until analytics consumers are checked. |
| `motorsport-partner` | name, slug, logo, websiteUrl, partnerType, sortOrder, isActive | none identified in current render path. |

No programme collection was split. The local retirement migration removed only
verified FIA legacy links/media relations and orphaned component rows; it did
not remove the shared IJTC relations or any FIA grouped content.
