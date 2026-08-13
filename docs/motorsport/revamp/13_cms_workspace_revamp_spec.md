# Motorsport CMS Workspace Revamp Specification

Status: CMS-MSR-UI-4 complete; future extension approval required

Date: 2026-08-13

Owner: Sarga CMS / Motorsport workspace

## 1. Design Read

Reading this as an operational CMS workspace for Motorsport editors, with a
disciplined federation and paddock character, leaning toward warm editorial
surfaces, Draftline Blue structure, Charcoal inverse surfaces, and restrained
high-performance details.

Design dials:

- Design variance: 6/10
- Motion intensity: 3/10
- Visual density: 6/10

Premium means faster editor decisions, accurate Motorsport brand expression,
strong hierarchy, accessible controls, and stable Strapi integration. It does
not mean copying the public Motorsport website into the admin panel.

## 2. Current Baseline

Authenticated local browser audit completed with Motorsport Admin account.

### Desktop

- Route: `/admin/sarga-workspaces/motorsport`
- Viewport: 1200 x 897
- Visible collections: 13 permitted cards
- Permission checks: 13 successful `200` responses
- Horizontal overflow: none
- Post-login application errors: none
- Existing warnings: absolute menu-link paths, React Router future flag,
  `useRBAC` API deprecation warning

### Mobile

- Viewport: 390 x 844
- Horizontal overflow: none
- Workspace content collapses to one column
- Guidance occupies most of first viewport before collection navigation
- Collection navigation begins substantially below the fold

### Current weaknesses

- Workspace uses generic nested rounded panels and cards.
- Three guidance notices push editor tasks below the first fold.
- Group order is accidental: Pages, Programs, Commerce, Editorial, Library.
- Motorsport workspace accent uses Gateway-style `#ff5032`, not approved Motorsport
  semantic tokens.
- Current menu icon is a wide 777 x 195 lockup rendered inside a 28 x 28 box,
  leaving visible artwork approximately 28 x 7 pixels.
- All four workspace menu entries use Motorsport icon and Motorsport alt text.
- Workspace styles are mostly inline and cannot express robust hover, focus,
  theme, and reduced-motion states.
- Global admin heading overrides affect Strapi screens outside workspace scope.

## 3. Goals

1. Make Motorsport workspace feel like a premium international brand tool,
   distinct from Gateway and generic Strapi.
2. Put high-frequency editor tasks within first viewport where practical.
3. Preserve existing RBAC, scope filters, routes, Content Manager deep links,
   and server enforcement exactly.
4. Use approved Motorsport visual tokens without compromising contrast or
   Strapi semantic colors.
5. Improve keyboard focus, hover, active, loading, denied, dark-mode, and
   reduced-motion behavior.
6. Keep implementation reviewable through small sub-phases and browser UAT at
   every stage.

## 4. Non-goals and Hard Boundaries

Do not change:

- Content models, schemas, seed contracts, or APIs.
- `siteScope` security enforcement or managed-role permissions.
- `Page.Protect`, `useRBAC`, or Content Manager route contracts.
- Shared Media Library ownership policy.
- Public Motorsport frontend.
- Ticketing, payment, checkout, accounts, or internal ticketing.
- Native Strapi sidebar fork or unsupported nested sidebar API.
- External scripts, paid services, or unapproved fonts.

Initial revamp excludes Content Manager form customization and live dashboard
metrics. Both require separate approval after editor UAT evidence.

## 5. Brand Direction

Use approved Motorsport foundations from
`docs/motorsport/revamp/11_redesign_foundations.tokens.json`.

### Semantic palette

| Role | Token | Value |
| --- | --- | --- |
| Workspace canvas | Warm White | `#FFF9EE` |
| Subtle surface | Cream 100 | `#F6EFE3` |
| Raised surface | White | `#FFFFFF` |
| Inverse surface | Charcoal | `#1B1B1B` |
| Structural band | Draftline Blue | `#0033A0` |
| Primary action | Crimson 700 | `#C41427` |
| Primary hover | Crimson 800 | `#A81022` |
| Energy accent | Ignition Orange | `#FF6B00` |
| Accessible orange text | Orange 800 | `#B94700` |
| Focus indicator | Electric Yellow | `#F5C800` |
| Help/data accent | Slipstream Teal | `#00C4CC` |
| Primary text | Charcoal | `#1B1B1B` |
| Secondary text | Ink 700 | `#47433D` |
| Muted text | Ink 600 | `#625E56` |
| Light border | Cream 200 | `#E8DECF` |

Rules:

