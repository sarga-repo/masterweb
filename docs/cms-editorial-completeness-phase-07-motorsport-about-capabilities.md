# CMS Editorial Completeness — Phase 07 Motorsport About Capabilities

## Status

**Phase 07A complete. Phase 07B pending approval.**

## Request

Make four capability cards on `frontend-motorsport /about` fully CMS-managed for
the `Sarga Motorsport Admin` role. Current CMS editing exposes only generic
`shared.page-section` records. Capability card titles and descriptions remain
hardcoded in `frontend-motorsport/src/app/about/page.tsx`.

## Current-State Assessment

### Rendered route

`frontend-motorsport/src/app/about/page.tsx`

Current data sources:

| Surface | Current source | CMS editable now |
| --- | --- | --- |
| Hero title | `site-page.heroTitle` | Yes |
| Hero description | `site-page.heroDescription` | Yes |
| Profile body | `shared.page-section`, `profile` | Yes |
| Profile heading | `shared.page-section`, `profile.title` | Yes |
| Vision body | `shared.page-section`, `vision` | Yes |
| What We Do intro | `shared.page-section`, `what-we-do` | Yes |
| Operating idea | `shared.page-section`, `operating-idea` | Yes |
| Team intro | `shared.page-section`, `team-intro` | Yes |
| Contact CTA | `shared.page-section`, `contact-cta` | Yes |
| Ecosystem CTA | `shared.page-section`, `ecosystem-cta` | Yes |
| Capability card titles | `CAPABILITIES` constant | No |
| Capability card descriptions | `CAPABILITIES` constant | No |
| Capability order/count | `CAPABILITIES` constant | No |
| Capability card enabled state | Not supported | No |
| Capability card icons | No CMS field | Code-owned visual treatment | No |
| Leadership names/roles/media | `leadership-person` collection | Yes, scoped Motorsport records |

Current hardcoded cards:

1. Professional competition
2. Talent development
3. Event experience
4. Media & partnerships

### Additional gap identified after 07C

The profile heading `A stage built for velocity.` was hardcoded in the frontend
even though the `profile` page section already exposes a CMS `title` field. The
frontend now uses `profile.title` and keeps the existing fallback only when the
CMS value is absent.

### Existing comparable pattern

Motorsport homepage already uses a suitable CMS architecture:

- `site-page.motorsportWorldSection`
- repeatable `motorsport.discipline-card` components
- ordered cards via `sortOrder`
- `enabled` state
- title, label, media, alt text, destination, and accent fields
- frontend mapping with fallback data

Relevant files:

- `cms/src/components/motorsport/world-of-motorsport.json`
- `cms/src/components/motorsport/discipline-card.json`
- `frontend-motorsport/src/lib/homepage-data.ts`
- `frontend-motorsport/src/app/page.tsx`

Generic Gateway and Horse Sport `shared.page-section` records manage section
copy, but do not provide an ordered nested card collection for this requirement.

## Recommended Architecture

Add two Motorsport-specific components:

### `motorsport.about-capabilities`

Repeatable: false. Added to `api::site-page.site-page.sections` dynamic zone.

Fields:

| Field | Type | Required | Purpose |
| --- | --- | --- | --- |
| `enabled` | boolean | Yes | Hide entire capability grid without deleting content |
| `eyebrow` | string | No | Section eyebrow, default `What we do` |
| `title` | string | Yes | Grid heading, default approved heading |
| `description` | text | No | Intro copy above cards |
| `cards` | repeatable `motorsport.about-capability-card` | Yes | Ordered capability records |

### `motorsport.about-capability-card`

Repeatable within `about-capabilities`, maximum six cards.

Fields:

| Field | Type | Required | Purpose |
| --- | --- | --- | --- |
| `internalName` | string | Yes | Stable editor/admin identifier, not public copy |
| `enabled` | boolean | Yes | Hide card without deletion |
| `title` | string | Yes | Card heading |
| `description` | text | Yes | Card body |
| `sortOrder` | integer | Yes | Deterministic display order |
| `accent` | enum | Yes | Existing Motorsport visual accent |
| `iconKey` | enum | No | Optional controlled icon selection if approved |

