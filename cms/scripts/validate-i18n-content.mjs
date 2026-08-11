import assert from "node:assert/strict";

const baseUrl = process.env.CMS_UAT_BASE_URL ?? "http://localhost:1337";
const email = required("CMS_UAT_SUPERADMIN_EMAIL");
const password = required("CMS_UAT_PASSWORD");
const created = [];
let token;

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

function query(params) {
  return `?${new URLSearchParams(params).toString()}`;
}

async function request(path, { method = "GET", body } = {}) {
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

function documentFrom(response, message) {
  assert.ok(
    response.status >= 200 && response.status < 300,
    `${message}: HTTP ${response.status} ${JSON.stringify(response.data)}`,
  );
  const document = response.data?.data ?? response.data;
  assert.ok(document?.documentId, `${message}: no documentId`);
  return document;
}

async function login() {
  const response = await request("/admin/login", {
    method: "POST",
    body: { email, password },
  });
  assert.equal(response.status, 200);
  token = response.data?.data?.token;
  assert.ok(token);
}

async function create(uid, payload) {
  const path = `/content-manager/collection-types/${uid}`;
  const document = documentFrom(
    await request(path, { method: "POST", body: payload }),
    `${uid} create`,
  );
  created.push({ uid, documentId: document.documentId });
  return document;
}

async function update(uid, documentId, payload, message) {
  return documentFrom(
    await request(`/content-manager/collection-types/${uid}/${documentId}`, {
      method: "PUT",
      body: payload,
    }),
    message,
  );
}

async function publish(uid, documentId, locale, document) {
  return documentFrom(
    await request(
      `/content-manager/collection-types/${uid}/${documentId}/actions/publish`,
      { method: "POST", body: { ...document, locale } },
    ),
    `${uid} ${locale} publish`,
  );
}

async function validateDynamicZoneAndSingleComponent() {
  const uid = "api::site-page.site-page";
  const slug = "gwr-cms5-content-page";
  const englishPayload = {
    locale: "en",
    title: "GWR CMS5 content page",
    slug,
    routePath: "/gwr-cms5-content-page",
    siteScope: "gateway",
    pageKind: "custom",
    navigationLabel: "Content test",
    heroTitle: "English hero",
    pageAvailability: {
      pageEnabled: true,
      comingSoonTitle: "English coming soon",
      showNotifyCta: true,
      noIndexWhileDisabled: true,
    },
    sections: [
      {
        __component: "shared.page-section",
        sectionKey: "uat-introduction",
        title: "English dynamic-zone title",
        body: "English dynamic-zone body.",
      },
    ],
  };
  const english = await create(uid, englishPayload);
  assert.equal(english.sections?.[0]?.title, "English dynamic-zone title");

  const indonesianPayload = {
    ...englishPayload,
    locale: "id",
    title: "Halaman pengujian GWR CMS5",
    navigationLabel: "Uji konten",
    heroTitle: "Hero Indonesia",
    pageAvailability: {
      ...englishPayload.pageAvailability,
      comingSoonTitle: "Segera hadir dalam Bahasa Indonesia",
    },
    sections: [
      {
        __component: "shared.page-section",
        sectionKey: "uat-introduction",
        title: "Judul zona dinamis Indonesia",
        body: "Isi zona dinamis Indonesia.",
      },
    ],
  };
  const indonesian = await update(
    uid,
    english.documentId,
    indonesianPayload,
    `${uid} Indonesian localization`,
  );
  assert.equal(indonesian.routePath, englishPayload.routePath);
  assert.equal(indonesian.sections?.[0]?.title, "Judul zona dinamis Indonesia");
  assert.equal(
    indonesian.pageAvailability?.comingSoonTitle,
    "Segera hadir dalam Bahasa Indonesia",
  );

  const routeViolation = await request(
    `/content-manager/collection-types/${uid}/${english.documentId}`,
    {
      method: "PUT",
      body: { ...indonesianPayload, routePath: "/indonesian-only-route" },
    },
  );
  assert.equal(routeViolation.status, 400);

  await publish(uid, english.documentId, "en", english);
  await publish(uid, english.documentId, "id", indonesian);
}

async function validateRepeatableComponentAndClone() {
  const uid = "api::event.event";
  const slug = "gwr-cms5-content-event";
  const englishPayload = {
    locale: "en",
    title: "GWR CMS5 content event",
    slug,
    description: "English event description.",
    eventStatus: "announced",
    siteScope: "gateway",
    schedule: [
      {
        label: "Practice",
        day: "Friday",
        description: "English repeatable component.",
      },
      {
        label: "Race",
        day: "Saturday",
        description: "English race session.",
      },
    ],
  };
  const english = await create(uid, englishPayload);
  assert.equal(english.schedule?.length, 2);

  const indonesianPayload = {
    ...englishPayload,
    locale: "id",
    title: "Acara pengujian GWR CMS5",
    description: "Deskripsi acara Indonesia.",
    schedule: [
      {
        label: "Latihan",
        day: "Jumat",
        description: "Komponen berulang Indonesia.",
      },
      {
        label: "Balapan",
        day: "Sabtu",
        description: "Sesi balapan Indonesia.",
      },
    ],
  };
  const indonesian = await update(
    uid,
    english.documentId,
    indonesianPayload,
    `${uid} Indonesian localization`,
  );
  assert.equal(indonesian.slug, slug);
  assert.deepEqual(
    indonesian.schedule.map((session) => session.label),
    ["Latihan", "Balapan"],
  );
  await publish(uid, english.documentId, "en", english);
  await publish(uid, english.documentId, "id", indonesian);

  const clonePayload = {
    ...englishPayload,
    locale: "en",
    title: "GWR CMS5 cloned event",
    slug: `${slug}-clone`,
  };
  const clone = documentFrom(
    await request(
      `/content-manager/collection-types/${uid}/clone/${english.documentId}`,
      { method: "POST", body: clonePayload },
    ),
    `${uid} English clone`,
  );
  created.push({ uid, documentId: clone.documentId });
  const cloneId = await update(
    uid,
    clone.documentId,
    {
      ...indonesianPayload,
      slug: clonePayload.slug,
      title: "Klon acara GWR CMS5",
    },
    `${uid} cloned Indonesian localization`,
  );
  assert.equal(cloneId.slug, clonePayload.slug);
  assert.equal(cloneId.locale, "id");
}

async function validatePublicLocaleQueries() {
  for (const [endpoint, slug] of [
    ["site-pages", "gwr-cms5-content-page"],
    ["events", "gwr-cms5-content-event"],
  ]) {
    for (const locale of ["en", "id"]) {
      const response = await fetch(
        `${baseUrl}/api/${endpoint}${query({
          locale,
          "filters[slug][$eq]": slug,
          "pagination[pageSize]": "10",
        })}`,
      );
      assert.equal(response.status, 200);
      const data = await response.json();
      assert.equal(data.data?.length, 1, `${endpoint} ${locale} public query`);
      assert.equal(data.data[0].locale, locale);
    }
  }
}

async function cleanup() {
  for (const { uid, documentId } of created.reverse()) {
    for (const locale of ["id", "en"]) {
      await request(
        `/content-manager/collection-types/${uid}/${documentId}${query({ locale })}`,
        { method: "DELETE" },
      );
    }
  }
}

let passed = false;
try {
  await login();
  await validateDynamicZoneAndSingleComponent();
  await validateRepeatableComponentAndClone();
  await validatePublicLocaleQueries();
  passed = true;
  console.log(
    "Localized components, dynamic zones, draft/publish, clone, public locale queries, and cleanup passed.",
  );
} finally {
  await cleanup();
  if (!passed) process.exitCode = 1;
}
