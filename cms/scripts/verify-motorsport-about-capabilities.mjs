#!/usr/bin/env node

const baseUrl = (process.env.CMS_UAT_BASE_URL ?? "http://localhost:1337").replace(/\/$/, "");
const params = new URLSearchParams({
  "filters[siteScope][$eq]": "motorsport",
  "filters[slug][$eq]": "motorsport-about",
  "populate[sections][on][motorsport.about-capabilities][populate][cards]": "true",
  "pagination[pageSize]": "1",
});

const response = await fetch(`${baseUrl}/api/site-pages?${params}`);
if (!response.ok) {
  console.error(`Motorsport About verification blocked: HTTP ${response.status}`);
  process.exit(2);
}

const page = (await response.json()).data?.[0];
const sections = page?.sections ?? [];
const capabilitySections = sections.filter(
  (section) => section.__component === "motorsport.about-capabilities",
);
const cards = capabilitySections[0]?.cards ?? [];
const result = {
  checkedAt: new Date().toISOString(),
  baseUrl,
  pageFound: Boolean(page),
  capabilitySectionCount: capabilitySections.length,
  cardCount: cards.length,
  internalNames: cards.map((card) => card.internalName),
  duplicateInternalNames:
    new Set(cards.map((card) => card.internalName)).size !== cards.length,
};

console.log(JSON.stringify(result, null, 2));
process.exitCode =
  result.pageFound &&
  result.capabilitySectionCount === 1 &&
  result.cardCount >= 1 &&
  !result.duplicateInternalNames
    ? 0
    : 2;
