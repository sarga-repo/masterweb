import assert from "node:assert/strict";
import test from "node:test";

test("Motorsport leadership query includes shared leadership records", () => {
  const query = new URLSearchParams({
    "filters[siteScope][$in][0]": "motorsport",
    "filters[siteScope][$in][1]": "shared",
  });
  assert.equal(query.get("filters[siteScope][$in][0]"), "motorsport");
  assert.equal(query.get("filters[siteScope][$in][1]"), "shared");
  assert.notEqual(query.get("filters[siteScope][$in][0]"), "gateway");
});
