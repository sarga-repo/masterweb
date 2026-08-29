import type { Core } from "@strapi/strapi";

type Mode = "off" | "dry-run" | "apply" | "verify";

type DocumentService = {
  findMany: (params?: Record<string, unknown>) => Promise<any[]>;
  update: (params: Record<string, unknown>) => Promise<any>;
};

const PROGRAM_UID = "api::motorsport-program.motorsport-program";

const PAGE_COMPONENTS: Record<string, string[]> = {
  hero: [
    "showEyebrow",
    "showTitle",
    "showDescription",
    "showMedia",
    "showPrimaryCta",
    "showSecondaryCta",
    "showMetricGroup",
  ],
  informationBand: [
    "showEyebrow",
    "showTitle",
    "showDescription",
    "showMetricGroup",
  ],
  pageSection: [
    "showIndex",
    "showEyebrow",
    "showTitle",
    "showBody",
    "showMedia",
    "showCta",
  ],
  capabilities: ["showIndex", "showEyebrow", "showTitle", "showDescription"],
  pageAvailability: ["showNotifyCta"],
};

const PAGE_DEFINITIONS = [
  [
    "api::motorsport-home-page.motorsport-home-page",
    [
      ["hero", "hero"],
      ["informationBand", "informationBand"],
      ["upcomingEventsSection", "pageSection"],
      ["latestNewsSection", "pageSection"],
      ["connectedRecordsSection", "pageSection"],
      ["gallerySection", "pageSection"],
      ["partnersSection", "pageSection"],
      ["newsletterSection", "pageSection"],
      ["pageAvailability", "pageAvailability"],
    ],
  ],
  [
    "api::motorsport-about-page.motorsport-about-page",
    [
      ["hero", "hero"],
      ["informationBand", "informationBand"],
      ["profileSection", "pageSection"],
      ["capabilities", "capabilities"],
      ["teamSection", "pageSection"],
      ["contactCtaSection", "pageSection"],
      ["ecosystemCtaSection", "pageSection"],
      ["pageAvailability", "pageAvailability"],
    ],
  ],
  [
    "api::motorsport-events-page.motorsport-events-page",
    [
      ["hero", "hero"],
      ["informationBand", "informationBand"],
      ["programmesSection", "pageSection"],
      ["calendarSection", "pageSection"],
      ["pageAvailability", "pageAvailability"],
    ],
  ],
  [
    "api::motorsport-news-page.motorsport-news-page",
    [
      ["hero", "hero"],
      ["informationBand", "informationBand"],
      ["leadStorySection", "pageSection"],
      ["archiveIntroSection", "pageSection"],
      ["galleryCtaSection", "pageSection"],
      ["pageAvailability", "pageAvailability"],
    ],
  ],
  [
    "api::motorsport-gallery-page.motorsport-gallery-page",
    [
      ["hero", "hero"],
      ["informationBand", "informationBand"],
      ["archiveSection", "pageSection"],
      ["pageAvailability", "pageAvailability"],
    ],
  ],
  [
    "api::motorsport-merchandise-page.motorsport-merchandise-page",
    [
      ["hero", "hero"],
      ["informationBand", "informationBand"],
      ["catalogueSection", "pageSection"],
      ["finalCtaSection", "pageSection"],
      ["pageAvailability", "pageAvailability"],
    ],
  ],
  [
    "api::motorsport-tickets-page.motorsport-tickets-page",
    [
      ["hero", "hero"],
      ["informationBand", "informationBand"],
      ["featuredTicketSection", "pageSection"],
      ["ticketedEventsSection", "pageSection"],
      ["ticketInfoSection", "pageSection"],
      ["pageAvailability", "pageAvailability"],
    ],
  ],
  [
    "api::motorsport-contact-page.motorsport-contact-page",
    [
      ["hero", "hero"],
      ["informationBand", "informationBand"],
      ["inquiryFormSection", "pageSection"],
      ["finalCtaSection", "pageSection"],
      ["pageAvailability", "pageAvailability"],
    ],
  ],
  [
    "api::motorsport-partners-page.motorsport-partners-page",
    [
      ["hero", "hero"],
      ["informationBand", "informationBand"],
      ["partnerNetworkSection", "pageSection"],
      ["finalCtaSection", "pageSection"],
      ["pageAvailability", "pageAvailability"],
    ],
  ],
  [
    "api::motorsport-experience-page.motorsport-experience-page",
    [
      ["hero", "hero"],
      ["informationBand", "informationBand"],
      ["pillarsSection", "pageSection"],
      ["trackSection", "pageSection"],
      ["finalCtaSection", "pageSection"],
      ["pageAvailability", "pageAvailability"],
    ],
  ],
] as const;

function mode(): Mode {
  const value = process.env.MOTORSPORT_SHOW_FIELD_DEFAULTS_MODE ?? "off";
  return ["off", "dry-run", "apply", "verify"].includes(value)
    ? (value as Mode)
    : "off";
}

