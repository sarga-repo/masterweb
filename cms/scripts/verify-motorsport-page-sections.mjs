#!/usr/bin/env node

const baseUrl = (process.env.CMS_UAT_BASE_URL ?? "http://localhost:1337").replace(/\/$/, "");
const params = new URLSearchParams({
  "filters[siteScope][$eq]": "motorsport",
  "filters[routePath][$ne]": "/",
  "populate[sections]": "true",
  "pagination[pageSize]": "100",
});
const response = await fetch(`${baseUrl}/api/site-pages?${params}`);
if (!response.ok) {
  console.error(`Motorsport page section verification blocked: HTTP ${response.status}`);
  process.exit(2);
}

const pages = (await response.json()).data ?? [];
const expectedRoutes = new Set([
  "/about",
  "/events",
  "/news",
  "/contact",
  "/partners",
  "/tickets",
  "/gallery",
  "/campaign/fia-rallycross-world-cup-indonesia-2026",
]);
const result = pages.map((page) => ({
  title: page.title,
  routePath: page.routePath,
  sectionKeys: (page.sections ?? []).map((section) =>
    section.__component === "motorsport.about-capabilities"
      ? section.__component
      : section.sectionKey,
  ),
}));
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), pages: result }, null, 2));
process.exitCode = result.some(
  (page) => expectedRoutes.has(page.routePath) && page.sectionKeys.length === 0,
)
  ? 2
  : 0;
