# IJTC Standings — CMS ↔ Frontend Audit

Route: `/events/indonesia-junior-talent-cup/standings`.

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Hero | title, description, season, image | Program + Presentation → Hero | `motorsportPresentation.hero.*`, `seasonLabel`, `heroMedia` | actively used / fallback | Shared program hero is preferred. |
| Classification control | copy and metrics | Presentation → Information Band + Standing relation | `informationBand.*`, `standings` relation | actively used / derived | Classified count/leader are derived when custom metrics are absent. |
| Standings table | position, rider, number, team, region, points, result summary, portrait | Motorsport Standing + Rider relation | standing fields and related `rider` fields | actively used | `StandingsTable` is populated from CMS standings joined to rider data. |
| Classification heading | heading and explanatory copy | Program presentation section `standings` | `presentationSections[standings].*` | actively used / fallback | Existing explanatory copy is now CMS overrideable. |
| Demo notice | unapproved data warning | Frontend publication safety | none | derived hardcoded | Appears only when result data contains explicit demo markers. |
| Cross-links | riders and regulation | Relations/routes | `riders`, `regulations` | actively used / fixed route | Link labels are stable interface taxonomy. |

## Validation

- Standings route now reads the shared program hero and `standings` section copy.
- Standing/rider relation data remains CMS-managed and no standings values are hardcoded in the page.
