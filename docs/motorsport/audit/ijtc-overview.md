# IJTC Overview — CMS ↔ Frontend Audit

Route: `/events/indonesia-junior-talent-cup`.

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Hero | title, summary, season, image, CTA | Motorsport Program + Presentation | `title`, `mainHeadline`, `summary`, `seasonLabel`, `motorsportPresentation.hero.*`, `becomeRidersLabel/Url` | actively used / fallback | Hero presentation is preferred; program identity and local fallback remain for incomplete records. |
| Programme control | copy and metrics | Presentation → Information Band | `motorsportPresentation.informationBand.*` | actively used / fallback | Metrics are CMS-managed when supplied; overview counts/status are derived from current program data otherwise. |
| Overview | section heading, body, image, CTA | Program presentation section `overview` | `presentationSections[overview].*` | actively used / fallback | Newly wired to the existing section component; current copy remains safe fallback for older records. |
| Programme directory | route cards and descriptions | Program presentation section `routes` | `presentationSections[routes].items.*` | actively used / fallback | CMS items control card label/title/body/href when present; the three established routes remain fallback. |
| Next intake | eyebrow, heading, body, CTA | Program presentation section `become-riders` | `presentationSections[become-riders].*` | actively used / fallback | Additive wiring preserves the current CTA route when no section is configured. |
| Programme state | status label | Program identity | `programStatus` | actively used | Display label is a stable translation of the controlled enum. |

The static route list, image, and marketing copy were previously hardcoded. They are now overrideable through the program’s section records without changing the existing layout. Stable route taxonomy and fallback copy remain code-owned for resilience.

## Validation

- Overview route now reads `overview`, `routes`, and `become-riders` presentation sections.
- Frontend and CMS TypeScript checks passed after the wiring change.
