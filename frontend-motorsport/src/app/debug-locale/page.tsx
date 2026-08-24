import { cookies, headers } from "next/headers";

export default async function DebugLocalePage() {
  const requestHeaders = await headers();
  const requestCookies = await cookies();
  return (
    <pre>
      {JSON.stringify(
        {
          localeHeader: requestHeaders.get("x-sarga-locale"),
          pathnameHeader: requestHeaders.get("x-sarga-pathname"),
          rewriteHeader: requestHeaders.get("x-middleware-rewrite"),
          cookie: requestCookies.get("sarga-locale")?.value ?? null,
          allHeaders: Object.fromEntries(requestHeaders),
        },
        null,
        2,
      )}
    </pre>
  );
}
