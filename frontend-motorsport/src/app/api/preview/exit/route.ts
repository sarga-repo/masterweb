import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { MOTORSPORT_PREVIEW_COOKIE } from "@/lib/preview/preview-context";

/** Leave an authenticated CMS Preview session and return to the live site. */
export async function GET() {
  const mode = await draftMode();
  mode.disable();

  const store = await cookies();
  store.delete(MOTORSPORT_PREVIEW_COOKIE);

  redirect("/");
}
