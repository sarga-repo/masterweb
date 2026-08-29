# Motorsport CMS ↔ Frontend Audit Index

This audit covers the dedicated Motorsport frontend routes and their current Strapi contracts. Each page document records the actual field consumer, fallback behavior, hardcoded interface chrome, and cleanup decision.

## Page audits

| Route / surface | Document |
| --- | --- |
| Home | [home.md](home.md) |
| About | [about.md](about.md) |
| Events hub | [events.md](events.md) |
| Event detail | [event-detail.md](event-detail.md) |
| News hub | [news.md](news.md) |
| News detail | [news-detail.md](news-detail.md) |
| Gallery | [gallery.md](gallery.md) |
| Merchandise | [merchandise.md](merchandise.md) |
| Tickets | [tickets.md](tickets.md) |
| Contact | [contact.md](contact.md) |
| Partners | [partners.md](partners.md) |
| Experience | [experience.md](experience.md) |
| FIA Rallycross campaign | [fia-rallycross.md](fia-rallycross.md) |
| IJTC overview | [ijtc-overview.md](ijtc-overview.md) |
| IJTC about | [ijtc-about.md](ijtc-about.md) |
| IJTC race schedule | [ijtc-race-schedule.md](ijtc-race-schedule.md) |
| IJTC riders | [ijtc-riders.md](ijtc-riders.md) |
| IJTC rider detail | [ijtc-rider-detail.md](ijtc-rider-detail.md) |
| IJTC standings | [ijtc-standings.md](ijtc-standings.md) |
| IJTC regulation | [ijtc-regulation.md](ijtc-regulation.md) |
| IJTC become riders | [ijtc-become-riders.md](ijtc-become-riders.md) |

## Collection and architecture audit

- [program-collections.md](program-collections.md) covers `motorsport-program`, rider, standing, regulation, ticket CTA, and partner records.
- The safest architecture is one canonical `motorsport-program` collection with program-type conditional editor guidance. No destructive collection split was performed.
- Legacy fields and compatibility fallbacks are explicitly marked in the page audits. Confirmed rollback-only fields are retired only after the local inventory, backup, and rehearsal checks pass.

## Cleanup outcome

- CMS-backed content is now used for the audited page presentation controls, CTAs, labels, imagery, SEO, and IJTC page copy where a matching existing component already exists.
- Every editable field in the dedicated Motorsport schemas has editor help metadata; private migration fields are excluded from editor requirements.
- Stable navigation, form-contract, accessibility, and publication-safety strings remain code-owned by design.
- Local source and rehearsal databases now contain the grouped FIA content and the verified legacy-field retirement. FIA legacy `presentationSections` links and top-level `heroMedia` relations are gone, while shared schema fields remain conditionally hidden for FIA. No staging or remote CMS change was made.

## Completed local cleanup phase — inventory, grouping, and retirement

The next cleanup phase should begin with a local PostgreSQL content snapshot and field-usage inventory. After the inventory is reviewed, implement the FIA Rallycross grouping additively:

```text
Motorsport Program
├── sharedPresentation
│   ├── hero
│   └── informationBand
├── fiaRallycrossContent
│   ├── formatSection
│   │   └── formatItems[]
│   ├── rundownSection
│   │   └── rundownItems[]
│   └── raceDayGuideSection
│       └── ruleItems[]
└── shared program fields and ticket relations
```

Completed gates:

1. ✅ Back up the local database and generate a non-destructive content inventory.
2. ✅ Add `fiaRallycrossContent` as an optional component on `motorsport-program`.
3. ✅ Use a specialized `format-item` containing only the fields consumed by the Format frontend: active state, sort order, label, title, description, and accent.
4. ✅ Reuse specialized `rundown-item` and `rule-item` children for schedule and race-day guidance data.
5. ✅ Backfill the FIA Rallycross record from the current Format, Rundown, and Race-day Guide content.
6. ✅ Update the FIA frontend to consume grouped content without the retired top-level fallback.
7. ✅ Add native `programType` field visibility so FIA editors see FIA fields and IJTC editors see IJTC/shared fields.
8. ✅ Retire confirmed rollback-only data: FIA `eventRules`, FIA top-level `rundown`, unconsumed IJTC `bannerSlides`, and seven unused single-type control sections.
9. ✅ Rehearse the retirement against `sarga_strapi_i18n_rehearsal` and verify zero targeted legacy links remain.
10. ✅ Retire FIA top-level `presentationSections` and `heroMedia` data after confirming the grouped content is canonical; keep the shared schema fields hidden for FIA and available to their real non-FIA consumers.
11. ✅ Correct the native Strapi editor conditions to direct JSON Logic so the conditional fields are actually hidden at runtime.

This is an additive grouping migration with a narrow retirement pass, not a split into separate Program collections. The canonical `motorsport-program` collection remains the safer architecture because it preserves localized records, event navigation, ticket relations, SEO, and shared presentation contracts while native conditions prevent irrelevant fields from confusing editors.

Staging deployment and staging migration remain blocked until explicit confirmation.
