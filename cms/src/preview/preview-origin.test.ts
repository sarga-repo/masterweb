import assert from "node:assert/strict";
import test from "node:test";

import { isAllowedPreviewOrigin, parsePreviewOrigins } from "./preview-origin.ts";

test("parses only explicit HTTP(S) origins", () => {
  assert.deepEqual(
    parsePreviewOrigins(
      "http://localhost:3001/, https://preview.example.com, javascript:alert(1), https://evil.example/path",
    ),
    ["http://localhost:3001", "https://preview.example.com"],
  );
});

test("checks exact configured origins", () => {
  const origins = parsePreviewOrigins("http://localhost:3001,https://preview.example.com");
  assert.equal(isAllowedPreviewOrigin("http://localhost:3001", origins), true);
  assert.equal(isAllowedPreviewOrigin("https://preview.example.com/", origins), true);
  assert.equal(isAllowedPreviewOrigin("https://evil.example.com", origins), false);
  assert.equal(isAllowedPreviewOrigin(null, origins), false);
});
