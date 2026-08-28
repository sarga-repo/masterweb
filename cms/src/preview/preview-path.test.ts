import assert from "node:assert/strict";
import test from "node:test";

import {
  APPROVED_MOTORSPORT_PREVIEW_UIDS,
  getMotorsportPreviewPath,
  normalizePreviewLocale,
  normalizePreviewStatus,
} from "./preview-path.ts";

test("maps Motorsport news and events to localized paths", () => {
  const document = { slug: "race-report", siteScope: "motorsport" };
  assert.equal(
    getMotorsportPreviewPath("api::news-article.news-article", document, "en"),
    "/news/race-report",
  );
  assert.equal(
    getMotorsportPreviewPath("api::event.event", document, "id"),
    "/id/events/race-report",
  );
});

test("maps dedicated Motorsport News Article previews without siteScope", () => {
  assert.equal(
    getMotorsportPreviewPath(
      "api::motorsport-news-article.motorsport-news-article",
      { slug: "fia-rallycross-race-report" },
      "en",
    ),
    "/news/fia-rallycross-race-report",
  );
  assert.equal(
    getMotorsportPreviewPath(
      "api::motorsport-news-article.motorsport-news-article",
      { slug: "fia-rallycross-race-report" },
      "id",
    ),
    "/id/news/fia-rallycross-race-report",
  );
});

test("maps approved Site Pages, canonical program routes, and global records", () => {
  assert.equal(
    getMotorsportPreviewPath(
      "api::site-page.site-page",
      {
        routePath: "/events/fia-rallycross-world-cup-indonesia-2026",
        siteScope: "motorsport",
      },
      "id",
    ),
    "/id/events/fia-rallycross-world-cup-indonesia-2026",
  );
  assert.equal(
    getMotorsportPreviewPath(
      "api::site-page.site-page",
      {
        routePath: "/campaign/fia-rallycross-world-cup-indonesia-2026",
        siteScope: "motorsport",
      },
      "en",
    ),
    "/events/fia-rallycross-world-cup-indonesia-2026",
  );
  assert.equal(
    getMotorsportPreviewPath(
      "api::motorsport-program.motorsport-program",
      { slug: "indonesia-junior-talent-cup", siteScope: "motorsport" },
      "en",
    ),
    "/events/indonesia-junior-talent-cup",
  );
  assert.equal(
    getMotorsportPreviewPath(
      "api::top-navigation-item.top-navigation-item",
      { siteScope: "motorsport" },
      "id",
    ),
    "/id",
  );
  assert.equal(
    getMotorsportPreviewPath(
      "api::leadership-person.leadership-person",
      { siteScope: "motorsport" },
      "en",
    ),
    "/about",
  );
  assert.equal(
    getMotorsportPreviewPath(
      "api::motorsport-tickets-page.motorsport-tickets-page",
      { routePath: "/tickets", siteScope: "motorsport" },
      "en",
    ),
    "/tickets",
  );
});

test("maps IJTC relation-owned records to their public consumers", () => {
  const program = {
    slug: "indonesia-junior-talent-cup",
    siteScope: "motorsport",
  };
  assert.equal(
    getMotorsportPreviewPath(
      "api::motorsport-rider.motorsport-rider",
      { slug: "rider-01", siteScope: "motorsport", program },
      "id",
    ),
    "/id/events/indonesia-junior-talent-cup/riders/rider-01",
  );
  assert.equal(
    getMotorsportPreviewPath(
      "api::motorsport-standing.motorsport-standing",
      { siteScope: "motorsport", program },
      "en",
    ),
    "/events/indonesia-junior-talent-cup/standings",
  );
  assert.equal(
    getMotorsportPreviewPath(
      "api::motorsport-regulation.motorsport-regulation",
      { siteScope: "motorsport", program },
      "en",
    ),
    "/events/indonesia-junior-talent-cup/regulation",
  );
  assert.equal(
    getMotorsportPreviewPath(
      "api::motorsport-rider.motorsport-rider",
      {
        slug: "rider-01",
        siteScope: "motorsport",
        program: { slug: "other-program" },
      },
      "en",
    ),
    null,
  );
});

test("maps only Motorsport Site chrome and secondary collections", () => {
  assert.equal(
    getMotorsportPreviewPath(
      "api::site.site",
      { slug: "sarga-motorsport" },
      "id",
    ),
    "/id",
  );
  for (const [uid, path] of [
    ["api::partner.partner", "/partners"],
    ["api::media-gallery.media-gallery", "/gallery"],
    ["api::merchandise-item.merchandise-item", "/merchandise"],
    ["api::ticket-cta.ticket-cta", "/tickets"],
  ] as const) {
    assert.equal(
      getMotorsportPreviewPath(uid, { siteScope: "motorsport" }, "id"),
      `/id${path}`,
    );
  }
  assert.equal(
    getMotorsportPreviewPath("api::site.site", { slug: "sarga-gateway" }),
    null,
  );
});

test("rejects unsupported, cross-site, unsafe, and invalid-locale documents", () => {
  assert.equal(
    getMotorsportPreviewPath("api::event.event", {
      slug: "../race-report",
      siteScope: "motorsport",
    }),
    null,
  );
  assert.equal(
    getMotorsportPreviewPath(
      "api::site-page.site-page",
      { routePath: "/campaign/example", siteScope: "motorsport" },
      "en",
    ),
    null,
  );
  assert.equal(
    getMotorsportPreviewPath("api::news-article.news-article", {
      slug: "race-report",
      siteScope: "gateway",
    }),
    null,
  );
  assert.equal(
    getMotorsportPreviewPath(
      "api::news-article.news-article",
      { slug: "race-report", siteScope: "motorsport" },
      "fr",
    ),
    null,
  );
  assert.equal(
    getMotorsportPreviewPath("api::unknown.unknown", {
      slug: "race-report",
      siteScope: "motorsport",
    }),
    null,
  );
});

test("normalizes only supported preview locale and status values", () => {
  assert.equal(normalizePreviewLocale("en"), "en");
  assert.equal(normalizePreviewLocale("id"), "id");
  assert.equal(normalizePreviewLocale(""), "en");
  assert.equal(normalizePreviewLocale(null), "en");
  assert.equal(normalizePreviewLocale("fr"), null);
  assert.equal(normalizePreviewStatus("draft"), "draft");
  assert.equal(normalizePreviewStatus("modified"), "draft");
  assert.equal(normalizePreviewStatus("published"), "published");
  assert.equal(normalizePreviewStatus("invalid"), null);
  assert.equal(normalizePreviewStatus(null), null);
  assert.ok(
    APPROVED_MOTORSPORT_PREVIEW_UIDS.includes("api::news-article.news-article"),
  );
  assert.ok(
    APPROVED_MOTORSPORT_PREVIEW_UIDS.includes(
      "api::motorsport-news-article.motorsport-news-article",
    ),
  );
});
