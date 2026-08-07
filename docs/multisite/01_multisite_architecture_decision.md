# Multisite Architecture Decision

## Decision

Use a **single repository, two frontend applications, and one shared Strapi CMS**.

```text
frontend-gateway/      Sarga.co group gateway
frontend-motorsport/   Dedicated Sarga Motorsport website
cms/                   Shared Strapi CMS
postgres               Shared CMS database
```

## Why this approach

The Sarga.co gateway and Sarga Motorsport website are related but visually different. The gateway acts as the group entry point, while Sarga Motorsport requires a dedicated premium motorsport experience. Keeping separate frontends avoids design-system conflict while preserving a single engineering workflow.

A shared CMS is recommended because news, events, campaigns, ticketing CTAs, and ecosystem metadata need to appear in both locations. A single CMS reduces duplicate content entry, prevents drift between sites, and gives the internal team one back office.

## Alternatives considered

### One frontend only

Rejected. Sarga Motorsport needs its own dedicated brand expression, page hierarchy, interaction style, and campaign landing pages.

### Two separate repositories

Not recommended for the current phase. It increases operational overhead, duplicates deployment and documentation, and makes shared CMS integration harder to maintain.

### Two separate CMS instances

Rejected for now. It increases content duplication and makes event/news/ticketing synchronization harder. Revisit only if Sarga Motorsport later requires separate editorial workflow, separate user permissions, separate infrastructure ownership, or different publishing compliance.

## Routing model

Recommended production routing options:

1. `sarga.co` for gateway and `motorsport.sarga.co` for Sarga Motorsport.
2. `sarga.co` for gateway and `sargamotorsport.com` if brand requires separate public domain.
3. `sarga.co/motorsport` only if the client wants a single domain path, but this is less ideal for an independent dedicated brand.

Preferred: `motorsport.sarga.co` because it keeps the group relationship clear while allowing a dedicated frontend deployment.

## Frontend responsibilities

### Gateway frontend

- Corporate/group positioning.
- Ecosystem overview.
- Cards linking to dedicated business sites.
- Shared news/event teasers.
- Gateway-level ticket hub.

### Motorsport frontend

- Motorsport brand story and experience.
- Event calendar and event detail pages.
- Ticketing journey for motorsport events.
- News, media, and campaign landing pages.
- Venue/track/event lifestyle storytelling.

## Shared backend responsibilities

- Global site settings.
- Navigation and footer menus per site.
- News articles with site visibility.
- Events with site visibility and ticket CTA relationships.
- Media assets.
- Inquiry forms and newsletter submissions.
- SEO metadata per page/content item.
