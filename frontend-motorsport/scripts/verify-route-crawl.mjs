#!/usr/bin/env node

const siteUrl = (
  process.env.MOTORSPORT_UAT_URL || "http://localhost:3001"
).replace(/\/$/, "");

function extractRoutes(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => {
    const url = new URL(match[1]);
    return `${url.pathname}${url.search}`;
  });
}

const sitemapResponse = await fetch(`${siteUrl}/sitemap.xml`);
if (!sitemapResponse.ok) {
  throw new Error(`Sitemap returned HTTP ${sitemapResponse.status}.`);
}

const sitemapRoutes = extractRoutes(await sitemapResponse.text());
const routes = [...new Set(sitemapRoutes)];
const localizedRoutes = routes.flatMap((route) =>
  route === "/" ? ["/", "/id"] : [route, `/id${route}`],
);
const failures = [];

for (const route of localizedRoutes) {
  const response = await fetch(`${siteUrl}${route}`, { redirect: "follow" });
  const html = await response.text();
  if (!response.ok) {
    failures.push(`${route}: HTTP ${response.status}`);
    continue;
  }
  if (
    html.includes("Application error") ||
    html.includes("CMS preview read failed") ||
    html.includes("CMS publish parity") ||
    html.includes("CMS unpublish parity")
  ) {
    failures.push(`${route}: diagnostic or UAT probe leaked into HTML`);
  }
  if (!html.includes("<main")) failures.push(`${route}: missing main landmark`);
}

const legacy = await fetch(
  `${siteUrl}/campaign/fia-rallycross-world-cup-indonesia-2026`,
  { redirect: "manual" },
);
if (![307, 308].includes(legacy.status)) {
  failures.push(`legacy FIA campaign: expected redirect, got ${legacy.status}`);
}

if (failures.length > 0) {
  console.error(`Motorsport route crawl failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `Motorsport route crawl passed: ${localizedRoutes.length} localized routes plus the legacy FIA redirect.`,
);
