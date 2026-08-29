# IJTC Riders — CMS ↔ Frontend Audit

Route: `/events/indonesia-junior-talent-cup/riders`.

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Hero | title, description, season, image | Program + Presentation → Hero | `motorsportPresentation.hero.*`, `seasonLabel`, `heroMedia` | actively used / fallback | Shared program hero is preferred; fallback content remains for empty/local records. |
| Rider control | profile/demo/nation metrics | Presentation → Information Band + Rider relation | `informationBand.*`, `riders` relation | actively used / derived | Counts are derived from published rider records; custom metrics override them. |
| Rider catalogue | name, number, team, region, portrait, bio link | Motorsport Rider | `name`, `slug`, `number`, `team`, `region`, `nationality`, `portrait`, `bio` | actively used | `RiderCatalog` and rider detail route consume these fields. |
| Catalogue heading | heading and explanatory copy | Program presentation section `riders` | `presentationSections[riders].*` | actively used / fallback | Existing static copy is now overrideable from the program record. |
| Demo notice | warning copy | Frontend publication safety | none | hardcoded fallback | Generated from explicit demo markers; this prevents unapproved demo records reading as official participants. |
| Cross-links | standings and rider inquiry | Program CTA / route chrome | `becomeRidersLabel/Url`; fixed route | actively used / hardcoded | Inquiry CTA is program-managed; route labels are stable navigation. |

## Validation

- Riders route now reads the shared program hero and `riders` section copy.
- Rider relation and profile fields remain the sole source for catalogue/profile content.
