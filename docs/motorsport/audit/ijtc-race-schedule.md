# IJTC Race Schedule — CMS ↔ Frontend Audit

Route: `/events/indonesia-junior-talent-cup/race-schedule`.

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Hero | page title, description, season, image | Program + Presentation → Hero | `motorsportPresentation.hero.*`, `seasonLabel`, `heroMedia` | actively used / fallback | The shared program hero is now used when configured; legacy program image remains fallback. |
| Calendar control | copy and metrics | Presentation → Information Band | `motorsportPresentation.informationBand.*` | actively used / fallback | Round count is derived from active mapped schedule entries when no custom metrics exist. |
| Race calendar | section heading and description | Program presentation section `race-schedule` | `presentationSections[race-schedule].*` | actively used / fallback | Existing `rundown` data remains the source of schedule rows. |
| Schedule rows | round/date/title/venue/description/times/status | Program schedule | `rundown[]` | actively used | `mapProgramSchedule` filters active rows, sorts by `sortOrder`, and maps start/end times. |
| Notice | placeholder/demo warning | Frontend publication safety | none | hardcoded fallback | This is operational safety copy and should remain visible until editorial approval workflow is modeled. |
| Cross-links | rider profiles and standings | Frontend route chrome | none | hardcoded in frontend | Stable programme navigation. |

`eventRules` is retired from the shared program model. Rider relations, standing relations, and regulation relations are not consumed by this route; they belong to their own IJTC pages. The shared `rundown[]` remains because this route consumes it.

## Validation

- The route was wired to the shared program presentation Hero and `race-schedule` section.
- Frontend and CMS TypeScript checks passed after the wiring change.
