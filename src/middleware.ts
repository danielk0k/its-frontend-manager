import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";
import { auth } from "./lib/auth";

export default auth(async function middleware(request) {
  const secureCookie = process.env.NODE_ENV === "production";
  const cookieName = secureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
  const secret = process.env.AUTH_SECRET;
  const token = await getToken({
    req: request,
    secret: secret,
    secureCookie,
    salt: cookieName,
  });
  if (!token) return NextResponse.redirect(new URL("/signin", request.url));

  // Check the role and redirect based on the role
  if (token) {
    switch (token.role) {
      case Role.ADMIN:
        if (!request.nextUrl.pathname.startsWith("/user-management")) {
          return NextResponse.redirect(
            new URL("/user-management", request.url)
          );
        }
        break;
      case Role.TEACHER:
        if (!request.nextUrl.pathname.startsWith("/courses")) {
          return NextResponse.redirect(new URL("/courses", request.url));
        }
        break;
      case Role.STUDENT:
        // Add the paths that the student can access here
        if (!request.nextUrl.pathname.startsWith("/courses")) {
          return NextResponse.redirect(new URL("/courses", request.url));
        }
        break;
      default:
        return NextResponse.redirect(new URL("/signin", request.url));
    }
  }
});

export const config = {
  matcher: [
    // Match all routes except the ones that start with /signin and api and the static folder
    "/((?!api|_next/static|_next/image|favicon.ico|signin|signup|forgot-password).*)",
  ],
};
