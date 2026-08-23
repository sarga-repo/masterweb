import type { Core } from "@strapi/strapi";

const CONTENT_MANAGER_STORE = {
  type: "plugin" as const,
  name: "content_manager",
};

type LayoutField = { name: string; size: number };
type LayoutRow = LayoutField[];
type Layout = LayoutRow[];
type MigrationMode = "off" | "dry-run" | "apply" | "verify";

type ContentManagerConfiguration = {
  layouts?: { edit?: unknown; [key: string]: unknown };
  [key: string]: unknown;
};

type ContentManagerStore = {
  get: (params: { key: string }) => Promise<unknown>;
  set: (params: { key: string; value: unknown }) => Promise<void>;
};

const COMPONENT_LAYOUTS: Record<string, Layout> = {
  "motorsport.about-capabilities": [
    [
      { name: "enabled", size: 4 },
      { name: "eyebrow", size: 6 },
    ],
    [
      { name: "title", size: 6 },
      { name: "description", size: 6 },
    ],
    [{ name: "cards", size: 12 }],
    [
      { name: "showIndex", size: 4 },
      { name: "indexLabel", size: 6 },
    ],
    [
      { name: "showEyebrow", size: 4 },
      { name: "showTitle", size: 4 },
      { name: "showDescription", size: 4 },
    ],
  ],
  "motorsport.about-capability-card": [
    [
      { name: "internalName", size: 6 },
      { name: "enabled", size: 4 },
    ],
    [
      { name: "title", size: 6 },
      { name: "description", size: 6 },
    ],
    [
      { name: "sortOrder", size: 4 },
      { name: "accent", size: 6 },
    ],
    [{ name: "indexLabel", size: 6 }],
  ],
  "motorsport.campaign-slide": [
    [
      { name: "title", size: 6 },
      { name: "description", size: 6 },
    ],
    [
      { name: "image", size: 6 },
      { name: "ctaLabel", size: 6 },
    ],
    [
      { name: "ctaUrl", size: 6 },
      { name: "sortOrder", size: 4 },
    ],
  ],
  "motorsport.detail-presentation": [
    [{ name: "hero", size: 12 }],
    [{ name: "informationBand", size: 12 }],
    [{ name: "routeKey", size: 6 }],
  ],
  "motorsport.discipline-card": [
    [
      { name: "internalName", size: 6 },
      { name: "enabled", size: 4 },
    ],
    [
      { name: "title", size: 6 },
      { name: "shortLabel", size: 6 },
    ],
    [
      { name: "image", size: 6 },
      { name: "imageAlt", size: 6 },
    ],
    [
      { name: "href", size: 6 },
      { name: "accent", size: 6 },
    ],
    [{ name: "sortOrder", size: 4 }],
  ],
  "motorsport.hero-slide": [
    [
      { name: "internalName", size: 6 },
      { name: "eyebrow", size: 6 },
    ],
    [
      { name: "title", size: 6 },
      { name: "description", size: 6 },
    ],
    [
      { name: "image", size: 6 },
      { name: "mobileImage", size: 6 },
    ],
    [{ name: "video", size: 12 }],
    [
      { name: "imageAlt", size: 6 },
      { name: "subjectAnchor", size: 6 },
    ],
    [
      { name: "ctaLabel", size: 6 },
      { name: "ctaUrl", size: 6 },
    ],
    [
      { name: "isActive", size: 4 },
      { name: "sortOrder", size: 4 },
    ],
  ],
  "motorsport.home-information-band": [
    [
      { name: "enabled", size: 4 },
      { name: "eyebrow", size: 6 },
    ],
    [
      { name: "title", size: 6 },
      { name: "description", size: 6 },
    ],
    [
      { name: "nextEventLabel", size: 6 },
      { name: "ticketStatusLabel", size: 6 },
    ],
    [
      { name: "regionLabel", size: 6 },
      { name: "regionValue", size: 6 },
    ],
  ],
  "motorsport.home-ticket-section": [
    [
      { name: "isActive", size: 4 },
      { name: "eyebrow", size: 6 },
    ],
    [
      { name: "title", size: 6 },
      { name: "description", size: 6 },
    ],
    [
      { name: "backgroundImage", size: 6 },
      { name: "eventLabel", size: 6 },
    ],
    [
      { name: "eventText", size: 6 },
      { name: "providerLabel", size: 6 },
    ],
    [
      { name: "providerText", size: 6 },
      { name: "partnerLabel", size: 6 },
    ],
    [
      { name: "footerText", size: 6 },
      { name: "ctaLabel", size: 6 },
    ],
    [
      { name: "ctaUrl", size: 6 },
      { name: "backgroundImageMobile", size: 6 },
    ],
  ],
  "motorsport.information-band-metric": [
    [
      { name: "isActive", size: 4 },
      { name: "label", size: 6 },
    ],
    [{ name: "value", size: 6 }],
  ],
  "motorsport.page-hero": [
    [
      { name: "isActive", size: 4 },
      { name: "eyebrow", size: 6 },
    ],
    [{ name: "title", size: 6 }],
    [{ name: "description", size: 12 }],
    [
      { name: "backgroundMedia", size: 6 },
      { name: "mobileBackgroundMedia", size: 6 },
    ],
    [
      { name: "backgroundAlt", size: 6 },
      { name: "showMetricGroup", size: 4 },
    ],
    [{ name: "metrics", size: 12 }],
    [
      { name: "showEyebrow", size: 4 },
      { name: "showTitle", size: 4 },
      { name: "showDescription", size: 4 },
    ],
    [{ name: "showMedia", size: 4 }],
  ],
  "motorsport.page-information-band": [
    [{ name: "isActive", size: 4 }],
    [{ name: "metrics", size: 12 }],
    [
      { name: "showEyebrow", size: 4 },
      { name: "showTitle", size: 4 },
      { name: "showDescription", size: 4 },
    ],
    [
      { name: "eyebrow", size: 6 },
      { name: "title", size: 6 },
    ],
    [{ name: "description", size: 12 }],
    [{ name: "showMetricGroup", size: 4 }],
  ],
  "motorsport.page-section": [
    [
      { name: "isActive", size: 4 },
      { name: "showIndex", size: 4 },
      { name: "showEyebrow", size: 4 },
    ],
    [
      { name: "showTitle", size: 4 },
      { name: "showBody", size: 4 },
      { name: "showMedia", size: 4 },
    ],
    [
      { name: "showCta", size: 4 },
      { name: "indexLabel", size: 6 },
    ],
    [
      { name: "eyebrow", size: 6 },
      { name: "title", size: 6 },
    ],
    [{ name: "body", size: 12 }],
    [
      { name: "media", size: 6 },
      { name: "ctaLabel", size: 6 },
    ],
    [
      { name: "ctaUrl", size: 6 },
      { name: "ctaTarget", size: 6 },
    ],
    [
      { name: "theme", size: 6 },
      { name: "supportLabel", size: 6 },
    ],
    [{ name: "supportBody", size: 12 }],
    [
      { name: "legalText", size: 6 },
      { name: "secondaryCtaLabel", size: 6 },
    ],
    [
      { name: "secondaryCtaUrl", size: 6 },
      { name: "secondaryCtaTarget", size: 6 },
    ],
    [{ name: "items", size: 12 }],
  ],
  "motorsport.page-section-item": [
    [
      { name: "isActive", size: 4 },
      { name: "sortOrder", size: 4 },
      { name: "accent", size: 4 },
    ],
    [
      { name: "label", size: 6 },
      { name: "title", size: 6 },
    ],
    [{ name: "description", size: 12 }],
    [
      { name: "media", size: 6 },
      { name: "mediaAlt", size: 6 },
    ],
    [
      { name: "hrefLabel", size: 6 },
      { name: "href", size: 6 },
    ],
  ],
  "motorsport.rule-item": [
    [
      { name: "ruleType", size: 6 },
      { name: "title", size: 6 },
    ],
    [
      { name: "description", size: 6 },
      { name: "sortOrder", size: 4 },
    ],
  ],
  "motorsport.rundown-item": [
    [
      { name: "dayLabel", size: 6 },
      { name: "dateLabel", size: 6 },
    ],
    [
      { name: "venue", size: 6 },
      { name: "status", size: 6 },
    ],
    [
      { name: "startTime", size: 4 },
      { name: "endTime", size: 4 },
    ],
    [
      { name: "title", size: 6 },
      { name: "description", size: 6 },
    ],
    [{ name: "sortOrder", size: 4 }],
  ],
  "motorsport.world-of-motorsport": [
    [
      { name: "enabled", size: 4 },
      { name: "eyebrow", size: 6 },
    ],
    [
      { name: "titlePrefix", size: 6 },
      { name: "titleAccent", size: 6 },
    ],
    [
      { name: "description", size: 6 },
      { name: "ctaLabel", size: 6 },
    ],
    [{ name: "ctaUrl", size: 6 }],
    [{ name: "disciplines", size: 12 }],
  ],
};

