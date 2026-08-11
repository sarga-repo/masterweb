import assert from "node:assert/strict";

const baseUrl = process.env.CMS_UAT_BASE_URL ?? "http://localhost:1337";
const password = required("CMS_UAT_PASSWORD");
const contentType = "api::news-article.news-article";
const collectionPath = `/content-manager/collection-types/${contentType}`;

const managedRoles = [
  {
    scope: "gateway",
    email: required("CMS_UAT_GATEWAY_EMAIL"),
    workspaceAction: "admin::sarga-workspaces.access-gateway",
  },
  {
    scope: "motorsport",
    email: required("CMS_UAT_MOTORSPORT_EMAIL"),
    workspaceAction: "admin::sarga-workspaces.access-motorsport",
  },
  {
    scope: "horsesport",
    email: required("CMS_UAT_HORSESPORT_EMAIL"),
    workspaceAction: "admin::sarga-workspaces.access-horsesport",
  },
  {
    scope: "shared",
    email: required("CMS_UAT_SHARED_EMAIL"),
    workspaceAction: "admin::sarga-workspaces.access-shared",
  },
];

const superAdmin = {
  email: required("CMS_UAT_SUPERADMIN_EMAIL"),
};

const sessions = new Map();
const documents = new Map();
const results = [];

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
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

function alternateScope(scope) {
  return scope === "motorsport" ? "gateway" : "motorsport";
}

function query(params) {
  return `?${new URLSearchParams(params).toString()}`;
}

function documentFrom(response, message) {
  assert.ok(
    response.status >= 200 && response.status < 300,
    `${message}: HTTP ${response.status}`,
  );
  assert.ok(
    response.data?.data?.documentId,
    `${message}: no document returned`,
  );
  return response.data.data;
}

async function assertRelationBoundary(role, token, field, targetUid) {
  const direct = await request(
    `/content-manager/collection-types/${targetUid}${query({ page: "1", pageSize: "100" })}`,
    { token },
  );
  const relation = await request(
    `/content-manager/relations/${contentType}/${field}${query({ id: "", page: "1", pageSize: "100", _q: "" })}`,
    { token },
  );

  const allowedIds = new Set(
    direct.status === 200
      ? (direct.data?.results ?? []).map(
          (entry) => entry.documentId ?? entry.id,
        )
      : [],
  );
  const relationEntries =
    relation.status === 200 ? (relation.data?.results ?? []) : [];

  assert.ok(
    relation.status === 200 || [401, 403, 404].includes(relation.status),
    `${role.scope} ${field} relation returned HTTP ${relation.status}`,
  );
  assert.ok(
    relationEntries.every((entry) =>
      allowedIds.has(entry.documentId ?? entry.id),
    ),
    `${role.scope} ${field} relation exposed an unauthorized record`,
  );
}

async function assertReferenceBoundary(role, token, targetUid, expectedSlug) {
  const response = await request(
    `/content-manager/collection-types/${targetUid}${query({ page: "1", pageSize: "100" })}`,
    { token },
  );
  assert.equal(response.status, 200);
  const slugs = (response.data?.results ?? []).map((entry) => entry.slug);
  assert.deepEqual([...new Set(slugs)], [expectedSlug]);
}

