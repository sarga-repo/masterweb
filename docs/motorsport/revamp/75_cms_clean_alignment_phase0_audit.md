# MSR-CMS-CLEAN-0 — CMS/frontend alignment reassessment

Date: 2026-08-23
Status: completed as a read-only audit; approval required before Phase 1
Scope: Sarga Motorsport top-level pages, programme/detail presentation, CMS
field ownership, and admin form usability

## Why this reassessment exists

The earlier MSR-CMS-CLEAN-0 through MSR-CMS-CLEAN-11 track delivered the
dedicated Motorsport Single Types and the shared Hero/Information Band
components. Those historical phases remain recorded as complete. This
reassessment checks the implementation as it exists now against the intended
single-source-of-truth behavior requested for the next cleansing pass.

It does not reopen or delete the earlier migration work. It identifies the
remaining alignment work before changing schemas, data, or public rendering.

## Phase 0 rules

1. The CMS page editor order is the editorial contract for top-level page
   sections.
2. The frontend must render sections in that contract order. A frontend
   adapter may translate a CMS field name into a stable render key, but it may
   not use a global union of fields from unrelated page types as the order.
3. Every public section or editable content block needs one CMS owner and an
   explicit `isActive`/`enabled` control when editors need show/hide behavior.
4. A visible frontend wrapper is allowed for layout, but it must not silently
   combine two independently editable CMS sections unless the CMS contract
   defines that grouping.
5. Shared collections remain shared only when the content is genuinely shared.
   Motorsport-owned fields and relations must have one dedicated canonical
   source before legacy duplicates are archived.
6. No legacy record or schema is deleted during the cleansing track. Migration
   and rollback evidence precede retirement.

## Static audit evidence

The repository now contains a read-only validator:

```bash
node cms/scripts/audit-motorsport-cms-frontend-alignment.mjs
```

The default mode reports findings and exits successfully so it can be used as
an inventory. `--strict` is reserved for a later gate after the findings have
been resolved:

```bash
node cms/scripts/audit-motorsport-cms-frontend-alignment.mjs --strict
```

The validator checks the ten dedicated page schemas, their frontend render
markers, the explicit CMS-to-frontend mappings, and known duplicate-source
sets. It does not call Strapi or mutate the database.

## Page order inventory

The following is the current contract comparison. `informationBand → control`
means the frontend currently renders the canonical Information Band inside a
legacy control-section marker; it is a migration alias, not two intended
visible bands.

| Route | CMS presentation order | Current frontend order | Phase 0 finding |
| --- | --- | --- | --- |
| `/` | Hero, hero slides, Information Band, World of Motorsport, Upcoming Events, Ticket, Latest News, Connected Records | Hero, Information Band, World of Motorsport, Upcoming Events, Ticket, Latest News, Connected Records, Gallery | Gallery is rendered but has no dedicated CMS field. Partner strip and newsletter are also not full page sections in the Home Single Type. |
| `/about` | Hero, Information Band, Profile, Capabilities, Team, Contact CTA, Ecosystem CTA | Hero, Information Band, Profile, Capabilities, Team, combined About CTAs | Two CMS CTA sections are combined into one render boundary; some labels, copy, and destinations remain fallback-owned. |
| `/events` | Hero, Information Band, Event Control, Programmes, Calendar | Hero, Event Control, Programmes, Calendar | Information Band and Event Control both map to the same visible control slot. |
| `/news` | Hero, Information Band, News Control, Lead Story, Archive Intro, Gallery CTA | Hero, News Control, News Feed wrapper, Lead Story, Archive Intro, Gallery CTA | Information Band and News Control are duplicated sources; News Feed is a structural wrapper whose visibility is coupled to Archive Intro. |
| `/gallery` | Hero, Information Band, Archive | Hero, Information Band, Gallery Archive | Legacy `gallery-intro` is still read even though the dedicated page model does not own it. |
| `/merchandise` | Hero, Information Band, Merch Control, Catalogue, Final CTA | Hero, Merch Control, Catalogue, Final CTA | Information Band and Merch Control are duplicated sources; the final destination is partly hardcoded. |
| `/tickets` | Hero, Information Band, Ticket Control, Featured Ticket, Ticketed Events, Ticket Info | Hero, Ticket Control, Featured Ticket, Ticketed Events, Ticket Info | Information Band and Ticket Control are duplicated sources; ticket-info copy is partly hardcoded. |
| `/partners` | Hero, Information Band, Partner Control, Partner Network, Final CTA | Hero, Partner Control, Partner Network, Final CTA | Information Band and Partner Control are duplicated sources; final CTA body/destination is partly hardcoded. |
| `/experience` | Hero, Information Band, Experience Control, Pillars, Track, Final CTA | Hero, Experience Control, Pillars, Track, Final CTA | Information Band and Experience Control are duplicated sources; pillar/track content is partly hardcoded. |
| `/contact` | Hero, Information Band, Inquiry Control, Inquiry Form, Final CTA | Hero, Inquiry Control, Inquiry Form, Final CTA | Information Band and Inquiry Control are duplicated sources; contact labels/destinations are partly hardcoded. |

The current page marker order is useful evidence of public render order, but it
does not by itself prove that the data source is canonical. That is why the
validator reports both marker order and CMS field order.

## Detail and programme surfaces

The detail presentation direction is sound but still needs the same one-owner
rule:

- Event and News detail use `motorsportPresentation.hero` and
  `motorsportPresentation.informationBand`, with safe legacy/fallback paths.
- Campaign/programme records use `motorsportPresentation`, then `heroMedia` as
  a legacy fallback, followed by `bannerSlides` and `presentationSections`.
