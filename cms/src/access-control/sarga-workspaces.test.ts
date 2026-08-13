import assert from "node:assert/strict";
import test from "node:test";
import type { Core } from "@strapi/strapi";

import {
  WORKSPACE_ROLES,
  buildRolePermissions,
  getManagedReadableFields,
  getManagedWritableFields,
} from "./sarga-workspaces.ts";

function createStrapiFixture(): Core.Strapi {
  const managedSubjects = new Set(
    WORKSPACE_ROLES.flatMap((role) => [
      ...role.subjects,
      ...(role.unscopedSubjects ?? []),
      ...(role.readOnlyReferences ?? []).map((reference) => reference.subject),
      ...(role.editableReferences ?? []).map((reference) => reference.subject),
    ]),
  );

  return {
    contentTypes: Object.fromEntries(
      [...managedSubjects].map((subject) => [
        subject,
        {
          attributes: {
            title: { type: "string" },
            siteScope: { type: "enumeration", required: true },
            locale: { type: "string", visible: false },
            localizations: { type: "relation", writable: false },
            internalNotes: { type: "text", private: true },
            seo: { type: "component", component: "shared.seo" },
            blocks: {
              type: "dynamiczone",
              components: ["shared.callout"],
            },
            heroVideo: {
              type: "component",
              component: "shared.hero-video",
            },
            motorsportFeaturedEvent: {
              type: "relation",
              relation: "manyToOne",
              target: "api::event.event",
            },
            motorsportInformationBand: {
              type: "component",
              component: "motorsport.home-information-band",
            },
            motorsportWorldSection: {
              type: "component",
              component: "motorsport.world-of-motorsport",
            },
          },
        },
      ]),
    ),
    components: {
      "shared.seo": {
        attributes: {
          metaTitle: { type: "string" },
          metaDescription: { type: "text" },
        },
      },
      "shared.callout": {
        attributes: {
          title: { type: "string" },
          body: { type: "text" },
        },
      },
      "shared.hero-video": {
        attributes: {
          enabled: { type: "boolean" },
          primaryVideo: { type: "media", allowedTypes: ["videos"] },
          alternateVideo: { type: "media", allowedTypes: ["videos"] },
          posterImage: { type: "media", allowedTypes: ["images"] },
        },
      },
      "motorsport.home-information-band": {
        attributes: {
          enabled: { type: "boolean" },
          eyebrow: { type: "string" },
          title: { type: "string" },
        },
      },
      "motorsport.world-of-motorsport": {
        attributes: {
          enabled: { type: "boolean" },
          titlePrefix: { type: "string" },
          disciplines: {
            type: "component",
            repeatable: true,
            component: "motorsport.discipline-card",
          },
        },
      },
      "motorsport.discipline-card": {
        attributes: {
          internalName: { type: "string" },
          title: { type: "string" },
          image: { type: "media", allowedTypes: ["images"] },
        },
      },
    },
  } as unknown as Core.Strapi;
}

test("managed writable fields omit siteScope", () => {
  const strapi = createStrapiFixture();
  const fields = getManagedWritableFields(
    strapi,
    "api::news-article.news-article",
  );

  assert.deepEqual(fields, [
    "title",
    "seo",
    "seo.metaTitle",
    "seo.metaDescription",
    "blocks",
    "blocks.title",
    "blocks.body",
    "heroVideo",
    "heroVideo.enabled",
    "heroVideo.primaryVideo",
    "heroVideo.alternateVideo",
    "heroVideo.posterImage",
    "motorsportFeaturedEvent",
    "motorsportInformationBand",
    "motorsportInformationBand.enabled",
    "motorsportInformationBand.eyebrow",
    "motorsportInformationBand.title",
    "motorsportWorldSection",
    "motorsportWorldSection.enabled",
    "motorsportWorldSection.titlePrefix",
    "motorsportWorldSection.disciplines",
    "motorsportWorldSection.disciplines.internalName",
    "motorsportWorldSection.disciplines.title",
    "motorsportWorldSection.disciplines.image",
  ]);
});

