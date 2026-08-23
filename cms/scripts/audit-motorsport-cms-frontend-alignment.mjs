#!/usr/bin/env node

/**
 * MSR-CMS-CLEAN-0 read-only audit.
 *
 * This script intentionally inspects repository contracts only. It does not
 * call Strapi, write files, migrate content, or change the frontend. Findings
 * are expected until the later alignment phases close them; use --strict in CI
 * once the inventory is meant to be a blocking gate.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const strict = process.argv.includes("--strict");

const readText = (relativePath) => {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing file: ${relativePath}`);
  }
  return fs.readFileSync(absolutePath, "utf8");
};

const readJson = (relativePath) => JSON.parse(readText(relativePath));

const pageContracts = [
  {
    id: "home",
    route: "/",
    schema:
      "cms/src/api/motorsport-home-page/content-types/motorsport-home-page/schema.json",
    frontend: "frontend-motorsport/src/app/page.tsx",
    presentationFields: [
      "hero",
      "heroSlides",
      "informationBand",
      "worldSection",
      "featuredEvent",
      "featuredProgram",
      "upcomingEventsSection",
      "ticketSection",
      "latestNewsSection",
      "connectedRecordsSection",
      "gallerySection",
      "partnersSection",
      "newsletterSection",
    ],
    frontendKeys: [
      "hero",
      "information-band",
      "world-of-motorsport",
      "upcoming-events",
      "homepage-ticket",
      "latest-news",
      "connected-records",
      "gallery",
      "partners",
      "newsletter",
    ],
    mappings: [
      ["heroSlides", "hero"],
      ["informationBand", "information-band"],
      ["worldSection", "world-of-motorsport"],
      ["upcomingEventsSection", "upcoming-events"],
      ["ticketSection", "homepage-ticket"],
      ["latestNewsSection", "latest-news"],
      ["connectedRecordsSection", "connected-records"],
    ],
    findings: [],
  },
  {
    id: "about",
    route: "/about",
    schema:
      "cms/src/api/motorsport-about-page/content-types/motorsport-about-page/schema.json",
    frontend: "frontend-motorsport/src/app/about/page.tsx",
    presentationFields: [
      "hero",
      "informationBand",
      "profileSection",
      "capabilities",
      "teamSection",
      "contactCtaSection",
      "ecosystemCtaSection",
    ],
    frontendKeys: [
      "hero",
      "information-band",
      "profile",
      "about-capabilities",
      "team-intro",
      "about-ctas",
    ],
    mappings: [
      ["profileSection", "profile"],
      ["capabilities", "about-capabilities"],
      ["teamSection", "team-intro"],
      ["contactCtaSection", "about-ctas"],
      ["ecosystemCtaSection", "about-ctas"],
    ],
    findings: [],
  },
  {
    id: "events",
    route: "/events",
    schema:
      "cms/src/api/motorsport-events-page/content-types/motorsport-events-page/schema.json",
    frontend: "frontend-motorsport/src/app/events/page.tsx",
    presentationFields: [
      "hero",
      "informationBand",
      "programmesSection",
      "calendarSection",
    ],
    frontendKeys: ["hero", "information-band", "programmes", "calendar"],
    mappings: [
      ["informationBand", "information-band"],
      ["programmesSection", "programmes"],
      ["calendarSection", "calendar"],
    ],
    findings: [],
  },
  {
    id: "news",
    route: "/news",
    schema:
      "cms/src/api/motorsport-news-page/content-types/motorsport-news-page/schema.json",
    frontend: "frontend-motorsport/src/app/news/page.tsx",
    presentationFields: [
      "hero",
      "informationBand",
      "leadStorySection",
      "archiveIntroSection",
      "galleryCtaSection",
    ],
    frontendKeys: [
      "hero",
      "information-band",
      "news-feed",
      "lead-story",
      "archive-intro",
      "news-gallery-cta",
    ],
    mappings: [
      ["informationBand", "information-band"],
      ["leadStorySection", "lead-story"],
      ["archiveIntroSection", "archive-intro"],
      ["galleryCtaSection", "news-gallery-cta"],
    ],
    findings: [],
  },
  {
    id: "gallery",
    route: "/gallery",
    schema:
      "cms/src/api/motorsport-gallery-page/content-types/motorsport-gallery-page/schema.json",
    frontend: "frontend-motorsport/src/app/gallery/page.tsx",
    presentationFields: ["hero", "informationBand", "archiveSection"],
    frontendKeys: ["hero", "information-band", "gallery-archive"],
    mappings: [["archiveSection", "gallery-archive"]],
    findings: [],
  },
  {
    id: "merchandise",
    route: "/merchandise",
    schema:
      "cms/src/api/motorsport-merchandise-page/content-types/motorsport-merchandise-page/schema.json",
    frontend: "frontend-motorsport/src/app/merchandise/page.tsx",
    presentationFields: [
      "hero",
      "informationBand",
      "catalogueSection",
      "finalCtaSection",
    ],
    frontendKeys: [
      "hero",
      "information-band",
      "merchandise-catalog",
      "merch-final-cta",
    ],
    mappings: [
      ["informationBand", "information-band"],
      ["catalogueSection", "merchandise-catalog"],
      ["finalCtaSection", "merch-final-cta"],
    ],
    findings: [],
  },
  {
    id: "tickets",
    route: "/tickets",
    schema:
      "cms/src/api/motorsport-tickets-page/content-types/motorsport-tickets-page/schema.json",
    frontend: "frontend-motorsport/src/app/tickets/page.tsx",
    presentationFields: [
      "hero",
      "informationBand",
      "featuredTicketSection",
      "ticketedEventsSection",
      "ticketInfoSection",
    ],
    frontendKeys: [
      "hero",
      "information-band",
      "featured-ticket",
      "ticketed-events",
      "ticket-info",
    ],
    mappings: [
      ["informationBand", "information-band"],
      ["featuredTicketSection", "featured-ticket"],
      ["ticketedEventsSection", "ticketed-events"],
      ["ticketInfoSection", "ticket-info"],
    ],
    findings: [],
  },
  {
    id: "partners",
    route: "/partners",
    schema:
      "cms/src/api/motorsport-partners-page/content-types/motorsport-partners-page/schema.json",
    frontend: "frontend-motorsport/src/app/partners/page.tsx",
    presentationFields: [
      "hero",
      "informationBand",
      "partnerNetworkSection",
      "finalCtaSection",
    ],
    frontendKeys: [
      "hero",
      "information-band",
      "partner-network",
      "partners-final-cta",
    ],
    mappings: [
      ["informationBand", "information-band"],
      ["partnerNetworkSection", "partner-network"],
      ["finalCtaSection", "partners-final-cta"],
    ],
    findings: [],
  },
  {
    id: "experience",
    route: "/experience",
    schema:
      "cms/src/api/motorsport-experience-page/content-types/motorsport-experience-page/schema.json",
    frontend: "frontend-motorsport/src/app/experience/page.tsx",
    presentationFields: [
      "hero",
      "informationBand",
      "pillarsSection",
      "trackSection",
      "finalCtaSection",
    ],
    frontendKeys: [
      "hero",
      "information-band",
      "experience-pillars",
      "experience-track",
      "experience-final-cta",
    ],
    mappings: [
      ["informationBand", "information-band"],
      ["pillarsSection", "experience-pillars"],
      ["trackSection", "experience-track"],
      ["finalCtaSection", "experience-final-cta"],
    ],
    findings: [],
  },
  {
    id: "contact",
    route: "/contact",
    schema:
      "cms/src/api/motorsport-contact-page/content-types/motorsport-contact-page/schema.json",
    frontend: "frontend-motorsport/src/app/contact/page.tsx",
    presentationFields: [
      "hero",
      "informationBand",
      "inquiryFormSection",
      "finalCtaSection",
    ],
    frontendKeys: [
      "hero",
      "information-band",
      "inquiry-form",
      "contact-final-cta",
    ],
    mappings: [
      ["informationBand", "information-band"],
      ["inquiryFormSection", "inquiry-form"],
      ["finalCtaSection", "contact-final-cta"],
    ],
    findings: [],
  },
];

const duplicateFieldSets = [
  {
    id: "ticket-cta",
    status: "compatibility-only",
    sources: [
      "cms/src/api/motorsport-ticket-cta/content-types/motorsport-ticket-cta/schema.json",
      "cms/src/api/ticket-cta/content-types/ticket-cta/schema.json",
    ],
    fields: [
      "title",
      "label",
      "provider",
      "eyebrow",
      "description",
      "eventLabel",
      "eventText",
      "providerLabel",
      "providerText",
      "partnerLabel",
      "footerText",
      "ctaLabel",
      "ctaType",
      "url",
      "embedCode",
      "embedConfigJson",
      "trackingParams",
      "activeFrom",
      "activeUntil",
      "isActive",
      "image",
      "backgroundImage",
      "backgroundImageMobile",
      "relatedEvent",
    ],
    recommendation:
      "Keep the dedicated Motorsport collection as the scoped owner during migration, then archive the shared duplicate only after relation and frontend cutover evidence.",
  },
  {
    id: "information-band-control",
    status: "retired-read-path",
    sources: "all dedicated Motorsport Single Types",
    fields: ["informationBand", "*ControlSection"],
    recommendation:
      "Make informationBand the only visible control-band source. Retain legacy control sections only as migration fallbacks until each route passes cutover.",
  },
];

const getSchemaAttributes = (relativePath) => {
  const schema = readJson(relativePath);
  return Object.keys(schema.attributes ?? {});
};

const extractFrontendKeys = (relativePath) => {
  const source = readText(relativePath);
  return [...source.matchAll(/data-cms-section-key="([^"]+)"/g)].map(
    (match) => match[1],
  );
};

const unique = (items) => [...new Set(items)];
const issues = [];
const audit = [];

for (const contract of pageContracts) {
  const schemaAttributes = getSchemaAttributes(contract.schema);
  const missingFields = contract.presentationFields.filter(
    (field) => !schemaAttributes.includes(field),
  );
  const frontendKeys = extractFrontendKeys(contract.frontend);
  const duplicateFrontendKeys = unique(
    frontendKeys.filter((key, index) => frontendKeys.indexOf(key) !== index),
  );
  const presentationAttributes = schemaAttributes.filter(
    (field) =>
      ![
        "siteScope",
        "routePath",
        "routeAliases",
        "title",
        "navigationLabel",
        "pageAvailability",
        "seo",
      ].includes(field),
  );

  if (missingFields.length) {
    issues.push(
      `${contract.route}: missing expected CMS fields: ${missingFields.join(", ")}`,
    );
  }
  if (duplicateFrontendKeys.length) {
    issues.push(
      `${contract.route}: duplicate frontend section markers: ${duplicateFrontendKeys.join(", ")}`,
    );
  }

  audit.push({
    route: contract.route,
    cmsSchema: contract.schema,
    frontendSource: contract.frontend,
    cmsPresentationOrder: presentationAttributes,
    expectedPresentationOrder: contract.presentationFields,
    frontendMarkerOrder: frontendKeys,
    mappings: contract.mappings.map(([cms, frontend]) => ({ cms, frontend })),
    findings: contract.findings,
    missingExpectedFields: missingFields,
  });
}

const duplicateAudit = duplicateFieldSets.map((duplicate) => {
  if (Array.isArray(duplicate.sources)) {
    const sourceFields = duplicate.sources.map((source) => ({
      source,
      fields: getSchemaAttributes(source),
    }));
    const missing = duplicate.fields.filter((field) =>
      sourceFields.some(({ fields }) => !fields.includes(field)),
    );
    if (missing.length) {
      issues.push(
        `${duplicate.id}: duplicate set references fields missing from one source: ${missing.join(", ")}`,
      );
    }
    return { ...duplicate, sourceFields };
  }
  return duplicate;
});

const structuralFindings = audit.flatMap((entry) =>
  entry.findings.map((finding) => ({ route: entry.route, finding })),
);

const result = {
  mode: "read-only",
  phase: "MSR-CMS-CLEAN-0",
  checkedAt: new Date().toISOString(),
  strict,
  summary: {
    pagesChecked: audit.length,
    structuralIssues: issues.length,
    documentedFindings: structuralFindings.length,
    duplicateSourceSets: duplicateAudit.filter(
      (duplicate) => duplicate.status === "active",
    ).length,
  },
  pages: audit,
  duplicateSourceAudit: duplicateAudit,
  structuralIssues: issues,
  documentedFindings: structuralFindings,
};

console.log(JSON.stringify(result, null, 2));

// Default mode is an inventory and therefore succeeds with findings. Strict
// mode is reserved for the later phase gates after the findings are closed.
process.exitCode =
  strict && (issues.length > 0 || structuralFindings.length > 0) ? 1 : 0;