- Bright orange is for accents and surfaces, not small body text.
- Electric Yellow is for focus and status, not paragraphs.
- Crimson remains visually distinct from semantic danger treatment where Strapi
  requires destructive meaning.
- Dark mode needs paired semantic surfaces and readable controls; no hardcoded
  light-only workspace island.

### Typography

- Workspace display: `Owners Wide` only if approved local font asset exists;
  otherwise use the approved fallback stack.
- Workspace body/UI: `Noto Sans`, with robust system fallback.
- Do not globally force all Strapi headings into Motorsport display typography.
- Workspace H1 target: 36–52px desktop, 30–38px mobile.
- Group heading target: 18–24px.
- Collection title target: 16–20px.
- Body target: 14–16px.
- Use tabular numerals if later data cues are introduced.

### Shape and material

- Use one documented radius scale: workspace shell 16px, inner item 10px,
  controls 8px.
- Reduce card-inside-panel-inside-page nesting.
- Prefer section bands, dividers, and structured rows for routine collections.
- Use tinted shadows sparingly; no generic black shadow stack.
- Add only restrained technical geometry: thin rules, active markers, or a
  single diagonal detail. No racing animation or decorative noise layer.

## 6. Information Architecture

Make group order explicit rather than relying on link insertion order.

Target order:

1. Pages
2. Editorial
3. Programs
4. Commerce
5. Library

Priority actions should appear above the full collection architecture without
inventing metrics:

- Edit site pages
- Manage events
- Publish news
- Manage Motorsport programs

These actions must deep-link to existing Content Manager views or existing
workspace anchors. No new API calls in initial phases.

Secondary collections remain available:

- Top Navigation
- Riders
- Standings & results
- Regulations
- Leadership
- Media galleries
- Merchandise
- Ticket CTAs
- Partners & sponsors

## 7. Phased Delivery

Each phase ends with build checks and authenticated browser review. No phase
should silently include later-phase scope.

### CMS-MSR-UI-0: Baseline and approval contract

Status: Complete

Done:

- Audited current source and relevant Motorsport design specifications.
- Logged in with supplied Motorsport Admin credentials for local browser UAT.
- Captured desktop and mobile baseline screenshots.
- Verified 13 permission checks return `200`.
- Verified no horizontal overflow at 1200px and 390px.
- Confirmed current post-login browser has no application errors.

Exit evidence:

- `motorsport-workspace-baseline-desktop.png`
- `motorsport-workspace-baseline-mobile.png`
- Source audit and logo inventory.

### CMS-MSR-UI-1: Logo and visual foundation

Status: Complete

Scope:

- Replace Motorsport workspace menu icon source with the requested
  `frontend-motorsport/public/brand/logo-sarga-motorsport-full.png` asset,
  published through CMS-owned static admin asset handling.
- Do not reference the frontend app path at runtime.
- Preserve 28 x 28 menu slot and `object-fit: contain`.
- Use descriptive accessible treatment only for Motorsport entry; other
  workspace entries must not announce Motorsport branding.
- Add scoped Motorsport workspace tokens and theme-aware styles.
- Add explicit group order.
- Add guaranteed focus-visible, hover, active, reduced-motion, and dark-mode
  contracts.
- Correct workspace heading hierarchy from H1 → H2 → H3.

Icon caveat:

- Requested file is approximately square and fills the menu slot better than
  current wide lockup, but its full wording remains small at 28px.
- Do not derive or crop a new logo mark without brand approval.
- Reassess menu legibility during browser review. If wording is unreadable, keep
  requested asset in the workspace masthead and request approval for a dedicated
  square menu mark as a later asset-only decision.

Out of scope:

- Redesigning all four workspace identities.
- Changing global Strapi semantic theme values.
- Loading unapproved remote fonts.

Acceptance:

- Motorsport icon visibly replaces current icon in left menu.
- No runtime dependency on `frontend-motorsport` URL/path.
- Other workspace labels and routes remain unchanged.
- Workspace uses Motorsport semantic tokens without changing Content Manager
  security or behavior.
- Keyboard focus is visible on every custom link/action.
- Build passes; RBAC tests remain 11/11.
- Authenticated browser review passes at 1200px, 390px, light mode, and dark
  mode with no horizontal overflow or application errors.

Verification evidence:

- CMS production build passed.
- Workspace RBAC tests passed: 11/11.
- Requested logo served from `/admin-assets/logo-sarga-motorsport-full.png`.
- Authenticated Motorsport browser UAT confirmed 13 cards and 13 successful
  permission checks.
- Group order confirmed as Pages, Editorial, Programs, Commerce, Library.
- Light-mode canvas resolved to Warm White and structural border to Draftline
  Blue.