Default `iconKey` behavior: no new icon system. Existing card layout has no
editorial icon dependency; retain visual numbering and accent styling in code.
Add icon selection only if design/content owners explicitly require it.

## CMS Admin Experience

After implementation, `Sarga Motorsport Admin` edits:

1. Open **Sarga Motorsport** workspace.
2. Open **Pages**.
3. Open **Motorsport Site pages**.
4. Open **About Sarga Motorsport** (`routePath = /about`).
5. Open **Sections** dynamic zone.
6. Add or expand **About Capabilities**.
7. Add, reorder, enable/disable, and edit capability cards.
8. Save and publish.

Expected dynamic-zone appearance:

```text
Sections
├── Page Section - profile
├── Page Section - vision
├── Page Section - what-we-do
├── About Capabilities
│   ├── Card - Professional competition
│   ├── Card - Talent development
│   ├── Card - Event experience
│   └── Card - Media & partnerships
├── Page Section - operating-idea
├── Page Section - team-intro
├── Page Section - contact-cta
└── Page Section - ecosystem-cta
```

The Motorsport role already includes `api::site-page.site-page`. Its managed
field discovery recursively includes dynamic-zone components and nested
component fields. Therefore no separate role permission should be added unless
runtime UAT proves Strapi requires an explicit nested-component permission.

## Frontend Contract

`fetchSitePage("about")` already populates `sections`. Extend typed section
mapping to recognize `motorsport.about-capabilities` and render it.

Rendering rules:

- Render CMS capability grid when component exists and `enabled !== false`.
- Filter cards where `enabled !== false`.
- Sort by `sortOrder`, then preserve CMS order for equal values.
- Render CMS title/description exactly after safe trimming.
- Keep technical index labels (`01`, `02`, etc.) code-owned.
- Keep layout, responsive behavior, contrast, and semantic markup code-owned.
- If component is absent or produces zero enabled cards, render current four-card
  fallback temporarily.
- Do not merge individual CMS cards with fallback cards. Use whole-component
  fallback to avoid mixed successful/incomplete content.
- Keep fallback until production/staging content verification completes.

## Seed Contract

Update `HORSESPORT_SITE_PAGES` equivalent Motorsport About seed record with one
`motorsport.about-capabilities` component containing current approved copy:

| Order | Internal name | Title |
| ---: | --- | --- |
| 1 | `professional-competition` | Professional competition |
| 2 | `talent-development` | Talent development |
| 3 | `event-experience` | Event experience |
| 4 | `media-partnerships` | Media & partnerships |

Seed updates must be idempotent and must not overwrite editor changes on existing
records. Existing seeded page records currently use create-if-missing behavior;
implementation must preserve that rule or add an explicit migration that updates
only absent capability components.

## Phased Implementation Plan

### Phase 07A — Schema and contract — Complete

- Add both component schemas.
- Add components to `site-page.sections` dynamic-zone allowlist.
- Update generated CMS contracts and `strapi/content-types.json`.
- Add component shape/types and section-key contract tests.
- Do not change frontend rendering yet.

Exit criteria:

- CMS build/typecheck passes.
- Schema loads without UID conflicts.
- Role field discovery includes nested card fields.

Evidence:

- Added `motorsport.about-capabilities` component.
- Added `motorsport.about-capability-card` nested repeatable component.
- Registered About Capabilities in `site-page.sections` dynamic zone.
- CMS TypeScript compilation passed.
- CMS production build passed.
- `git diff --check` passed.

No seed data or frontend rendering changed in Phase 07A.

### Phase 07B — Seed and migration safety — Complete

- Add four default cards to local seed data.
- Ensure existing records are not overwritten.
- Add a non-destructive migration/rehearsal check for missing component data.
- Verify local Strapi record has exactly one capability component and four cards.

Exit criteria:

- Restarting CMS does not duplicate cards.
- Existing editor-authored capability content remains unchanged.
- Local API returns component under Motorsport About only.