function documentService(strapi: Core.Strapi, uid: string) {
  return (
    strapi.documents as unknown as (contentType: string) => DocumentService
  )(uid);
}

function componentData(value: any): any {
  if (Array.isArray(value)) return value.map(componentData);
  if (!value || typeof value !== "object") return value;
  if ("mime" in value && "id" in value) return value.id;
  if ("documentId" in value && value.documentId) return value.documentId;
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([key]) =>
          ![
            "id",
            "documentId",
            "createdAt",
            "updatedAt",
            "publishedAt",
            "locale",
          ].includes(key),
      )
      .map(([key, child]) => [key, componentData(child)]),
  );
}

function missingShowFields(component: any, fields: readonly string[]) {
  if (!component || typeof component !== "object") return [];
  return fields.filter(
    (field) => component[field] === null || component[field] === undefined,
  );
}

function backfillProgramSectionDefaults(section: any) {
  const nextSection = componentData(section);
  let missing = 0;

  for (const field of PAGE_COMPONENTS.pageSection) {
    if (section[field] === null || section[field] === undefined) {
      nextSection[field] = true;
      missing += 1;
    }
  }

  if (Array.isArray(section.items)) {
    nextSection.items = section.items.map((item: any) => {
      const nextItem = componentData(item);
      if (item.isActive === null || item.isActive === undefined) {
        nextItem.isActive = true;
        missing += 1;
      }
      return nextItem;
    });
  }

  return { value: nextSection, missing };
}

export async function backfillMotorsportShowFieldDefaults(strapi: Core.Strapi) {
  const executionMode = mode();
  if (executionMode === "off") return;

  const report = {
    mode: executionMode,
    documents: 0,
    documentsWithMissingValues: 0,
    fieldsMissing: 0,
    updated: 0,
  };

  for (const [uid, componentDefinitions] of PAGE_DEFINITIONS) {
    const records = await documentService(strapi, uid).findMany({
      locale: "*",
      status: "draft",
      populate: "*",
      limit: 1_000,
    });

    for (const record of records) {
      report.documents += 1;
      const data: Record<string, unknown> = {};
      let missingInRecord = 0;

      for (const [fieldName, componentName] of componentDefinitions) {
        const component = record[fieldName];
        const missing = missingShowFields(
          component,
          PAGE_COMPONENTS[componentName],
        );
        if (!missing.length) continue;
        missingInRecord += missing.length;
        const nextComponent = componentData(component);
        for (const field of missing) nextComponent[field] = true;
        data[fieldName] = nextComponent;
      }

      if (
        uid === "api::motorsport-home-page.motorsport-home-page" &&
        (record.showPartnersOnHomepage === null ||
          record.showPartnersOnHomepage === undefined)
      ) {
        data.showPartnersOnHomepage = true;
        missingInRecord += 1;
      }

      if (!missingInRecord) continue;
      report.documentsWithMissingValues += 1;
      report.fieldsMissing += missingInRecord;

      if (executionMode === "apply") {
        await documentService(strapi, uid).update({
          documentId: record.documentId,
          locale: record.locale || "en",
          status: "draft",
          data,
        });
        report.updated += 1;
      }
    }
  }

  const programRecords = await documentService(strapi, PROGRAM_UID).findMany({
    locale: "*",
    status: "draft",
    populate: "*",
    limit: 1_000,
  });

  for (const record of programRecords) {
    const data: Record<string, unknown> = {};
    let missingInRecord = 0;

    if (Array.isArray(record.presentationSections)) {
      const nextSections = record.presentationSections.map((section: any) => {
        const result = backfillProgramSectionDefaults(section);
        missingInRecord += result.missing;
        return result.value;
      });
      if (missingInRecord) data.presentationSections = nextSections;
    }

    for (const fieldName of ["rundown"] as const) {
      const components = record[fieldName];
      if (!Array.isArray(components)) continue;
      const nextComponents = components.map((component: any) => {
        const nextComponent = componentData(component);
        if (component.isActive === null || component.isActive === undefined) {
          nextComponent.isActive = true;
          missingInRecord += 1;
        }
        return nextComponent;
      });
      if (
        nextComponents.some(
          (component: any, index: number) =>
            component.isActive !== components[index].isActive,
        )
      ) {
        data[fieldName] = nextComponents;
      }
    }

    report.documents += 1;
    if (!missingInRecord) continue;
    report.documentsWithMissingValues += 1;
    report.fieldsMissing += missingInRecord;

    if (executionMode === "apply") {
      await documentService(strapi, PROGRAM_UID).update({
        documentId: record.documentId,
        locale: record.locale || "en",
        status: "draft",
        data,
      });
      report.updated += 1;
    }
  }

  strapi.log.info(`[motorsport-show-field-defaults] ${JSON.stringify(report)}`);

  if (executionMode === "verify" && report.fieldsMissing > 0) {
    throw new Error(
      `[motorsport-show-field-defaults] verification failed: ${report.fieldsMissing} missing values remain`,
    );
  }
}
