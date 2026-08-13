import assert from "node:assert/strict";
import test from "node:test";

const SITE_SCOPES = ["gateway", "motorsport", "horsesport", "shared"] as const;

const PAGE_CONTRACTS = [
  ["gateway", "/news", "newsHub"],
  ["gateway", "/contact", "custom"],
  ["gateway", "/careers", "custom"],
  ["gateway", "/ticket-hub", "custom"],
  ["motorsport", "/news", "newsHub"],
  ["motorsport", "/events", "eventHub"],
  ["motorsport", "/contact", "custom"],
  ["motorsport", "/partners", "custom"],
  ["motorsport", "/tickets", "custom"],
  ["motorsport", "/gallery", "custom"],
  ["horsesport", "/news", "newsHub"],
  ["horsesport", "/about", "about"],
  ["horsesport", "/venues", "custom"],
  ["horsesport", "/stable-life", "custom"],
  ["horsesport", "/contact", "custom"],
  ["horsesport", "/", "home"],
] as const;

const SECTION_KEYS = [
  "lead-story",
  "archive-intro",
  "event-control",
  "programmes",
  "calendar",
  "inquiry-map",
  "career-disciplines",
  "upcoming",
  "inquiry-control",
  "inquiry-form",
  "partner-control",
  "partner-network",
  "ticket-control",
  "featured-ticket",
  "gallery-intro",
  "about",
  "story",
  "capabilities",
  "network",
  "facilities",
  "intro",
];

test("editorial page contracts use canonical site scopes", () => {
  for (const [scope] of PAGE_CONTRACTS) {
    assert.ok(SITE_SCOPES.includes(scope));
  }
});

test("editorial page contracts have unique scope and route identities", () => {
  const identities = PAGE_CONTRACTS.map(([scope, route, kind]) =>
    `${scope}:${route}:${kind}`,
  );
  assert.equal(new Set(identities).size, identities.length);
});

test("section keys use stable kebab-case names", () => {
  for (const key of SECTION_KEYS) {
    assert.match(key, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
  assert.equal(new Set(SECTION_KEYS).size, SECTION_KEYS.length);
});

test("technical values stay outside editorial section contract", () => {
  const technicalKeys = ["pagination", "filter", "status", "aria-label"];
  for (const key of technicalKeys) {
    assert.equal(SECTION_KEYS.includes(key), false);
  }
});