Evidence:

- Added four approved default capability cards to the Motorsport About seed.
- Existing About records receive the component only when it is absent.
- Existing sections and editor-authored capability content are not overwritten.
- Added `uat:motorsport-about-capabilities` verification command.
- CMS TypeScript compilation passed.
- CMS production build passed.
- Local API returned one capability component with four cards after restart.
- `git diff --check` passed.

The first verification attempt used invalid Strapi dynamic-zone populate syntax
and returned HTTP 400; query was corrected to component-specific `populate[sections][on]` syntax, then verification passed.

### Phase 07C — Frontend consumer — Complete

- Replace `CAPABILITIES` rendering path with CMS component mapping.
- Keep fallback for absent/incomplete CMS records.
- Preserve visual design from supplied screenshot.
- Add tests for ordering, enabled filtering, and whole-component fallback.

Exit criteria:

- CMS card edits appear on `/about` after publish/revalidation.
- Disabled cards disappear without layout breakage.
- Missing component renders approved fallback without mixed data.

Evidence:

- Added typed CMS capability mapping in `frontend-motorsport/src/lib/cms-data.ts`.
- `/about` now renders CMS cards when the dedicated component is present.
- Disabled cards and incomplete cards are excluded.
- Cards sort by CMS `sortOrder`.
- Missing/empty component falls back to the complete four-card block.
- Technical card numbering remains code-owned.
- Motorsport typecheck, lint, and production build passed.
- `git diff --check` passed.
- Added Node regression tests for ordering, enabled filtering, and fallback.

The Motorsport package has no test script or installed test runner; regression
test source is typechecked but not executed in this phase.

### Phase 07D — Admin and UAT — Partially Complete

- Verify `Sarga Motorsport Admin` can edit/publish page and nested cards.
- Verify Gateway, Horse Sport, Shared, and Hidden records cannot leak into query.
- Verify Indonesian localization behavior remains whole-record fallback.
- Verify media/SEO behavior if optional card media is later approved.

Exit criteria:

- Authenticated role UAT passes.
- Browser UAT passes desktop/mobile and accessibility checks.
- No production migration before stakeholder approval.

Evidence:

- Profile heading now reads `profile.title` from CMS, with fallback only when
  absent.
- Motorsport `/about` browser smoke passed: HTTP 200, one H1, four capability
  cards, no horizontal overflow at 1200px, zero browser console errors.
- CMS build and TypeScript compilation passed.
- Motorsport typecheck, lint, and production build passed.
- Public API site isolation passed 12/12 checks.
- Authenticated `Sarga Motorsport Admin` edit/publish UAT is blocked pending
  `CMS_UAT_PASSWORD` and authenticated CMS credentials.
- Indonesian localization review remains pending.

## Explicit Non-Goals

- No new collection type for four fixed About cards.
- No generic card-builder that allows arbitrary layout mutation.
- No editor control over technical numbering, CSS, grid geometry, or icon code.
- No deletion of fallback cards before staging/production verification.
- No production data migration in implementation phases without approval.

## Acceptance Criteria

- [ ] Motorsport About dynamic zone exposes `About Capabilities` component.
- [ ] Editors can manage four or fewer enabled cards without code changes.
- [ ] Card order is CMS-controlled.
- [ ] Card copy is CMS-controlled.
- [ ] Existing visual hierarchy remains unchanged.
- [ ] Motorsport Admin can edit/publish nested card fields.
- [ ] Other site scopes remain isolated.
- [ ] Missing/incomplete CMS component falls back as one complete block.
- [ ] Schema, seed, frontend, RBAC, and browser tests pass.
- [ ] Phase progress and handover evidence are updated.

## Approval Gate

Approval requested for the following before Phase 07A implementation:

1. Use dedicated `motorsport.about-capabilities` and
   `motorsport.about-capability-card` components.
2. Keep technical numbering and visual layout code-owned.
3. Keep current four-card fallback until staging verification.
4. Do not add editor-controlled icons or card media in first implementation.
5. Execute phases 07A through 07D sequentially with validation after each phase.
