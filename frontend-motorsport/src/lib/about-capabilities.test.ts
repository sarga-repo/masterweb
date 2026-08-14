import assert from "node:assert/strict";
import test from "node:test";
import { mapAboutCapabilities } from "./cms-data";

test("maps enabled About capability cards in CMS order", () => {
  const result = mapAboutCapabilities([
    {
      __component: "motorsport.about-capabilities",
      sectionKey: "about-capabilities",
      title: "Capabilities",
      cards: [
        { title: "Second", description: "B", sortOrder: 2 },
        { title: "Disabled", description: "C", sortOrder: 3, enabled: false },
        { title: "First", description: "A", sortOrder: 1 },
      ],
    },
  ]);
  assert.deepEqual(
    result?.cards.map((card) => card.title),
    ["First", "Second"],
  );
});

test("uses whole-component fallback for missing or empty capability data", () => {
  assert.equal(mapAboutCapabilities(undefined), null);
  assert.equal(
    mapAboutCapabilities([
      {
        __component: "motorsport.about-capabilities",
        sectionKey: "about-capabilities",
        cards: [{ title: "", description: "" }],
      },
    ]),
    null,
  );
});
