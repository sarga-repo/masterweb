# Motorsport CMS Preview Phase 3 Implementation

## Document status

- Phase: 3 - event, news, campaign, and Motorsport Program Preview
- Status: Implemented
- Date: 2026-08-15
- Scope: Canonical event routes, detail content, campaign fields, relations,
  media, CTAs, SEO, and locale propagation

## What changed

### Canonical campaign routing

- Motorsport Program Preview resolves to `/events/{programSlug}`.
- Rallycross Preview uses canonical
  `/events/fia-rallycross-world-cup-indonesia-2026`.
- `/campaign/{slug}` remains an alias that redirects to the canonical event
  route.
- Canonical event metadata now uses Rallycross campaign SEO instead of generic
  event placeholder metadata.

### Event Preview

Event detail reads now explicitly propagate locale and populate:

- Cover and hero media
- Event gallery relation
- Ticket CTA relation
- Sponsor relation and sponsor logos
- SEO and Open Graph image

Event detail Preview uses CMS sponsor relations instead of the published global
partner fallback. Hidden draft events resolve to not-found in Preview rather than
showing placeholder event content.

### News Preview

News detail reads now explicitly propagate locale and populate:

- Cover media
- Full article body
- SEO and Open Graph image

Article metadata uses CMS SEO fields. Related article lists preserve empty draft
results instead of substituting placeholder articles. Missing draft articles
resolve to not-found in Preview.

### Campaign and Program Preview

Rallycross campaign reads now preserve and render:

- Program title, slug, type, status, season, summary, headline, dates, and venue
- Hero media and alt text
- Banner slide title, description, image, alt text, order, and CTA label/URL
- Rundown day/date/venue/status/times/title/description/order
- Event rule type/title/description/order
- Related ticket CTA label/provider/type/URL/embed configuration
- Primary CTA fallback label/URL
- SEO title, description, Open Graph title/description/image, canonical URL, and
  no-index state

Draft campaign arrays remain empty when editors intentionally remove slides,
schedule entries, rules, or ticket CTAs. Published-mode fallback content remains
available when CMS content is unavailable.

Canonical internal SEO URLs are normalized to absolute site URLs. External SEO
URLs remain restricted to safe HTTP(S) destinations.

### Locale propagation

Explicit locale now flows through Event, News, Campaign Program, and canonical
campaign Site Page reads. Indonesian requests retain localized route paths and
use Strapi's existing English fallback only when Indonesian content is absent.

## Verification

- Motorsport typecheck passed.
- Motorsport ESLint passed.
- Motorsport production build passed.
- Motorsport Preview tests: 7/7 passed.
- `git diff --check` passed.
- Local draft Program API smoke check returned HTTP 200.
- Local draft Event API smoke check returned HTTP 200 with sponsor/SEO populate
  request.
- Local draft News API smoke check returned HTTP 200 with SEO populate request.
- Localized draft responses were checked for `locale=id`; local seed currently
  returned empty Indonesian collections, so client English fallback remains the
  expected behavior for those records.

## Known limitations

- Browser mutation testing from Strapi Content Manager remains pending.
- Local seed does not provide complete Indonesian translations for all Program,
  Event, and News records.
- Event gallery and some non-rendered event fields are populated for Preview
  readiness but are not displayed by current Event detail UI.
- Gateway and Horse Sport Preview remain out of scope.
