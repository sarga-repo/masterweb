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
 * (frontend-gateway/src/lib/mock-data.ts) so CMS-backed and fallback rendering stay
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
  // Multisite content types (Phase 2)
  'api::site.site.find',
  'api::site.site.findOne',
  'api::partner.partner.find',
  'api::partner.partner.findOne',
  'api::ticket-cta.ticket-cta.find',
  'api::ticket-cta.ticket-cta.findOne',
  'api::media-gallery.media-gallery.find',
  'api::media-gallery.media-gallery.findOne',
  // Corporate record (About page)
  'api::timeline-item.timeline-item.find',
  'api::timeline-item.timeline-item.findOne',
  'api::leadership-person.leadership-person.find',
  'api::leadership-person.leadership-person.findOne',
];

/** Multisite Site registry (Phase 2). */
const SITES = [
  {
    name: 'Sarga Gateway',
    slug: 'sarga-gateway',
    baseUrl: 'http://localhost:3000',
    description: 'Sarga.co group gateway - the corporate ecosystem entry point.',
    themeKey: 'gateway',
    isActive: true,
  },
  {
    name: 'Sarga Motorsport',
    slug: 'sarga-motorsport',
    baseUrl: 'http://localhost:3001',
    description: 'Dedicated Sarga Motorsport website.',
    themeKey: 'motorsport',
    isActive: true,
  },
  {
    name: 'Sarga Horse Sport',
    slug: 'sarga-horse-sport',
    baseUrl: 'http://localhost:3002',
    description: 'Dedicated Sarga Horse Sport website.',
    themeKey: 'horsesport',
    isActive: true,
  },
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
    siteScope: 'shared',
    dedicatedSiteKey: 'horsesport',
    dedicatedSiteUrl: 'http://localhost:3002',
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
    siteScope: 'shared',
    dedicatedSiteKey: 'motorsport',
    dedicatedSiteUrl: 'http://localhost:3001',
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
    siteScope: 'gateway',
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
    siteScope: 'gateway',
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
    siteScope: 'gateway',
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
    siteScope: 'gateway',
    showOnGateway: true,
    showOnMotorsport: false,
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
    siteScope: 'gateway',
    showOnGateway: true,
    showOnMotorsport: false,
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
    siteScope: 'gateway',
    showOnGateway: true,
    showOnMotorsport: false,
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
    // Shared: eligible for both frontends; gateway shows it as a teaser.
    siteScope: 'shared',
    showOnGateway: true,
    showOnMotorsport: true,
  },
];

const TIMELINE_ITEMS = [
  {
    year: '2023',
    label: 'Concept Formulation',
    title: 'Groundwork of PT Sarga Multi Ekosistem',
    description:
      'Sarga was conceptualized to solve fragmented infrastructure across equine and motorsport categories through a centralized holding portfolio.',
    order: 1,
  },
  {
    year: '2024',
    label: 'Event Synergies',
    title: 'First Major Festivals & Digital Broadcasts',
    description:
      'Initial motorsport trials and equestrian derbies were paired with multi-platform digital broadcasting rights, serving more than half a million viewers.',
    order: 2,
  },
  {
    year: '2025',
    label: 'Venue Development',
    title: 'An Integrated Venue Network',
    description:
      'Collaborative development brought together modern tracks, lifestyle destinations, and high-performance sports infrastructure.',
    order: 3,
  },
];

const LEADERSHIP_PEOPLE = [
  {
    name: 'Farry Ongko Widjaja',
    role: 'President Director',
    group: 'board',
    order: 1,
  },
  {
    name: 'Diana Airin',
    role: 'Chief Operating Officer',
    group: 'executive',
    order: 2,
  },
  {
    name: 'Nugdha Achadie',
    role: 'Chief Financial Officer',
    group: 'executive',
    order: 3,
  },
  {
    name: 'Zaki Maulani',
    role: 'Head of Partnerships',
    group: 'executive',
    order: 4,
  },
  {
    name: 'Aseanto Oudang',
    role: 'Head of Technology',
    group: 'executive',
    order: 5,
  },
  {
    name: 'Samsul Purba',
    role: 'Head of Operations',
    group: 'executive',
    order: 6,
  },
];

/**
 * Motorsport demo set (Phase 2). Demonstrates site-aware querying:
 * motorsport-scoped content that is also flagged for a gateway teaser.
 */
const MOTORSPORT_PARTNERS = [
  {
    name: 'Apex Fuels',
    slug: 'apex-fuels',
    websiteUrl: 'https://example.com',
    partnerType: 'sponsor',
    siteScope: 'motorsport',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: 'Velocity Tyres',
    slug: 'velocity-tyres',
    websiteUrl: 'https://example.com',
    partnerType: 'technical',
    siteScope: 'motorsport',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: 'Gridline Broadcasting',
    slug: 'gridline-broadcasting',
    websiteUrl: 'https://example.com',
    partnerType: 'media',
    siteScope: 'motorsport',
    sortOrder: 3,
    isActive: true,
  },
];

