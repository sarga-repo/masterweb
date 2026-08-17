import assert from "node:assert/strict";
import test from "node:test";

import {
  getGlobalChromeAffectedRoutes,
  getSharedRecordAffectedRoutes,
} from "./affected-routes.ts";

test("maps partner consumers across homepage, hub, event, and locales", () => {
  assert.deepEqual(
    getSharedRecordAffectedRoutes(
      "api::partner.partner",
      { eventSlug: "race-weekend" },
      "id",
    ),
    ["/id", "/id/partners", "/id/events/race-weekend"],
  );
});

test("maps ticket CTA consumers across event and program routes", () => {
  assert.deepEqual(
    getSharedRecordAffectedRoutes("api::ticket-cta.ticket-cta", {
      eventSlug: "race-weekend",
      programSlug: "fia-rallycross-world-cup-indonesia-2026",
    }),
    [
      "/",
      "/tickets",
      "/events/race-weekend",
      "/events/fia-rallycross-world-cup-indonesia-2026",
    ],
  );
});

test("maps leadership and gallery consumers and rejects unsafe context", () => {
  assert.deepEqual(
    getSharedRecordAffectedRoutes("api::leadership-person.leadership-person"),
    ["/", "/about"],
  );
  assert.deepEqual(
    getSharedRecordAffectedRoutes("api::media-gallery.media-gallery", {
      eventSlug: "../admin",
    }),
    ["/", "/gallery"],
  );
});

test("maps global header and footer across core route families", () => {
  const routes = getGlobalChromeAffectedRoutes("id");
  assert.equal(routes.includes("/id"), true);
  assert.equal(routes.includes("/id/contact"), true);
  assert.equal(routes.includes("/id/experience"), true);
  assert.equal(routes.includes("/id/merchandise"), true);
  assert.equal(routes.includes("/id/events/indonesia-junior-talent-cup"), true);
  assert.equal(routes.includes("/id/tickets"), true);
});