async function validateManagedRole(role) {
  const token = await login(role.email);
  sessions.set(role.scope, token);

  const permissions = await request("/admin/users/me/permissions", { token });
  assert.equal(permissions.status, 200);
  const actions = (permissions.data?.data ?? permissions.data ?? []).map(
    (permission) => permission.action,
  );
  const visibleWorkspaceActions = actions.filter((action) =>
    action.startsWith("admin::sarga-workspaces.access-"),
  );
  assert.deepEqual(visibleWorkspaceActions, [role.workspaceAction]);
  assert.ok(
    actions.includes("plugin::upload.read"),
    `${role.scope} role cannot browse existing Media Library assets`,
  );
  assert.ok(
    actions.includes("plugin::upload.assets.create"),
    `${role.scope} role cannot upload a new Media Library asset`,
  );

  const mediaLibrary = await request(
    `/upload/files${query({ page: "1", pageSize: "10", sort: "createdAt:DESC" })}`,
    { token },
  );
  assert.equal(
    mediaLibrary.status,
    200,
    `${role.scope} role cannot list existing Media Library assets`,
  );

  const list = await request(
    `${collectionPath}${query({ page: "1", pageSize: "100" })}`,
    { token },
  );
  assert.equal(list.status, 200);
  const superToken = sessions.get("superadmin");
  const allowedList = await request(
    `${collectionPath}${query({
      page: "1",
      pageSize: "100",
      "filters[siteScope][$eq]": role.scope,
    })}`,
    { token: superToken },
  );
  assert.equal(allowedList.status, 200);
  const allowedDocumentIds = new Set(
    (allowedList.data?.results ?? []).map((entry) => entry.documentId),
  );
  assert.ok(
    (list.data?.results ?? []).every((entry) =>
      allowedDocumentIds.has(entry.documentId),
    ),
    `${role.scope} list returned a foreign scope`,
  );

  const tamperedList = await request(
    `${collectionPath}${query({
      page: "1",
      pageSize: "100",
      "filters[siteScope][$eq]": alternateScope(role.scope),
    })}`,
    { token },
  );
  assert.equal(tamperedList.status, 200);
  assert.ok(
    (tamperedList.data?.results ?? []).every((entry) =>
      allowedDocumentIds.has(entry.documentId),
    ),
    `${role.scope} tampered filter returned a foreign scope`,
  );

  await assertRelationBoundary(role, token, "relatedEvent", "api::event.event");
  await assertRelationBoundary(
    role,
    token,
    "relatedGallery",
    "api::media-gallery.media-gallery",
  );
  await assertRelationBoundary(
    role,
    token,
    "relatedBusinesses",
    "api::ecosystem-business.ecosystem-business",
  );
  if (role.scope !== "shared") {
    const siteSlug =
      role.scope === "horsesport" ? "sarga-horse-sport" : `sarga-${role.scope}`;
    await assertReferenceBoundary(role, token, "api::site.site", siteSlug);
  }

  const slug = `codex-uat-rbac-${role.scope}`;
  const payload = {
    title: `Codex UAT ${role.scope}`,
    slug,
    excerpt: "Temporary workspace RBAC validation record.",
    category: "news",
    publishedDate: "2026-08-11",
    siteScope: alternateScope(role.scope),
    seo: { metaTitle: `Nested field ${role.scope}` },
  };

  const created = documentFrom(
    await request(collectionPath, { token, method: "POST", body: payload }),
    `${role.scope} create`,
  );
  const createdAsSuperAdmin = documentFrom(
    await request(`${collectionPath}/${created.documentId}`, {
      token: superToken,
    }),
    `${role.scope} create scope verification`,
  );
  assert.equal(createdAsSuperAdmin.siteScope, role.scope);
  assert.equal(created.seo?.metaTitle, payload.seo.metaTitle);

  const updated = documentFrom(
    await request(`${collectionPath}/${created.documentId}`, {
      token,
      method: "PUT",
      body: {
        ...payload,
        title: `${payload.title} updated`,
        siteScope: alternateScope(role.scope),
      },
    }),
    `${role.scope} update`,
  );
  const updatedAsSuperAdmin = documentFrom(
    await request(`${collectionPath}/${updated.documentId}`, {
      token: superToken,
    }),
    `${role.scope} update scope verification`,
  );
  assert.equal(updatedAsSuperAdmin.siteScope, role.scope);

  const clone = documentFrom(
    await request(`${collectionPath}/clone/${created.documentId}`, {
      token,
      method: "POST",
      body: {
        ...payload,
        title: `${payload.title} clone`,
        slug: `${slug}-clone`,
        siteScope: alternateScope(role.scope),
      },
    }),
    `${role.scope} clone`,
  );
  const cloneAsSuperAdmin = documentFrom(
    await request(`${collectionPath}/${clone.documentId}`, {
      token: superToken,
    }),
    `${role.scope} clone scope verification`,
  );
  assert.equal(cloneAsSuperAdmin.siteScope, role.scope);

  const published = documentFrom(
    await request(`${collectionPath}/${created.documentId}/actions/publish`, {
      token,
      method: "POST",
      body: updated,
    }),
    `${role.scope} publish`,
  );
  assert.ok(published.publishedAt, `${role.scope} record was not published`);

  const unpublishResponse = await request(
    `${collectionPath}/${created.documentId}/actions/unpublish`,
    {
      token,
      method: "POST",
      body: { discardDraft: false },
    },
  );
  assert.ok(
    unpublishResponse.status >= 200 && unpublishResponse.status < 300,
    `${role.scope} unpublish: HTTP ${unpublishResponse.status}`,
  );
  const publishedAfterUnpublish = await request(
    `${collectionPath}${query({
      page: "1",
      pageSize: "10",
      status: "published",
      "filters[slug][$eq]": slug,
    })}`,
    { token },
  );
  assert.equal(publishedAfterUnpublish.status, 200);
  assert.equal(publishedAfterUnpublish.data?.results?.length ?? 0, 0);

  documents.set(role.scope, {
    documentId: created.documentId,
    cloneDocumentId: clone.documentId,
  });
  results.push({
    role: role.scope,
    workspaceActions: visibleWorkspaceActions.length,
    listScoped: true,
    tamperedFilterBlocked: true,
    createUpdateCloneForced: true,
    publishUnpublish: true,
    relationsScoped: true,
    mediaLibraryBrowse: true,
  });
}

