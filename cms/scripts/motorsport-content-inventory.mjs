#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

const baseUrl = process.env.CMS_UAT_BASE_URL ?? "http://localhost:1337";
const outputPath = process.argv.includes("--output")
  ? process.argv[process.argv.indexOf("--output") + 1]
  : "../docs/motorsport/audit/field-inventory-2026-08-29.json";

const surfaces = [
  ["api::motorsport-home-page.motorsport-home-page", "motorsport-home-page", "single"],
  ["api::motorsport-about-page.motorsport-about-page", "motorsport-about-page", "single"],
  ["api::motorsport-events-page.motorsport-events-page", "motorsport-events-page", "single"],
  ["api::motorsport-news-page.motorsport-news-page", "motorsport-news-page", "single"],
  ["api::motorsport-gallery-page.motorsport-gallery-page", "motorsport-gallery-page", "single"],
  ["api::motorsport-merchandise-page.motorsport-merchandise-page", "motorsport-merchandise-page", "single"],
  ["api::motorsport-tickets-page.motorsport-tickets-page", "motorsport-tickets-page", "single"],
  ["api::motorsport-contact-page.motorsport-contact-page", "motorsport-contact-page", "single"],
  ["api::motorsport-partners-page.motorsport-partners-page", "motorsport-partners-page", "single"],
  ["api::motorsport-experience-page.motorsport-experience-page", "motorsport-experience-page", "single"],
  ["api::motorsport-program.motorsport-program", "motorsport-programs", "collection"],
  ["api::motorsport-event.motorsport-event", "motorsport-events", "collection"],
  ["api::motorsport-news-article.motorsport-news-article", "motorsport-news-articles", "collection"],
  ["api::media-gallery.media-gallery", "media-galleries", "collection"],
  ["api::motorsport-merchandise-item.motorsport-merchandise-item", "motorsport-merchandise-items", "collection"],
  ["api::motorsport-rider.motorsport-rider", "motorsport-riders", "collection"],
  ["api::motorsport-standing.motorsport-standing", "motorsport-standings", "collection"],
  ["api::motorsport-regulation.motorsport-regulation", "motorsport-regulations", "collection"],
  ["api::motorsport-ticket-cta.motorsport-ticket-cta", "motorsport-ticket-ctas", "collection"],
  ["api::motorsport-partner.motorsport-partner", "motorsport-partners", "collection"],
  ["api::motorsport-leadership-person.motorsport-leadership-person", "motorsport-leadership-people", "collection"],
  ["api::motorsport-top-navigation-item.motorsport-top-navigation-item", "motorsport-top-navigation-items", "collection"],
];

function isPresent(value) {
  if (value === null || value === undefined || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function collect(value, prefix, fields, media) {
  if (!isPresent(value)) return;
  fields[prefix] = (fields[prefix] ?? 0) + 1;
  if (value && typeof value === "object") {
    if (!Array.isArray(value) && typeof value.url === "string") media.add(value.url);
    if (Array.isArray(value)) {
      for (const item of value) collect(item, `${prefix}[]`, fields, media);
    } else {
      for (const [key, child] of Object.entries(value)) {
        if (!["id", "documentId", "createdAt", "updatedAt", "publishedAt"].includes(key)) {
          collect(child, `${prefix}.${key}`, fields, media);
        }
      }
    }
  }
}

async function request(endpoint, type) {
  const query = endpoint === "motorsport-programs"
    ? "?populate%5BheroMedia%5D=true&populate%5BbannerSlides%5D%5Bpopulate%5D%5Bimage%5D=true&populate%5BpresentationSections%5D%5Bpopulate%5D%5Bitems%5D=true&populate%5BmotorsportPresentation%5D%5Bpopulate%5D%5Bhero%5D%5Bpopulate%5D%5BbackgroundMedia%5D=true&populate%5BmotorsportPresentation%5D%5Bpopulate%5D%5BinformationBand%5D%5Bpopulate%5D%5Bmetrics%5D=true&populate%5BfiaRallycrossContent%5D%5Bpopulate%5D%5BformatSection%5D%5Bpopulate%5D%5BformatItems%5D=true&populate%5BfiaRallycrossContent%5D%5Bpopulate%5D%5BrundownSection%5D%5Bpopulate%5D%5BrundownItems%5D=true&populate%5BfiaRallycrossContent%5D%5Bpopulate%5D%5BraceDayGuideSection%5D%5Bpopulate%5D%5BruleItems%5D=true&populate%5Brundown%5D=true&populate%5BrelatedTicketCtas%5D=true&populate%5Briders%5D=true&populate%5Bstandings%5D=true&populate%5Bregulations%5D=true&populate%5BrelatedEvents%5D=true&populate%5Bsites%5D=true&populate%5Bseo%5D%5Bpopulate%5D%5BogImage%5D=true&pagination%5BpageSize%5D=100"
    : type === "collection"
      ? "?populate=*&pagination%5BpageSize%5D=100"
      : "?populate=*";
  const response = await fetch(`${baseUrl}/api/${endpoint}${query}`);
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
  return type === "collection" ? data?.data ?? [] : data?.data ? [data.data] : [];
}

const report = {
  generatedAt: new Date().toISOString(),
  mode: "read-only",
  baseUrl,
  surfaces: [],
};

const tableByEndpoint = {
  "motorsport-events": "motorsport_events",
  "motorsport-merchandise-items": "motorsport_merchandise_items",
  "motorsport-leadership-people": "motorsport_leadership_people",
  "motorsport-top-navigation-items": "motorsport_top_navigation_items",
};

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST ?? "localhost",
  port: Number(process.env.DATABASE_PORT ?? 5435),
  database: process.env.DATABASE_NAME ?? "sarga_strapi",
  user: process.env.DATABASE_USERNAME ?? "sarga",
  password: process.env.DATABASE_PASSWORD ?? "sarga_local_password",
  ssl: false,
});

