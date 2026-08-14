import { describe, expect, it } from "vitest";
import {
  localeAlternates,
  localeFromPathname,
  localizeHref,
  localizeKnownSiteHref,
  localizePath,
  stripLocalePrefix,
} from "./config";

describe("Gateway locale URL contract", () => {
  it("keeps English unprefixed and prefixes Indonesian", () => {
    expect(localizePath("/news", "en")).toBe("/news");
    expect(localizePath("/news", "id")).toBe("/id/news");
    expect(localizePath("/", "id")).toBe("/id");
    expect(localizePath("", "id")).toBe("/id");
  });

  it("normalizes active and equivalent paths", () => {
    expect(localeFromPathname("/id/news/story")).toBe("id");
    expect(stripLocalePrefix("/id/news/story")).toBe("/news/story");
    expect(localizeHref("/id/news?tag=race#latest", "en")).toBe(
      "/news?tag=race#latest",
    );
  });

  it("returns canonical language alternates", () => {
    expect(localeAlternates("/id/about")).toEqual({
      en: "/about",
      id: "/id/about",
      "x-default": "/about",
    });
  });

  it("does not rewrite external or protocol-relative destinations", () => {
    expect(localizeHref("https://motorsport.sarga.co", "id")).toBe(
      "https://motorsport.sarga.co",
    );
    expect(localizeHref("//example.com", "id")).toBe("//example.com");
  });

  it("preserves Indonesian locale on configured Sarga cross-site links", () => {
    const sites = [
      "https://sarga.co",
      "https://motorsport.sarga.co",
      "https://horsesport.sarga.co",
    ];
    expect(
      localizeKnownSiteHref(
        "https://motorsport.sarga.co/news/story?from=gateway#latest",
        "id",
        sites,
      ),
    ).toBe("https://motorsport.sarga.co/id/news/story?from=gateway#latest");
    expect(
      localizeKnownSiteHref("https://tickets.example.com/event", "id", sites),
    ).toBe("https://tickets.example.com/event");
    expect(localizeKnownSiteHref("/news", "id", sites)).toBe("/id/news");
  });
});