test("managed roles receive nested hero-video fields without writable scope", () => {
  const fields = getManagedWritableFields(
    createStrapiFixture(),
    "api::site-page.site-page",
  );

  assert.ok(fields.includes("heroVideo.primaryVideo"));
  assert.ok(fields.includes("heroVideo.alternateVideo"));
  assert.ok(fields.includes("heroVideo.posterImage"));
  assert.ok(fields.includes("motorsportFeaturedEvent"));
  assert.ok(fields.includes("motorsportWorldSection.disciplines.internalName"));
  assert.ok(fields.includes("motorsportWorldSection.disciplines.image"));
  assert.equal(fields.includes("siteScope"), false);
});

test("managed readable fields include required siteScope", () => {
  const strapi = createStrapiFixture();
  const fields = getManagedReadableFields(
    strapi,
    "api::news-article.news-article",
  );

  assert.ok(fields.includes("title"));
  assert.ok(fields.includes("siteScope"));
  assert.equal(fields.includes("locale"), false);
  assert.equal(fields.includes("localizations"), false);
  assert.equal(fields.includes("internalNotes"), false);
});

test("managed read permissions expose siteScope while create and update keep it immutable", () => {
  const strapi = createStrapiFixture();

  for (const role of WORKSPACE_ROLES) {
    const permissions = buildRolePermissions(strapi, role);
    for (const subject of role.subjects) {
      const fieldPermissions = permissions.filter(
        (permission) =>
          permission.subject === subject &&
          [
            "plugin::content-manager.explorer.create",
            "plugin::content-manager.explorer.read",
            "plugin::content-manager.explorer.update",
          ].includes(permission.action),
      );

      assert.equal(fieldPermissions.length, 3);

      for (const permission of fieldPermissions) {
        assert.ok(permission.properties?.fields?.includes("title"));
        assert.equal(
          permission.properties?.fields?.includes("siteScope"),
          permission.action === "plugin::content-manager.explorer.read",
        );
        assert.equal(permission.properties?.fields?.includes("locale"), false);
        assert.equal(
          permission.properties?.fields?.includes("localizations"),
          false,
        );
        assert.equal(
          permission.properties?.fields?.includes("internalNotes"),
          false,
        );
        assert.deepEqual(permission.properties?.locales, ["en", "id"]);
      }
    }
  }
});

test("managed roles retain conditioned publish permission for every scoped subject", () => {
  const strapi = createStrapiFixture();

  for (const role of WORKSPACE_ROLES) {
    const permissions = buildRolePermissions(strapi, role);

    for (const subject of role.subjects) {
      const publishPermission = permissions.find(
        (permission) =>
          permission.subject === subject &&
          permission.action === "plugin::content-manager.explorer.publish",
      );

      assert.deepEqual(publishPermission, {
        action: "plugin::content-manager.explorer.publish",
        subject,
        conditions: [`admin::${role.conditionName}`],
        properties: { locales: ["en", "id"] },
      });
    }
  }
});

test("managed roles retain one workspace action and scoped record conditions", () => {
  const strapi = createStrapiFixture();

  for (const role of WORKSPACE_ROLES) {
    const permissions = buildRolePermissions(strapi, role);
    const workspacePermissions = permissions.filter(
      (permission) => permission.action === role.accessAction,
    );
    assert.equal(workspacePermissions.length, 1);

    const scopedReadPermissions = permissions.filter(
      (permission) =>
        permission.action === "plugin::content-manager.explorer.read" &&
        role.subjects.includes(permission.subject ?? ""),
    );
    assert.equal(scopedReadPermissions.length, role.subjects.length);
    assert.ok(
      scopedReadPermissions.every(
        (permission) =>
          permission.conditions?.[0] === `admin::${role.conditionName}`,
      ),
    );
  }
});

