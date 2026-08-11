# 09 — GWR-CMS-8 Migration, UAT, and Handover

Status: repository implementation and isolated local rehearsal completed
2026-08-11. Staging promotion and stakeholder sign-off are pending; evidence is
recorded in `16_gwr_cms_8_migration_uat_handover.md`.

## Goal

Promote the tested bilingual CMS and public contract safely and hand it to the
three editorial teams.

## Deliverables

- Rehearse and document exact local-to-staging content/media promotion.
- Run the approved i18n migration against staging backup data and reconcile
  documents, localizations, media, relations, roles, and navigation.
- Complete five-role authenticated UAT in `en` and `id`.
- Complete cross-route browser, responsive, accessibility, SEO/hreflang,
  sitemap, cache, Docker, and rollback validation for all three frontends.
- Add editor guidance for creating a localization, reviewing fallback state,
  toggling/reordering navigation, previewing both locales, and publishing.
- Update Ubuntu VM, Nginx, backup/restore, content promotion, monitoring, and
  rollback handover documents.
- Produce a bilingual content-completeness report and record business owners for
  remaining translations.

## Launch rules

- No automatic machine-generated translation is published.
- Indonesian pages with English fallback remain `noindex` until reviewed.
- Navigation configuration must exist and pass URL/overflow validation for all
  three sites before disabling repository fallback alerts.
- Production migration requires an encrypted backup, maintenance window,
  tested rollback, and human sign-off.

## Approval gate

Final stakeholder UAT and launch decision. Gateway GWR-6 resumes only after the
CMS continuation is complete or explicitly reprioritized by the user.
