import { NextResponse } from "next/server";

import { auth } from "@/auth";

import { UserRole } from "@/lib/generated/prisma";

const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

function getRoleHome(role?: UserRole) {
  if (role === UserRole.ADMIN) {
    return "/admin";
  }

  if (role === UserRole.DEALER) {
    return "/dealer";
  }

  return "/";
}

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const role = request.auth?.user?.role as UserRole | undefined;
  const isAuthenticated = Boolean(request.auth?.user);

  if (authRoutes.includes(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(
        new URL(getRoleHome(role), request.url)
      );
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    if (role !== UserRole.ADMIN) {
      return NextResponse.redirect(
        new URL(getRoleHome(role), request.url)
      );
    }
  }

  if (pathname.startsWith("/dealer")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    if (role !== UserRole.DEALER) {
      return NextResponse.redirect(
        new URL(getRoleHome(role), request.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/dealer/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};