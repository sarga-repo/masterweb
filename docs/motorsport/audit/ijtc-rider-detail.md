# IJTC Rider Detail — CMS ↔ Frontend Audit

Route: `/events/indonesia-junior-talent-cup/riders/[riderSlug]`.

| Frontend Section | Frontend Element | CMS Section | CMS Field | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Metadata | rider title, description, image | Motorsport Rider | `name`, `number`, `team`, `portrait`, `bio` | actively used | Metadata is generated from the selected relation record. |
| Hero | number, name, biography, portrait | Motorsport Rider | `number`, `name`, `bio`, `portrait`, `portrait.alternativeText` | actively used / fallback | Missing biography and image have safe publication fallbacks. |
| Rider control | team, region, nation metrics | Motorsport Rider | `team`, `region`, `nationality` | actively used / fallback | Fallback labels indicate an incomplete record rather than inventing data. |
| Profile | portrait and repeated biography | Motorsport Rider | `portrait`, `bio`, `number` | actively used | Same record is intentionally reused for the detail composition. |
| Demo notice | demonstration warning | Frontend publication safety | none | derived hardcoded | Appears only when the record contains explicit demo markers. |
| Navigation | all riders and standings | Route chrome | none | hardcoded in frontend | Stable programme navigation. |

There is no separate rider presentation component today. The shared program Hero/Information Band controls are intentionally not copied into each rider record; this keeps individual rider records focused on participant data.

## Validation

- Dynamic params and metadata use the CMS rider relation.
- Frontend and CMS TypeScript checks passed.
