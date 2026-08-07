# 04 — Page Specifications

## Composition rule

Section lists in this document define required content and functionality, not a fixed visual template. Designers and implementers may reorder, combine, layer, or progressively reveal sections when doing so improves storytelling and usability. The resulting page must remain CMS-compatible, accessible, responsive, and faithful to the intended user journey. Page 7 of the preview PDF governs brand expression; pages 1-5 may inspire but should not be copied.

## 1. Homepage `/`

### Objective

Communicate Sarga.co as a 360° sports and entertainment leader and route users to ecosystem, corporate information, news, contact, and ticketing.

### Sections

1. Header/navigation
2. Hero
3. About preview
4. 360° Ecosystem
5. News & Publications preview
6. Ticket Hub CTA
7. Newsletter
8. Footer

### Hero content

- Eyebrow: `360° SPORTS & ENTERTAINMENT LEADER`
- Title: `THE LEADER IN 360° SPORT & ENTERTAINMENT`
- Body copy: Sarga.co operates as an integrated national powerhouse combining horse sports, motorsport, live entertainment, media rights, and ticketing platforms.
- CTA 1: Explore Ecosystem
- CTA 2: Corporate Root
- Background: cinematic horse + motorsport visual direction with original art direction using the page-7 graphic and color system

### Acceptance criteria

- Fully responsive
- Header works on desktop and mobile
- CTA links work
- Hero image is optimized
- Content is manageable from CMS where practical

## 2. About `/about`

### Objective

Explain Sarga Group as the holding/governance root overseeing tracks, entertainment production, and sustainable sports infrastructure.

### Sections

1. About intro
2. Board of Director card
3. Company Structure card
4. Tabs or segmented sections:
   - History Timeline
   - Leadership Council
   - Reports & Charters

### History Timeline content examples

- 2023 — Concept Formulation
- 2024 — Event Synergies
- 2025 — Venue Development

### Acceptance criteria

- Timeline items are CMS-managed
- Board/structure cards are CMS-managed
- Reports & Charters can link to PDF/assets from CMS
- Layout works on mobile

## 3. Ecosystem `/ecosystem`

### Objective

Present Sarga's commercial framework and child business/IP structure.

### Sections

1. Intro title: `360° Ecosystem`
2. Pillar tabs:
   - Sports
   - Venue
   - Media
   - Technology
3. Ecosystem business cards
4. CTA to child business pages

### Initial business cards

- Sarga Horse Sport
- Sarga Motorsport

### Future business cards

- Sarga Festival
- Sarga Rising Star
- Sarga Media
- Sarga Venues
- Sarga Tech

### Acceptance criteria

- Cards are CMS-managed
- Tabs filter business cards
- Each card links to a child business page
- New business items can be added without code changes

## 4. Child business page `/ecosystem/[slug]`

### Objective

Provide a reusable landing page template for each ecosystem unit.

### Sections

1. Hero
2. Overview
3. Key highlights
4. Event/campaign cards
5. Gallery/media
6. Related news
7. Ticket/contact CTA
8. Footer

### Initial pages

- `/ecosystem/sarga-horse-sport`
- `/ecosystem/sarga-motorsport`

### Acceptance criteria

- Slug-based dynamic route
- CMS-managed page content
- Related content can be attached from CMS
- Missing pages show 404

## 5. News listing `/news`

### Objective

List articles, publications, and media updates.

### Sections

1. Page title: News & Publications
2. Sort/filter controls
3. Article cards
4. Pagination or load more
5. Newsletter CTA

### Article card fields

- Image
- Hot topic badge
- Date
- Title
- Excerpt
- Read article CTA

### Acceptance criteria

- Articles are fetched from Strapi
- Sorting by latest update works
- Pagination/load more is implemented
- SEO metadata exists

## 6. News detail `/news/[slug]`

### Objective

Display full article/publication detail.

### Sections

1. Article hero
2. Date/category
3. Content body
4. Related articles
5. Share links
6. CTA/footer

### Acceptance criteria

- Slug-based dynamic route
- CMS rich text renders safely
- Open Graph metadata exists
- 404 on missing article

## 7. Careers `/careers`

### Objective

Provide careers information and allow Sarga to publish hiring/role content.

### Sections

1. Careers hero
2. Why join Sarga
3. Job listings or general call for talent
4. CTA to email/external recruitment link/form

### Acceptance criteria

- Career items are CMS-managed
- Can operate without active jobs
- CTA configurable in CMS

## 8. Contact `/contact`

### Objective

Collect inquiries for partnership, media, sponsorship, event, venue, and general business.

### Sections

1. Contact hero
2. Contact details
3. Inquiry form
4. Optional map/social links

### Form fields

- Name
- Email
- Phone
- Company
- Inquiry type
- Message
- Consent checkbox if required

### Acceptance criteria

- Validation works
- Submission is stored/sent
- Success and error states shown
- Anti-spam protection implemented

## 9. Ticket Hub `/ticket-hub`

### Objective

Show available events and send users to partner ticketing flow.

### Sections

1. Ticket Hub hero
2. Event cards
3. Event detail CTA
4. Partner ticketing redirect/deep link
5. Optional embed placeholder

### Acceptance criteria

- Event content is CMS-managed
- Ticket CTA is configurable per event
- No internal payment logic
- External links open safely
