import fs from 'node:fs';
import path from 'node:path';

import type { Core } from '@strapi/strapi';

/**
 * Local development seed.
 *
 * Runs from the bootstrap lifecycle when SEED_DEMO_CONTENT=true. It is
 * idempotent: content is only created when the target type is still empty,
 * so repeated container restarts never duplicate records.
 *
 * Content mirrors the frontend mock fallback
 * (frontend/src/lib/mock-data.ts) so CMS-backed and fallback rendering stay
 * consistent. Placeholder media from data/seed-media (extracted from the
 * visual reference package) is uploaded and attached to records whose image
 * fields are still empty; official assets can replace them in the admin.
 */

/** Read permissions granted to the public role for frontend fetching. */
const PUBLIC_READ_ACTIONS = [
  'api::homepage.homepage.find',
  'api::ecosystem-business.ecosystem-business.find',
  'api::ecosystem-business.ecosystem-business.findOne',
  'api::news-article.news-article.find',
  'api::news-article.news-article.findOne',
  'api::event.event.find',
  'api::event.event.findOne',
];

const HOMEPAGE = {
  heroEyebrow: '360° Sports & Entertainment Leader',
  heroTitle: 'The Leader in 360° Sport & Entertainment',
  heroDescription:
    'Sarga.co operates as a highly integrated national powerhouse. We unify elite horse sports, high-performance motorsport tracks, live entertainment festivals, media rights, and modern ticketing platforms into a singular, highly efficient ecosystem.',
  primaryCtaLabel: 'Explore Ecosystem',
  primaryCtaUrl: '/ecosystem',
  secondaryCtaLabel: 'Corporate Root',
  secondaryCtaUrl: '/about',
  aboutSummaryTitle: 'About',
  aboutSummaryBody:
    'Sarga Group operates as the direct holding governance overseeing premier tracks, entertainment production, and sustainable sports infrastructure in Indonesia.',
};

const ECOSYSTEM_BUSINESSES = [
  {
    name: 'Sarga Horse Sport',
    slug: 'sarga-horse-sport',
    pillar: 'sports',
    shortDescription:
      'Organizer of premium national horse derbies, showcasing elite jockeys and managing strict veterinary compliance protocols.',
    overview:
      'Sarga Horse Sport formulates premium national race classifications, elite jockey programs, and strict veterinary compliance protocols across Indonesian horse sport.',
    ctaLabel: 'Find Out More',
    businessStatus: 'active',
    order: 1,
  },
  {
    name: 'Sarga Motorsport',
    slug: 'sarga-motorsport',
    pillar: 'sports',
    shortDescription:
      'Constructing high-stakes tarmac motorsport series and touring car cups that attract global racing associations.',
    overview:
      'Sarga Motorsport constructs high-stakes tarmac series and touring car cups, pairing circuit development with international racing partnerships.',
    ctaLabel: 'Find Out More',
    businessStatus: 'active',
    order: 2,
  },
  {
    name: 'Sarga Venues',
    slug: 'sarga-venues',
    pillar: 'venue',
    shortDescription:
      'Developing and restoring championship-grade tracks, stables, and spectator venues for world-class events.',
    ctaLabel: 'Coming Soon',
    businessStatus: 'comingSoon',
    order: 3,
  },
  {
    name: 'Sarga Media',
    slug: 'sarga-media',
    pillar: 'media',
    shortDescription:
      'Broadcast, editorial, and media-rights operations amplifying every Sarga property across channels.',
    ctaLabel: 'Coming Soon',
    businessStatus: 'comingSoon',
    order: 4,
  },
  {
    name: 'Sarga Tech',
    slug: 'sarga-tech',
    pillar: 'technology',
    shortDescription:
      'Ticketing platforms and live data technology powering seamless fan experiences across the ecosystem.',
    ctaLabel: 'Coming Soon',
    businessStatus: 'comingSoon',
    order: 5,
  },
];

