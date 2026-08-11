import assert from "node:assert/strict";

const baseUrl = process.env.CMS_UAT_BASE_URL ?? "http://localhost:1337";
const password = required("CMS_UAT_PASSWORD");
const navigationUid = "api::top-navigation-item.top-navigation-item";
const navigationPath = `/content-manager/collection-types/${navigationUid}`;

const siteRoles = [
  {
    scope: "gateway",
    email: required("CMS_UAT_GATEWAY_EMAIL"),
  },
  {
    scope: "motorsport",
    email: required("CMS_UAT_MOTORSPORT_EMAIL"),
  },
  {
    scope: "horsesport",
    email: required("CMS_UAT_HORSESPORT_EMAIL"),
  },
];
const sharedRole = {
  scope: "shared",
  email: required("CMS_UAT_SHARED_EMAIL"),
};
const superAdmin = {
  email: required("CMS_UAT_SUPERADMIN_EMAIL"),
};

const tokens = new Map();
const createdDocuments = [];
const results = [];

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

function query(params) {
  return `?${new URLSearchParams(params).toString()}`;
}

async function request(path, { token, method = "GET", body } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      accept: "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: response.status, data };
}

async function login(email) {
  const response = await request("/admin/login", {
    method: "POST",
    body: { email, password },
  });
  assert.equal(response.status, 200, `Login failed for ${email}`);
  assert.ok(response.data?.data?.token, `No token returned for ${email}`);
  return response.data.data.token;
}

function responseDocument(response, message) {
  assert.ok(
    response.status >= 200 && response.status < 300,
    `${message}: HTTP ${response.status} ${JSON.stringify(response.data)}`,
  );
  const document = response.data?.data ?? response.data;
  assert.ok(document?.documentId, `${message}: no documentId returned`);
  return document;
}

async function permissionsFor(token) {
  const response = await request("/admin/users/me/permissions", { token });
  assert.equal(response.status, 200);
  return response.data?.data ?? response.data ?? [];
}

async function validateSiteRole(role) {
  const token = await login(role.email);
  tokens.set(role.scope, token);
  const permissions = await permissionsFor(token);
  const actions = permissions.map((permission) => permission.action);
  assert.ok(actions.includes("plugin::i18n.locale.read"));
  assert.equal(
    actions.some((action) =>
      [
        "plugin::i18n.locale.create",
        "plugin::i18n.locale.update",
        "plugin::i18n.locale.delete",
      ].includes(action),
    ),
    false,
  );

  for (const locale of ["en", "id"]) {
    const list = await request(
      `${navigationPath}${query({ locale, page: "1", pageSize: "100" })}`,
      { token },
    );
    assert.equal(list.status, 200);
    assert.ok(
      (list.data?.results ?? []).every(
        (entry) =>
          entry.internalName?.startsWith(`${role.scope}-`) &&
          entry.locale === locale,
      ),
      `${role.scope} saw foreign Top Navigation content in ${locale}`,
    );
  }

  const forbiddenLocale = await request("/i18n/locales", {
    token,
    method: "POST",
    body: { name: "Forbidden UAT locale", code: "xx-uat" },
  });
  assert.ok(
    [401, 403].includes(forbiddenLocale.status),
    `${role.scope} unexpectedly administered locales`,
  );

  const internalName = `gwr-cms5-uat-${role.scope}`;
  const englishPayload = {
    locale: "en",
    internalName,
    siteScope: role.scope === "motorsport" ? "gateway" : "motorsport",
    label: `UAT ${role.scope}`,
    ariaLabel: `UAT ${role.scope}`,
    href: "/gwr-cms5-uat",
    linkType: "internal",
    enabled: false,
    displayOrder: 900,
    emphasis: "default",
    openInNewTab: false,
  };
  const english = responseDocument(
    await request(navigationPath, {
      token,
      method: "POST",
      body: englishPayload,
    }),
    `${role.scope} English create`,
  );
  createdDocuments.push(english.documentId);
  const superToken = tokens.get("superadmin");
  const superView = responseDocument(
    await request(
      `${navigationPath}/${english.documentId}${query({ locale: "en" })}`,
      { token: superToken },
    ),
    `${role.scope} Super Admin scope verification`,
  );
  assert.equal(superView.siteScope, role.scope);

  const indonesianPayload = {
    ...englishPayload,
    locale: "id",
    siteScope: role.scope,
    label: `Uji ${role.scope}`,
    ariaLabel: `Uji ${role.scope}`,
  };
  const indonesian = responseDocument(
    await request(`${navigationPath}/${english.documentId}`, {
      token,
      method: "PUT",
      body: indonesianPayload,
    }),
    `${role.scope} Indonesian localization`,
  );
  assert.equal(indonesian.locale, "id");
  assert.equal(indonesian.href, english.href);

  const parityViolation = await request(
    `${navigationPath}/${english.documentId}`,
    {
      token,
      method: "PUT",
      body: {
        ...indonesianPayload,
        href: "/forbidden-indonesian-structure",
      },
    },
  );
  assert.equal(parityViolation.status, 400);

  const unsafeUrl = await request(`${navigationPath}/${english.documentId}`, {
    token,
    method: "PUT",
    body: {
      ...englishPayload,
      href: "javascript:alert(1)",
      linkType: "external",
    },
  });
  assert.equal(unsafeUrl.status, 400);

  results.push({
    role: role.scope,
    locales: "en,id",
    scopeForced: true,
    localeAdministrationDenied: true,
    structuralParityEnforced: true,
    unsafeUrlRejected: true,
  });
}

