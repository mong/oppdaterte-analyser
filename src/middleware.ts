import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.rewrite(new URL("/no/", request.url));
}

export const config = {
  matcher: ["/"],
};
