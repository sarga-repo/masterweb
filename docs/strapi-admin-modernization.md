# Sarga Content Studio — Strapi Admin Modernization

## Status

Implemented locally for Strapi **5.49.0**. The existing Strapi Content
Manager remains the editor of record. No replacement editor, duplicate content
type route, or Strapi core modification was added.

## Architecture

The modernization uses the supported application-level Admin extension points:

- `cms/src/admin/app.tsx` keeps the existing Sarga branding, workspace links,
  preview integration, and native Strapi editor behavior.
- `cms/src/admin/styles/admin.css` provides shared design tokens and semantic
  Content Manager and admin-shell styling.
- `bootstrap()` marks the current native `/content-manager/` route on the
- The same stylesheet also styles the shell state for the sidebar, CMS
  homepage widgets, and Media Library. Login-specific form refinements remain
  in the existing application-level admin style injection because Strapi
  renders authentication outside the Content Manager route tree.
- The implementation does not branch on a content-type UID or menu name.

Native Strapi capabilities remain responsible for create, edit, save, delete,
draft/publish, localization, relations, components, repeatable components,
dynamic zones, media, validation, permissions, custom fields, and plugins.

## Detected editor coverage

The repository currently registers **39 content types**: **27 Collection
Types** and **12 Single Types**. Coverage is route-based and therefore applies
to all of them, including future types that use the native Content Manager.

### Collection Types

`Corporate Report`, `Ecosystem Business`, `Event`, `Inquiry Submission`, `Job
Vacancy`, `Leadership Person`, `Media Gallery`, `Merchandise Item`, `Motorsport
Event`, `Motorsport Leadership Person`, `Motorsport Merchandise Item`,
`Motorsport News Article`, `Motorsport Partner`, `Motorsport Program`,
`Motorsport Regulation`, `Motorsport Rider`, `Motorsport Standing`, `Motorsport
Ticket CTA`, `Motorsport Top Navigation Item`, `News Article`, `Newsletter
Subscription`, `Partner`, `Site`, `Site Page`, `Ticket CTA`, `Timeline Item`, and
`Top Navigation Item`.

### Single Types

`Homepage`, `Motorsport About Page`, `Motorsport Contact Page`, `Motorsport
Events Page`, `Motorsport Experience Page`, `Motorsport Gallery Page`,
`Motorsport Home Page`, `Motorsport Merchandise Page`, `Motorsport News Page`,
`Motorsport Partners Page`, `Motorsport Theme Settings`, and `Motorsport Tickets
Page`.

The source inventory also includes the shared and Motorsport components used by
these editors, including media, rich text, relations, repeatable components,
dynamic-zone sections, FIA Rallycross groups, SEO, hero video, and event
session components.

## Design tokens

The shared stylesheet defines a centralized token layer for:

- Warm neutral editor canvas: `#F7F3EC`
- Raised surface: `#FFFFFF`
- Charcoal ink: `#1B1B1B`
- Apex Crimson primary: `#E8192C`
- Draftline Blue secondary: `#0033A0`
- Electric Yellow focus: `#F5C800`
- Slipstream Teal and Ignition Orange status accents
- Shared radii, shadows, spacing behavior, body typography, and display
  headings

The treatment follows the requested balance of approximately 70% editor
productivity and 30% Sarga brand character. It deliberately does not add
frontend-only preloaders, scroll hijacking, custom cursors, or heavy animation
to the CMS.

## Shared Content Manager improvements

- Cleaner warm canvas and content hierarchy for native editor pages.
- More legible labels, helper text, required-field context, and validation
  messages.
- Consistent input, textarea, select, combobox, and focus states.
- Clearer component/section headings and expanded/collapsed affordances.
- Improved visual separation for repeatable and dynamic-zone groups using
  native structural roles.
- More deliberate relation and media-control surfaces without changing their
  semantics or Media Library behavior.
- Modernized dialogs, tab lists, status messages, and empty/loading surfaces.
- Preserved keyboard focus visibility and reduced-motion behavior.
- Shared button interaction polish while retaining Strapi's native action
  state machine and permission checks.
- Added a restrained Sarga dotted pattern and gradient accent to editor and
  shell canvases, plus matching sidebar navigation states and CMS homepage
  widget surfaces.
- Extended the same visual language to full-page Media Library cards and
  authentication inputs/actions.

## Collection Type and Single Type behavior

Both editor families use the same native Content Manager route contract in
Strapi 5.49. The route marker is set whenever the current path contains
`/content-manager/`, which covers collection list/create/edit paths and single
type edit paths without a hardcoded content-type allowlist.

The application-level styling is intentionally additive. It does not replace
Strapi's field renderers, relation logic, upload picker, component editor,
dynamic-zone controls, draft/publish controls, or RBAC checks.

## Future content types

A newly registered Collection Type or Single Type automatically receives the
shared treatment when it renders through the native Content Manager. No new
UID condition, menu entry, or custom editor component is required.

## Files changed

- `cms/src/admin/app.tsx`
- `cms/src/admin/styles/admin.css`
- `docs/strapi-admin-modernization.md`
- `docs/PHASE_PROGRESS.md`

## Validation

Run from the repository root:

```bash
docker compose exec -T strapi pnpm exec tsc -p src/admin/tsconfig.json --noEmit
docker compose exec -T strapi pnpm build
git diff --check
```

The authenticated local browser smoke test covered the Motorsport Program
Collection Type editor, FIA grouped components, Media Library picker, full-page
Media Library, and CMS homepage. Save, publish, deletion, and permission
changes were not triggered; native Strapi action semantics remain untouched.

## Known limitations

- Strapi's Design System uses generated styled-component classes internally.
  The customization avoids depending on those classes and uses semantic/ARIA
  structure, which is more upgrade-resistant but cannot restyle every deeply
  encapsulated plugin surface.
- Some third-party custom fields may expose no stable semantic wrapper and will
  retain more native styling.
- The persisted Content Manager field order/layout remains controlled by the
  existing local migrations; this modernization does not rewrite schema data
  or migrate stored content.
- A Strapi major/minor upgrade should include a visual smoke test because
  native semantic structure can change even when public Admin APIs remain
  compatible.
- No staging build, deployment, migration, or schema operation was performed.
