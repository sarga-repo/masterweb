import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * cross-site routing depends on env vars that site-config reads at module load,
 * so each test stubs the env then imports the module fresh.
 */
async function loadCrossSite(env: {
  motorsport?: string;
  horsesport?: string;
}) {
  vi.resetModules();
  if (env.motorsport !== undefined) {
    vi.stubEnv("NEXT_PUBLIC_MOTORSPORT_SITE_URL", env.motorsport);
  }
  if (env.horsesport !== undefined) {
    vi.stubEnv("NEXT_PUBLIC_HORSESPORT_SITE_URL", env.horsesport);
  }
  return import("./cross-site");
}

const CONFIGURED = {
  motorsport: "http://localhost:3001",
  horsesport: "http://localhost:3002",
};

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_MOTORSPORT_SITE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_HORSESPORT_SITE_URL", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("resolveContentUrl", () => {
  it("routes horsesport-scoped news to the horse sport site", async () => {
    const { resolveContentUrl } = await loadCrossSite(CONFIGURED);
    expect(
      resolveContentUrl({
        slug: "sarga-national-derby",
        contentType: "news",
        siteScope: "horsesport",
      }),
    ).toEqual({
      href: "http://localhost:3002/news/sarga-national-derby",
      isExternal: true,
    });
  });

  it("routes motorsport-scoped events to the motorsport site", async () => {
    const { resolveContentUrl } = await loadCrossSite(CONFIGURED);
    expect(
      resolveContentUrl({
        slug: "race-weekend",
        contentType: "events",
        siteScope: "motorsport",
      }),
    ).toEqual({
      href: "http://localhost:3001/events/race-weekend",
      isExternal: true,
    });
  });

  it("keeps gateway/shared/unscoped content on the gateway", async () => {
    const { resolveContentUrl } = await loadCrossSite(CONFIGURED);
    expect(
      resolveContentUrl({
        slug: "a",
        contentType: "news",
        siteScope: "gateway",
      }),
    ).toEqual({ href: "/news/a", isExternal: false });
    expect(
      resolveContentUrl({
        slug: "b",
        contentType: "events",
        siteScope: "shared",
      }),
    ).toEqual({ href: "/ticket-hub/b", isExternal: false });
    expect(resolveContentUrl({ slug: "c", contentType: "news" })).toEqual({
      href: "/news/c",
      isExternal: false,
    });
  });

  it("falls back to the gateway when the dedicated site is not configured", async () => {
    const { resolveContentUrl } = await loadCrossSite({
      motorsport: "",
      horsesport: "",
    });
    expect(
      resolveContentUrl({
        slug: "derby",
        contentType: "events",
        siteScope: "horsesport",
      }),
    ).toEqual({ href: "/ticket-hub/derby", isExternal: false });
  });
});

describe("businessSiteUrl", () => {
  it("maps dedicated-site businesses to their frontends", async () => {
    const { businessSiteUrl } = await loadCrossSite(CONFIGURED);
    expect(businessSiteUrl("sarga-horse-sport")).toBe("http://localhost:3002/");
    expect(businessSiteUrl("sarga-motorsport")).toBe("http://localhost:3001/");
  });

  it("returns undefined for gateway-hosted businesses", async () => {
    const { businessSiteUrl } = await loadCrossSite(CONFIGURED);
    expect(businessSiteUrl("sarga-venues")).toBeUndefined();
  });

  it("uses a valid CMS destination only when environment configuration is absent", async () => {
    const { businessSiteUrl } = await loadCrossSite({
      motorsport: "",
      horsesport: "",
    });
    expect(
      businessSiteUrl(
        "sarga-motorsport",
        "https://motorsport.sarga.co/programmes",
      ),
    ).toBe("https://motorsport.sarga.co/programmes");
    expect(
      businessSiteUrl("sarga-motorsport", "javascript:alert(1)"),
    ).toBeUndefined();
  });

  it("returns undefined when the dedicated site is not configured", async () => {
    const { businessSiteUrl } = await loadCrossSite({ horsesport: "" });
    expect(businessSiteUrl("sarga-horse-sport")).toBeUndefined();
  });
});

describe("safeBusinessCtaUrl", () => {
  it("accepts local paths and HTTPS destinations", async () => {
    const { safeBusinessCtaUrl } = await loadCrossSite(CONFIGURED);
    expect(safeBusinessCtaUrl("/contact?subject=venue")).toBe(
      "/contact?subject=venue",
    );
    expect(safeBusinessCtaUrl("https://partners.example.com/brief")).toBe(
      "https://partners.example.com/brief",
    );
  });

  it("rejects protocol-relative and executable destinations", async () => {
    const { safeBusinessCtaUrl } = await loadCrossSite(CONFIGURED);
    expect(safeBusinessCtaUrl("//attacker.example")).toBeUndefined();
    expect(safeBusinessCtaUrl("javascript:alert(1)")).toBeUndefined();
  });
});

describe("dedicatedSiteLabel", () => {
  it("labels each dedicated site", async () => {
    const { dedicatedSiteLabel } = await loadCrossSite(CONFIGURED);
    expect(dedicatedSiteLabel("motorsport")).toBe("motorsport site");
    expect(dedicatedSiteLabel("horsesport")).toBe("horse sport site");
    expect(dedicatedSiteLabel("shared")).toBe("dedicated site");
  });
});
