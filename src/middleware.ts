import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "no"],
  defaultLocale: "no",
});

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (/^\/(?:no|en)\//.test(pathname)) {
    // Path is prefixed with a locale, so init the
    // internationalization middleware.
    return intlMiddleware(request);
  }

  // The path is missing the locale prefix, so redirect
  // to the path with the default language.
  const url = request.nextUrl.clone();
  url.pathname = `/no${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