function migrationMode(): MigrationMode {
  const value = process.env.MOTORSPORT_CONTENT_MANAGER_LAYOUT_MODE ?? "off";
  return ["off", "dry-run", "apply", "verify"].includes(value)
    ? (value as MigrationMode)
    : "off";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function layoutSignature(layout: unknown): string {
  if (!Array.isArray(layout)) return "";
  return JSON.stringify(
    layout.map((row) =>
      Array.isArray(row)
        ? row.map((field) =>
            isObject(field)
              ? { name: String(field.name), size: Number(field.size) }
              : null,
          )
        : null,
    ),
  );
}

function hasSameLayout(current: unknown, expected: Layout): boolean {
  return layoutSignature(current) === layoutSignature(expected);
}

function preserveExistingFields(current: unknown, expected: Layout): Layout {
  const existing = new Map<string, Record<string, unknown>>();
  if (Array.isArray(current)) {
    for (const row of current) {
      if (!Array.isArray(row)) continue;
      for (const field of row) {
        if (isObject(field) && typeof field.name === "string") {
          existing.set(field.name, field);
        }
      }
    }
  }

  const result = expected.map((row) =>
    row.map((field) => ({
      ...(existing.get(field.name) ?? {}),
      name: field.name,
      size: field.size,
    })),
  );
  const known = new Set(expected.flat().map((field) => field.name));
  const unknown = [...existing.entries()].filter(([name]) => !known.has(name));

  // Do not silently remove a field introduced by a newer schema. Keep it at
  // the end until the canonical layout is deliberately extended.
  for (const [name, field] of unknown) {
    result.push([{ ...field, name, size: Number(field.size) || 12 }]);
  }
  return result;
}

export async function migrateMotorsportContentManagerLayouts(
  strapi: Core.Strapi,
) {
  const executionMode = migrationMode();
  if (executionMode === "off") return;

  const store = strapi.store(
    CONTENT_MANAGER_STORE,
  ) as unknown as ContentManagerStore;
  const report = {
    mode: executionMode,
    checked: 0,
    changed: 0,
    missing: 0,
    changedKeys: [] as string[],
  };

  for (const [component, expected] of Object.entries(COMPONENT_LAYOUTS)) {
    const key = `configuration_components::${component}`;
    const raw = await store.get({ key });
    report.checked += 1;
    if (!isObject(raw)) {
      report.missing += 1;
      continue;
    }

    const current = raw as ContentManagerConfiguration;
    const editLayout = current.layouts?.edit;
    const repairedLayout = preserveExistingFields(editLayout, expected);
    if (hasSameLayout(editLayout, repairedLayout)) continue;

    report.changed += 1;
    report.changedKeys.push(key);
    if (executionMode === "apply") {
      await store.set({
        key,
        value: {
          ...current,
          layouts: {
            ...(isObject(current.layouts) ? current.layouts : {}),
            edit: repairedLayout,
          },
        },
      });
      strapi.log.info(`[motorsport-cm-layout] repaired ${key}`);
    }
  }

  strapi.log.info(`[motorsport-cm-layout] ${JSON.stringify(report)}`);
  if (executionMode === "verify" && (report.changed > 0 || report.missing > 0)) {
    throw new Error(
      `[motorsport-cm-layout] verification failed: ${JSON.stringify(report)}`,
    );
  }
}
