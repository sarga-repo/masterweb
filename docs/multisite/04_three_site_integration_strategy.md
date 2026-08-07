# 04 - Three-Site Integration Strategy

## Architecture decision

Keep a single repository and a single Strapi CMS.

Use three separated frontend apps:

```text
frontend-gateway/
frontend-motorsport/
frontend-horsesport/
cms/
```

This keeps code ownership and deployment clear while allowing content to be managed once.

## Frontend ownership

| Frontend | Site key | Local port | Production intent |
|---|---|---:|---|
| Gateway | `gateway` | 3000 | `sarga.co` |
| Motorsport | `motorsport` | 3001 | `motorsport.sarga.co` |
| Horse Sport | `horsesport` | 3002 | `horsesport.sarga.co` |

## Routing rules

### Gateway ecosystem cards

- Sarga Motorsport card → Motorsport dedicated site
- Sarga Horse Sport card → Horse Sport dedicated site
- Future businesses can either open gateway detail pages or dedicated sites depending on `dedicatedSiteKey`.

### News and events

News/events should include `canonicalSite` and `primaryBusiness`.

Routing behavior:

| Content | Canonical site | Gateway behavior |
|---|---|---|
| Gateway corporate news | gateway | Open on gateway |
| Motorsport article/event | motorsport | Show teaser, open Motorsport |
| Horse Sport article/event | horsesport | Show teaser, open Horse Sport |
| Shared ecosystem item | shared or configured canonical | Use canonical site or gateway fallback |

## URL builder utility

Create a shared utility per frontend or package-level utility:

```ts
type SiteKey = 'gateway' | 'motorsport' | 'horsesport';

function resolveContentUrl(content: {
  slug: string;
  contentType: 'news' | 'events' | 'tickets' | 'campaigns';
  canonicalSite?: SiteKey;
  primaryBusiness?: { slug: string; dedicatedSiteKey?: SiteKey };
}): string
```

Rules:

- If `canonicalSite` is set, use its base URL.
- If content has `primaryBusiness.dedicatedSiteKey`, use that site.
- Otherwise open on gateway.

## CMS filtering

Gateway home/news/ticket teasers:

```text
siteScope in ['gateway', 'shared']
or showOnGateway == true
```

Motorsport pages:

```text
siteScope in ['motorsport', 'shared']
and primaryBusiness.slug == 'sarga-motorsport'
```

Horse Sport pages:

```text
siteScope in ['horsesport', 'shared']
and primaryBusiness.slug == 'sarga-horse-sport'
```

## Ticketing

Use one Ticket CTA collection.

Gateway ticket hub can show all active ticket CTAs eligible for gateway.

Dedicated sites show only CTAs for their primary business or shared CTAs assigned to them.

## SEO and canonical URLs

- Each dedicated frontend owns canonical URLs for its business-specific content.
- Gateway should not duplicate full content pages for Motorsport/Horse Sport articles; use teasers.
- Add canonical metadata and Open Graph per site.
- Keep sitemap generation site-specific.

## Future scalability

When more dedicated sites are added, replace enum-based `siteScope` with a `Site` collection relation.