- Campaign `presentationSections` and legacy route sections can currently be
  merged during fallback, which risks duplicate content when both are present.
- IJTC child pages consume programme opening presentation but still contain
  route-local labels, cards, and CTA copy that are not consistently mapped to
  CMS-controlled named sections.

The existing programme editor layout migration is the correct UX pattern: put
the active presentation fields first, keep the legacy fallback adjacent and
labelled, then place carousel/supporting sections, followed by identity,
schedule, CTA, relation, scope, and SEO fields.

## Missing coverage and show/hide requirements

The next implementation phases should add or normalize CMS ownership for the
following surfaces rather than adding more frontend constants:

| Surface | Current gap | Required contract |
| --- | --- | --- |
| Homepage Gallery | Rendered by the frontend but absent from the dedicated Home Single Type | Add a named gallery section with copy/media/CTA and `isActive`, or explicitly remove the render path after content-owner approval. |
| Homepage Partner strip | Only the collection and a global boolean are CMS-controlled | Add a named section contract for visibility and editorial label, while keeping partner records in the Partner collection. |
| Homepage Newsletter | Hardcoded section/copy | Add a named section with `isActive`, copy, and the existing safe form route; do not move submission logic into content. |
| About combined CTAs | Two CMS fields share one render boundary | Either define an intentional grouped section contract or render `contactCtaSection` and `ecosystemCtaSection` as independent CMS-order units. |
| Experience pillars/track | CMS section toggles exist, but much of the visible content is hardcoded | Add repeatable, ordered CMS items with item-level visibility and media/alt text, or document the remaining content as intentionally structural. |
| Detail story/related sections | News/event detail labels and visibility are partly route-owned | Extend the existing detail presentation only for editorial copy/visibility; keep event, ticket, relation, and safety logic in their owning collections. |
| IJTC child pages | Programme opening contract exists, but child-page surfaces remain mostly route constants | Add named programme presentation sections incrementally, with explicit ownership and fallback rules. |

For every new or normalized section, the default is an explicit whole-section
visibility field plus field-level visibility only where the design needs it.
The reusable Motorsport `page-section` already provides the pattern for
eyebrow/title/body/media/CTA visibility; future components should follow the
same semantics rather than inventing per-route booleans.

## Duplicate-source inventory

### Information Band versus legacy control sections

The dedicated page models contain a canonical `informationBand` and a legacy
named `*ControlSection` on Events, News, Merchandise, Tickets, Partners,
Experience, and Contact. The frontend currently gives the canonical band
precedence but retains the legacy section as a fallback. This is safe for
migration but not a clean editor contract.

Decision for the next phase: `informationBand` is the only visible control-band
owner. Legacy control sections remain read-only compatibility fallbacks until
the route has migrated and its records have been reconciled.

### Shared Ticket CTA versus Motorsport Ticket CTA

`cms/src/api/ticket-cta/.../schema.json` and
`cms/src/api/motorsport-ticket-cta/.../schema.json` overlap across title, labels,
provider, redirect/embed fields, timing, active state, artwork, and event
relation. The dedicated Motorsport collection also carries the localized
presentation fields used by the Motorsport ticket experience.

Decision for the next phase: keep the dedicated Motorsport Ticket CTA as the
Motorsport-owned authoring source, map existing shared records by stable
relation/document identity, and archive the duplicate only after a dry-run,
relation reconciliation, frontend cutover, and rollback rehearsal.

### Generic `mapSinglePage` section union

`frontend-motorsport/src/lib/cms-data.ts` maintains one `sectionKeys` array for
all page types. This means the normalized array order is not the order of the
active page's CMS schema. The About `capabilities` section is appended after
that shared loop even though the About schema places it before Team.

Decision for the next phase: use per-page ordered field definitions or a
schema-driven adapter. Keep stable section keys for rendering and tests, but
never use the global union array as the source of order.

## Admin UI/UX direction

The current dedicated Single Types are the right foundation. The editor should
be made easier through supported Strapi Content Manager layouts and workspace
guidance, not CSS hiding or a second CMS:

1. Keep one page entry per route and put Hero → Information Band → named page
   sections at the top of every layout.
2. Group sections in the same sequence as the public page and use clear display
   labels such as “Homepage — Gallery” or “Events — Calendar”.
3. Put show/hide controls first inside each section, followed by copy, media,
   CTA, and advanced presentation fields.
4. Keep relations, scope, SEO, and migration-only fields below the editorial
   content. Managed site editors must not be asked to choose their own scope.
5. Add concise field descriptions explaining the public effect of each toggle,
   fallback behavior, media requirements, and the canonical source when a
   legacy field remains.
6. Use progressive disclosure for advanced JSON/embed/technical fields and
   dedicated workspace links for Home, About, Events, News, Gallery, Commerce,
   Support, and Shared Library.
7. Use a reusable “content owner” convention in component descriptions so an
   editor can tell whether a value belongs to the page, a related collection,
   or a shared library record.

This approach keeps the form maintainable as the number of editable sections
grows while preventing duplicate fields from looking equally authoritative.

## Phase gate

MSR-CMS-CLEAN-0 is complete when:

- the validator runs in read-only mode;
- the ten page schema/marker mappings are documented;
- missing CMS coverage and duplicate sources are explicitly listed;
- the canonical Information Band and ticket ownership decisions are recorded;
- no runtime schema, frontend, content, or database mutation is introduced.

The next phase should implement the ordered adapter and canonical-source
foundation only. It should not yet migrate or archive duplicate records.
