import assert from "node:assert/strict";
import test from "node:test";

import {
  assertNavigationStructuralParity,
  assertStableLocalizedRoutes,
  validateNavigationLink,
} from "./sarga-i18n.ts";

test("accepts internal, HTTPS, and localhost navigation URLs", () => {
  assert.doesNotThrow(() =>
    validateNavigationLink({
      href: "/about?source=header#team",
      linkType: "internal",
      openInNewTab: false,
    }),
  );
  assert.doesNotThrow(() =>
    validateNavigationLink({
      href: "https://motorsport.sarga.co/events",
      linkType: "crossSite",
      openInNewTab: false,
    }),
  );
  assert.doesNotThrow(() =>
    validateNavigationLink({
      href: "http://localhost:3001/events",
      linkType: "crossSite",
      openInNewTab: false,
    }),
  );
});

test("rejects unsafe or mismatched navigation URLs", () => {
  for (const data of [
    { href: "//evil.example", linkType: "internal" },
    { href: "javascript:alert(1)", linkType: "external" },
    { href: "http://example.com", linkType: "external" },
    { href: "/contact", linkType: "internal", openInNewTab: true },
  ]) {
    assert.throws(
      () => validateNavigationLink(data),
      /Top Navigation|Internal/,
    );
  }
});

test("Indonesian labels may change while structural fields stay equal", () => {
  const master = {
    internalName: "gateway-about",
    siteScope: "gateway",
    href: "/about",
    linkType: "internal",
    enabled: true,
    displayOrder: 20,
    emphasis: "default",
    openInNewTab: false,
  };

  assert.doesNotThrow(() =>
    assertNavigationStructuralParity(
      { ...master, label: "Tentang Sarga" },
      master,
    ),
  );
  assert.throws(
    () =>
      assertNavigationStructuralParity({ ...master, href: "/tentang" }, master),
    /English master/,
  );
  assert.throws(
    () => assertNavigationStructuralParity({ label: "Beranda" }, null),
    /Create and save the English/,
  );
});

test("localized route fields must match the English document", () => {
  assert.doesNotThrow(() =>
    assertStableLocalizedRoutes(
      { slug: "same-slug", title: "Judul Indonesia" },
      { slug: "same-slug", title: "English title" },
    ),
  );
  assert.throws(
    () =>
      assertStableLocalizedRoutes(
        { routePath: "/id-only-path" },
        { routePath: "/shared-path" },
      ),
    /stable route field/,
  );
  assert.throws(
    () => assertStableLocalizedRoutes({ slug: "id-first" }, null),
    /English document/,
  );
});
