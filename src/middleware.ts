import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = `/no${request.nextUrl.pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Hvis ugyldig språk i URL, legger vi til /no/
    "/((?!_next|no/|en/).*)",
  ],
};
