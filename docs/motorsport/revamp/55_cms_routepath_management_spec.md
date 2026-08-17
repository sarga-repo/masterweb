# MSR-CMS-OWNERSHIP-4 — Constrained routePath management

Add required, non-localized `routePath` to each Motorsport page Single Type as
a constrained string field. Strapi does not accept slash-prefixed URL values in
an enumeration, so lifecycle validation permits only `/`, `/about`, `/events`, `/news`, `/gallery`,
`/merchandise`, `/tickets`, `/contact`, `/partners`, and `/experience`.

Reject invalid values, duplicates, missing paths for published pages, and
trailing-slash mismatches. Keep the code-owned canonical route when CMS is
unavailable. Build a cached published route manifest consumed by navigation,
sitemap, Preview, and the Next.js resolver. On a published path change, retain
the previous path as an alias and permanently redirect it to the new path.
Preview resolves a draft path only for the signed edited document; arbitrary
external URLs are never allowed.
