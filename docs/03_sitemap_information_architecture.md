# 03 — Sitemap and Information Architecture

> For the current Sarga.co Gateway revamp, the source of truth is
> `docs/gateway/revamp/02_information_architecture_and_page_specs.md`, based on
> `reference/source-pdfs/sarga.co_sitemap.pdf`. The material below remains
> useful background where it does not conflict with that package.

## Recommended URL structure

```text
/
├── /about
│   ├── /about/board-of-directors
│   ├── /about/company-structure
│   ├── #history-timeline
│   ├── #leadership-council
│   └── #reports-charters
├── /ecosystem
│   ├── /ecosystem/sarga-horse-sport
│   ├── /ecosystem/sarga-motorsport
│   ├── /ecosystem/sarga-media
│   ├── /ecosystem/sarga-festival
│   ├── /ecosystem/sarga-rising-star
│   ├── /ecosystem/sarga-venues
│   └── /ecosystem/sarga-tech
├── /news
│   └── /news/[slug]
├── /careers
│   └── /careers/jobs
│       └── /careers/jobs/[slug]
├── /contact
├── /ticket-hub
│   └── /ticket-hub/[event-slug]
├── /privacy-policy
└── /terms
```

## Homepage as single-page gateway

The homepage should also work as a one-page gateway with anchor links:

```text
/#hero
/#about
/#ecosystem
/#news
/#careers
/#contact
/#ticket-hub
```

## Navigation mapping

| Navigation item    | Target                        | Purpose                                                  |
| ------------------ | ----------------------------- | -------------------------------------------------------- |
| About              | `/about` or `/#about`         | Corporate root, history, leadership, reports             |
| Board of Directors | `/about/board-of-directors`   | Published board and executive leadership profiles        |
| Company Structure  | `/about/company-structure`    | Holding, governance, management, and portfolio hierarchy |
| 360° Ecosystem     | `/ecosystem` or `/#ecosystem` | Explore group business units/IPs                         |
| News & Publication | `/news` or `/#news`           | Articles, media, publications                            |
| Careers            | `/careers`                    | Discipline overview and live recruitment counts          |
| Job vacancies      | `/careers/jobs`               | Searchable and paginated CMS vacancy roster              |
| Get in Touch       | `/contact`                    | Inquiry and partnership lead                             |
| Ticket Hub         | `/ticket-hub`                 | Event discovery and partner ticketing CTA                |

## Footer structure

### Ecosystem Map

- Sarga Horse Sport
- Sarga Motorsport
- Sarga Festival
- Sarga Rising Star
- Venue & Track Restoration
- Sarga Media
- Sarga Tech

### Publications

- Sarga News Syndicate
- Official Press Releases
- Sarga Magazine
- Fiscal Balance Report 2025
- Equine Sustainability Charters

### Newsletter

- Email input
- Submit CTA
- Consent text if required

### Legal/footer bottom

- Copyright
- Legal company name
- Privacy Policy
- Terms
- Optional strategic alliance line

## Expansion principle

Every child business should be represented as an `Ecosystem Business` content item in Strapi. Pages should be generated dynamically from slug-based content, so Sarga can add future business pages without new code for each page.

## Active multisite locale-aware sitemap contract (GWR-CMS-6/7)

- Existing unprefixed routes remain English (`en`) and preserve current links.
- Indonesian (`id`) mirrors eligible public routes under `/id`.
- Localized slugs are deferred; the same stable slug is used below each locale
  root in the first release.
- Header visibility is not route availability. Disabling a CMS Top Navigation
  item removes desktop/mobile discovery but does not delete, redirect, noindex,
  or remove its page from the sitemap.
- A published Indonesian localization receives a canonical Indonesian URL and
  `hreflang`; an English fallback shown at an Indonesian URL remains `noindex`.
- English index entries publish `en`/`id` alternates. Indonesian dynamic URLs
  become their own sitemap entries only when Strapi returns a published
  Indonesian record; English fallbacks remain reachable but `noindex` and are
  intentionally excluded as Indonesian `<loc>` entries.
- Gateway, Motorsport, and Horse Sport publish site-owned English sitemap
  entries with `en`/`id` alternates. Indonesian fallback routes remain
  reachable but excluded as standalone `<loc>` entries until translation
  approval.
