# IJTC Regulation — CMS ↔ Frontend Audit

Route: `/events/indonesia-junior-talent-cup/regulation`.

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Hero | title, description, season, image | Program + Presentation → Hero | `motorsportPresentation.hero.*`, `seasonLabel`, `heroMedia` | actively used / fallback | Shared program hero is preferred. |
| Document control | copy and metrics | Presentation → Information Band + Regulation relation | `informationBand.*`, `regulations` relation | actively used / derived | Published/pending status is derived from whether the CMS file URL exists. |
| Rulebook | title, summary, version, effective date, PDF link | Motorsport Regulation | `title`, `summary`, `version`, `effectiveDate`, `file`, `fileLabel` | actively used / fallback | Download appears only for an active relation with an approved file. |
| Rulebook heading | heading and explanatory copy | Program presentation section `regulation` | `presentationSections[regulation].*` | actively used / fallback | Existing copy is now CMS overrideable. |
| Publication workflow | three release steps | Frontend publication safety | none | hardcoded | Operational workflow guidance; no CMS fields exist or are needed for the controlled release process. |
| Inquiry CTA | support label and link | Program CTA / route chrome | `becomeRidersLabel/Url` with fixed fallback | actively used / fallback | The route is program-managed; label fallback is stable. |

## Validation

- Regulation route now reads the shared program hero and `regulation` section copy.
- Regulation relations remain CMS-managed; no PDF or document metadata is hardcoded.
