import assert from "node:assert/strict";
import test from "node:test";

import { buildEventMenuLinks } from "./event-navigation.ts";

const program = (
  overrides: Partial<{
    title: string;
    href: string;
    eventMenuLabel: string;
    eventMenuEnabled: boolean;
    status: "ticketsOpen" | "registrationOpen" | "hidden";
  }> = {},
) => ({
  title: "FIA Rallycross World Cup Indonesia 2026",
  href: "/events/fia-rallycross-world-cup-indonesia-2026",
  eventMenuLabel: "FIA Rallycross",
  eventMenuEnabled: true,
  status: "ticketsOpen" as const,
  ...overrides,
});

test("lists every explicitly enabled, visible CMS program", () => {
  assert.deepEqual(
    buildEventMenuLinks(
      [
        program(),
        program({
          title: "Indonesia Junior Talent Cup",
          href: "/events/indonesia-junior-talent-cup",
          eventMenuLabel: "IJTC",
          status: "registrationOpen",
        }),
      ],
      false,
    ),
    [
      {
        label: "FIA Rallycross",
        href: "/events/fia-rallycross-world-cup-indonesia-2026",
      },
      { label: "IJTC", href: "/events/indonesia-junior-talent-cup" },
    ],
  );
});

test("does not show disabled or hidden programs", () => {
  assert.deepEqual(
    buildEventMenuLinks(
      [program({ eventMenuEnabled: false }), program({ status: "hidden" })],
      false,
    ),
    [],
  );
});

test("uses both repository fallbacks when CMS is unavailable", () => {
  assert.deepEqual(buildEventMenuLinks([], false), [
    {
      label: "FIA Rallycross",
      href: "/events/fia-rallycross-world-cup-indonesia-2026",
    },
    { label: "IJTC", href: "/events/indonesia-junior-talent-cup" },
  ]);
});
