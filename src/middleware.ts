// import NextAuth from "next-auth";
// import authConfig from "./auth.config";

// import {
//     DEFAULT_LOGIN_REDIRECT,
//     apiAuthPrefix,
//     authRoutes,
//     publicRoutes,
// } from  "./route";

// const { auth } = NextAuth(authConfig);

// export default auth((req) => {
//     const { nextUrl } = req;
//     const isLoggedIn = !!req.auth;

//     const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//     const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//     const isAuthRoute = authRoutes.includes(nextUrl.pathname);

//     if (isApiAuthRoute) {
//       return null;
//     }

//     if (isAuthRoute) {
//       if (isLoggedIn) {
//         return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
//       }
//       return null;
//     }

//     if (!isLoggedIn && !isPublicRoute) {


//       return Response.redirect(new URL(
//         "/auth/register",
//         nextUrl
//       ));
//     }

//     return null;
// })

// // Optionally, don't invoke Middleware on some paths
// export const config = {
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// }

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";



export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  if (!token) return NextResponse.redirect(new URL("/signin", request.url));

  // Check the role and redirect based on the role
  switch (token.role) {
    case "ADMIN":
      if (!request.nextUrl.pathname.startsWith("/user-management")) {
        return NextResponse.redirect(new URL("/user-management", request.url));
      }
      break;
    case "TEACHER":
      if (
        !request.nextUrl.pathname.startsWith("/patients") &&
        !request.nextUrl.pathname.startsWith("/patientprofile") &&
        !request.nextUrl.pathname.startsWith("/complain") &&
        !request.nextUrl.pathname.startsWith("/report")
      ) {
        return NextResponse.redirect(new URL("/zzz", request.url));
      }
      break;
    case "STUDENT":
      // Add the paths that the nurse can access here
      if (!request.nextUrl.pathname.startsWith("/vitals")) {
        return NextResponse.redirect(new URL("/vitals", request.url));
      }
      break;
    case "PATHOLOGIST":
      // Add the paths that the pathologist can access here
      if (!request.nextUrl.pathname.startsWith("/image")) {
        return NextResponse.redirect(new URL("/image", request.url));
      }
      break;
    default:
      return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    // Match all routes except the ones that start with /login and api and the static folder
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