async function validateCrossRoleAccess() {
  for (const role of managedRoles) {
    const token = sessions.get(role.scope);
    const foreignRole = managedRoles.find(
      (candidate) => candidate.scope !== role.scope,
    );
    const foreignDocument = documents.get(foreignRole.scope);

    for (const operation of [
      { method: "GET" },
      { method: "PUT", body: { title: "Forbidden cross-site update" } },
      { method: "DELETE" },
      { method: "POST", suffix: "/actions/publish", body: {} },
    ]) {
      const response = await request(
        `${collectionPath}/${foreignDocument.documentId}${operation.suffix ?? ""}`,
        { token, ...operation },
      );
      assert.ok(
        [401, 403, 404].includes(response.status),
        `${role.scope} ${operation.method} unexpectedly accessed ${foreignRole.scope} content (HTTP ${response.status})`,
      );
    }
  }
}

async function validateSuperAdmin() {
  const token = await login(superAdmin.email);
  sessions.set("superadmin", token);

  const permissions = await request("/admin/users/me/permissions", { token });
  assert.equal(permissions.status, 200);
  const actions = (permissions.data?.data ?? permissions.data ?? []).map(
    (permission) => permission.action,
  );
  const workspaceActions = actions.filter((action) =>
    action.startsWith("admin::sarga-workspaces.access-"),
  );
  assert.equal(new Set(workspaceActions).size, 4);

  const payload = {
    title: "Codex UAT Super Admin",
    slug: "codex-uat-rbac-superadmin",
    excerpt: "Temporary Super Admin scope validation record.",
    category: "news",
    publishedDate: "2026-08-11",
    siteScope: "hidden",
  };
  const created = documentFrom(
    await request(collectionPath, { token, method: "POST", body: payload }),
    "Super Admin create",
  );
  assert.equal(created.siteScope, "hidden");
  documents.set("superadmin", { documentId: created.documentId });
  results.push({
    role: "superadmin",
    workspaceActions: new Set(workspaceActions).size,
    deliberateScopeControl: true,
  });
}

async function cleanup() {
  const token = sessions.get("superadmin");
  if (!token) return;

  const response = await request(
    `${collectionPath}${query({
      page: "1",
      pageSize: "100",
      "filters[slug][$startsWith]": "codex-uat-",
    })}`,
    { token },
  );

  for (const entry of response.data?.results ?? []) {
    await request(`${collectionPath}/${entry.documentId}`, {
      token,
      method: "DELETE",
    });
  }
}

let passed = false;
try {
  await validateSuperAdmin();
  for (const role of managedRoles) await validateManagedRole(role);
  await validateCrossRoleAccess();
  passed = true;
  console.table(results);
  console.log("Workspace RBAC UAT passed.");
} finally {
  await cleanup();
  if (!passed)
    console.error(
      "Workspace RBAC UAT failed; temporary records were cleaned when possible.",
    );
}