const NEWS_ARTICLES = [
  {
    title: 'Sarga Cup Merdeka Series Achieves Spectator Benchmarks',
    slug: 'sarga-cup-merdeka-series',
    excerpt:
      'Over 200 thousand horse racing enthusiasts and digital spectators tuned in to our multi-angle broadcast experience.',
    body: 'Over 200 thousand horse racing enthusiasts and digital spectators tuned in to our multi-angle broadcast experience across the Sarga Cup Merdeka Series. The series set new national benchmarks for attendance, digital engagement, and broadcast reach.',
    category: 'news',
    publishedDate: '2025-07-24',
    isHotTopic: true,
  },
  {
    title: 'Sarga Group Signs MoU With Regional Tourism Portfolios for Turf Track',
    slug: 'sarga-group-mou-turf-track',
    excerpt:
      'PT Sarga Multi Ekosistem commits to multi-year investments designing high-performance racing venues and destinations.',
    body: 'PT Sarga Multi Ekosistem has signed a memorandum of understanding with regional tourism portfolios, committing to multi-year investments in high-performance racing venues and integrated sport-tourism destinations.',
    category: 'press-release',
    publishedDate: '2025-10-12',
    isHotTopic: false,
  },
  {
    title: 'Inside the Stable: Elite Jockey Lifestyles and Equine Biology',
    slug: 'inside-the-stable-elite-jockey',
    excerpt:
      'An editorial review covering veterinary nutrition formulas, physical track conditioning, and daily jockey routines.',
    body: 'An editorial review covering veterinary nutrition formulas, physical track conditioning, and the daily routines that shape elite jockey performance across the Sarga network.',
    category: 'magazine',
    publishedDate: '2025-07-24',
    isHotTopic: false,
  },
];

const EVENTS = [
  {
    title: 'Sarga Championship Weekend',
    slug: 'sample-event',
    description:
      'A flagship weekend connecting elite horse sport, motorsport showcases, live entertainment, and premium hospitality.',
    eventDate: '2026-09-19T09:00:00.000Z',
    endDate: '2026-09-20T21:00:00.000Z',
    venue: 'Sarga Integrated Sporting Grounds, Indonesia',
    ticketCtaLabel: 'Partner tickets coming soon',
    ticketIntegrationType: 'redirect',
    eventStatus: 'upcoming',
  },
];

/**
 * Placeholder media manifest: files in cms/data/seed-media, attached to the
 * record/field pairs below only while those fields are still empty.
 */
const SEED_MEDIA: Array<{
  file: string;
  alt: string;
  uid: string;
  /** Slug for collection types; undefined targets the single type document. */
  slug?: string;
  field: string;
}> = [
  {
    file: 'sarga-cinematic-hero-concept.jpg',
    alt: 'Three horses running alongside a red race car at a modern circuit',
    uid: 'api::homepage.homepage',
    field: 'heroImage',
  },
  {
    file: 'sarga-horse-sport-turf-aerial.jpg',
    alt: 'Aerial view of a jockey galloping across turf with a long shadow',
    uid: 'api::ecosystem-business.ecosystem-business',
    slug: 'sarga-horse-sport',
    field: 'cardImage',
  },
  {
    file: 'sarga-motorsport-concept.jpg',
    alt: 'Red touring race car accelerating past a circuit grandstand',
    uid: 'api::ecosystem-business.ecosystem-business',
    slug: 'sarga-motorsport',
    field: 'cardImage',
  },
  {
    file: 'news-merdeka-jockeys.jpg',
    alt: 'Two jockeys racing side by side past a blurred grandstand',
    uid: 'api::news-article.news-article',
    slug: 'sarga-cup-merdeka-series',
    field: 'coverImage',
  },
  {
    file: 'news-turf-track-aerial.jpg',
    alt: 'Aerial view of curved turf and dirt racing track lanes',
    uid: 'api::news-article.news-article',
    slug: 'sarga-group-mou-turf-track',
    field: 'coverImage',
  },
  {
    file: 'news-stable-interior.jpg',
    alt: 'Horses inside a modern stable atrium lit by a circular skylight',
    uid: 'api::news-article.news-article',
    slug: 'inside-the-stable-elite-jockey',
    field: 'coverImage',
  },
  {
    file: 'sarga-cinematic-hero-concept.jpg',
    alt: 'Three horses running alongside a red race car at a modern circuit',
    uid: 'api::event.event',
    slug: 'sample-event',
    field: 'coverImage',
  },
];

/** Upload a seed-media file to the media library unless already present. */
async function uploadIfMissing(
  strapi: Core.Strapi,
  filename: string,
  alt: string,
): Promise<{ id: number } | null> {
  const existing = await strapi.db
    .query('plugin::upload.file')
    .findOne({ where: { name: filename } });
  if (existing) return existing;

  const filePath = path.join(
    strapi.dirs.app.root,
    'data',
    'seed-media',
    filename,
  );
  if (!fs.existsSync(filePath)) {
    strapi.log.warn(`[seed] Media file missing, skipped: ${filePath}`);
    return null;
  }

  const stat = fs.statSync(filePath);
  // Provide both formidable v2 and v3 style keys for compatibility.
  const fileDescriptor = {
    filepath: filePath,
    path: filePath,
    originalFilename: filename,
    name: filename,
    mimetype: 'image/jpeg',
    type: 'image/jpeg',
    size: stat.size,
  };

  const uploadService = strapi.plugin('upload').service('upload') as {
    upload: (params: {
      data: Record<string, unknown>;
      files: Record<string, unknown>;
    }) => Promise<Array<{ id: number }>>;
  };

  const [uploaded] = await uploadService.upload({
    data: { fileInfo: { name: filename, alternativeText: alt } },
    files: fileDescriptor,
  });
  strapi.log.info(`[seed] Uploaded media: ${filename}`);
  return uploaded ?? null;
}