const MOTORSPORT_EVENTS = [
  {
    title: 'Sarga Grand Prix - Night Race',
    slug: 'sarga-grand-prix-night-race',
    description:
      'The headline round of the Sarga Touring Cup under floodlights: qualifying heat, support races, and a full night-race spectacle.',
    eventDate: '2026-11-14T12:00:00.000Z',
    endDate: '2026-11-14T22:00:00.000Z',
    venue: 'Sarga International Circuit',
    circuitName: 'Sarga International Circuit',
    venueAddress: 'Sentul, West Java, Indonesia',
    racingCategory: 'Touring Car',
    seriesName: 'Sarga Touring Cup',
    broadcastUrl: 'https://example.com/live',
    eventStatus: 'ticketsOpen',
    ticketCtaLabel: 'Buy Tickets',
    ticketIntegrationType: 'redirect',
    siteScope: 'motorsport',
    showOnGateway: true,
    showOnMotorsport: true,
  },
  {
    title: 'Superbike Night Sessions',
    slug: 'superbike-night-sessions',
    description:
      'High-speed superbike action under the floodlights at Mandalika. Three days of qualifying, support races, and the main event.',
    eventDate: '2026-10-04T10:00:00.000Z',
    endDate: '2026-10-06T22:00:00.000Z',
    venue: 'Mandalika International Street Circuit',
    circuitName: 'Mandalika International Street Circuit',
    venueAddress: 'Lombok, West Nusa Tenggara, Indonesia',
    racingCategory: 'Superbike',
    seriesName: 'Sarga Motorcycle Series',
    broadcastUrl: 'https://example.com/live',
    eventStatus: 'announced',
    ticketCtaLabel: 'Register Interest',
    ticketIntegrationType: 'redirect',
    siteScope: 'motorsport',
    showOnGateway: false,
    showOnMotorsport: true,
  },
  {
    title: 'GT Endurance Challenge',
    slug: 'gt-endurance-challenge',
    description:
      'A 12-hour endurance race pairing professional GT3 machinery with amateur drivers. A test of machine and human resilience.',
    eventDate: '2026-11-22T06:00:00.000Z',
    endDate: '2026-11-22T18:00:00.000Z',
    venue: 'Sentul International Circuit',
    circuitName: 'Sentul International Circuit',
    venueAddress: 'Sentul, West Java, Indonesia',
    racingCategory: 'GT',
    seriesName: 'Sarga Motorsport Series',
    eventStatus: 'announced',
    ticketCtaLabel: 'Coming Soon',
    ticketIntegrationType: 'redirect',
    siteScope: 'motorsport',
    showOnGateway: false,
    showOnMotorsport: true,
  },
  {
    title: 'Moto Festival Weekend',
    slug: 'moto-festival-weekend',
    description:
      'A full weekend of motorcycle racing culture - Moto2 support races, stunt shows, paddock access, and live music stages.',
    eventDate: '2026-12-13T08:00:00.000Z',
    endDate: '2026-12-14T22:00:00.000Z',
    venue: 'Mandalika International Street Circuit',
    circuitName: 'Mandalika International Street Circuit',
    venueAddress: 'Lombok, West Nusa Tenggara, Indonesia',
    racingCategory: 'Moto2',
    seriesName: 'Sarga Motorcycle Series',
    eventStatus: 'ticketsOpen',
    ticketCtaLabel: 'Buy Tickets',
    ticketIntegrationType: 'redirect',
    siteScope: 'motorsport',
    showOnGateway: true,
    showOnMotorsport: true,
  },
];

const MOTORSPORT_TICKET_CTAS = [
  {
    title: 'Sarga Grand Prix - Night Race Tickets',
    label: 'Buy Tickets',
    provider: 'Partner Ticketing',
    ctaType: 'redirect',
    url: 'https://example.com/tickets/sarga-grand-prix',
    isActive: true,
    siteScope: 'motorsport',
  },
  {
    title: 'Moto Festival Weekend Tickets',
    label: 'Get Passes',
    provider: 'Partner Ticketing',
    ctaType: 'redirect',
    url: 'https://example.com/tickets/moto-festival',
    isActive: true,
    siteScope: 'motorsport',
  },
];

const MOTORSPORT_NEWS = [
  {
    title: 'Sarga Motorsport Unveils Night Race Series',
    slug: 'sarga-motorsport-night-race-series',
    excerpt:
      'A new floodlit touring car series brings cinematic night racing to the Sarga International Circuit.',
    body: 'Sarga Motorsport has unveiled a floodlit night race series, pairing professional touring car competition with a full lifestyle event program at the Sarga International Circuit.',
    category: 'announcement',
    publishedDate: '2026-08-01',
    isHotTopic: true,
    siteScope: 'motorsport',
    showOnGateway: true,
    showOnMotorsport: true,
    featuredOnMotorsport: true,
  },
  {
    title: 'The Line Between Control and Chaos',
    slug: 'the-line-between-control-and-chaos',
    excerpt:
      "Inside the cockpit of Sarga's opening race weekend - a masterclass in pressure, precision, and the fine art of going fast.",
    body: "Inside the cockpit of Sarga's opening race weekend. A masterclass in pressure, precision, and the fine art of going fast - told through the voices of the drivers who lived it.",
    category: 'race-report',
    publishedDate: '2026-07-02',
    isHotTopic: false,
    siteScope: 'motorsport',
    showOnGateway: false,
    showOnMotorsport: true,
  },
  {
    title: 'Riders Rewrite the Racing Line',
    slug: 'riders-rewrite-the-racing-line',
    excerpt:
      "How Indonesia's fastest riders are reshaping the sport - one apex at a time.",
    body: "How Indonesia's fastest riders are reshaping the sport - one apex at a time. From junior categories to the international stage, a new generation is redefining what it means to race.",
    category: 'magazine',
    publishedDate: '2026-06-28',
    isHotTopic: false,
    siteScope: 'motorsport',
    showOnGateway: false,
    showOnMotorsport: true,
  },
  {
    title: 'Building the 360° Racing Ecosystem',
    slug: 'building-the-360-racing-ecosystem',
    excerpt:
      'From track to grandstand to livestream - how Sarga is engineering an entire motorsport experience.',
    body: 'From track to grandstand to livestream - how Sarga is engineering an entire motorsport experience. Infrastructure, broadcast, hospitality, and fan engagement, all under one roof.',
    category: 'magazine',
    publishedDate: '2026-06-15',
    isHotTopic: false,
    siteScope: 'motorsport',
    showOnGateway: false,
    showOnMotorsport: true,
  },
];

