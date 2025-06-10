import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Define protected routes
const protectedRoutes = [
  "/Home",
  // Add more protected routes here
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Check if the current path is protected
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

// Specify which routes to match
export const config = {
  matcher: ["/Home" /* add more protected routes here */],
};
