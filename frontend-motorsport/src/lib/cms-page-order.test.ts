import assert from "node:assert/strict";
import test from "node:test";

import {
  mapMotorsportSinglePageSections,
  mergeAuthoritativeCmsSections,
} from "./cms-page-order.ts";

test("maps named sections in the About CMS order", () => {
  const sections = mapMotorsportSinglePageSections({
    routePath: "/about",
    profileSection: { title: "Profile" },
    capabilities: { title: "Capabilities", cards: [] },
    teamSection: { title: "Team" },
    contactCtaSection: { title: "Contact" },
    ecosystemCtaSection: { title: "Ecosystem" },
  });

  assert.deepEqual(
    sections.map((section) => section.sectionKey),
    [
      "profile",
      "about-capabilities",
      "team-intro",
      "contact-cta",
      "ecosystem-cta",
    ],
  );
});

test("does not let an unrelated page field change Events order", () => {
  const sections = mapMotorsportSinglePageSections({
    routePath: "/events",
    calendarSection: { title: "Calendar" },
    programmesSection: { title: "Programmes" },
    eventControlSection: { title: "Control" },
    profileSection: { title: "Unrelated legacy field" },
  });

  assert.deepEqual(
    sections.map((section) => section.sectionKey),
    ["programmes", "calendar"],
  );
});

test("deduplicates campaign sections and keeps an explicit hidden state", () => {
  const sections = mergeAuthoritativeCmsSections(
    [
      { sectionKey: "format", title: "Format", enabled: true },
      { sectionKey: "rundown", title: "Rundown", enabled: true },
      { sectionKey: "race-day-guide", title: "Guide", enabled: true },
      { sectionKey: "format", title: "Updated format", enabled: true },
      { sectionKey: "rundown", title: "Updated rundown", enabled: false },
      { sectionKey: "race-day-guide", title: "Updated guide", enabled: false },
    ],
    [{ sectionKey: "legacy-only", title: "Legacy" }],
  );

  assert.deepEqual(
    sections.map((section) => [section.sectionKey, section.enabled]),
    [
      ["format", true],
      ["rundown", false],
      ["race-day-guide", false],
      ["legacy-only", undefined],
    ],
  );
  assert.equal(sections[0].title, "Updated format");
});
