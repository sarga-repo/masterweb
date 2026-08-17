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

function previewAdminOrigins() {
  return Array.from(
    new Set(
      (process.env.PREVIEW_ADMIN_ORIGINS ?? process.env.CMS_ADMIN_ORIGIN ?? "")
        .split(",")
        .map((value) => {
          try {
            const url = new URL(value.trim());
            return ["http:", "https:"].includes(url.protocol) &&
              !url.username &&
              !url.password &&
              url.pathname === "/" &&
              !url.search &&
              !url.hash
              ? url.origin
              : null;
          } catch {
            return null;
          }
        })
        .filter((origin): origin is string => Boolean(origin)),
    ),
  );
}

const nextConfig: NextConfig = {
  async headers() {
    const adminOrigins = previewAdminOrigins();
    return adminOrigins.length > 0
      ? [
          {
            source: "/(.*)",
            headers: [
              {
                key: "Content-Security-Policy",
                value: `frame-ancestors 'self' ${adminOrigins.join(" ")}`,
              },
            ],
          },
        ]
      : [];
  },
  async redirects() {
    return [
      {
        source: "/campaign/fia-rallycross-world-cup-indonesia-2026",
        destination: "/events/fia-rallycross-world-cup-indonesia-2026",
        permanent: true,
      },
    ];
  },
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
