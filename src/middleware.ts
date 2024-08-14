import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/no";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/"], // Only run on root (/) URL
};
