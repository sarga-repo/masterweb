# CMS Editorial Completeness — Phase 01 Frozen Inventory

## Status

Frozen on 2026-08-12. Inventory records current route ownership and known
editorial gaps. It is a planning baseline, not a CMS data migration.

## Classification Rules

| Classification | Meaning | Implementation rule |
| --- | --- | --- |
| `CMS_MANAGED` | Value comes from Strapi record/component and is consumed by route | Preserve typed query and scope test |
| `STATIC_EDITORIAL` | Meaningful public copy/media is in frontend source | Move to scoped page/collection contract |
| `FALLBACK_ONLY` | Temporary outage/absent-record value | Keep until CMS migration verified; never treat as source of truth |
| `TECHNICAL` | UI, accessibility, routing, filtering, security, or data-derived value | Keep code-owned unless separately approved |
| `DEFERRED` | Requires route-specific model decision | Do not add generic fields prematurely |

## Route Inventory

### Gateway

| Route | Current primary source | Status | Main gap |
| --- | --- | --- | --- |
| `/` | `homepage` + collections | `STATIC_EDITORIAL` / `CMS_MANAGED` | Supporting sections and media fallback |
| `/about` | `homepage`, timeline, leadership | `STATIC_EDITORIAL` | Philosophy and corporate record sections |
| `/about/board-of-directors` | Leadership collection | `STATIC_EDITORIAL` | Hero/governance framing |
| `/about/company-structure` | Frontend source | `STATIC_EDITORIAL` | Full page copy |
| `/about/history` | `site-page` + timeline | `CMS_MANAGED` | Empty states only |
| `/about/annual-report` | `site-page` + reports | `CMS_MANAGED` / `FALLBACK_ONLY` | Empty-state wording |
| `/about/sustainability-report` | `site-page` + reports | `CMS_MANAGED` / `FALLBACK_ONLY` | Empty-state wording |
| `/ecosystem` | Ecosystem collection | `STATIC_EDITORIAL` | Hub intro and section framing |
| `/ecosystem/[slug]` | Business collection | `STATIC_EDITORIAL` | Capability/media/related framing |
| `/news` | `newsHub` + articles | `CMS_MANAGED` / `FALLBACK_ONLY` | Production publish pending |
| `/news/[slug]` | News Article | `CMS_MANAGED` / `STATIC_EDITORIAL` | Related/empty framing |
| `/news/press-releases` | News Article | `CMS_MANAGED` / `STATIC_EDITORIAL` | Archive framing |
| `/careers` | Vacancies + custom page | `CMS_MANAGED` / `STATIC_EDITORIAL` | Roster/footer copy |
| `/careers/jobs` | Vacancies | `STATIC_EDITORIAL` | Search intro/framing |
| `/careers/jobs/[slug]` | Vacancy | `CMS_MANAGED` | Technical/application labels |
| `/contact` | Custom page + form | `CMS_MANAGED` / `STATIC_EDITORIAL` | Form/closing copy |
| `/ticket-hub` | Custom page + events | `CMS_MANAGED` / `STATIC_EDITORIAL` | Listing/partner framing |
| `/ticket-hub/[slug]` | Event | `CMS_MANAGED` / `STATIC_EDITORIAL` | Ticket detail framing |

### Motorsport

| Route | Current primary source | Status | Main gap |
| --- | --- | --- | --- |
| `/` | Home `site-page` + collections | `CMS_MANAGED` / `STATIC_EDITORIAL` | Ticket/newsletter/support copy |
| `/about` | About `site-page` + Leadership | `CMS_MANAGED` / `STATIC_EDITORIAL` | Operating/team/media framing |
| `/events` | Event Hub `site-page` + programs/events | `CMS_MANAGED` / `FALLBACK_ONLY` | Production publish pending |
| `/events/[slug]` | Event collection | `CMS_MANAGED` / `STATIC_EDITORIAL` | Briefing/ticket/sponsor framing |
| IJTC routes | Program collections | `CMS_MANAGED` / `STATIC_EDITORIAL` | Subpage copy and CTA framing |
| `/campaign/[slug]` | Program collection | `CMS_MANAGED` / `STATIC_EDITORIAL` | Campaign narrative sections |
| `/news` | News Hub + articles | `CMS_MANAGED` / `FALLBACK_ONLY` | Production publish pending |
| `/news/[slug]` | News Article | `CMS_MANAGED` / `STATIC_EDITORIAL` | Detail framing |
| `/gallery` | Gallery + custom page | `CMS_MANAGED` / `FALLBACK_ONLY` | Production media/content review |
| `/partners` | Partners + custom page | `CMS_MANAGED` / `FALLBACK_ONLY` | Production publish pending |
| `/tickets` | Ticket CTAs + custom page | `CMS_MANAGED` / `FALLBACK_ONLY` | Production publish pending |
| `/contact` | Custom page + form | `CMS_MANAGED` / `STATIC_EDITORIAL` | Support/footer framing |
| `/merchandise` | Merchandise + page | `CMS_MANAGED` / `STATIC_EDITORIAL` | Showcase disclaimer/section copy |

### Horse Sport

| Route | Current primary source | Status | Main gap |
| --- | --- | --- | --- |
| `/` | Home page + events/news/gallery/business | `STATIC_EDITORIAL` | Most section copy/media |
| `/about` | Business collection | `STATIC_EDITORIAL` | Hero/story/capabilities/CTA |
| `/events` | Events collection | `STATIC_EDITORIAL` | Hero/empty-state copy/media |
| `/events/[slug]` | Event collection | `CMS_MANAGED` / `STATIC_EDITORIAL` | Detail section framing |
| `/news` | News Hub + articles | `CMS_MANAGED` / `FALLBACK_ONLY` | Production publish pending |
| `/news/[slug]` | News Article | `CMS_MANAGED` / `STATIC_EDITORIAL` | Detail framing |
| `/gallery` | Galleries | `STATIC_EDITORIAL` | Hero/empty state/media fallback |
| `/venues` | Frontend source | `STATIC_EDITORIAL` | Full page model missing |
| `/stable-life` | News reuse | `STATIC_EDITORIAL` | Hero/editorial hub copy/media |
| `/partners` | Partners | `STATIC_EDITORIAL` | Hero/proposition/CTA |
| `/contact` | Form | `STATIC_EDITORIAL` | Hero/form explanation |
| `/tickets` | Ticket CTAs | `STATIC_EDITORIAL` | Hero/ticket explanation/empty state |
| `/campaigns/[slug]` | Placeholder route | `DEFERRED` | Campaign page contract |

## Media Inventory Rule

Every media source found in route files must be one of:

1. CMS media field/relation with populated URL and alt text.
2. `FALLBACK_ONLY` local asset documented in phase migration notes.
3. `TECHNICAL` brand/system asset, such as fixed logo or icon.

Unclassified editorial media is a Phase 2+ migration defect.

## Section-Key Contract

Page section keys use lowercase kebab-case and remain unique within one page.
Existing keys remain stable:

```text
lead-story
archive-intro
event-control
programmes
calendar
inquiry-map
career-disciplines
upcoming
inquiry-control
inquiry-form
partner-control
partner-network
ticket-control
featured-ticket
gallery-intro
```

New keys require route-level documentation and no duplicate semantic key within
same page record.
