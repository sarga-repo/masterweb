# Strapi Per-Site Workspace Segregation

This package specifies the approval-gated Gateway revamp sub-track that removes
manual site selection from normal CMS editorial work while retaining
`siteScope` as the internal ownership and RBAC boundary.

## Documents

- `plan.md` — accepted direction, phase status, and scope boundary.
- `01_architecture_spec.md` — target roles, navigation, ownership, and security
  model.
- `02_gwr_cms_1_audit_spec.md` — documentation/audit phase contract.
- `03_gwr_cms_2_implementation_spec.md` — CMS implementation contract.
- `04_gwr_cms_3_validation_handover_spec.md` — validation and editor handover
  contract.
- `audit.md` — current implementation inventory and delta analysis.
- `uat-results.md` — authenticated role, bypass, and regression evidence.
- `editor-handover.md` — editor, Super Admin, provisioning, and environment
  operating guide.
- `05_gwr_cms_4_i18n_navigation_assessment.md` — bilingual content and
  CMS-managed top-navigation feasibility, architecture, risks, and estimate.
- `06_gwr_cms_5_cms_i18n_navigation_spec.md` — CMS schema, migration rehearsal,
  navigation model, RBAC, and API phase.
- `07_gwr_cms_6_gateway_i18n_navigation_spec.md` — Gateway bilingual routing,
  shell, SEO, and dynamic navigation phase.
- `08_gwr_cms_7_dedicated_sites_i18n_navigation_spec.md` — Motorsport and Horse
  Sport rollout phase.
- `09_gwr_cms_8_i18n_migration_uat_handover_spec.md` — migration, complete UAT,
  deployment, and editor handover phase.
- `10_gwr_cms_5_migration_rehearsal.md` — backup, isolated restore, migration,
  data/media reconciliation, authenticated UAT, and local rollout evidence.
- `11_gwr_cms_mail_1_exchange_online_assessment.md` — Microsoft Exchange Online
  OAuth2 mail architecture, tenant prerequisites, delivery phases, risks, and
  effort estimate.
- `12_gwr_cms_mail_2_oauth_transport_spec.md` — implemented Exchange Online
  XOAUTH2 transport, secure environment contract, no-send verification,
  credential rotation, and rollback runbook.
- `13_gwr_cms_mail_3_transactional_notifications_spec.md` — durable inquiry
  notification state, per-site recipient routing, bilingual templates, bounded
  retry, and security controls.
- `14_gwr_cms_mail_4_staging_uat_handover.md` — controlled staging send,
  end-to-end UAT, monitoring, rotation, rollback, and production launch gates.
- `15_gwr_cms_mail_4_1_temporary_basic_auth_fallback.md` — explicitly gated,
  hard-expiring password-authentication fallback for the urgent Motorsport
  launch and the mandatory OAuth migration procedure.
- `16_gwr_cms_8_migration_uat_handover.md` — isolated restore/reconciliation,
  five-role UAT, three-site browser evidence, defects closed, and external
  staging gates.
- `17_gwr_cms_8_bilingual_content_completeness.md` — generated per-record
  Indonesian translation/publish backlog and business-owner sign-off table.
- `18_gwr_cms_9_multisite_hero_video_spec.md` — shared CMS hero-video contract,
  three-site implementation, editorial limits, accessibility, and UAT evidence.
- `19_gwr_cms_10_motorsport_home_sections_spec.md` — Motorsport Race Control
  and World of Motorsport component, relation, seed, RBAC, and runtime contract.
- `20_gwr_cms_11_motorsport_media_news_refinement.md` — existing Media Library
  selection guidance and UAT, least-privilege decision, News detail gradient
  refinement, and Homepage Latest News race-flag treatment.
- `21_gwr_cms_mail_5_motorsport_settings_ui.md` — protected Motorsport SMTP
  settings UI, encrypted secret storage, CMS-over-environment fallback, and
  verification runbook.

## Source precedence

1. Current approved user direction.
2. This specification package.
3. `docs/multisite/03_shared_cms_content_sync_strategy.md`.
4. `docs/motorsport/revamp/04_cms_architecture_admin_ux.md`.
5. Existing implementation where it does not conflict with the above.

GWR-CMS-1 through GWR-CMS-7 and GWR-CMS-MAIL-1 through GWR-CMS-MAIL-2 are
complete. GWR-CMS-MAIL-3 implementation is complete. GWR-CMS-MAIL-4 tooling and
handover are complete, while its credentialed staging evidence remains pending
Microsoft 365 credentials and mailbox-scoped authorization. Production mail
therefore remains disabled by default. GWR-CMS-MAIL-4.1 provides an approved
temporary Basic-auth fallback with a hard expiry; OAuth remains the target.
GWR-CMS-8 repository work and isolated rehearsal are complete; real staging
promotion and stakeholder sign-off remain pending. Gateway GWR-6 remains
paused until the user explicitly approves the next phase. GWR-CMS-9 repository
implementation is complete; approved video assets still need editorial upload
and staging/public-domain verification. GWR-CMS-10 repository implementation is
complete; staging promotion remains part of the existing external launch gate.
GWR-CMS-11 repository implementation is complete; the credentialed Media
Library request remains included in the existing staging RBAC gate.
GWR-CMS-MAIL-5 repository implementation is complete; production rollout still
requires the normal environment encryption-key, Exchange authorization, and
staging UAT gates.
