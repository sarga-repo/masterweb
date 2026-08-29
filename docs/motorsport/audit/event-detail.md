# Motorsport Event Detail — CMS ↔ Frontend Audit

Route: `/events/[slug]` (excluding the FIA Rallycross campaign slug, which is audited separately).

Implementation traced through `frontend-motorsport/src/app/events/[slug]/page.tsx`, `frontend-motorsport/src/lib/cms-data.ts`, and the `motorsport-event` schema.

## Mapping

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Metadata | title, description, canonical, OG image | Motorsport Event / SEO | `title`, `description`, `seo`, `coverImage`/`heroMedia` | actively used | `generateMetadata` uses CMS SEO and the mapped event fallback image. |
| Hero | kicker, title, description, background image and alt text | Motorsport Presentation → Hero | `motorsportPresentation.hero.*` | actively used | Hero copy/media override event identity; event category/series and image are fallbacks. |
| Hero | status chip | Event identity | `eventStatus` | actively used | Mapped by `statusMap`; stable status vocabulary is code-owned. |
| Hero metrics | date and circuit metrics | Motorsport Presentation → Hero | `hero.metrics`, `eventDate`, `endDate`, `venue`, `circuitName` | actively used / fallback | Custom metrics win; date/circuit values are fallback metrics. |
| Event control | eyebrow, title, description, metrics | Motorsport Presentation → Information Band | `informationBand.*` | actively used / fallback | The fallback text is retained for incomplete legacy records. |
| Event overview | rich event body | Event identity | `description` | actively used / fallback | Empty body shows a safe publication-state message. |
| Event file | series, class, date, circuit values | Event identity | `seriesName`, `racingCategory`, `eventDate`, `endDate`, `venue`, `circuitName` | actively used | `mapEvent` normalizes category, date range, venue, and series. The labels are stable UI taxonomy, not editable content. |
| Ticket section | panel copy, provider, event meta, image, CTA | Related Ticket CTA | `ticketCtas.*` | actively used / fallback | Active related ticket CTA is selected; safe `/tickets` fallback remains only for a ticket relation without a valid URL. |
| Sponsors | event sponsor logos | Partner relation | `sponsors` → partner `name`, `logo`, `websiteUrl` | actively used / fallback | Event sponsors win; the event page can fall back to the first five Motorsport partners when no sponsors are attached outside preview. |
| Footer navigation | All events link | Frontend route chrome | none | hardcoded in frontend | Stable navigation label and `/events` destination; not editorial content. |
| Footer navigation | Ticket information link | Ticket CTA | `ticketCtas.label` / `ticketCtaLabel` | actively used / fallback | CTA label is CMS-driven; “Ticket information” is the fallback label. |

## Field disposition

`title`, `slug`, `description`, event dates/status/category/series/venue, media, ticket relations, sponsors, presentation, and SEO have direct consumers. `schedule`, `venueAddress`, `broadcastUrl`, `embedUrl`, `embedCode`, `business`, and the legacy `ticketUrl`, `ticketCtaLabel`, `ticketIntegrationType` fields are not consumed by this route’s current render path. They must not be deleted solely from this page: they are part of the event schema contract and may be used by admin migration code, other APIs, or older records. The active ticket relation is the canonical frontend source.

`coverImage` is the event-card/list image; `heroMedia` is the legacy detail fallback. The newer `motorsportPresentation.hero.backgroundMedia` is the preferred detail hero. This precedence is intentional and should be retained until existing records are migrated.

## Structure and cleanup decision

The event page already follows the preferred grouping for editable detail presentation: Hero and Information Band are in one `motorsport.detail-presentation` component, while event identity, ticket destinations, sponsors, and SEO remain separate domain groups. Do not merge schedule/ticket/sponsor relations into the presentation component; they are reusable domain records and are editor-friendly as separate forms.

No destructive schema change is approved in this phase. The remaining hardcoded strings are stable interface labels or publication-state fallbacks, not per-event editorial fields. A future migration may retire legacy ticket fields only after repository-wide consumers and stored records are checked.

## Validation

- `frontend-motorsport`: typecheck passed after the detail-route audit work.
- `cms`: TypeScript check passed.
- JSON schemas and `git diff --check` passed.