/** Gallery entries for the motorsport gallery page. */
const MOTORSPORT_GALLERIES = [
  {
    title: 'Galerry',
    slug: 'media-gallery',
    description: 'Trackside photography from Sarga Motorsport events.',
    siteScope: 'motorsport',
  },
];

/**
 * Horse Sport demo set (Horse Sport Phase 2). Mirrors the motorsport demo:
 * horsesport-scoped content, one shared item flagged for a gateway teaser, all
 * linked to the Sarga Horse Sport business. Demonstrates three-site querying.
 */
const HORSESPORT_PARTNERS = [
  {
    name: 'Meridian Stables',
    slug: 'meridian-stables',
    websiteUrl: 'https://example.com',
    partnerType: 'sponsor',
    siteScope: 'horsesport',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: 'Turfline Grounds',
    slug: 'turfline-grounds',
    websiteUrl: 'https://example.com',
    partnerType: 'technical',
    siteScope: 'horsesport',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: 'Derby Day Hospitality',
    slug: 'derby-day-hospitality',
    websiteUrl: 'https://example.com',
    partnerType: 'community',
    siteScope: 'horsesport',
    sortOrder: 3,
    isActive: true,
  },
];

const HORSESPORT_EVENTS = [
  {
    title: 'Sarga National Derby - Merdeka Cup',
    slug: 'sarga-national-derby-merdeka-cup',
    description:
      'The flagship national derby under golden-hour turf conditions: elite jockeys, championship classification, and full race-day hospitality.',
    eventDate: '2026-08-17T08:00:00.000Z',
    endDate: '2026-08-17T18:00:00.000Z',
    venue: 'Sarga Turf Park',
    venueAddress: 'Bogor, West Java, Indonesia',
    eventStatus: 'ticketsOpen',
    eventDiscipline: 'derby',
    raceClass: 'Group 1 - National Championship',
    trackType: 'turf',
    hospitalityInfo:
      'Grandstand lounge, paddock club, and family zone with trackside dining.',
    stableAccessInfo:
      'Guided pre-race stable tours available for hospitality ticket holders.',
    ticketCtaLabel: 'Buy Tickets',
    ticketIntegrationType: 'redirect',
    siteScope: 'horsesport',
    showOnGateway: true,
    showOnMotorsport: false,
    showOnHorseSport: true,
  },
  {
    title: 'Turf Classic Twilight Meeting',
    slug: 'turf-classic-twilight-meeting',
    description:
      'An evening turf meeting pairing sprint classifications with an open-air lifestyle program across the infield.',
    eventDate: '2026-09-12T10:00:00.000Z',
    endDate: '2026-09-12T21:00:00.000Z',
    venue: 'Sarga Turf Park',
    venueAddress: 'Bogor, West Java, Indonesia',
    eventStatus: 'announced',
    eventDiscipline: 'turf',
    raceClass: 'Listed - Sprint',
    trackType: 'turf',
    hospitalityInfo: 'Twilight terrace and premium turf-side seating.',
    ticketCtaLabel: 'Register Interest',
    ticketIntegrationType: 'redirect',
    siteScope: 'horsesport',
    showOnGateway: false,
    showOnMotorsport: false,
    showOnHorseSport: true,
  },
  {
    title: 'Sarga Champions Sprint',
    slug: 'sarga-champions-sprint',
    description:
      'A championship sprint spectacle decided in the first furlongs - the fastest field of the season breaks from the gates in a high-stakes dash to the line.',
    eventDate: '2026-10-04T09:00:00.000Z',
    endDate: '2026-10-04T17:00:00.000Z',
    venue: 'Grand Paddock Arena',
    venueAddress: 'Bogor, West Java, Indonesia',
    eventStatus: 'announced',
    eventDiscipline: 'championship',
    raceClass: 'Group 2 - Sprint Championship',
    trackType: 'turf',
    hospitalityInfo:
      'Trackside champions lounge with a direct view of the starting gates.',
    ticketCtaLabel: 'Register Interest',
    ticketIntegrationType: 'redirect',
    siteScope: 'horsesport',
    showOnGateway: true,
    showOnMotorsport: false,
    showOnHorseSport: true,
  },
];

const HORSESPORT_TICKET_CTAS = [
  {
    title: 'Sarga National Derby - Merdeka Cup Tickets',
    label: 'Buy Tickets',
    provider: 'Partner Ticketing',
    ctaType: 'redirect',
    url: 'https://example.com/tickets/sarga-national-derby',
    isActive: true,
    siteScope: 'horsesport',
  },
];

