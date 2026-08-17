import assert from "node:assert/strict";
import test from "node:test";

import { isSafePreviewPath, normalizePreviewStatus } from "./preview-path.ts";

test("accepts only Motorsport news preview paths", () => {
  assert.equal(isSafePreviewPath("/news/race-report"), true);
  assert.equal(isSafePreviewPath("/id/news/race-report"), true);
  assert.equal(
    isSafePreviewPath("https://evil.example/news/race-report"),
    false,
  );
  assert.equal(isSafePreviewPath("/events/race-report"), true);
  assert.equal(isSafePreviewPath("/events/race-weekend"), true);
  assert.equal(isSafePreviewPath("/id/about"), true);
  assert.equal(isSafePreviewPath("/campaign/race-weekend"), false);
  assert.equal(isSafePreviewPath("/news/../admin"), false);
});

test("normalizes supported preview statuses", () => {
  assert.equal(normalizePreviewStatus("draft"), "draft");
  assert.equal(normalizePreviewStatus("modified"), "draft");
  assert.equal(normalizePreviewStatus("published"), "published");
  assert.equal(normalizePreviewStatus("invalid"), null);
  assert.equal(normalizePreviewStatus(null), null);
});

test("accepts every supported preview destination and rejects unsafe variants", () => {
  for (const path of [
    "/",
    "/id",
    "/about",
    "/id/about",
    "/events",
    "/id/events",
    "/news",
    "/id/news",
    "/partners",
    "/id/partners",
    "/gallery",
    "/id/gallery",
    "/merchandise",
    "/id/merchandise",
    "/tickets",
    "/id/tickets",
    "/events/race-weekend",
    "/id/events/race-weekend",
    "/events/indonesia-junior-talent-cup/race-schedule",
    "/events/indonesia-junior-talent-cup",
    "/events/indonesia-junior-talent-cup/about",
    "/events/indonesia-junior-talent-cup/become-riders",
    "/events/indonesia-junior-talent-cup/regulation",
    "/events/indonesia-junior-talent-cup/riders",
    "/id/events/indonesia-junior-talent-cup/riders/rider-01",
    "/id/events/indonesia-junior-talent-cup/standings",
    "/news/race-report",
    "/id/news/race-report",
  ]) {
    assert.equal(isSafePreviewPath(path), true, path);
  }

  for (const path of [
    "//evil.example/news/race-report",
    "/events/race_report",
    "/news/Race-Report",
    "/campaign/race-report",
    "/id/campaign/race-report",
    "/events/indonesia-junior-talent-cup/unknown",
    "/api/preview",
  ]) {
    assert.equal(isSafePreviewPath(path), false, path);
  }
});
