# 06 — Testing and UAT

## Required validation matrix

Each implementation phase validates at least:

- 320 × 568 mobile
- 375 × 812 mobile
- 768 × 1024 tablet
- 1024 × 768 small landscape/laptop
- 1280 × 720 laptop
- 1440 × 900 desktop
- 1920 × 1080 wide desktop

## Visual acceptance

- Gateway retains the approved Sarga palette and identity.
- Homepage composition is recognisably aligned with the Website Sarga.co
  Preview without copying PDF screenshots as assets.
- Photography is consistently warm, bright, kinetic, and appropriate to the
  ecosystem context.
- Zalando display and Plus Jakarta Sans body roles are consistent.
- No heading, arrow, focus ring, or translated animation state is clipped.
- No single inner-page hero or black surface is repeated without editorial
  purpose.
- Navigation remains centred/readable and Ticket Hub remains last.

## Functional acceptance

- Every canonical route resolves and every nav/footer link is valid.
- Motorsport and Horse Sport cards deep-link to their configured sites.
- Sarga Venues, Media, and Tech render the full page only when enabled.
- Disabled pages render Coming Soon at the same canonical URL.
- Hidden/unpublished pages return `404`.
- Press Releases filters the shared News collection.
- Forms keep validation, error, success, consent, and spam guardrails.
- Ticket links use approved redirects only.

## CMS acceptance

- Gateway, Motorsport, and Horse Sport editors each see exactly one prefixed
  custom site workspace and only their permitted records.
- Managed site editors are not offered an editable `siteScope`; the assigned
  workspace scope is enforced on create, update, and clone.
- Direct custom-workspace URLs, Content Manager URLs, modified filters, and
  submitted scope values do not bypass role or record segregation.
- Super Admin is the only supported cross-site role and sees all workspaces.
- Shared Library remains absent from every dedicated site role.
- Page availability fields are understandable and validated.
- Seed is idempotent and does not overwrite editorially changed records.
- Local, staging, and production promotion preserves content and media.

## Accessibility and performance

- Keyboard navigation and visible focus states work across all controls.
- Tabs expose correct roles/states and work without pointer input.
- Colour contrast meets WCAG AA for normal text and controls.
- Reduced-motion users receive stable content.
- Media has dimensions, responsive sizing, useful alt text, and no layout shift.
- No horizontal overflow occurs at the validation widths.

## Engineering gates

- Gateway lint, type check, tests, and production build pass.
- CMS type check/build and focused API tests pass when schema work occurs.
- Docker Compose local deployment remains compatible.
- Browser console contains no new errors or image-layout warnings.
- `git diff --check` passes.

## Gateway bilingual/navigation UAT completed (GWR-CMS-6)

- Repeat the Gateway route matrix at unprefixed English and `/id` Indonesian
  URLs, including live, Coming Soon, hidden, missing, and external destinations.
- Verify language switching preserves equivalent paths and active navigation.
- Verify CMS menu enable/disable, order, label localization, CTA emphasis,
  configured-empty state, unsafe URL rejection, and outage fallback on desktop
  and mobile.
- Verify `<html lang>`, canonical, `hreflang`, Open Graph locale, structured
  data, sitemap alternates, and fallback `noindex`.
- Verify Gateway Admin can manage only Gateway localizations/navigation and
  cannot bypass another scope through direct URLs or submitted data.

The Gateway route, responsive header, metadata, fallback, form-response, and
CMS-menu cases above passed on 2026-08-11. Managed-role localization/navigation
boundaries were established in GWR-CMS-5. Repeat the branded public-route
matrix for Motorsport and Horse Sport in GWR-CMS-7.

## Three-site migration and launch UAT (GWR-CMS-8)

The isolated local rehearsal passed on 2026-08-11:

- exact source/target database, locale, Media Library, and uploads
  reconciliation;
- authenticated Gateway, Motorsport, Horse Sport, Shared Library, and Super
  Admin role scenarios;
- localized navigation and content/component create, clone, draft, publish,
  public-query, and cleanup scenarios;
- Gateway, Motorsport, and Horse Sport browser checks at 1280 × 720 and
  390 × 844, including locale retention across configured cross-site links;
- canonical/hreflang, fallback `noindex`, sitemap/robots, and overflow checks.

The staging rerun must use protected disposable staging users and the real
HTTPS domains. It must also reconcile public media URLs, capture the rollback
drill, and attach stakeholder translation/launch approval. The repository
evidence and commands are recorded in
`docs/strapi-admin-menu/16_gwr_cms_8_migration_uat_handover.md`.