const HORSESPORT_NEWS = [
  {
    title: 'Merdeka Cup Returns to a Sold-Out Grandstand',
    slug: 'merdeka-cup-returns-sold-out-grandstand',
    excerpt:
      'The Sarga National Derby headlines a record race-day program with elite jockeys and championship turf classifications.',
    body: 'The Sarga National Derby returns for the Merdeka Cup, headlining a record race-day program with elite jockeys, championship turf classifications, and a full hospitality experience across the Sarga Turf Park.',
    category: 'event-announcement',
    publishedDate: '2026-07-20',
    isHotTopic: true,
    siteScope: 'horsesport',
    showOnGateway: true,
    showOnMotorsport: false,
    showOnHorseSport: true,
    featuredOnHorseSport: true,
  },
  {
    title: 'Inside the Stable: Conditioning an Elite Derby Contender',
    slug: 'inside-the-stable-conditioning-derby-contender',
    excerpt:
      'A behind-the-scenes look at nutrition, veterinary care, and the daily routines that shape a championship horse.',
    body: 'A behind-the-scenes look at the nutrition programs, veterinary care, and disciplined daily routines that shape a championship derby contender inside the Sarga Horse Sport network.',
    category: 'stable-life',
    publishedDate: '2026-07-05',
    isHotTopic: false,
    siteScope: 'horsesport',
    showOnGateway: false,
    showOnMotorsport: false,
    showOnHorseSport: true,
  },
  {
    title: 'Turf Track Development Reaches Championship Grade',
    slug: 'turf-track-development-championship-grade',
    excerpt:
      'New drainage and turf management bring the Sarga Turf Park to international championship standards.',
    body: 'New drainage systems and turf management protocols have brought the Sarga Turf Park to international championship standards, ahead of the upcoming national derby season.',
    category: 'turf-venue',
    publishedDate: '2026-06-22',
    isHotTopic: false,
    siteScope: 'horsesport',
    showOnGateway: false,
    showOnMotorsport: false,
    showOnHorseSport: true,
  },
  {
    title: 'The Making of a Champion Jockey',
    slug: 'the-making-of-a-champion-jockey',
    excerpt:
      'Discipline, weight management, and split-second race-craft - an intimate profile of the riders behind Sarga Horse Sport victories.',
    body: 'Behind every championship result is a rider whose craft is honed over years. This profile follows the discipline, weight management, and split-second decision-making that define an elite Sarga Horse Sport jockey - from dawn track work to the roar of the home straight.',
    category: 'jockey-story',
    publishedDate: '2026-07-28',
    isHotTopic: true,
    siteScope: 'horsesport',
    showOnGateway: false,
    showOnMotorsport: false,
    showOnHorseSport: true,
    featuredOnHorseSport: true,
  },
  {
    title: 'Photo Finish Decides the Turf Classic',
    slug: 'photo-finish-decides-turf-classic',
    excerpt:
      'A blanket finish separated by inches - the Turf Classic delivered one of the closest results in Sarga Horse Sport history.',
    body: 'Inches decided the Turf Classic as the leading contenders flashed across the line together, sending the result to a photo finish. This race report breaks down the closing sectionals, the winning ride, and what the result means for the championship standings.',
    category: 'race-results',
    publishedDate: '2026-07-15',
    isHotTopic: false,
    siteScope: 'horsesport',
    showOnGateway: false,
    showOnMotorsport: false,
    showOnHorseSport: true,
  },
];

