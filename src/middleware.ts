import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.redirect("/no");
}

export const config = {
  matcher: ["/"], // Only run on root (/) URL
};
