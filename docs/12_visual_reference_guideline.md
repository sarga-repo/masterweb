# 12 - Brand and Creative Reference Guideline

> **Gateway revamp precedence (2026-08-10):** For current Sarga.co Gateway
> implementation, use `docs/gateway/revamp/` and the Website Sarga.co Preview /
> Brand Visual Preview sections of
> `reference/source-pdfs/look_and_feel_website_sarga_co.pdf`. The approved brief
> explicitly requires closer layout and brand-visual alignment while retaining
> the current theme. The general originality guidance below still applies, but
> statements treating all sample layouts as non-binding no longer override the
> Gateway revamp specification.

## Purpose

`reference/source-pdfs/sarga_website_preview.pdf` contains two different kinds of reference material that must not be conflated:

1. Page 7 defines the Sarga.co brand foundation.
2. Pages 1-5 show a good example of how that foundation can be applied to a website.

Page 7 is the authoritative visual source within the PDF. Pages 1-5 are inspiration, quality calibration, and proof of concept only. They are not page templates, wireframes, or pixel-perfect acceptance targets.

The production website must be an original, premium digital expression of Sarga at an international frontend standard. It should retain the approved product scope, information architecture, content meaning, CMS model, and user journeys while using creative judgment in layout, composition, interaction, motion, and responsive art direction.

## Binding brand foundation - page 7

The following signals should remain recognizably Sarga across the experience:

- Brand color system: deep navy/black, white and light neutrals, Sarga red and orange, with supporting pink and gold where appropriate.
- Display typography: Zalando Sans Expanded.
- Body and interface typography: Plus Jakarta Sans.
- Racing-inspired diagonal/checkered graphic language with progressive energy.
- Cinematic hero photography and media treatment that conveys speed, competition, atmosphere, scale, and live entertainment.
- Confident uppercase display typography and concise label/eyebrow treatments.
- Official Sarga logo usage and correct reverse/default variants.

Exact tokens and implementation guidance are maintained in `docs/07_design_system.md`.

## Non-binding implementation examples - pages 1-5

The preview pages can inform the expected level of confidence, energy, legibility, and brand presence. They may inspire ideas such as dark-to-light pacing, image-led storytelling, large typography, gateway navigation, and the combination of corporate and entertainment content.

They do not require the production website to copy:

- Header dimensions or navigation composition.
- Hero layout, headline wrapping, CTA placement, or background construction.
- About split-screen layout or tab arrangement.
- Ecosystem panel, tabs, or card composition.
- News grid, filter arrangement, or article-card design.
- Footer columns, newsletter layout, or graphic placement.
- Section order, spacing values, corner radii, or exact motif geometry.

Visual similarity to pages 1-5 is not an acceptance criterion. Brand coherence, originality, usability, quality, and performance are.

## Creative ambition

The visual experience should feel comparable in craft to leading international sports, entertainment, mobility, venue, and media platforms. The goal is not trend accumulation; it is a distinctive system that makes Sarga's ecosystem easy to understand and exciting to explore.

Preferred qualities:

- Editorial hierarchy with one clear focal point per viewport.
- Bold but controlled use of scale, negative space, contrast, and asymmetry.
- Cinematic full-bleed or layered media with intentional focal-point crops.
- Smooth section pacing between high-energy and quieter informational moments.
- Purposeful motion that supports orientation, storytelling, or brand energy.
- Refined hover, focus, loading, empty, and error states.
- Breakpoint-specific compositions rather than a desktop layout merely stacked on mobile.
- Reusable visual logic that can scale across future ecosystem brands and CMS content.

Avoid:

- Generic corporate templates or repetitive card grids.
- Literal reconstruction of the preview screenshots.
- Racing graphics applied as wallpaper to every section.
- Decorative effects that reduce readability, performance, or navigation clarity.
- Desktop-only visual ideas that collapse poorly on mobile.
- Rasterizing, embedding, tracing, or extracting the sample website screens for use in production.

## Page-level creative freedom

The page specifications define required content and functionality, not fixed visual arrangements. Implementers may reorder, combine, layer, pin, sequence, or progressively reveal content when the resulting journey remains clear and CMS-compatible.

### Homepage

Create a distinctive group-gateway experience with a high-impact opening, immediate ecosystem orientation, and strong pathways to corporate information, stories, events, and ticketing. The hero should follow the page-7 photography and graphic direction but use an original composition.

### About

Express governance, history, leadership, reports, and company structure with authority and clarity. A conventional split layout or tabs are optional; an editorial timeline, index, progressive disclosure, or other accessible pattern may be used.

### Ecosystem

Make the breadth and relationships of the Sarga portfolio easy to understand. The experience may use filters, spatial mapping, editorial panels, horizontal journeys, or immersive transitions, provided every business remains discoverable and accessible.

### News and Publications

Use an editorial system appropriate for media and publications. Featured stories, topic navigation, asymmetric grids, and varied card scales are encouraged when CMS content remains robust at different title and excerpt lengths.

### Ticket Hub, Careers, and Contact

Give utility-focused pages the same brand quality while keeping task completion direct. Visual spectacle must not obstruct ticket redirects, job discovery, inquiry forms, validation, or consent information.

### Footer and global navigation

Navigation should clearly communicate the group-gateway model and primary actions. Header and footer compositions may depart completely from the samples as long as they are accessible, responsive, recognizable, and consistent.

## Implementation guardrails

- Use responsive HTML, CSS, SVG, and optimized media; never embed the preview pages as website images.
- Use official logo assets from `assets/brand/logos/`.
- Use official or approved media when available. Placeholders or generated concepts must be clearly replaceable and must not be presented as approved final campaign assets.
- Maintain semantic HTML, keyboard access, visible focus, contrast, readable type, and reduced-motion support.
- Keep advanced effects progressive and performant. Essential content and actions must remain usable without animation.
- Preserve Strapi content contracts and test layouts with realistic short, long, missing, and multilingual-ready content.
- If creative treatment conflicts with a written functional requirement, accessibility, performance, or content integrity, prioritize the requirement and record the tradeoff.

## Creative review criteria

A design is ready for approval when:

- It is recognizably Sarga without depending on copied preview layouts.
- It uses the page-7 colors, typography, graphics, and image direction coherently.
- It presents an original visual idea with consistent execution across pages.
- Primary journeys and content hierarchy are immediately understandable.
- Desktop, tablet, and mobile each feel intentionally art-directed.
- Motion and interaction have accessible fallbacks and do not harm Core Web Vitals.
- The system remains maintainable, CMS-compatible, and expandable to future ecosystem units.

## Reference file paths

```text
reference/source-pdfs/sarga_website_preview.pdf
reference/source-pdfs/look_and_feel_website_sarga_co.pdf
reference/source-pdfs/sarga.co_sitemap.pdf
reference/source-pdfs/requirements.pdf
```