- Dark-mode canvas resolved to Graphite and preserved all 13 cards.
- Electric Yellow focus outline resolved on custom action links.
- Desktop 1200px and mobile 390px had no horizontal overflow.
- Browser console reported zero errors after authentication.

Files changed:

- `cms/public/admin-assets/logo-sarga-motorsport-full.png`
- `cms/src/admin/app.tsx`
- `cms/src/admin/extensions/sarga-workspaces/WorkspacePage.tsx`

### CMS-MSR-UI-2: Workspace hierarchy and task surface

Status: Complete

Scope:

- Replace generic stacked notices and nested card grid with a compact branded
  masthead, priority task surface, explicit group bands, and lean collection
  rows/cards.
- Use Draftline Blue as structural anchor and Charcoal for inverse masthead;
  retain Warm White as primary canvas.
- Bring Pages, Editorial, Programs, and Events into first-task view.
- Keep all existing collection links and create permissions.
- Add no fake counts, recency, status, or analytics.
- Keep motion limited to interaction feedback and optional disclosure.

Implemented:

- Added four priority task links: Edit site pages, Manage events, Publish news,
  and Manage programs.
- Reused existing scoped Content Manager paths for every priority task.
- Kept all 13 authorized collection cards and existing create/manage actions.
- Rendered operational groups in explicit order: Pages, Editorial, Programs,
  Commerce, Library.
- Added compact task-surface hover, active, and focus states.
- Reduced collection-card vertical weight while preserving descriptions and
  action affordances.

Acceptance:

- Primary editor actions are discoverable without scanning all 13 cards.
- Reduced nested surface treatment is visually evident.
- All authorized links remain reachable.
- Unauthorized cards never become actionable.
- Desktop, mobile, keyboard, and 200% zoom pass review.

Verification evidence:

- CMS production build passed.
- Workspace RBAC tests passed: 11/11.
- Four task links rendered with `siteScope=motorsport` filters.
- 13 collection cards remained available after permission resolution.
- First priority task was visible within desktop viewport.
- Desktop 1200px and mobile 390px had no horizontal overflow.
- Keyboard focus outline resolved to Electric Yellow.
- Dark-mode task surface retained all four tasks and 13 cards.
- Browser console reported zero errors after authentication.

Files changed:

- `cms/src/admin/extensions/sarga-workspaces/WorkspacePage.tsx`
- `cms/src/admin/app.tsx`
- `docs/motorsport/revamp/13_cms_workspace_revamp_spec.md`
- `docs/PHASE_PROGRESS.md`

### CMS-MSR-UI-3: Guidance and editor assistance

Status: Complete

Scope:

- Collapse long Site Page guidance into progressive disclosure.
- Present Home vs About field guidance as concise required/optional/
  homepage-only matrix.
- Clarify shared Media Library ownership near relevant workflow, without
  claiming asset isolation.
- Preserve publishing guardrail and immutable scope explanation.
- Move nonessential media instructions away from first-fold task surface where
  possible.
- Convert new workspace copy to translation keys.

Implemented:

- Replaced long Site Page and media prose notices with semantic progressive
  disclosure panels.
- Added Home/About field matrix with Use and Leave empty columns.
- Preserved visible publishing guardrail and immutable scope warning.
- Clarified shared Media Library ownership without implying asset isolation.
- Kept guidance collapsed by default so priority tasks remain first-fold content.
- Used semantic `details`, `summary`, `table`, and list markup without DOM text
  matching or field hiding.

Acceptance:

- First viewport prioritizes editor tasks over prose.
- Home/About editor can identify fields without reading a paragraph dump.
- English and Indonesian-length labels do not break layout.
- No DOM text matching is added for critical behavior.

Verification evidence:

- CMS production build passed.
- Workspace RBAC tests passed: 11/11.
- Both guidance panels start collapsed.
- Site Page guide expanded to a two-row Home/About matrix.
- Media guide expanded to four ordered selection steps.
- 13 authorized cards remained available.
- Desktop 1200px and mobile 390px had no horizontal overflow.
- Priority task surface remained before guidance and collection groups.
- Dark mode preserved collapsed guidance and all collection cards.
- Browser console reported zero errors after authentication.

Files changed:

- `cms/src/admin/extensions/sarga-workspaces/WorkspacePage.tsx`
- `docs/motorsport/revamp/13_cms_workspace_revamp_spec.md`
- `docs/PHASE_PROGRESS.md`

### CMS-MSR-UI-4: Shell and upgrade hardening

Status: Complete

