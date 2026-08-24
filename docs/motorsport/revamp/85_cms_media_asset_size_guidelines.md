# Motorsport CMS media asset size guidelines

Use the following source dimensions when preparing new artwork. Strapi may
generate smaller responsive formats, but the original upload should meet the
recommended size and aspect ratio so the frontend `object-cover` crops remain
sharp and predictable.

| CMS field / use                                |                                     Recommended source | Guidance                                                                   |
| ---------------------------------------------- | -----------------------------------------------------: | -------------------------------------------------------------------------- |
| Homepage hero slide, desktop page hero         |                                   2400 × 1200 px (2:1) | Keep the focal subject near the selected anchor and leave copy-safe space. |
| Homepage hero slide, mobile image              |                                   1080 × 1350 px (4:5) | Use a dedicated crop when the desktop composition does not survive mobile. |
| Event hero / campaign banner                   |                                   2400 × 1200 px (2:1) | Keep the action inside the central crop-safe area.                         |
| News article cover / event card / section card |                                   1600 × 1000 px (8:5) | Keep the editorial subject central for card and detail crops.              |
| Editorial section media / gallery item         |                                   2000 × 1333 px (3:2) | Use consistent orientation within a gallery or repeatable card group.      |
| Ticket background, desktop                     |                   1920 × 900 px (approximately 2.13:1) | Preserve negative space where the CTA copy is rendered.                    |
| Ticket background, mobile                      |                                   1080 × 1350 px (4:5) | Upload when the desktop crop makes the copy or subject unclear.            |
| Rider / leadership portrait                    |                                   1000 × 1250 px (4:5) | Keep the face, helmet, and shoulders within the center safe area.          |
| Merchandise image                              |                                   1200 × 1200 px (1:1) | Center the product on a transparent or neutral background.                 |
| Partner, social, or footer icon                |    SVG preferred; otherwise 256–800 px transparent PNG | Include clear space and avoid baked-in backgrounds.                        |
| Site header/footer wordmark                    | SVG preferred; otherwise 2400 × 700 px transparent PNG | Upload the complete wordmark; do not crop the logo to its symbol.          |
| Open Graph image                               |                                 1200 × 630 px (1.91:1) | Keep headline and brand mark inside the social safe area.                  |
| Video poster                                   |          2400 × 1200 px desktop; 1080 × 1350 px mobile | Match the related video framing.                                           |

For all raster uploads, use high-quality JPG/WebP for photography and
transparent PNG/SVG for logos. Do not place important text at the extreme edge
of an image because responsive crops and the preview device selector can remove
that area. Use the media field descriptions in the CMS as the field-level
reminder; this document is the consolidated handoff reference for the design
team.

The hero-slider CTA supports either an internal path beginning with `/` or an
approved HTTPS external URL. External destinations open in a new tab. The
hero-slider button color remains intentionally unchanged until Sarga provides
the final color hex values.
