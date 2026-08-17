# MSR-CMS-OWNERSHIP-1 — Motorsport collection foundation

## Goal

Add dedicated Motorsport collection types without moving data or changing
frontend reads. This phase is additive and safe to roll back.

## Collections

Create `motorsport-event`, `motorsport-leadership-person`,
`motorsport-merchandise-item`, `motorsport-news-article`, `motorsport-partner`,
`motorsport-ticket-cta`, and `motorsport-top-navigation-item`. Start from the
current shared schemas, preserving localized fields, draft/publish, media, SEO,
and relation semantics.

Each schema is structurally Motorsport-owned and intentionally omits
editor-selected `siteScope`; workspace RBAC is therefore not dependent on a
scope filter that the new records do not have. Each adds private
`legacySourceDocumentId` metadata for idempotent migration.
Relations to `Site`, `Ecosystem Business`, `Media Gallery`, and `Motorsport
Program` remain shared. Relations between migrated records point to the new
dedicated UID.

## RBAC and verification

Add the seven UIDs only to Motorsport Admin and Super Admin permissions. Do not
add them to Gateway, Horse Sport, or Shared Library roles. Keep shared subjects
during transition. Strapi compile, access-control tests, and unchanged public
frontend builds are the phase gate. No migration flag is enabled by default.
