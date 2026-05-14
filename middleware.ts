import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";

const adminPrefix = "/admin";
const dealerPrefix = "/dealer";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(adminPrefix) && !pathname.startsWith(dealerPrefix)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token || typeof token.role !== "string") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith(adminPrefix) && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    pathname.startsWith(dealerPrefix) &&
    token.role !== "DEALER" &&
    token.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dealer/:path*"],
};