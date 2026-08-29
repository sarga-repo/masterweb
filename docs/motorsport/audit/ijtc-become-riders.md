# IJTC Become Riders — CMS ↔ Frontend Audit

Route: `/events/indonesia-junior-talent-cup/become-riders`.

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Hero | title, description, season, image | Program + Presentation → Hero | `motorsportPresentation.hero.*`, `seasonLabel`, `heroMedia` | actively used / fallback | Shared program hero is preferred. |
| Programme entry | heading and form introduction | Program presentation section `inquiry` | `presentationSections[inquiry].*` | actively used / fallback | Section controls now override the route’s editorial introduction. |
| Inquiry form | form fields and submission endpoint | Frontend form contract | none | hardcoded functional schema | Fields are intentionally fixed because the API validates the public inquiry contract; labels are not program-specific CMS content yet. |
| Before you submit | eligibility and privacy safety copy | Product policy | none | hardcoded | Must remain controlled product/legal guidance, not arbitrary editor copy. |
| Process | heading and process cards | Program presentation section `process` | `presentationSections[process].*`, nested `items.*` | actively used / fallback | CMS items override the three-step explanatory cards. |
| About link | programme guidance link | Route chrome | fixed route | hardcoded | Stable internal navigation. |

## Cleanup decision

The form field names and policy text are deliberately code-owned. Converting them to arbitrary rich text would make the public API contract and safety messaging less predictable. The editorial headings and process cards are CMS-managed through program sections.

## Validation

- Inquiry and process sections now consume `presentationSections` when configured.
- Frontend and CMS TypeScript checks passed.
