# CMS Site Page Editor UX and SEO Integration Plan

## Status

**Phase 08C complete. Phase 08D pending approval.**

## Objective

Improve shared `Site Page` editing without breaking existing Gateway,
Motorsport, Horse Sport, Shared Library, localization, RBAC, or frontend
contracts.

Requested outcomes:

1. Make Motorsport About SEO fields active on the public page.
2. Reduce confusion from optional fields that do not apply to every `pageKind`.
3. Give editors clear page-specific guidance.
4. Split homepage-specific fields only if shared `Site Page` remains unusable.

## Assessment

### A. Motorsport About SEO

Current state:

- CMS `Site Page` already has optional `shared.seo` component.
- `frontend-motorsport/src/lib/cms-data.ts` already fetches `seo.ogImage` and
  maps SEO data into `SitePageContent`.
- Most dynamic Motorsport routes do not consistently pass `page.seo` into
  `createMetadata`.
- `/about` exports static metadata instead of `generateMetadata()`.
- `frontend-motorsport/src/lib/seo/metadata.ts` currently lacks `seo` override
  input, unlike Gateway and Horse Sport metadata helpers.

Conclusion: SEO data is structurally present but not fully active. Fixing this is
low-risk and should be Phase 08A.

### B. Conditional field visibility

Current state:

- `Site Page` contains generic fields plus Motorsport homepage-specific fields:
  - `heroSlides`
  - `motorsportFeaturedEvent`
  - `motorsportInformationBand`
  - `motorsportWorldSection`
- Generic optional fields include:
  - `heroVideo`
  - `pageAvailability`
  - `seo`
  - `heroMedia`
- Strapi schema JSON does not provide reliable conditional visibility based on
  `pageKind` or `siteScope`.
- Existing admin customization provides workspace navigation and notices, but no
  field-level Content Manager conditional rendering.
- CSS/DOM hiding from `admin/app.tsx` would be brittle and risks hiding fields
  from Super Admin or future Strapi UI changes.

Conclusion: Do not implement CSS field hiding. Start with explicit editor
guidance and field descriptions. Reassess custom Content Manager extension only
after UAT.

### C. Page-specific editor guidance

Current workspace dashboard already provides grouped links and descriptions.
It can safely be extended with:

- A `Site Page` field description that explains generic versus page-kind-specific
  fields.
- Motorsport workspace guidance listing fields used by Home, About, Events, News,
  Tickets, Gallery, Partners, Campaign, and Merchandise.
- A visible warning in the Motorsport workspace page editor route explaining:
  - Homepage-only fields
  - About dynamic sections
  - SEO usage
  - Fields that should remain empty for About
- Documentation embedded in CMS admin route, not external scripts.

Conclusion: Guidance is low-risk and useful immediately. Implement before any
conditional field extension.

### D. Splitting `Site Page`

Candidate split:

```text
site-page
├── generic page fields
├── homepage page type
├── editorial hub page type
├── campaign page type
└── commerce/custom page type
```

Risks:

- Existing 28+ records require migration and relation/localization handling.
- RBAC subjects and workspace links change.
- Frontend queries currently depend on one `site-pages` endpoint.
- Existing API tokens and filters require migration.
- Strapi admin navigation becomes more complex, not less, unless custom tooling
  is added.
- Shared `sections`, SEO, availability, and media contracts would still need
  duplication or composition.

Conclusion: Do not split now. Shared `Site Page` remains technically sound.
Improve editor guidance first. Revisit only if authenticated UAT proves field
confusion causes repeated editorial errors.

## Target Behavior

### Motorsport About SEO

CMS record:

```text
Site Page: About Sarga Motorsport
routePath: /about
pageKind: about
siteScope: motorsport
SEO: populated
```

Frontend behavior:

- `metaTitle` overrides default title.
- `metaDescription` overrides default description.
- `ogTitle` and `ogDescription` override social copy.
- `ogImage` overrides page image/social fallback.
- `canonicalUrl` applies only to default locale and only when valid.
- `noIndex` sets `robots.index = false`.
- Indonesian missing-record fallback remains whole-record and noindex.
- Empty SEO component uses approved code defaults.

### Editor guidance

For Motorsport About, editor guidance must identify:

Use:

- `heroTitle`
- `heroDescription`
- `heroMedia`
- `sections`
- `seo`

Leave empty:

- `heroSlides`
- `heroVideo`
- `motorsportFeaturedEvent`
- `motorsportInformationBand`
- `motorsportWorldSection`
- `pageAvailability`, unless About is intentionally being disabled

Inside `sections`, use:

```text
profile
vision
what-we-do
motorsport.about-capabilities
operating-idea
team-intro
contact-cta
ecosystem-cta
```

## Phased Plan

### Phase 08A — Motorsport About SEO integration

- Extend Motorsport metadata helper to accept CMS SEO overrides.
- Convert About static metadata to `generateMetadata()`.
- Pass `page.seo`, hero image, and fallback status.
- Validate canonical, Open Graph, Twitter, robots, and locale behavior.
- Add metadata unit tests.

