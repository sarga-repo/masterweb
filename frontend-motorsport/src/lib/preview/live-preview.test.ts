import assert from "node:assert/strict";
import test from "node:test";

import { previewRevisionFingerprint } from "./live-preview.ts";

test("preview revision fingerprint changes when a saved CMS revision changes", () => {
  const before = previewRevisionFingerprint({
    documentId: "abcdefghijklmnopqrst",
    updatedAt: "2026-08-23T10:00:00.000Z",
    publishedAt: null,
    status: "draft",
  });
  const after = previewRevisionFingerprint({
    documentId: "abcdefghijklmnopqrst",
    updatedAt: "2026-08-23T10:00:01.000Z",
    publishedAt: null,
    status: "draft",
  });

  assert.notEqual(before, after);
});

test("preview revision fingerprint includes status and publication state", () => {
  const draft = previewRevisionFingerprint({
    documentId: "abcdefghijklmnopqrst",
    updatedAt: "2026-08-23T10:00:00.000Z",
    publishedAt: "2026-08-22T10:00:00.000Z",
    status: "draft",
  });
  const published = previewRevisionFingerprint({
    documentId: "abcdefghijklmnopqrst",
    updatedAt: "2026-08-23T10:00:00.000Z",
    publishedAt: "2026-08-23T10:00:00.000Z",
    status: "published",
  });

  assert.notEqual(draft, published);
});