await db.connect();

function quoteIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`;
}

async function databaseFallback(endpoint) {
  const table = tableByEndpoint[endpoint];
  if (!table) return null;
  const columnsResult = await db.query(
    `select column_name from information_schema.columns where table_schema = 'public' and table_name = $1 order by ordinal_position`,
    [table],
  );
  if (!columnsResult.rows.length) return null;
  const rows = await db.query(`select * from ${quoteIdentifier(table)}`);
  return rows.rows;
}

for (const [uid, endpoint, type] of surfaces) {
  try {
    let records;
    try {
      records = await request(endpoint, type);
    } catch (error) {
      records = await databaseFallback(endpoint);
      if (!records) throw error;
    }
    const fields = {};
    const media = new Set();
    for (const record of records) collect(record, "record", fields, media);
    report.surfaces.push({
      uid,
      endpoint,
      type,
      recordCount: records.length,
      locales: [...new Set(records.map((record) => record.locale).filter(Boolean))].sort(),
      programs: records
        .filter((record) => record.slug && record.programType)
        .map((record) => ({
          documentId: record.documentId,
          slug: record.slug,
          programType: record.programType,
          programStatus: record.programStatus,
          locale: record.locale,
          activePresentationSections: (record.presentationSections ?? [])
            .filter((section) => section.isActive !== false)
            .map((section) => section.sectionKey),
          legacyPresentationSections: record.presentationSections?.length ?? 0,
          legacyHeroMedia: record.heroMedia ? 1 : 0,
          bannerSlides: record.bannerSlides?.length ?? 0,
          legacyRundownItems: record.rundown?.length ?? 0,
          groupedFormatItems:
            record.fiaRallycrossContent?.formatSection?.formatItems?.length ?? 0,
          groupedRundownItems:
            record.fiaRallycrossContent?.rundownSection?.rundownItems?.length ?? 0,
          groupedRuleItems:
            record.fiaRallycrossContent?.raceDayGuideSection?.ruleItems?.length ?? 0,
          riderRelations: record.riders?.length ?? 0,
          standingRelations: record.standings?.length ?? 0,
          regulationRelations: record.regulations?.length ?? 0,
        })),
      nonEmptyFieldCounts: fields,
      mediaReferenceCount: media.size,
    });
  } catch (error) {
    report.surfaces.push({ uid, endpoint, type, status: "error", error: String(error) });
  }
}

await db.end();

const resolved = path.resolve(path.dirname(new URL(import.meta.url).pathname), outputPath);
fs.mkdirSync(path.dirname(resolved), { recursive: true });
fs.writeFileSync(resolved, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Wrote read-only Motorsport inventory: ${resolved}`);