/** Attach placeholder media to records whose image fields are still empty. */
async function seedMedia(
  strapi: Core.Strapi,
  documents: (uid: string) => {
    findFirst: (params?: Record<string, unknown>) => Promise<unknown>;
    update: (params: Record<string, unknown>) => Promise<unknown>;
  },
) {
  for (const item of SEED_MEDIA) {
    const filters = item.slug ? { slug: { $eq: item.slug } } : undefined;
    const doc = (await documents(item.uid).findFirst({
      ...(filters ? { filters } : {}),
      populate: [item.field],
    })) as
      | ({ documentId: string } & Record<string, unknown>)
      | null;

    if (!doc) continue;
    if (doc[item.field]) continue; // already has media — never overwrite

    const file = await uploadIfMissing(strapi, item.file, item.alt);
    if (!file) continue;

    await documents(item.uid).update({
      documentId: doc.documentId,
      data: { [item.field]: file.id },
      status: 'published',
    });
    strapi.log.info(
      `[seed] Attached ${item.file} → ${item.uid}${item.slug ? `(${item.slug})` : ''}.${item.field}`,
    );
  }
}

/** Grant public read access for content endpoints (idempotent). */
async function grantPublicReadPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    strapi.log.warn('[seed] Public role not found; skipping permission grants.');
    return;
  }

  for (const action of PUBLIC_READ_ACTIONS) {
    const existing = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });

    if (!existing) {
      await strapi.db
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: publicRole.id } });
      strapi.log.info(`[seed] Granted public permission: ${action}`);
    }
  }
}

export default async function seedDemoContent(strapi: Core.Strapi) {
  if (process.env.SEED_DEMO_CONTENT !== 'true') return;

  strapi.log.info('[seed] SEED_DEMO_CONTENT=true — checking demo content…');

  // Loosely typed accessor: seed data is validated by Strapi at write time.
  const documents = strapi.documents as unknown as (uid: string) => {
    count: (params?: Record<string, unknown>) => Promise<number>;
    findFirst: (params?: Record<string, unknown>) => Promise<unknown>;
    create: (params: Record<string, unknown>) => Promise<unknown>;
    update: (params: Record<string, unknown>) => Promise<unknown>;
  };

  await grantPublicReadPermissions(strapi);

  // Homepage (single type)
  const existingHomepage = await documents('api::homepage.homepage').findFirst();
  if (!existingHomepage) {
    await documents('api::homepage.homepage').create({
      data: HOMEPAGE,
      status: 'published',
    });
    strapi.log.info('[seed] Created homepage content.');
  }

  // Ecosystem businesses
  const businessCount = await documents(
    'api::ecosystem-business.ecosystem-business',
  ).count();
  if (businessCount === 0) {
    for (const business of ECOSYSTEM_BUSINESSES) {
      await documents('api::ecosystem-business.ecosystem-business').create({
        data: business,
        status: 'published',
      });
    }
    strapi.log.info(
      `[seed] Created ${ECOSYSTEM_BUSINESSES.length} ecosystem businesses.`,
    );
  }

  // News articles
  const articleCount = await documents('api::news-article.news-article').count();
  if (articleCount === 0) {
    for (const article of NEWS_ARTICLES) {
      await documents('api::news-article.news-article').create({
        data: article,
        status: 'published',
      });
    }
    strapi.log.info(`[seed] Created ${NEWS_ARTICLES.length} news articles.`);
  }

  // Events
  const eventCount = await documents('api::event.event').count();
  if (eventCount === 0) {
    for (const event of EVENTS) {
      await documents('api::event.event').create({
        data: event,
        status: 'published',
      });
    }
    strapi.log.info(`[seed] Created ${EVENTS.length} events.`);
  }

  // Placeholder media (upload + attach where image fields are empty)
  await seedMedia(strapi, documents);

  strapi.log.info('[seed] Demo content check complete.');
}
