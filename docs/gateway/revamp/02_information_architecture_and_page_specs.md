# 02 — Information Architecture and Page Specifications

## Target navigation

Use the reference order on desktop and mobile:

1. About
2. 360° Ecosystem
3. News & Publication
4. Careers
5. Get in Touch
6. Ticket Hub — final highlighted action

## Canonical route map

```text
/
├── /about
│   ├── /about/history
│   ├── /about/board-of-directors
│   ├── /about/company-structure
│   ├── /about/annual-report
│   └── /about/sustainability-report
├── /ecosystem
│   ├── /ecosystem/sarga-venues
│   ├── /ecosystem/sarga-media
│   └── /ecosystem/sarga-tech
├── /news
│   ├── /news/press-releases
│   └── /news/[slug]
├── /careers
│   └── /careers/jobs
│       └── /careers/jobs/[slug]
├── /contact
├── /ticket-hub
│   └── /ticket-hub/[slug]
├── /privacy-policy
└── /terms
```

Sarga Motorsport and Sarga Horse Sport appear in the ecosystem but resolve to
their configured dedicated-site URLs. They must not be rendered as duplicate
Gateway detail pages.

The sitemap shows Sarga News as a connected publication property. Until an
approved dedicated URL or final content contract exists, it should be modelled
as a filtered publication channel within `/news`, not invented as a fourth
frontend.

## Page templates

### Homepage

- Reference-aligned warm cinematic hero with one headline, short supporting
  copy, and at most two primary actions.
- About preview with functional History, Leadership, and Reports views.
- 360° Ecosystem area with Sports, Venue, Media, and Technology categories.
- Publication preview with clear article hierarchy.
- Ticket Hub and newsletter pathways before the footer.

Decorative metrics may appear only when they materially improve the message;
the current hero metrics are not part of the target hero contract.

### About hub

- Corporate introduction, vision, history preview, leadership preview, group
  structure, report entry points, and contact pathway.
- Use a distinct editorial composition rather than repeating the homepage.

### History

- CMS-managed chronological milestones.
- Optional related publication links.
- Timeline is accessible without hover and reflows cleanly on mobile.

### Board and company structure

- Board profiles use consistent portraits, role hierarchy, biography summary,
  and accessible detail states.
- Company Structure explains governance and ecosystem relationships without
  duplicating CMS content from business pages.

### Annual and sustainability reports

- CMS-managed report index with year, title, summary, cover media, file or
  approved external URL, and publication status.
- No fabricated report downloads. Missing files show an editorially managed
  availability message.

### Ecosystem hub

- Category switching for Sports, Venue, Media, and Technology.
- Sports cards deep-link to Motorsport and Horse Sport dedicated sites.
- Venues, Media, and Tech cards link to Gateway dedicated pages and expose
  Live or Coming Soon status clearly.

### Sarga Venues, Sarga Media, and Sarga Tech

- Canonical routes use the existing dynamic ecosystem pattern:
  `/ecosystem/[slug]`.
- When enabled, each page uses the shared editorial framework but has a
  dedicated hero, proposition, capabilities, highlights, proof/media, related
  publications, and CTA content from Strapi.
- When disabled, the same URL returns the branded Coming Soon template defined
  in the CMS contract.

### News and Press Releases

- `/news` is the publication hub.
- `/news/press-releases` is a CMS-filtered view, not a duplicated collection.
- Article detail continues to use `/news/[slug]`.

### Careers, Contact, and Ticket Hub

- Retain existing route ownership and form/ticket redirect guardrails.
- Recompose each page using the Gateway visual system rather than duplicating
  the homepage hero.
- Careers owns four CMS-backed disciplines, a searchable and paginated vacancy
  index, and one reusable vacancy detail template. Applications leave the site
  only through a validated HTTPS LinkedIn URL; no internal recruitment account
  or application workflow is introduced.
- Ticket Hub remains discovery and partner redirect only.

## Legacy and redirects

- Preserve all currently indexed routes.
- Introduce redirects only after route implementation and CMS migration are
  verified.
- Hidden or unpublished records return `404`.
- Coming Soon pages return `200`, use their canonical URL, and default to
  `noindex` until enabled.

## GWR-1 route foundation status

The History, Annual Report, Sustainability Report, and Press Releases routes
now exist with typed CMS adapters and reference-safe route shells. The three
internal ecosystem canonical routes now expose the CMS-controlled Coming Soon
state, while the two sport aliases redirect to their dedicated frontends.
These are information-architecture foundations; GWR-2 through GWR-6 retain
ownership of the final typography, composition, and full page content.

## Active Gateway locale and top-navigation extension (GWR-CMS-6)

- English retains every canonical route above without a prefix.
- Indonesian mirrors eligible routes below `/id` with the same first-release
  stable slug.
- The header list becomes CMS-managed per site and locale. Disabling a menu
  item changes discovery only; it does not change route availability, Coming
  Soon state, redirects, canonicals, or sitemap eligibility.
- The language switch is permanent shell navigation and cannot be disabled by
  editors.
- An unpublished Indonesian localization uses complete-record English fallback
  and remains `noindex`; it never produces a partially mixed-language page.
- This contract is active on Sarga.co only. The two dedicated sport frontends
  remain unchanged until GWR-CMS-7 is approved.
