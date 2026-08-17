# MSR-CMS-OWNERSHIP-3 — Motorsport frontend adapter cutover

For Motorsport routes, detail pages, navigation, ticket CTAs, news, gallery,
partners, leadership, and merchandise, read the dedicated collection first.
If no published dedicated record exists, read the legacy shared collection
filtered to Motorsport scope. Exact Draft Preview reads only the requested
document and never mixes draft with published fallback. Gateway and Horse Sport
continue using shared collections.

Add dedicated UIDs to seed adapters, API-token permissions, publish/unpublish
revalidation, and route invalidation. Seed scripts stay idempotent and do not
duplicate content unless ownership migration is explicitly enabled.

Exit only after browser and production-build checks pass for home, About,
Events, News, Gallery, Merchandise, Tickets, Contact, Partners, Experience,
detail routes, IJTC, navigation, Preview, EN/ID, and ticket redirects.
