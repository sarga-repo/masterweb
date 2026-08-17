import type { Core } from "@strapi/strapi";

import {
  getMotorsportPreviewPath,
  isApprovedMotorsportPreviewUid,
  normalizePreviewLocale,
  normalizePreviewStatus,
  type PreviewDocument,
} from "../src/preview/preview-path";
import {
  isAllowedPreviewOrigin,
  parsePreviewOrigins,
} from "../src/preview/preview-origin";

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT"),
    },
  },
  secrets: {
    encryptionKey: env("ENCRYPTION_KEY"),
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
    docLinks: env.bool("FLAG_DOC_LINKS", true),
  },
  preview: {
    enabled: env.bool("PREVIEW_ENABLED", false),
    config: {
      allowedOrigins: parsePreviewOrigins(
        env(
          "PREVIEW_ALLOWED_ORIGINS",
          env("CLIENT_URL", "http://localhost:3001"),
        ),
      ),
      async handler(uid, { documentId, locale, status }) {
        if (!isApprovedMotorsportPreviewUid(uid)) return null;
        const normalizedLocale = normalizePreviewLocale(locale);
        const normalizedStatus = normalizePreviewStatus(status);
        const previewSecret = env("PREVIEW_SECRET", "");
        const allowedOrigins = parsePreviewOrigins(
          env(
            "PREVIEW_ALLOWED_ORIGINS",
            env("CLIENT_URL", "http://localhost:3001"),
          ),
        );
        const previewUrl = env("PREVIEW_URL", "http://localhost:3001");
        let previewOrigin: string;
        try {
          previewOrigin = new URL(previewUrl).origin;
        } catch {
          return null;
        }

        if (
          !normalizedLocale ||
          !normalizedStatus ||
          !previewSecret ||
          !documentId ||
          !isAllowedPreviewOrigin(previewOrigin, allowedOrigins)
        )
          return null;

        const strapi = (
          globalThis as typeof globalThis & {
            strapi?: {
              documents: (contentType: string) => {
                findOne: (params: Record<string, unknown>) => Promise<unknown>;
              };
            };
          }
        ).strapi;
        if (!strapi) return null;

        const populate =
          uid === "api::motorsport-rider.motorsport-rider" ||
          uid === "api::motorsport-standing.motorsport-standing" ||
          uid === "api::motorsport-regulation.motorsport-regulation"
            ? ["program"]
            : undefined;
        let document: unknown;
        try {
          const findOne = (
            strapi.documents(uid) as unknown as {
              findOne: (params: Record<string, unknown>) => Promise<unknown>;
            }
          ).findOne;
          document = await findOne({
            documentId,
            locale: normalizedLocale,
            status: normalizedStatus,
            ...(populate ? { populate } : {}),
          });
        } catch {
          return null;
        }
        const pathname = getMotorsportPreviewPath(
          uid,
          document as PreviewDocument | null,
          normalizedLocale,
        );
        if (!pathname) return null;

        const params = new URLSearchParams({
          url: pathname,
          secret: previewSecret,
          status: normalizedStatus,
          uid,
          documentId,
          locale: normalizedLocale,
        });
        return `${previewUrl.replace(/\/$/, "")}/api/preview?${params}`;
      },
    },
  },
});

export default config;
