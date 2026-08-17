import assert from "node:assert/strict";
import test from "node:test";

import {
  isAllowedPreviewRequestOrigin,
  parsePreviewAdminOrigins,
} from "./preview-origin.ts";

test("parses explicit admin origins", () => {
  assert.deepEqual(
    parsePreviewAdminOrigins(
      "http://localhost:1337/, https://cms.example.com/admin",
    ),
    ["http://localhost:1337"],
  );
});

test("allows absent origin headers but rejects configured foreign origins", () => {
  const allowed = parsePreviewAdminOrigins("http://localhost:1337");
  assert.equal(
    isAllowedPreviewRequestOrigin(
      new Request("http://localhost:3001/api/preview"),
      allowed,
    ),
    true,
  );
  assert.equal(
    isAllowedPreviewRequestOrigin(
      new Request("http://localhost:3001/api/preview", {
        headers: { referer: "http://localhost:1337/admin/content-manager" },
      }),
      allowed,
    ),
    true,
  );
  assert.equal(
    isAllowedPreviewRequestOrigin(
      new Request("http://localhost:3001/api/preview", {
        headers: { origin: "https://evil.example" },
      }),
      allowed,
    ),
    false,
  );
});
