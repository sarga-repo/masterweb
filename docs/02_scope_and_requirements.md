# 02 — Scope and Requirements

## In scope

### Corporate/group gateway

- Homepage hero
- About section/page
- 360° Ecosystem section
- Ecosystem business cards
- Child business landing pages
- News and publication listing
- Article detail page
- Career section/page
- Contact/get in touch page
- Ticket Hub page or CTA flow
- Newsletter form
- Footer sitemap
- SEO metadata and sitemap
- Strapi CMS for content management
- Deployment documentation
- Hypercare and maintenance planning

### CMS-enabled content

- Homepage content
- About content
- Timeline items
- Leadership/council placeholders
- Reports and charters
- Ecosystem businesses
- News/publication articles
- Events/ticketing CTAs
- Career items
- Contact details
- Footer links
- SEO fields

### Dynamic functionality

- Inquiry/contact form
- Newsletter subscription
- Event CTA links
- Ticketing redirect/deep link/embed placeholder
- CMS preview-ready content structure

## Out of scope for current phase

The current phase should not include:

- Internal payment processing
- User accounts
- Internal ticketing engine
- Complex custom backend
- Checkout, cart, order management
- Customer account dashboard
- In-house CRM unless later requested
- Advanced role-based application workflow
- Mobile app

## Functional requirements

### Navigation

Main navigation should include:

- About
- 360° Ecosystem
- News & Publication
- Careers
- Get in Touch
- Ticket Hub

### Homepage

The homepage must contain:

- Top navigation
- Strong hero section
- Main positioning: "The Leader in 360° Sport & Entertainment"
- CTA: Explore Ecosystem
- CTA: Corporate Root
- About summary
- 360° Ecosystem section
- News/publication preview
- Newsletter form
- Footer sitemap

### About

The About section/page must support:

- Sarga group description
- History timeline
- Leadership Council tab/section
- Reports & Charters tab/section
- Board of Director card
- Company Structure card

### 360° Ecosystem

The ecosystem section must support categories/pillars:

- Sports
- Venue
- Media
- Technology
- Optional: Fun/Entertainment, if confirmed by Sarga

Initial sports cards:

- Sarga Horse Sport
- Sarga Motorsport

Future cards:

- Sarga Festival
- Sarga Rising Star
- Sarga Media
- Sarga Venues
- Sarga Tech

### News & Publication

Must support:

- Article listing
- Featured/hot topic label
- Sorting by latest update
- Article cards with image, title, date, excerpt, and read article CTA
- Article detail page
- SEO metadata per article

### Ticket Hub

Must support:

- Event listing
- Event details
- CTA to partner ticketing
- Redirect/deep link as baseline
- Embed widget as optional future enhancement
- No internal payment processing

### Forms

Forms should be simple and reliable:

- Contact/inquiry form
- Newsletter form
- Optional career inquiry form

Form submissions may be stored in Strapi and/or sent to email/webhook.

## Non-functional requirements

### Creative and visual quality

- Page 7 of the preview PDF defines the approved brand foundation: colors, typography, graphic language, and hero photography style.
- Pages 1-5 are examples and must not constrain the production layout or component composition.
- The visual design must be original, coherent, premium, and internationally competitive.
- Each breakpoint should receive intentional art direction; responsive behavior must go beyond mechanically stacking desktop sections.
- Motion and advanced visual effects must be purposeful, accessible, performant, and respectful of reduced-motion preferences.
- Written requirements, CMS-managed content, navigation clarity, and conversion journeys take priority over decorative experimentation.

### Performance

- Fast initial load
- Optimized images
- Static generation where possible
- CDN delivery
- Target Lighthouse performance score: 85+ for desktop, 75+ for mobile after media optimization

### SEO

- Metadata per page
- Open Graph image support
- Structured sitemap.xml
- robots.txt
- Clean URL slugs
- Article SEO fields
- Canonical URLs

### Accessibility

- Semantic HTML
- Keyboard navigable menu
- Accessible forms
- Sufficient color contrast
- Alt text from CMS for images

### Maintainability

- TypeScript codebase
- Clear component structure
- Strapi content model documented
- Environment variables documented
- Handover docs included

### Security

- HTTPS only
- Secure admin URL for Strapi
- Role-based admin users in Strapi
- Environment variables not committed
- Input validation for forms
- Anti-spam protection for public forms
- CORS configured safely
- Regular dependency update process

## Confirmed design decision

- The preview PDF is visual and brand direction, not a pixel-perfect implementation requirement.
- Page 7 is the authoritative brand source within the preview PDF.
- The production website should use original creative layouts while preserving approved functionality, information architecture, and content hierarchy.

## Open questions

- Final brand color tokens and fonts
- Official logo files and image assets
- Partner ticketing platform name and supported integration method
- Newsletter destination: Strapi, Mailchimp, CRM, email, or Google Sheet
- Contact form recipient email
- Career flow: static content, email, or external recruitment link
- Languages: English only, Indonesian only, or bilingual
