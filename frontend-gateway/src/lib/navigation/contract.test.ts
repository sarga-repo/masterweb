import { describe, expect, it } from "vitest";
import {
  isSafeNavigationHref,
  resolveNavigationDocuments,
  type RawNavigationItem,
} from "./contract";

const master: RawNavigationItem = {
  documentId: "doc-1",
  internalName: "gateway-about",
  siteScope: "gateway",
  locale: "en",
  href: "/about",
  label: "About",
  ariaLabel: "About Sarga",
  linkType: "internal",
  emphasis: "default",
  openInNewTab: false,
  displayOrder: 10,
  enabled: true,
};

describe("Gateway navigation contract", () => {
  it("uses English structure and Indonesian labels", () => {
    const result = resolveNavigationDocuments(
      [master],
      [{ ...master, locale: "id", label: "Tentang Kami" }],
      "id",
    );
    expect(result.items[0]).toMatchObject({
      href: "/about",
      label: "Tentang Kami",
      displayOrder: 10,
    });
    expect(result.labelFallback).toBe(false);
  });

  it("uses a complete English label fallback when a translation is missing", () => {
    const result = resolveNavigationDocuments([master], [], "id");
    expect(result.items[0].label).toBe("About");
    expect(result.labelFallback).toBe(true);
  });

  it("respects disabled items and does not merge defaults", () => {
    const result = resolveNavigationDocuments(
      [{ ...master, enabled: false }],
      [],
      "en",
    );
    expect(result.items).toEqual([]);
  });

  it("rejects unsafe links", () => {
    expect(isSafeNavigationHref("javascript:alert(1)", "external")).toBe(false);
    expect(isSafeNavigationHref("//example.com", "internal")).toBe(false);
    expect(isSafeNavigationHref("/about", "internal")).toBe(true);
    expect(isSafeNavigationHref("https://sarga.co", "crossSite")).toBe(true);
  });
});
