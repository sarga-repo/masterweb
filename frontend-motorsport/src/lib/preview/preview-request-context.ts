import "server-only";

import { cookies } from "next/headers";

import {
  MOTORSPORT_PREVIEW_COOKIE,
  verifyPreviewContext,
} from "./preview-context";

export async function getMotorsportPreviewContext() {
  const store = await cookies();
  return verifyPreviewContext(
    store.get(MOTORSPORT_PREVIEW_COOKIE)?.value,
    process.env.PREVIEW_SECRET,
  );
}
