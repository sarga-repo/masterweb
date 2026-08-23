import assert from "node:assert/strict";
import test from "node:test";

import { mapMotorsportSinglePageSections } from "./cms-page-order.ts";

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
