import { NextResponse, type NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  isLocale,
  localeFromPathname,
  stripLocalePrefix,
} from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const rewriteLocale = request.nextUrl.searchParams.get("__sarga_locale");
  const locale = isLocale(rewriteLocale)
    ? rewriteLocale
    : localeFromPathname(request.nextUrl.pathname);
  const routePath = stripLocalePrefix(request.nextUrl.pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-sarga-locale", locale);
  requestHeaders.set("x-sarga-pathname", routePath);

  // Keep a request-side fallback for deployments where the custom headers
  // above are removed while Next performs the internal rewrite.
  const cookies = (request.headers.get("cookie") ?? "")
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .filter((cookie) => !cookie.startsWith(`${LOCALE_COOKIE}=`));
  cookies.push(`${LOCALE_COOKIE}=${locale}`);
  requestHeaders.set("cookie", cookies.join("; "));

  if (locale === "id") {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = routePath;
    rewritten.searchParams.set("__sarga_locale", locale);
    return NextResponse.rewrite(rewritten, {
      request: { headers: requestHeaders },
    });
  }
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
