import assert from "node:assert/strict";
import test from "node:test";

import {
  isExactSingleDocument,
  mapMotorsportInformationBand,
  mapMotorsportNamedPageSection,
  mapMotorsportPageHero,
} from "./motorsport-page-foundation.ts";

test("maps the shared hero contract and trims editorial values", () => {
  const hero = mapMotorsportPageHero({
    isActive: true,
    eyebrow: "  SYS / GALLERY  ",
    title: "  Gallery  ",
    description: "  Trackside frames  ",
    backgroundMedia: {
      id: 1,
      url: "/uploads/gallery.jpg",
      mime: "image/jpeg",
      alternativeText: "Gallery background",
    },
  });

  assert.equal(hero?.isActive, true);
  assert.equal(hero?.eyebrow, "SYS / GALLERY");
  assert.equal(hero?.title, "Gallery");
  assert.equal(hero?.description, "Trackside frames");
  assert.equal(
    hero?.backgroundMedia?.url.endsWith("/uploads/gallery.jpg"),
    true,
  );
  assert.equal(hero?.backgroundMedia?.alt, "Gallery background");
});

test("maps and gates hero metrics using the shared contract", () => {
  const hero = mapMotorsportPageHero({
    title: "Gallery",
    showMetricGroup: true,
    metrics: [
      { label: "Frames", value: "12" },
      { isActive: false, label: "Hidden", value: "0" },
      { label: "Format", value: "Editorial" },
    ],
  });

  assert.equal(hero?.showMetricGroup, true);
  assert.deepEqual(hero?.metrics, [
    { label: "Frames", value: "12" },
    { label: "Format", value: "Editorial" },
  ]);

  const hiddenHero = mapMotorsportPageHero({
    title: "Gallery",
    showMetricGroup: false,
    metrics: [{ label: "Frames", value: "12" }],
  });
  assert.equal(hiddenHero?.showMetricGroup, false);
  assert.deepEqual(hiddenHero?.metrics, []);
});

test("hides the information-band metric group and separators as one unit", () => {
  const band = mapMotorsportInformationBand({
    title: "Race control",
    showMetricGroup: false,
    metrics: [
      { label: "Next event", value: "15 Nov 2026" },
      { label: "Region", value: "Indonesia" },
    ],
  });

  assert.equal(band?.showMetricGroup, false);
  assert.deepEqual(band?.metrics, []);
});

test("filters inactive or incomplete metrics and caps the group at three", () => {
  const band = mapMotorsportInformationBand({
    title: "Race control",
    metrics: [
      { label: "One", value: "1" },
      { isActive: false, label: "Hidden", value: "2" },
      { label: "Missing value", value: " " },
      { label: "Two", value: "2" },
      { label: "Three", value: "3" },
      { label: "Four", value: "4" },
    ],
  });

  assert.deepEqual(band?.metrics, [
    { label: "One", value: "1" },
    { label: "Two", value: "2" },
    { label: "Three", value: "3" },
  ]);
});

test("maps named sections without requiring a manual section key", () => {
  const section = mapMotorsportNamedPageSection({
    isActive: false,
    title: "  Archive  ",
    ctaTarget: "newWindow",
    theme: "dark",
  });

  assert.equal(section?.isActive, false);
  assert.equal(section?.title, "Archive");
  assert.equal(section?.ctaTarget, "newWindow");
  assert.equal(section?.theme, "dark");
  assert.equal(section?.body, undefined);
});

test("requires the exact Preview document ID", () => {
  assert.equal(
    isExactSingleDocument({ data: { documentId: "doc-123" } }, "doc-123"),
    true,
  );
  assert.equal(
    isExactSingleDocument({ data: { documentId: "other-doc" } }, "doc-123"),
    false,
  );
  assert.equal(isExactSingleDocument({ data: null }, "doc-123"), false);
});
