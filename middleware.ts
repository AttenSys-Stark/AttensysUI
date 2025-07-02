import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = [
  "/Home",
  "/Mybootcamps",
  "/adminconsole",
  "/Course",
  "/course",
  "/mycoursepage",
];

const ADMIN_EMAIL = "attensyshq@gmail.com";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is trying to access the root path while authenticated
  if (pathname === "/") {
    const firebaseToken = request.cookies.get("firebase-auth-token")?.value;

    if (firebaseToken) {
      // User is authenticated, but let client-side logic handle account completion
      // Don't redirect immediately - let the signup process complete
      return NextResponse.next();
    }

    // User is not authenticated, allow access to login page
    return NextResponse.next();
  }

  // Check if the current path is protected
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Check for Firebase auth token in cookies
    const firebaseToken = request.cookies.get("firebase-auth-token")?.value;

    if (!firebaseToken) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the token by calling our verification API
    try {
      const verifyResponse = await fetch(
        `${request.nextUrl.origin}/api/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: firebaseToken }),
        },
      );

      if (!verifyResponse.ok) {
        // Token is invalid, redirect to login
        const loginUrl = new URL("/", request.url);
        return NextResponse.redirect(loginUrl);
      }

      // For adminconsole route, check if user is admin
      if (pathname.startsWith("/adminconsole")) {
        const userData = await verifyResponse.json();
        const userEmail = userData.email;

        if (userEmail !== ADMIN_EMAIL) {
          // User is not admin, redirect to Home
          const homeUrl = new URL("/Home", request.url);
          return NextResponse.redirect(homeUrl);
        }
      }
    } catch (error) {
      console.error("Token verification error:", error);
      // If verification fails, redirect to login
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Specify which routes to match
export const config = {
  matcher: [
    "/",
    "/Home/:path*",
    "/Mybootcamps/:path*",
    "/adminconsole/:path*",
    "/Course/:path*",
    "/course/:path*",
    "/mycoursepage/:path*",
  ],
};