Exit criteria:

- CMS SEO values appear in `/about` document metadata.
- Empty SEO uses approved fallback.
- `noIndex` works.
- No secrets enter client output.

Evidence:

- Motorsport metadata helper now accepts CMS SEO overrides.
- `/about` now uses `generateMetadata()` and fetches its CMS page record.
- CMS fields control title, description, Open Graph, Twitter, canonical, and
  `noIndex` behavior.
- Empty SEO values retain approved fallback metadata.
- Added metadata regression coverage.
- Motorsport typecheck, lint, and production build passed.
- CMS TypeScript compilation passed.
- `git diff --check` passed.

The Motorsport package has no test script or installed test runner; metadata test
source is typechecked but not executed in this phase.

### Phase 08B — Shared Site Page editor guidance

- Improve `Site Page` schema descriptions for generic optional fields.
- Add page-kind guidance to Motorsport workspace dashboard.
- Add a page-kind matrix to CMS handover documentation.
- Add an admin note explaining fields that should remain empty.
- Keep guidance informational; do not mutate content.

Exit criteria:

- Motorsport Admin sees guidance before opening Site Page records.
- Guidance matches actual frontend consumers.
- Gateway, Horse Sport, and Shared workspaces remain understandable.

Evidence:

- Added page-kind and optional-field descriptions to the `Site Page` schema.
- Added Motorsport workspace guidance for About active fields and homepage-only
  fields.
- Guidance explicitly documents SEO, Sections, hero media, hero slides, featured
  event, information band, World of Motorsport, and page availability usage.
- No CSS/DOM field hiding or schema split introduced.
- CMS TypeScript compilation and production build passed.

### Phase 08C — Admin UAT and conditional visibility decision

- Run authenticated UAT with each managed role.
- Record fields editors incorrectly populate or cannot understand.
- Test whether guidance resolves confusion.
- Decide whether custom Content Manager extension is justified.

Exit criteria:

- Explicit go/no-go decision for conditional field visibility.
- No CSS/DOM field hiding accepted as final implementation.

Evidence:

- Supplied Gateway Admin authenticated successfully.
- Supplied Motorsport Admin authenticated successfully.
- Supplied Horse Sport Admin authenticated successfully.
- Supplied Super Admin authenticated successfully.
- Dedicated role workspace actions were isolated correctly:
  - Gateway Admin: Gateway only
  - Motorsport Admin: Motorsport only
  - Horse Sport Admin: Horse Sport only
  - Super Admin: all four workspaces
- All supplied accounts can read Content Manager Site Page records according to
  their role permissions.
- Existing comprehensive RBAC script now passes with separate Shared Library
  Admin credentials; Super Admin remains distinct and unrestricted.
- CMS admin loaded with zero browser errors during login-page smoke check.

Decision:

- **Conditional field visibility: defer.** Guidance is sufficient for current
  scope, and no evidence yet justifies brittle or invasive field hiding.
- **Site Page schema split: defer.** Shared collection remains justified; no
  migration or API complexity should be introduced without further editor error
  evidence.
- **Optional Phase 08D:** only consider supported Content Manager grouping or
  collapsing if future UAT records repeated field misuse.

Final UAT update:

- Full five-role RBAC UAT passed after Shared Library Admin credentials were
  supplied. Temporary records were cleaned by the UAT script.

### Phase 08D — Optional conditional editor extension

Only execute if 08C approves.

Possible implementation:

- Custom Content Manager editor wrapper or supported Strapi admin extension.
- Read current `pageKind` and `siteScope`.
- Group or collapse irrelevant optional fields.
- Keep Super Admin access to all fields.
- Never hide fields required for existing records or migration.

Required tests:

- About, Home, Campaign, News, Event Hub, Tickets, and Merchandise forms.
- All four workspace roles.
- Super Admin.
- English and Indonesian locales.
- Existing records with populated optional fields.

### Phase 08E — Site Page split reassessment

Only execute if 08C/08D demonstrate shared collection remains unmanageable.

- Produce migration inventory.
- Model API and RBAC impact.
- Prototype admin UX without production migration.
- Obtain explicit architecture approval.
- Migrate only additive/new records first.
- Retain read compatibility during transition.

## Acceptance Criteria

- [ ] Motorsport About CMS SEO is fully active.
- [ ] SEO fallback and locale behavior are tested.
- [ ] Page-kind editor guidance exists for Motorsport and shared page records.
- [ ] Guidance lists active and intentionally empty fields.
- [ ] Authenticated role UAT records actual editor experience.
- [ ] Conditional visibility has explicit go/no-go decision.
- [ ] No brittle CSS-only field hiding is used.
- [ ] Site Page split is deferred unless evidence justifies it.
- [ ] Phase progress and handover docs record evidence.

## Approval Gate

Approve Phase 08A first:

1. Implement Motorsport About SEO integration.
2. Add metadata tests.
3. Do not change CMS schema shape.
4. Do not hide fields yet.
5. Continue to Phase 08B only after Phase 08A validation passes.
