# 03 — Sitemap and Information Architecture

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
| Careers            | `/careers`                    | Recruitment information                                  |
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
