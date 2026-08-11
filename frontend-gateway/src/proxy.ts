import { NextResponse, type NextRequest } from "next/server";
import { localeFromPathname, stripLocalePrefix } from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = localeFromPathname(pathname);
  const requestHeaders = new Headers(request.headers);
  const routePath = stripLocalePrefix(pathname);

  requestHeaders.set("x-sarga-locale", locale);
  requestHeaders.set("x-sarga-pathname", routePath);

  if (locale === "id") {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = routePath;
    return NextResponse.rewrite(rewritten, {
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
