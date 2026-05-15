import NextAuth from "next-auth";

import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const isAdminRoute =
    req.nextUrl.pathname.startsWith("/admin");

  const isDealerRoute =
    req.nextUrl.pathname.startsWith("/dealer");

  if (
    (isAdminRoute || isDealerRoute) &&
    !isLoggedIn
  ) {
    return Response.redirect(
      new URL("/login", req.nextUrl)
    );
  }
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/dealer/:path*",
  ],
};