test("Leadership Person is scoped for every site workspace", () => {
  const strapi = createStrapiFixture();
  const subject = "api::leadership-person.leadership-person";

  for (const role of WORKSPACE_ROLES.filter((role) => role.scope !== "shared")) {
    assert.ok(role.subjects.includes(subject));
    const permissions = buildRolePermissions(strapi, role);
    const readPermission = permissions.find(
      (permission) =>
        permission.subject === subject &&
        permission.action === "plugin::content-manager.explorer.read",
    );
    const createPermission = permissions.find(
      (permission) =>
        permission.subject === subject &&
        permission.action === "plugin::content-manager.explorer.create",
    );

    assert.deepEqual(readPermission?.conditions, [
      `admin::${role.conditionName}`,
    ]);
    assert.equal(createPermission?.properties?.fields?.includes("siteScope"), false);
  }

  const sharedRole = WORKSPACE_ROLES.find((role) => role.scope === "shared");
  assert.ok(sharedRole?.subjects.includes(subject));
  assert.equal(sharedRole?.unscopedSubjects?.includes(subject), false);
});

test("dedicated roles expose only conditioned read-only reference records", () => {
  const strapi = createStrapiFixture();

  for (const role of WORKSPACE_ROLES) {
    const permissions = buildRolePermissions(strapi, role);

    for (const reference of role.readOnlyReferences ?? []) {
      const referencePermissions = permissions.filter(
        (permission) => permission.subject === reference.subject,
      );

      assert.deepEqual(referencePermissions, [
        {
          action: "plugin::content-manager.explorer.read",
          subject: reference.subject,
          conditions: [`admin::${reference.conditionName}`],
          properties: {
            fields: getManagedWritableFields(strapi, reference.subject),
            locales: ["en", "id"],
          },
        },
      ]);
    }
  }
});

test("Motorsport role can edit only its Site chrome record", () => {
  const strapi = createStrapiFixture();
  const role = WORKSPACE_ROLES.find((item) => item.scope === "motorsport");
  assert.ok(role);
  const permissions = buildRolePermissions(strapi, role);
  const sitePermissions = permissions.filter(
    (permission) => permission.subject === "api::site.site",
  );

  assert.deepEqual(
    sitePermissions.map((permission) => permission.action),
    [
      "plugin::content-manager.explorer.read",
      "plugin::content-manager.explorer.update",
      "plugin::content-manager.explorer.publish",
    ],
  );
  assert.equal(
    sitePermissions.some(
      (permission) => permission.conditions?.[0] ===
        "admin::sarga-workspaces-is-motorsport-site-editable",
    ),
    true,
  );
  assert.equal(
    permissions.some(
      (permission) =>
        permission.subject === "api::site.site" &&
        permission.action === "plugin::content-manager.explorer.delete",
    ),
    false,
  );
});

test("managed roles can read locale choices but cannot administer locales", () => {
  const strapi = createStrapiFixture();

  for (const role of WORKSPACE_ROLES) {
    const permissions = buildRolePermissions(strapi, role);
    assert.equal(
      permissions.filter(
        (permission) => permission.action === "plugin::i18n.locale.read",
      ).length,
      1,
    );
    assert.equal(
      permissions.some((permission) =>
        [
          "plugin::i18n.locale.create",
          "plugin::i18n.locale.update",
          "plugin::i18n.locale.delete",
        ].includes(permission.action),
      ),
      false,
    );
  }
});

test("unscoped shared collections retain explicit readable field permissions", () => {
  const strapi = createStrapiFixture();

  for (const role of WORKSPACE_ROLES) {
    const permissions = buildRolePermissions(strapi, role);

    for (const subject of role.unscopedSubjects ?? []) {
      const readPermission = permissions.find(
        (permission) =>
          permission.subject === subject &&
          permission.action === "plugin::content-manager.explorer.read",
      );

      assert.ok(readPermission?.properties?.fields?.includes("title"));
      assert.equal(
        readPermission?.properties?.fields?.includes("siteScope"),
        true,
      );
    }
  }
});

test("unknown subjects fail closed", () => {
  const strapi = createStrapiFixture();

  assert.throws(
    () => getManagedWritableFields(strapi, "api::missing.missing"),
    /unknown content type/,
  );
});
