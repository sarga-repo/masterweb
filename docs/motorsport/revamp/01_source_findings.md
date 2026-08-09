# 01 - Source Findings

## Files reviewed

- `reference/source-pdfs/look_and_feel_website_sarga_co.pdf`
- `reference/source-pdfs/sarga_motorsport_2.pdf`
- `reference/source-pdfs/sarga_motorsport_brand_playbook.pdf`
- `AGENTS.md`
- `README.md`
- `docs/motorsport/*`
- `prompts/motorsport/*`
- `checklists/motorsport/motorsport_uat_checklist.md`
- `frontend-motorsport/src/app/page.tsx`
- `frontend-motorsport/src/app/*`
- `frontend-motorsport/src/components/*`
- `cms/src/admin/app.tsx`
- `cms/src/seed.ts`
- `strapi/content-types.json`

## Look & Feel PDF takeaways

The Motorsport section of the Look & Feel deck shows three important layers:

1. A website preview with a compact dark header, warm daylight editorial hero,
   large centered racing headline, pill-style Ticket Hub CTA in the final nav
   position, blue information band, alternating light/dark content blocks,
   racing discipline tiles, gallery feed, and compact dark footer.
2. A Motorsport brand system using Owners Wide for display type and Noto Sans for body copy.
3. A Motorsport visual world that includes rally, formula/circuit racing, motorcycle racing, driver/cockpit closeups, grandstand crowd energy, podium/media moments, scenic road/circuit imagery, and high-motion racing photography.

The current site already uses many compatible tokens, but the revamp should move closer to the deck's composition: larger editorial modules, stronger image-led sections, sharper discipline taxonomy, and fewer generic marketing-card patterns.

## Sarga Motorsport 2 PDF takeaways

The sitemap PDF changes Motorsport from a broad brand site into a program and event-driven site.

Target top-level routes:

- Home
- About
- Event
- News
- Contact
- Gallery
- Merchandise
- Ticket

Home includes:

- Headline
- Description
- Upcoming Events
- News
- Gallery

About includes:

- Profile
- Vision
- What We Do
- Meet The Team
- Contact Us
- Part of Sarga.co

Event includes:

- Indonesia Junior Talent Cup
- FIA Rallycross World Cup Indonesia 2026

Indonesia Junior Talent Cup includes:

- Race Schedule
- Profile Riders
- Standing Points & Results
- About IJTC
- Regulation
- Become Riders
- Regulation download PDF

FIA Rallycross World Cup Indonesia 2026 includes a campaign landing page with:

- Banner
- "First Time, Wild Action, Closer Than Ever"
- FIA Rallycross World Cup Indonesia 2026
- 5-6 December 2026
- Jakarta International E-Prix Circuit
- Get Your Ticket Now
- Banner slider
- Rundown
- Do and donts

## Existing repo status

The repo already contains:

- `frontend-motorsport/` as a dedicated Next.js app on port 3001.
- Existing Motorsport routes: `/events`, `/events/[slug]`, `/tickets`, `/experience`, `/news`, `/news/[slug]`, `/gallery`, `/partners`, `/about`, `/contact`, `/campaign/[slug]`.
- Shared Strapi CMS in `cms/`.
- `siteScope` support for `gateway`, `motorsport`, `horsesport`, `shared`, and `hidden`.
- Cross-site teaser flags for Gateway, Motorsport, and Horse Sport.
- Existing Strapi admin branding in `cms/src/admin/app.tsx`.

## Main gap

The public frontend is already dedicated, but the information architecture is still the older broad ecosystem version. The CMS is shared and site-aware, but the editor experience still reads as one combined content system. The revamp should keep the good architecture and update the public IA, page templates, CMS workspaces, and editorial workflow.
