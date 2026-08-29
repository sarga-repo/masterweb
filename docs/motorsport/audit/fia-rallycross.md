# FIA Rallycross World Cup Campaign — CMS ↔ Frontend Audit

Route: `/events/fia-rallycross-world-cup-indonesia-2026` (rendered by `frontend-motorsport/src/app/campaign/[slug]/page.tsx`).

## Mapping

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Metadata | title, description, canonical, OG image | Motorsport Program / SEO | `seo`, `title`, `summary`, `motorsportPresentation.hero` | actively used / fallback | Campaign metadata is program-owned. Top-level `heroMedia` is retained only as a non-Rallycross compatibility fallback and is hidden for FIA. |
| Hero | eyebrow, title, description, image, visibility | Motorsport Presentation → Hero | `motorsportPresentation.hero.*` | actively used / fallback | Route-page navigation label and program identity are fallback sources for legacy records. |
| Hero CTAs | primary CTA | Hero / Ticket CTA / Program | `hero.primaryCta`, `relatedTicketCtas`, `primaryCtaLabel`, `primaryCtaUrl` | actively used / fallback | Active related ticket CTA wins; program CTA is the safe fallback. |
| Hero CTAs | secondary rundown CTA | Hero | `hero.secondaryCta.*` | actively used / fallback | Default “View the rundown” points to the local rundown anchor when not configured. |
| World Cup control | eyebrow, title, description, metrics, visibility | Motorsport Presentation → Information Band; route section fallback | `informationBand.*`, legacy `presentationSections[world-cup-control].*`, legacy route page section | actively used / fallback | Presentation band is primary. The legacy program section is hidden for FIA and retained only as a compatibility path for older records. |
| Campaign slider | slides, images, event metadata, CTA | FIA Campaign Slides | `bannerSlides.*` | actively used by FIA | This is the live campaign slider, not a duplicate Format/Rundown/Guide section. It is visible only when `programType = rallycross`. |
| Format | heading copy and cards | `fiaRallycrossContent.formatSection` | `formatSection.*`, `formatItems[]` | actively used | One FIA-only logical CMS section now owns both presentation copy and Format cards. |
| Rundown | heading copy and schedule cards | `fiaRallycrossContent.rundownSection` | `rundownSection.*`, `rundownItems[]` | actively used | One FIA-only logical CMS section now owns both presentation copy and schedule rows. |
| Race-day guide | heading copy and rule cards | `fiaRallycrossContent.raceDayGuideSection` | `raceDayGuideSection.*`, `ruleItems[]` | actively used | One FIA-only logical CMS section now owns both presentation copy and Do/Do not rules. |
| Ticket section | ticket panel and partner route | Related Ticket CTA + presentation section | `relatedTicketCtas.*`, `presentationSections[campaign-ticket].*` | actively used / fallback | Ticketing remains redirect/deep-link based; no payment or account logic is introduced. |
| Footer CTA | All events, Campaign inquiries | Frontend route chrome | none | hardcoded in frontend | Stable navigation labels/routes, not campaign editorial data. |

## Program segregation recommendation

Keep one `motorsport-program` collection as the canonical program record for now. The current consumer split is:

| Program capability | FIA Rallycross | IJTC | Architecture decision |
| --- | --- | --- | --- |
| Hero and Information Band | yes | yes | Shared `motorsport.detail-presentation` component. |
| `fiaRallycrossContent` | format, rundown, race-day-guide | no | FIA-only grouped component; each nested section owns its presentation fields and items. |
| `presentationSections` | IJTC overview/about/schedule/riders/standings/regulation/inquiry/process and campaign ticket | available for non-FIA sections | Hidden for FIA in the editor; current FIA links were retired after grouped content became canonical. Retained because non-FIA consumers still use the field. |
| `bannerSlides` | yes | no current consumer | Campaign-specific component; visible only for Rallycross through a native `programType` condition. Stale IJTC rows were retired. |
| `eventRules` | no after grouped cutover | no | Retired from schema, editor layout, frontend populate, and stored component links. Canonical replacement is `fiaRallycrossContent.raceDayGuideSection.ruleItems[]`. |
| `rundown` | no after grouped cutover | yes | Hidden for FIA; FIA top-level rows were retired after grouped verification. The schema remains because IJTC still consumes the shared field. |
| `riders`, `standings`, `regulations` | no | yes | Hidden for FIA; IJTC-only relations remain because IJTC pages consume them. FIA had no stored relation rows to remove. |
| `becomeRidersLabel/Url` | no | yes | IJTC-only CTA fields; currently consumed by IJTC routes. |
| ticket relations, SEO, site scope | yes | yes | Shared domain fields. |

A destructive split into Rallycross and IJTC collection types would risk breaking existing relations, slugs, ticket ownership, program navigation, and localized records. The safest next step is additive admin UX: conditional field visibility/help text by `programType`, plus validation that required section keys match the selected type. If a split is eventually approved, migrate additively with an idempotent script and retain redirects/relations until production verification.

## Cleanup decision

The grouped FIA fields are now canonical. The three Format fallback cards were
migrated into CMS because the legacy Format item links were empty. FIA
top-level `presentationSections`, `heroMedia`, `rundown`, and `eventRules` data
was retired or removed only after grouped counts and consumer checks matched.
Those shared schema fields remain where another programme still consumes them,
but native `programType` conditions hide them from FIA editors. The remaining
hardcoded copy is either a local fallback for absent CMS content or stable UI
chrome. No staging changes were made.

## Validation

- `frontend-motorsport`: typecheck and route build are rerun after the grouped-content cutover.
- `cms`: schema/admin build and source/rehearsal migration completed.
- Read-only inventory: [field-inventory-2026-08-29.md](field-inventory-2026-08-29.md).
- JSON schemas and `git diff --check` passed.
