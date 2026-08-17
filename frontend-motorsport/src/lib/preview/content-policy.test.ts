import assert from "node:assert/strict";
import test from "node:test";

import { resolvePreviewCollection } from "./content-policy.ts";

test("preserves CMS collections, including empty draft results, in Preview", () => {
  const fallback = ["fallback"];
  assert.deepEqual(resolvePreviewCollection(["draft"], fallback, true), [
    "draft",
  ]);
  assert.deepEqual(resolvePreviewCollection([], fallback, true), []);
  assert.deepEqual(resolvePreviewCollection(null, fallback, true), []);
});

test("retains curated fallbacks outside Preview", () => {
  const fallback = ["fallback"];
  assert.deepEqual(resolvePreviewCollection(["published"], fallback, false), [
    "published",
  ]);
  assert.deepEqual(resolvePreviewCollection([], fallback, false), fallback);
  assert.deepEqual(resolvePreviewCollection(null, fallback, false), fallback);
});