/** Gallery entries for the horse sport gallery page. */
const HORSESPORT_GALLERIES = [
  {
    title: 'Race Day Gallery',
    slug: 'horse-sport-race-day',
    description: 'Race-day, turf, and stable photography from Sarga Horse Sport events.',
    category: 'race-day',
    siteScope: 'horsesport',
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
  // Motorsport news cover images
  {
    file: 'sarga-motorsport-concept.jpg',
    alt: 'Red touring race car accelerating past a circuit grandstand',
    uid: 'api::news-article.news-article',
    slug: 'sarga-motorsport-night-race-series',
    field: 'coverImage',
  },
  {
    file: 'sarga-cinematic-hero-concept.jpg',
    alt: 'Three horses running alongside a red race car at a modern circuit',
    uid: 'api::news-article.news-article',
    slug: 'the-line-between-control-and-chaos',
    field: 'coverImage',
  },
  {
    file: 'sarga-horse-sport-turf-aerial.jpg',
    alt: 'Aerial view of a jockey galloping across turf',
    uid: 'api::news-article.news-article',
    slug: 'riders-rewrite-the-racing-line',
    field: 'coverImage',
  },
  {
    file: 'news-stable-interior.jpg',
    alt: 'Horses inside a modern stable atrium lit by a circular skylight',
    uid: 'api::news-article.news-article',
    slug: 'building-the-360-racing-ecosystem',
    field: 'coverImage',
  },
  // Motorsport event cover images
  {
    file: 'sarga-motorsport-concept.jpg',
    alt: 'Red touring race car accelerating past a circuit grandstand',
    uid: 'api::event.event',
    slug: 'superbike-night-sessions',
    field: 'coverImage',
  },
  {
    file: 'sarga-cinematic-hero-concept.jpg',
    alt: 'Three horses running alongside a red race car at a modern circuit',
    uid: 'api::event.event',
    slug: 'gt-endurance-challenge',
    field: 'coverImage',
  },
  {
    file: 'sarga-horse-sport-turf-aerial.jpg',
    alt: 'Aerial view of a jockey galloping across turf',
    uid: 'api::event.event',
    slug: 'moto-festival-weekend',
    field: 'coverImage',
  },
  // Horse Sport event cover images
  {
    file: 'news-merdeka-jockeys.jpg',
    alt: 'Two jockeys racing side by side past a blurred grandstand',
    uid: 'api::event.event',
    slug: 'sarga-national-derby-merdeka-cup',
    field: 'coverImage',
  },
  {
    file: 'news-turf-track-aerial.jpg',
    alt: 'Aerial view of curved turf and dirt racing track lanes',
    uid: 'api::event.event',
    slug: 'turf-classic-twilight-meeting',
    field: 'coverImage',
  },
  // Horse Sport news cover images
  {
    file: 'news-merdeka-jockeys.jpg',
    alt: 'Two jockeys racing side by side past a blurred grandstand',
    uid: 'api::news-article.news-article',
    slug: 'merdeka-cup-returns-sold-out-grandstand',
    field: 'coverImage',
  },
  {
    file: 'news-stable-interior.jpg',
    alt: 'Elite race horse inside a premium stable interior',
    uid: 'api::news-article.news-article',
    slug: 'inside-the-stable-conditioning-derby-contender',
    field: 'coverImage',
  },
  {
    file: 'news-turf-track-aerial.jpg',
    alt: 'Aerial view of curved turf and dirt racing track lanes',
    uid: 'api::news-article.news-article',
    slug: 'turf-track-development-championship-grade',
    field: 'coverImage',
  },
  // Horse Sport - new high-res posts (HS-media refresh)
  {
    file: 'hs-starting-gates.png',
    alt: 'A field of racehorses bursting from the starting gates, turf flying',
    uid: 'api::event.event',
    slug: 'sarga-champions-sprint',
    field: 'coverImage',
  },
  {
    file: 'hs-jockey-portrait.png',
    alt: 'Editorial close-up portrait of a determined jockey in racing silks',
    uid: 'api::news-article.news-article',
    slug: 'the-making-of-a-champion-jockey',
    field: 'coverImage',
  },
  {
    file: 'hs-closeup-action.png',
    alt: 'High-speed close-up of racehorses straining toward a photo finish',
    uid: 'api::news-article.news-article',
    slug: 'photo-finish-decides-turf-classic',
    field: 'coverImage',
  },
  // Horse Sport gallery cover image
  {
    file: 'sarga-horse-sport-turf-aerial.jpg',
    alt: 'Aerial view of a jockey galloping across turf',
    uid: 'api::media-gallery.media-gallery',
    slug: 'horse-sport-race-day',
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
  const ext = path.extname(filename).toLowerCase();
  const mime =
    ext === '.png'
      ? 'image/png'
      : ext === '.webp'
        ? 'image/webp'
        : 'image/jpeg';
  // Provide both formidable v2 and v3 style keys for compatibility.
  const fileDescriptor = {
    filepath: filePath,
    path: filePath,
    originalFilename: filename,
    name: filename,
    mimetype: mime,
    type: mime,
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
    if (doc[item.field]) continue; // already has media - never overwrite

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

/**
 * Horse Sport cover refresh: swaps the earlier low-resolution placeholder
 * covers for the curated high-resolution art. Unlike `seedMedia`, this DOES
 * replace an existing image - but only when the current cover isn't already the
 * target file, so it stays idempotent across re-seeds.
 */
const HORSESPORT_COVER_REFRESH: Array<{
  uid: string;
  slug: string;
  field: string;
  file: string;
  alt: string;
}> = [
  {
    uid: 'api::event.event',
    slug: 'sarga-national-derby-merdeka-cup',
    field: 'coverImage',
    file: 'hs-home-straight-finish.png',
    alt: 'Two racehorses neck-and-neck down the home straight toward the line',
  },
  {
    uid: 'api::event.event',
    slug: 'turf-classic-twilight-meeting',
    field: 'coverImage',
    file: 'hs-night-race.png',
    alt: 'A twilight horse race under bright stadium floodlights',
  },
  {
    uid: 'api::news-article.news-article',
    slug: 'merdeka-cup-returns-sold-out-grandstand',
    field: 'coverImage',
    file: 'hs-winners-circle.png',
    alt: 'Triumphant winner’s circle celebration on race day',
  },
  {
    uid: 'api::news-article.news-article',
    slug: 'inside-the-stable-conditioning-derby-contender',
    field: 'coverImage',
    file: 'hs-champion-horse.png',
    alt: 'Studio portrait of a champion thoroughbred racehorse',
  },
  {
    uid: 'api::news-article.news-article',
    slug: 'turf-track-development-championship-grade',
    field: 'coverImage',
    file: 'hs-racecourse-aerial.png',
    alt: 'Cinematic aerial of a sweeping green turf racecourse at golden hour',
  },
];

/** Curated high-res set for the Horse Sport race-day gallery. */
const HORSESPORT_GALLERY_REFRESH = [
  { file: 'hs-home-straight-finish.png', alt: 'Racehorses neck-and-neck down the home straight' },
  { file: 'hs-winners-circle.png', alt: 'Winner’s circle celebration on race day' },
  { file: 'hs-champion-horse.png', alt: 'Studio portrait of a champion racehorse' },
  { file: 'hs-racecourse-aerial.png', alt: 'Aerial view of a sweeping turf racecourse' },
  { file: 'hs-night-race.png', alt: 'Night horse race under stadium floodlights' },
  { file: 'hs-starting-gates.png', alt: 'Racehorses bursting from the starting gates' },
  { file: 'hs-closeup-action.png', alt: 'High-speed close-up of racehorses at full gallop' },
  { file: 'hs-jockey-portrait.png', alt: 'Editorial portrait of a jockey in racing silks' },
];

async function refreshHorseSportMedia(
  strapi: Core.Strapi,
  documents: (uid: string) => {
    findFirst: (params?: Record<string, unknown>) => Promise<unknown>;
    update: (params: Record<string, unknown>) => Promise<unknown>;
  },
) {
  // Single covers
  for (const item of HORSESPORT_COVER_REFRESH) {
    const doc = (await documents(item.uid).findFirst({
      filters: { slug: { $eq: item.slug } },
      populate: [item.field],
    })) as
      | ({ documentId: string } & Record<string, unknown>)
      | null;
    if (!doc) continue;

    const current = doc[item.field] as { name?: string } | null | undefined;
    if (current?.name === item.file) continue; // already the high-res art

    const file = await uploadIfMissing(strapi, item.file, item.alt);
    if (!file) continue;

    await documents(item.uid).update({
      documentId: doc.documentId,
      data: { [item.field]: file.id },
      status: 'published',
    });
    strapi.log.info(
      `[seed] Refreshed cover ${item.file} → ${item.uid}(${item.slug}).${item.field}`,
    );
  }

  // Gallery mediaItems - replace the low-res set with the curated high-res set.
  const gallery = (await documents('api::media-gallery.media-gallery').findFirst(
    {
      filters: { slug: { $eq: 'horse-sport-race-day' } },
      populate: ['mediaItems'],
    },
  )) as
    | { documentId: string; mediaItems?: Array<{ name?: string }> }
    | null;
  if (gallery) {
    const currentNames = (gallery.mediaItems ?? [])
      .map((m) => m.name)
      .filter(Boolean)
      .sort();
    const targetNames = HORSESPORT_GALLERY_REFRESH.map((g) => g.file).sort();
    const alreadySet =
      currentNames.length === targetNames.length &&
      currentNames.every((n, i) => n === targetNames[i]);
    if (!alreadySet) {
      const fileIds: number[] = [];
      for (const g of HORSESPORT_GALLERY_REFRESH) {
        const file = await uploadIfMissing(strapi, g.file, g.alt);
        if (file) fileIds.push(file.id);
      }
      if (fileIds.length > 0) {
        await documents('api::media-gallery.media-gallery').update({
          documentId: gallery.documentId,
          data: { mediaItems: fileIds },
          status: 'published',
        });
        strapi.log.info(
          `[seed] Refreshed ${fileIds.length} gallery images → horse-sport-race-day`,
        );
      }
    }
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

  strapi.log.info('[seed] SEED_DEMO_CONTENT=true - checking demo content…');

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

  // --- Multisite (Phase 2): site registry + motorsport demo set ---

  // Site registry
  const siteCount = await documents('api::site.site').count();
  if (siteCount === 0) {
    for (const site of SITES) {
      await documents('api::site.site').create({
        data: site,
        status: 'published',
      });
    }
    strapi.log.info(`[seed] Created ${SITES.length} sites.`);
  }

  // Resolve the Sarga Motorsport business for relations.
  const motorsportBusiness = (await documents(
    'api::ecosystem-business.ecosystem-business',
  ).findFirst({ filters: { slug: { $eq: 'sarga-motorsport' } } })) as
    | { documentId: string }
    | null;

  // Motorsport events (idempotent by slug), linked to the motorsport business.
  for (const msEvent of MOTORSPORT_EVENTS) {
    const existing = await documents('api::event.event').findFirst({
      filters: { slug: { $eq: msEvent.slug } },
    });
    if (!existing) {
      await documents('api::event.event').create({
        data: {
          ...msEvent,
          ...(motorsportBusiness
            ? { business: motorsportBusiness.documentId }
            : {}),
        },
        status: 'published',
      });
      strapi.log.info(`[seed] Created motorsport event: ${msEvent.title}`);
    }
  }

  // Motorsport partners (idempotent by slug)
  for (const partner of MOTORSPORT_PARTNERS) {
    const existing = await documents('api::partner.partner').findFirst({
      filters: { slug: { $eq: partner.slug } },
    });
    if (!existing) {
      await documents('api::partner.partner').create({
        data: partner,
        status: 'published',
      });
      strapi.log.info(`[seed] Created motorsport partner: ${partner.name}`);
    }
  }

  // Motorsport ticket CTAs (idempotent by title), linked to the first event.
  const firstMotorsportEvent = (await documents('api::event.event').findFirst({
    filters: { slug: { $eq: MOTORSPORT_EVENTS[0].slug } },
  })) as { documentId: string } | null;

  for (const cta of MOTORSPORT_TICKET_CTAS) {
    const existing = await documents('api::ticket-cta.ticket-cta').findFirst({
      filters: { title: { $eq: cta.title } },
    });
    if (!existing) {
      await documents('api::ticket-cta.ticket-cta').create({
        data: {
          ...cta,
          ...(firstMotorsportEvent
            ? { relatedEvent: firstMotorsportEvent.documentId }
            : {}),
        },
        status: 'published',
      });
      strapi.log.info(`[seed] Created motorsport ticket CTA: ${cta.title}`);
    }
  }

  // Motorsport news articles (idempotent by slug), linked to the business + first event.
  for (const article of MOTORSPORT_NEWS) {
    const existing = await documents(
      'api::news-article.news-article',
    ).findFirst({ filters: { slug: { $eq: article.slug } } });
    if (!existing) {
      await documents('api::news-article.news-article').create({
        data: {
          ...article,
          ...(motorsportBusiness
            ? { relatedBusinesses: [motorsportBusiness.documentId] }
            : {}),
          ...(firstMotorsportEvent
            ? { relatedEvent: firstMotorsportEvent.documentId }
            : {}),
        },
        status: 'published',
      });
      strapi.log.info(`[seed] Created motorsport news: ${article.title}`);
    }
  }

  // Motorsport gallery (idempotent by slug)
  for (const gallery of MOTORSPORT_GALLERIES) {
    const existing = await documents(
      'api::media-gallery.media-gallery',
    ).findFirst({ filters: { slug: { $eq: gallery.slug } } });
    if (!existing) {
      await documents('api::media-gallery.media-gallery').create({
        data: gallery,
        status: 'published',
      });
      strapi.log.info(`[seed] Created motorsport gallery: ${gallery.title}`);
    }
  }

  // --- Horse Sport (Horse Sport Phase 2): horsesport demo set ---

  // Normalize dedicated-business routing (idempotent). The business create
  // block above is count-gated, so businesses seeded before the three-site
  // fields existed keep stale scope/routing on an existing DB. Bring the two
  // dedicated businesses in line so gateway → dedicated-site routing works.
  const DEDICATED_BUSINESS_ROUTING = [
    {
      slug: 'sarga-horse-sport',
      siteScope: 'shared',
      dedicatedSiteKey: 'horsesport',
      dedicatedSiteUrl: 'http://localhost:3002',
    },
    {
      slug: 'sarga-motorsport',
      siteScope: 'shared',
      dedicatedSiteKey: 'motorsport',
      dedicatedSiteUrl: 'http://localhost:3001',
    },
  ];
  for (const routing of DEDICATED_BUSINESS_ROUTING) {
    const biz = (await documents(
      'api::ecosystem-business.ecosystem-business',
    ).findFirst({ filters: { slug: { $eq: routing.slug } } })) as
      | ({ documentId: string } & Record<string, unknown>)
      | null;
    if (!biz) continue;
    const needsUpdate =
      biz.siteScope !== routing.siteScope ||
      biz.dedicatedSiteKey !== routing.dedicatedSiteKey ||
      biz.dedicatedSiteUrl !== routing.dedicatedSiteUrl;
    if (needsUpdate) {
      await documents('api::ecosystem-business.ecosystem-business').update({
        documentId: biz.documentId,
        data: {
          siteScope: routing.siteScope,
          dedicatedSiteKey: routing.dedicatedSiteKey,
          dedicatedSiteUrl: routing.dedicatedSiteUrl,
        },
        status: 'published',
      });
      strapi.log.info(
        `[seed] Normalized dedicated business routing: ${routing.slug}`,
      );
    }
  }

  // Resolve the Sarga Horse Sport business for relations.
  const horseSportBusiness = (await documents(
    'api::ecosystem-business.ecosystem-business',
  ).findFirst({ filters: { slug: { $eq: 'sarga-horse-sport' } } })) as
    | { documentId: string }
    | null;

  // Horse Sport events (idempotent by slug), linked to the horse sport business.
  for (const hsEvent of HORSESPORT_EVENTS) {
    const existing = await documents('api::event.event').findFirst({
      filters: { slug: { $eq: hsEvent.slug } },
    });
    if (!existing) {
      await documents('api::event.event').create({
        data: {
          ...hsEvent,
          ...(horseSportBusiness
            ? { business: horseSportBusiness.documentId }
            : {}),
        },
        status: 'published',
      });
      strapi.log.info(`[seed] Created horse sport event: ${hsEvent.title}`);
    }
  }

  // Horse Sport partners (idempotent by slug)
  for (const partner of HORSESPORT_PARTNERS) {
    const existing = await documents('api::partner.partner').findFirst({
      filters: { slug: { $eq: partner.slug } },
    });
    if (!existing) {
      await documents('api::partner.partner').create({
        data: partner,
        status: 'published',
      });
      strapi.log.info(`[seed] Created horse sport partner: ${partner.name}`);
    }
  }

  // Horse Sport ticket CTAs (idempotent by title), linked to the first event.
  const firstHorseSportEvent = (await documents('api::event.event').findFirst({
    filters: { slug: { $eq: HORSESPORT_EVENTS[0].slug } },
  })) as { documentId: string } | null;

  for (const cta of HORSESPORT_TICKET_CTAS) {
    const existing = await documents('api::ticket-cta.ticket-cta').findFirst({
      filters: { title: { $eq: cta.title } },
    });
    if (!existing) {
      await documents('api::ticket-cta.ticket-cta').create({
        data: {
          ...cta,
          ...(firstHorseSportEvent
            ? { relatedEvent: firstHorseSportEvent.documentId }
            : {}),
        },
        status: 'published',
      });
      strapi.log.info(`[seed] Created horse sport ticket CTA: ${cta.title}`);
    }
  }

  // Horse Sport gallery (idempotent by slug)
  for (const gallery of HORSESPORT_GALLERIES) {
    const existing = await documents(
      'api::media-gallery.media-gallery',
    ).findFirst({ filters: { slug: { $eq: gallery.slug } } });
    if (!existing) {
      await documents('api::media-gallery.media-gallery').create({
        data: gallery,
        status: 'published',
      });
      strapi.log.info(`[seed] Created horse sport gallery: ${gallery.title}`);
    }
  }

  // Horse Sport news articles (idempotent by slug), linked to the business,
  // first event, and race-day gallery.
  const horseSportGallery = (await documents(
    'api::media-gallery.media-gallery',
  ).findFirst({ filters: { slug: { $eq: HORSESPORT_GALLERIES[0].slug } } })) as
    | { documentId: string }
    | null;

  for (const article of HORSESPORT_NEWS) {
    const existing = await documents(
      'api::news-article.news-article',
    ).findFirst({ filters: { slug: { $eq: article.slug } } });
    if (!existing) {
      await documents('api::news-article.news-article').create({
        data: {
          ...article,
          ...(horseSportBusiness
            ? { relatedBusinesses: [horseSportBusiness.documentId] }
            : {}),
          ...(firstHorseSportEvent
            ? { relatedEvent: firstHorseSportEvent.documentId }
            : {}),
          ...(horseSportGallery
            ? { relatedGallery: horseSportGallery.documentId }
            : {}),
        },
        status: 'published',
      });
      strapi.log.info(`[seed] Created horse sport news: ${article.title}`);
    }
  }

  // Timeline items (About page corporate record)
  const timelineCount = await documents(
    'api::timeline-item.timeline-item',
  ).count();
  if (timelineCount === 0) {
    for (const item of TIMELINE_ITEMS) {
      await documents('api::timeline-item.timeline-item').create({
        data: item,
        status: 'published',
      });
    }
    strapi.log.info(
      `[seed] Created ${TIMELINE_ITEMS.length} timeline items.`,
    );
  }

  // Leadership people (About page corporate record)
  const leadershipCount = await documents(
    'api::leadership-person.leadership-person',
  ).count();
  if (leadershipCount === 0) {
    for (const person of LEADERSHIP_PEOPLE) {
      await documents('api::leadership-person.leadership-person').create({
        data: person,
        status: 'published',
      });
    }
    strapi.log.info(
      `[seed] Created ${LEADERSHIP_PEOPLE.length} leadership people.`,
    );
  }

  // Placeholder media (upload + attach where image fields are empty)
  await seedMedia(strapi, documents);

  // Horse Sport: replace low-res placeholders with curated high-res art
  await refreshHorseSportMedia(strapi, documents);

  // Timeline item images (matched by order field)
  const TIMELINE_MEDIA = [
    { order: 1, file: 'sarga-cinematic-hero-concept.jpg', alt: 'Sarga corporate concept visualization' },
    { order: 2, file: 'sarga-motorsport-concept.jpg', alt: 'Motorsport event concept visualization' },
    { order: 3, file: 'sarga-horse-sport-turf-aerial.jpg', alt: 'Aerial view of integrated venue network' },
  ];
  for (const item of TIMELINE_MEDIA) {
    const doc = (await documents('api::timeline-item.timeline-item').findFirst({
      filters: { order: { $eq: item.order } },
      populate: ['image'],
    })) as { documentId: string; image?: unknown } | null;
    if (!doc || doc.image) continue;
    const file = await uploadIfMissing(strapi, item.file, item.alt);
    if (!file) continue;
    await documents('api::timeline-item.timeline-item').update({
      documentId: doc.documentId,
      data: { image: file.id },
      status: 'published',
    });
    strapi.log.info(`[seed] Attached ${item.file} \u2192 timeline-item (order=${item.order})`);
  }

  // Leadership portraits (matched by name field)
  const LEADERSHIP_MEDIA = [
    { name: 'Farry Ongko Widjaja', file: 'farry-ongko-widjaja.jpg' },
    { name: 'Diana Airin', file: 'diana-airin.jpg' },
    { name: 'Nugdha Achadie', file: 'nugdha-achadie.jpg' },
    { name: 'Zaki Maulani', file: 'zaki-maulani.jpg' },
    { name: 'Aseanto Oudang', file: 'aseanto-oudang.jpg' },
    { name: 'Samsul Purba', file: 'samsul-purba.jpg' },
  ];
  for (const item of LEADERSHIP_MEDIA) {
    const doc = (await documents('api::leadership-person.leadership-person').findFirst({
      filters: { name: { $eq: item.name } },
      populate: ['portrait'],
    })) as { documentId: string; portrait?: unknown } | null;
    if (!doc || doc.portrait) continue;
    const file = await uploadIfMissing(strapi, item.file, `Portrait of ${item.name}`);
    if (!file) continue;
    await documents('api::leadership-person.leadership-person').update({
      documentId: doc.documentId,
      data: { portrait: file.id },
      status: 'published',
    });
    strapi.log.info(`[seed] Attached ${item.file} \u2192 leadership-person (${item.name})`);
  }

  // Gallery mediaItems (attach existing seed images to the motorsport gallery)
  const GALLERY_FILES = [
    { file: 'sarga-motorsport-concept.jpg', alt: 'Red touring race car accelerating past a circuit grandstand' },
    { file: 'sarga-cinematic-hero-concept.jpg', alt: 'Three horses running alongside a red race car at a modern circuit' },
    { file: 'sarga-horse-sport-turf-aerial.jpg', alt: 'Aerial view of a jockey galloping across turf' },
    { file: 'news-merdeka-jockeys.jpg', alt: 'Two jockeys racing side by side past a blurred grandstand' },
    { file: 'news-turf-track-aerial.jpg', alt: 'Aerial view of curved turf and dirt racing track lanes' },
  ];
  const galleryDoc = (await documents('api::media-gallery.media-gallery').findFirst({
    filters: { slug: { $eq: 'media-gallery' } },
    populate: ['mediaItems'],
  })) as { documentId: string; mediaItems?: unknown[] } | null;
  if (galleryDoc && !galleryDoc.mediaItems?.length) {
    const fileIds: number[] = [];
    for (const item of GALLERY_FILES) {
      const file = await uploadIfMissing(strapi, item.file, item.alt);
      if (file) fileIds.push(file.id);
    }
    if (fileIds.length > 0) {
      await documents('api::media-gallery.media-gallery').update({
        documentId: galleryDoc.documentId,
        data: { mediaItems: fileIds },
        status: 'published',
      });
      strapi.log.info(`[seed] Attached ${fileIds.length} images \u2192 media-gallery (media-gallery)`);
    }
  }

  // Horse Sport gallery mediaItems (attach existing seed images)
  const HORSESPORT_GALLERY_FILES = [
    { file: 'news-merdeka-jockeys.jpg', alt: 'Two jockeys racing side by side past a blurred grandstand' },
    { file: 'news-turf-track-aerial.jpg', alt: 'Aerial view of curved turf and dirt racing track lanes' },
    { file: 'news-stable-interior.jpg', alt: 'Elite race horse inside a premium stable interior' },
    { file: 'sarga-horse-sport-turf-aerial.jpg', alt: 'Aerial view of a jockey galloping across turf' },
  ];
  const horseSportGalleryDoc = (await documents('api::media-gallery.media-gallery').findFirst({
    filters: { slug: { $eq: 'horse-sport-race-day' } },
    populate: ['mediaItems'],
  })) as { documentId: string; mediaItems?: unknown[] } | null;
  if (horseSportGalleryDoc && !horseSportGalleryDoc.mediaItems?.length) {
    const fileIds: number[] = [];
    for (const item of HORSESPORT_GALLERY_FILES) {
      const file = await uploadIfMissing(strapi, item.file, item.alt);
      if (file) fileIds.push(file.id);
    }
    if (fileIds.length > 0) {
      await documents('api::media-gallery.media-gallery').update({
        documentId: horseSportGalleryDoc.documentId,
        data: { mediaItems: fileIds },
        status: 'published',
      });
      strapi.log.info(`[seed] Attached ${fileIds.length} images \u2192 media-gallery (horse-sport-race-day)`);
    }
  }

  strapi.log.info('[seed] Demo content check complete.');
}
