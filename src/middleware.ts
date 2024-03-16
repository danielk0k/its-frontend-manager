import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";


export async function middleware(request: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  const token = await getToken({
    req: request,
    secret: secret,
    salt: "authjs.session-token"
  });
  if (!token) console.log("null token")
  // if (!token) return NextResponse.redirect(new URL("/signin", request.url));

  // Check the role and redirect based on the role
  console.log(token)
  if (token) {
    switch (token.role) {
      case Role.ADMIN:
        if (!request.nextUrl.pathname.startsWith("/user-management")) {
          return NextResponse.redirect(new URL("/user-management", request.url));
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
}

export const config = {
  matcher: [
    // Match all routes except the ones that start with /signin and api and the static folder
    "/((?!api|_next/static|_next/image|favicon.ico|signin|signup).*)",
  ],
};
