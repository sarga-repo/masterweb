# IJTC About — CMS ↔ Frontend Audit

Route: `/events/indonesia-junior-talent-cup/about`.

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Hero | title, description, season, image | Program + Presentation → Hero | `motorsportPresentation.hero.*`, `summary`, `seasonLabel`, `heroMedia` | actively used / fallback | Shared program hero is now preferred. |
| Programme brief | copy and metrics | Presentation → Information Band | `motorsportPresentation.informationBand.*` | actively used / fallback | Custom band metrics override derived fallback values. |
| Purpose | heading, body, image | Program presentation section `purpose` | `presentationSections[purpose].*` | actively used / fallback | Section body/media are now CMS override points. |
| Development model | heading and principle cards | Program presentation section `model` | `presentationSections[model].*`, nested `items.*` | actively used / fallback | CMS items control order, number label, title, and description. |
| Programme entry | CTA heading and link | Program presentation section `become-riders` | `presentationSections[become-riders].*` plus program CTA | actively used / fallback | Existing local inquiry path remains fallback. |

Stable safety language about eligibility and accounts is intentionally code-owned because it communicates product constraints rather than campaign copy.

## Validation

- About route now reads `purpose`, `model`, and `become-riders` presentation sections.
- Frontend and CMS TypeScript checks passed.
