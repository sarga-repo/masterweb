import type { NextConfig } from "next";

/**
 * Allow next/image to optimize media served by the shared Strapi instance.
 * The host is derived from NEXT_PUBLIC_STRAPI_API_URL so it works across
 * local, Docker, and hosted environments without code changes.
 */
function strapiImagePattern() {
  const raw = process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337";
  try {
    const url = new URL(raw);
    return [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port || undefined,
        pathname: "/uploads/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    // Only the configured Strapi host is allowed. Add the specific S3/cloud
    // media hostname (docs/06) here once the storage provider is chosen - do not
    // use a wildcard host.
    remotePatterns: [...strapiImagePattern()],
    // Next 16 blocks image optimization from private/loopback IPs (SSRF
    // protection). Local development fetches Strapi media from localhost, so
    // allow it in development only - never in production.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
