# 05 - Migration Plan

## Migration goals

- Move Motorsport public navigation to the new event-program sitemap.
- Preserve existing URLs where they have SEO value.
- Add new IJTC, FIA Rallycross, Merchandise, and CMS workspace structures.
- Keep one shared Strapi instance.
- Avoid data loss and avoid manual duplication.

## Route migration

| Existing route     | Target behavior                                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `/`                | Redesign homepage around headline, description, upcoming events, news, gallery.                                             |
| `/experience`      | Remove from primary nav. Either redirect to `/about#what-we-do` or keep as unlisted legacy page until stakeholder approval. |
| `/partners`        | Remove from primary nav. Move sponsor/partner content into About, Event detail, or footer.                                  |
| `/events`          | Keep route, visible label `Event`.                                                                                          |
| `/tickets`         | Keep route, visible label `Ticket`.                                                                                         |
| `/campaign/[slug]` | Keep for campaign-style pages; FIA Rallycross can use this if preferred.                                                    |
| `/merchandise`     | Add new route.                                                                                                              |

## Content migration

1. Audit existing Motorsport records in Strapi.
2. Assign explicit `siteScope` for any null records.
3. Create or map Motorsport site pages.
4. Create IJTC program record.
5. Create FIA Rallycross campaign/event record.
6. Add regulation PDF media record and link to IJTC regulation page.
7. Add rider and standings data once provided.
8. Add merchandise placeholder or partner/inquiry content.

### MSR-RD3 homepage hero migration

Implemented 2026-08-09. Existing single-hero fields remain in place for
rollback; fresh or empty Motorsport Home records receive the three responsive
seed slides, while non-empty editor-managed carousels are preserved.

1. Add the repeatable `motorsport.hero-slide` component to the
   Motorsport-scoped Home `site-page` without removing existing hero fields.
2. Add three approved warm hero records with desktop/mobile media, alt text,
   subject anchors, deterministic order, and at most one CTA each.
3. Update the frontend mapper to prefer active ordered slides and fall back to
   `heroTitle`, `heroDescription`, and `heroMedia` when no valid slide exists.
4. Publish the carousel only after keyboard, Pause/Play, reduced-motion,
   responsive crop, and image-performance checks pass.
5. Retain the single-hero fields for at least one release as rollback data.

## CMS migration

Recommended order:

1. Add admin workspace UX first, so editors have a clear structure.
2. Add `site-page` if page content is CMS-managed.
3. Add Motorsport program models.
4. Add merchandise model.
5. Seed demo records.
6. Update frontend data fetchers.
7. Remove or hide old CMS references in docs/prompts.

## Compatibility rules

- Keep `/events`, `/news`, `/gallery`, `/about`, `/contact`, and `/tickets`.
- Do not delete old content until the new pages are verified.
- Use redirects only after stakeholder approval.
- Maintain `siteScope` filtering during every migration step.
- Treat missing `siteScope` as a migration defect, not as valid production content.

## Rollback

Rollback should be possible in two layers:

- Code rollback: revert the revamp branch or redeploy the previous production version.
- Content rollback: unpublish newly created pages/programs/campaigns and restore previous navigation records.
- Carousel rollback: deactivate/unpublish all hero slides so the frontend
  returns to the retained single-hero fallback without destructive schema work.

Avoid destructive database migrations. Add fields and collections first, then retire old usage later.