async function validateSharedRole() {
  const token = await login(sharedRole.email);
  tokens.set(sharedRole.scope, token);
  const permissions = await permissionsFor(token);
  const actions = permissions.map((permission) => permission.action);
  assert.ok(actions.includes("plugin::i18n.locale.read"));
  assert.equal(
    permissions.some((permission) => permission.subject === navigationUid),
    false,
  );
  const list = await request(
    `${navigationPath}${query({ locale: "en", page: "1", pageSize: "10" })}`,
    { token },
  );
  assert.ok([401, 403].includes(list.status));
  results.push({
    role: sharedRole.scope,
    localeReadOnly: true,
    topNavigationDenied: true,
  });
}

async function validateCrossSiteDirectAccess() {
  for (const role of siteRoles) {
    const token = tokens.get(role.scope);
    const foreignDocumentId = createdDocuments.find(
      (documentId, index) => siteRoles[index]?.scope !== role.scope,
    );
    const response = await request(
      `${navigationPath}/${foreignDocumentId}${query({ locale: "en" })}`,
      { token },
    );
    assert.ok(
      [401, 403, 404].includes(response.status),
      `${role.scope} directly accessed foreign Top Navigation content`,
    );
  }
}

async function validateSuperAdmin() {
  const token = await login(superAdmin.email);
  tokens.set("superadmin", token);
  const permissions = await permissionsFor(token);
  const actions = permissions.map((permission) => permission.action);
  for (const action of [
    "plugin::i18n.locale.create",
    "plugin::i18n.locale.read",
    "plugin::i18n.locale.update",
    "plugin::i18n.locale.delete",
  ]) {
    assert.ok(actions.includes(action), `Super Admin lacks ${action}`);
  }
  results.push({
    role: "superadmin",
    localeAdministration: true,
    allNavigationScopes: true,
  });
}

async function cleanup() {
  const token = tokens.get("superadmin");
  if (!token) return;
  for (const documentId of createdDocuments) {
    for (const locale of ["id", "en"]) {
      await request(`${navigationPath}/${documentId}${query({ locale })}`, {
        token,
        method: "DELETE",
      });
    }
  }
}

let passed = false;
try {
  await validateSuperAdmin();
  for (const role of siteRoles) await validateSiteRole(role);
  await validateSharedRole();
  await validateCrossSiteDirectAccess();
  passed = true;
  console.table(results);
  console.log("i18n and Top Navigation authenticated UAT passed.");
} finally {
  await cleanup();
  if (!passed) process.exitCode = 1;
}
