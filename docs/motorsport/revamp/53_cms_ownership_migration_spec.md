# MSR-CMS-OWNERSHIP-2 — Dedicated collection migration

The migration is an explicit command or flag, never an unconditional startup
action. It supports `--dry-run`, `--apply`, and `--verify` modes.

Select only records with `siteScope=motorsport` or an approved Motorsport Site
relation. Copy EN/ID locales, draft/published state, media IDs, components,
ordering, and relations. Store `legacySourceDocumentId`; reruns update the
mapping instead of creating duplicates.

Create mappings before dependent records. Event, News Article, Ticket CTA,
Partner, and Leadership relations resolve through the mapping table. Shared
Ecosystem Business, Media Gallery, Site, and Motorsport Program relations keep
their existing IDs. Never silently drop a relation.

The dry-run report includes source/target/skipped counts, locale and media
coverage, relation coverage, slug collisions, and invalid records. `--apply` is
blocked when collisions or required unresolved relations remain. Source records
are not deleted; the mapping/report is the rollback artifact.
