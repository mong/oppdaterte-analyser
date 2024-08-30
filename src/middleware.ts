import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "no"],
  defaultLocale: "no",
});

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle language routing first
  const response = intlMiddleware(request);

  // If intlMiddleware didn't handle the request, apply your custom logic
  if (response) return response;

  // Your existing logic
  const url = request.nextUrl.clone();
  url.pathname = `/no${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Intl routes
    "/((?!api|_next|.*\\..*).*)",
    // Your existing matcher
    "/((?!_next|no/|en/|img/|favicon.ico).*)",
  ],
};