Scope:

- Reduce broad global heading and card selectors.
- Scope Motorsport styles to workspace root.
- Review `!important` and internal Strapi DOM selectors.
- Keep Media Library guidance observer isolated or replace with supported
  extension point where available.
- Validate Login, Home, Content Manager, Media Library, Settings, and workspace
  screens after style changes.

Implemented:

- Removed global `[data-strapi-card]` visual override so Strapi core cards keep
  design-system ownership.
- Removed global heading typography leakage; custom typography remains scoped to
  `.sarga-workspace-page`.
- Changed custom workspace menu links to relative admin paths, matching Strapi's
  supported menu-link contract.
- Replaced English text matching in media-picker detection with structural dialog
  hooks and upload-control detection.
- Batched media-picker scanning through `requestAnimationFrame` to avoid running
  a full body scan for every mutation.
- Replaced injected media guidance `innerHTML` with DOM-safe `textContent` nodes.
- Preserved existing Media Library guidance behavior and workspace interactions.

Acceptance:

- Motorsport polish does not leak into unrelated Strapi screens.
- No new console errors or layout regressions.
- Upgrade-sensitive selectors are documented or removed.

Verification evidence:

- CMS production build passed.
- Workspace RBAC tests passed: 11/11.
- Motorsport workspace loaded with 13 cards and four priority tasks.
- Home, Content Manager, Media Library, Settings, and Motorsport routes loaded
  without horizontal overflow.
- No workspace cards leaked into core Strapi screens.
- No global `[data-strapi-card]` rule remained in runtime styles.
- Motorsport workspace remained visually scoped and route-protected.
- Browser console had no application errors on final authenticated workspace
  route.

Known runtime notes:

- Existing Strapi `useRBAC` deprecation and React Router future-flag warnings
  remain upstream warnings.
- Multi-route smoke captured expected stale-session `401`/`403` requests while
  navigating core screens; final authenticated workspace route was clean.
- Dev server must restart to load rebuilt menu-link assets and remove previously
  emitted absolute-path warnings.

### CMS-MSR-UI-5: Evidence-gated editor extension

Status: Deferred

Only execute if CMS-MSR-UI-3 UAT proves guidance insufficient.

Possible scope:

- Supported Content Manager extension for page-kind grouping or disclosure.
- No CSS-only field hiding.
- No populated legacy field may become inaccessible.
- Super Admin retains complete field access.

Requires separate approval before implementation.

### CMS-MSR-UI-6: Optional data-enhanced dashboard

Status: Deferred

Only execute if editor workflow evidence justifies API-backed data cues such as
upcoming event, draft count, locale completeness, or ticket status. Requires
permission-aware loading/error states and separate approval.

## 8. Verification Matrix

Run after every implementation phase:

```bash
pnpm --dir cms build
node --test cms/src/access-control/sarga-workspaces.test.ts
```

Browser checks:

- Authenticate Motorsport Admin.
- Open `/admin/sarga-workspaces/motorsport`.
- Confirm requested icon and accessible menu label.
- Confirm 13 authorized collection surfaces.
- Confirm no unauthorized collection becomes visible/actionable.
- Confirm Content Manager links preserve Motorsport scope filters.
- Test light mode and dark mode.
- Test 1200px desktop, 768px tablet, 390px mobile, and 200% zoom.
- Test keyboard-only focus order and visible focus rings.
- Check horizontal overflow.
- Check browser console for application errors.
- Confirm other workspace routes remain protected.

Do not record or commit credentials, session tokens, screenshots containing
passwords, or authentication headers.

## 9. Files and Ownership

Expected implementation files, phase-dependent:

- `cms/src/admin/app.tsx`
- `cms/src/admin/extensions/sarga-workspaces/WorkspacePage.tsx`
- `cms/src/admin/extensions/sarga-workspaces/` future scoped style/token files
- `cms/public/admin-assets/` if static asset publication is selected
- `docs/PHASE_PROGRESS.md`

Do not modify frontend Motorsport source to serve CMS admin assets.

## 10. Approval Gates

Approval requested before implementation:

1. Approve CMS-MSR-UI-1 logo and visual foundation.
2. Review Phase 1 browser evidence before CMS-MSR-UI-2.
3. Approve CMS-MSR-UI-2 hierarchy redesign after Phase 1 review.
4. Approve CMS-MSR-UI-3 guidance changes after hierarchy review.
5. Treat CMS-MSR-UI-5 and CMS-MSR-UI-6 as separate future decisions.

No code implementation beyond baseline audit should begin until CMS-MSR-UI-1 is
approved.
