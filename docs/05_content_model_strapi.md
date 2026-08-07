# 05 — Strapi Content Model

## CMS choice

The agreed CMS is **Strapi**. Strapi is recommended because it supports headless content management, REST/GraphQL APIs, admin roles, media library, custom content types, and flexible deployment with PostgreSQL.

## Content type overview

### Single Types

1. Site Settings
2. Homepage
3. About Page
4. Ecosystem Landing Page
5. Ticket Hub Landing Page
6. Careers Page
7. Contact Page
8. SEO Defaults

### Collection Types

1. Ecosystem Business
2. News Article
3. Event
4. Timeline Item
5. Leadership Person
6. Report/Charter
7. Career Opening
8. Inquiry Submission
9. Newsletter Subscription
10. Navigation Link
11. Footer Link

## Single type: Site Settings

| Field            | Type                 | Notes                              |
| ---------------- | -------------------- | ---------------------------------- |
| siteName         | Text                 | Sarga.co                           |
| legalCompanyName | Text                 | PT Sarga Multi Ekosistem           |
| logo             | Media                | Header logo                        |
| footerLogo       | Media                | Footer logo                        |
| primaryEmail     | Email                | Contact destination                |
| phone            | Text                 | Optional                           |
| address          | Text/Rich Text       | Optional                           |
| socialLinks      | Component repeatable | Instagram, LinkedIn, YouTube, etc. |
| defaultOgImage   | Media                | Used by SEO fallback               |

## Single type: Homepage

| Field              | Type      | Notes                              |
| ------------------ | --------- | ---------------------------------- |
| heroEyebrow        | Text      | 360° SPORTS & ENTERTAINMENT LEADER |
| heroTitle          | Text      | Main headline                      |
| heroDescription    | Rich Text | Hero body                          |
| heroImage          | Media     | Desktop image                      |
| heroImageMobile    | Media     | Optional mobile image              |
| primaryCtaLabel    | Text      | Explore Ecosystem                  |
| primaryCtaUrl      | Text      | /ecosystem                         |
| secondaryCtaLabel  | Text      | Corporate Root                     |
| secondaryCtaUrl    | Text      | /about                             |
| aboutSummaryTitle  | Text      | About                              |
| aboutSummaryBody   | Rich Text | Corporate description              |
| featuredBusinesses | Relation  | Ecosystem Business                 |
| featuredArticles   | Relation  | News Article                       |
| featuredEvents     | Relation  | Event                              |
| seo                | Component | SEO                                |

## Collection type: Ecosystem Business

| Field            | Type        | Notes                                                                                    |
| ---------------- | ----------- | ---------------------------------------------------------------------------------------- |
| name             | Text        | Sarga Horse Sport                                                                        |
| slug             | UID         | sarga-horse-sport                                                                        |
| pillar           | Enumeration | sports, venue, media, technology, festival, other                                        |
| shortDescription | Text        | Card text                                                                                |
| overview         | Rich Text   | Detail page body                                                                         |
| heroImage        | Media       | Hero                                                                                     |
| cardImage        | Media       | Card                                                                                     |
| logo             | Media       | Optional                                                                                 |
| ctaLabel         | Text        | Find Out More                                                                            |
| ctaUrl           | Text        | Optional override                                                                        |
| businessStatus   | Enumeration | active, comingSoon, hidden (renamed from `status`: reserved attribute name in Strapi v5) |
| launchTarget     | Text/Date   | e.g., August 2026                                                                        |
| order            | Number      | Sorting                                                                                  |
| relatedArticles  | Relation    | News Article                                                                             |
| relatedEvents    | Relation    | Event                                                                                    |
| seo              | Component   | SEO                                                                                      |

## Collection type: News Article

| Field             | Type             | Notes                                              |
| ----------------- | ---------------- | -------------------------------------------------- |
| title             | Text             | Required                                           |
| slug              | UID              | Required                                           |
| excerpt           | Text             | Card summary                                       |
| body              | Rich Text/Blocks | Article content                                    |
| coverImage        | Media            | Card/detail hero                                   |
| category          | Enumeration      | news, publication, press-release, report, magazine |
| publishedDate     | Date             | Display date                                       |
| isHotTopic        | Boolean          | Badge                                              |
| author            | Text             | Optional                                           |
| relatedBusinesses | Relation         | Ecosystem Business                                 |
| seo               | Component        | SEO                                                |
| publishedAt       | DateTime         | Strapi publishing                                  |

## Collection type: Event

| Field                 | Type        | Notes                                                                                      |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| title                 | Text        | Required                                                                                   |
| slug                  | UID         | Required                                                                                   |
| description           | Rich Text   | Event detail                                                                               |
| eventDate             | DateTime    | Required if known                                                                          |
| endDate               | DateTime    | Optional                                                                                   |
| venue                 | Text        | Optional                                                                                   |
| coverImage            | Media       | Card/detail                                                                                |
| business              | Relation    | Ecosystem Business                                                                         |
| ticketCtaLabel        | Text        | Buy Ticket / Get Ticket                                                                    |
| ticketUrl             | Text        | Partner ticketing URL                                                                      |
| ticketIntegrationType | Enumeration | redirect, deepLink, embed                                                                  |
| embedCode             | Text        | Optional, sanitize carefully                                                               |
| embedUrl              | Text        | Optional HTTPS iframe URL; rendered only for allowlisted hosts                             |
| eventStatus           | Enumeration | upcoming, live, past, hidden (renamed from `status`: reserved attribute name in Strapi v5) |
| seo                   | Component   | SEO                                                                                        |

## Collection type: Inquiry Submission

| Field         | Type        | Notes                                                          |
| ------------- | ----------- | -------------------------------------------------------------- |
| name          | Text        | Required                                                       |
| email         | Email       | Required                                                       |
| phone         | Text        | Optional                                                       |
| company       | Text        | Optional                                                       |
| inquiryType   | Enumeration | partnership, sponsorship, media, event, venue, career, general |
| message       | Text        | Required                                                       |
| sourcePage    | Text        | URL                                                            |
| submittedAt   | DateTime    | Auto                                                           |
| status        | Enumeration | new, contacted, closed                                         |
| internalNotes | Text        | Admin only                                                     |

## Collection type: Newsletter Subscription

| Field        | Type        | Notes                |
| ------------ | ----------- | -------------------- |
| email        | Email       | Required             |
| sourcePage   | Text        | Optional             |
| consent      | Boolean     | Optional             |
| subscribedAt | DateTime    | Auto                 |
| status       | Enumeration | active, unsubscribed |

## Component: SEO

| Field           | Type    | Notes         |
| --------------- | ------- | ------------- |
| metaTitle       | Text    | 50–60 chars   |
| metaDescription | Text    | 140–160 chars |
| ogTitle         | Text    | Optional      |
| ogDescription   | Text    | Optional      |
| ogImage         | Media   | Optional      |
| canonicalUrl    | Text    | Optional      |
| noIndex         | Boolean | Default false |

## API requirements

Frontend should use Strapi API through typed service functions. Do not call Strapi directly from random components.

Recommended service structure:

```text
src/lib/strapi/
├── client.ts
├── homepage.ts
├── ecosystem.ts
├── news.ts
├── events.ts
├── forms.ts
└── types.ts
```

## Content governance

- All public content should use Strapi draft/publish workflow.
- Only approved admin roles can publish.
- Media assets must include alt text.
- Slugs must be reviewed before publishing.
- Broken external ticket links must be checked before go-live.
