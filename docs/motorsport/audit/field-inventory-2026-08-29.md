# Motorsport CMS field/content inventory — 2026-08-29

This is the read-only inventory used for the local cleanup rehearsal. The
machine-readable source is [field-inventory-2026-08-29.json](field-inventory-2026-08-29.json).
Public collection APIs were used where available; protected collections were
read directly from the local PostgreSQL database without changing permissions.

## Inventory coverage

| CMS surface | Records | Locales observed | Media references | Result |
| --- | ---: | --- | ---: | --- |
| Motorsport single types | 10 | `en` | 0 | complete |
| `motorsport-program` | 2 | `en` | 31 | complete |
| `motorsport-event` | 10 | `en` | 0 | PostgreSQL fallback |
| News articles | 4 | `en` | 20 | complete |
| Media galleries | 3 | `en` | 105 | complete |
| Merchandise items | 12 | `en` | 0 | PostgreSQL fallback |
| Riders | 20 | `en` | 100 | complete |
| Standings | 20 | not set in returned rows | 0 | complete |
| Regulations | 1 | `en` | 0 | complete |
| Ticket CTAs | 4 | `en` | 8 | complete |
| Partners | 7 | `en` | 34 | complete |
| Leadership people | 2 | `en` | 0 | PostgreSQL fallback |
| Top navigation items | 32 | `en`, `id` | 0 | PostgreSQL fallback |

## Program records

| Program | Type | Status | Banner slides | Legacy rundown | Legacy guide rules | Riders | Standings | Regulations | Grouped FIA content |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `fia-rallycross-world-cup-indonesia-2026` | `rallycross` | `ticketsOpen` | 3 | 0 | 0 | 0 | 0 | 0 | migrated: 3 format, 5 rundown, 6 guide items |
| `indonesia-junior-talent-cup` | `juniorTalentCup` | `registrationOpen` | 0 | 8 | 0 | 20 | 20 | 1 | not applicable |

The FIA record had no persisted legacy Format item links, so the three already
rendered frontend fallback cards were copied into the new CMS Format items.
Their copy, order, and accent values are unchanged.

## Field classification

| Field group | Consumer trace | Classification | Local content | Disposition |
| --- | --- | --- | --- | --- |
| Program identity, lifecycle, dates, venue, scope, SEO | Event menu, program pages, metadata, multisite filtering | actively used | present | retain |
| `motorsportPresentation` | Shared program Hero and Information Band | actively used | present | retain |
| `fiaRallycrossContent.formatSection` + `formatItems[]` | FIA Format heading and cards | actively used | 3 per draft/published record | retain as FIA-only logical group |
| `fiaRallycrossContent.rundownSection` + `rundownItems[]` | FIA Rundown heading and schedule cards | actively used | 5 per draft/published record | retain as FIA-only logical group |
| `fiaRallycrossContent.raceDayGuideSection` + `ruleItems[]` | FIA Race-day Guide heading and Do/Do-not cards | actively used | 6 per draft/published record | retain as FIA-only logical group |
| `bannerSlides[]` | FIA campaign slider | actively used by FIA | 3 FIA, 0 IJTC | retain; native editor condition shows it only for Rallycross |
| legacy `presentationSections[]` | Non-FIA programme sections and compatibility fallback | actively used / fallback | 0 FIA links after retirement; schema retained | hidden for FIA; retain for non-FIA consumers |
| legacy `rundown[]` | IJTC race schedule | actively used / shared | 0 FIA, 8 IJTC | retain for IJTC; FIA rows retired after grouped verification |
| legacy `eventRules[]` | none after grouped cutover | retired | 0 | removed from schema, layout, frontend fallback, and stored component links |
| `relatedTicketCtas[]` | Campaign and ticket CTAs | actively used | present | retain |
| `riders[]`, `standings[]`, `regulations[]` | IJTC routes | actively used by IJTC | 20 / 20 / 1 | retain; hide for Rallycross through admin UX |
| `becomeRidersLabel`, `becomeRidersUrl` | IJTC inquiry routes | actively used by IJTC | present/optional | retain; hide for Rallycross through admin UX |
| `relatedEvents` | No current Motorsport public consumer found | unused/not wired | relation contract exists; content must be checked before deletion | retain pending cross-site migration decision |
| Program `heroMedia` | Older non-Rallycross program image fallback | fallback | 0 FIA links after retirement | hidden for FIA; retain for non-Rallycross compatibility records |

## Cross-collection candidates requiring migration

These fields are not rendered by the current dedicated Motorsport event/news
detail routes, but they are populated or referenced by shared/legacy contracts.
They are therefore not safe deletion candidates in this phase.

| Collection/field | Repository evidence | Inventory result | Decision |
| --- | --- | --- | --- |
| `motorsport-event.venueAddress` | Shared event model and Horse Sport event adapter | populated on 10 events | do not remove |
| `motorsport-event.broadcastUrl` | Shared event model and legacy ownership migration | populated on 4 events | do not remove |
| `motorsport-event.embedUrl`, `embedCode` | Gateway ticket-hub contract / private operational field | empty on local Motorsport events | keep until shared event ownership is retired |
| `motorsport-news-article.isHotTopic` | Homepage/news aggregation fallback | populated on 4 articles | do not remove |
| `motorsport-news-article.author` | Schema and legacy content contract | empty locally | retain pending content-model decision |
| private ticket `embedCode` / config fields | Ticket embed safety and operational integration | inventory references present | retain; not editor-visible |

## Rehearsal result

The pre-grouping database backup was restored into the isolated local database
`sarga_strapi_i18n_rehearsal`. Strapi loaded the new schemas and the additive
migration completed for both draft and published FIA records. Rehearsal counts:

| Target | FIA content parents | Format items | Rundown sections | Guide sections |
| --- | ---: | ---: | ---: | ---: |
| Source local DB | 2 | 6 | 2 | 2 |
| Rehearsal DB | 2 | 6 | 2 | 2 |

The migration is idempotent: rerunning `apply` on the already-migrated source
detected the existing grouped content and did not create duplicates. Legacy
fields were not deleted or overwritten.

## Retirement result

The local retirement rehearsal removed 46 confirmed rollback/control links and
31 orphaned component rows after a fresh backup. This included FIA top-level
`eventRules`, FIA top-level `rundown`, the unconsumed IJTC `bannerSlides` rows,
and seven single-type control sections. The follow-up FIA retirement removed 6
legacy `presentationSections` links, 2 top-level `heroMedia` relations, and 6
orphaned page-section rows. IJTC `rundown[]` and the FIA grouped content remain
intact. The isolated rehearsal database produced the same zero-targeted-link
verification result.
