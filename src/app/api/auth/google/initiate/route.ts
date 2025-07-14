import { NextRequest, NextResponse } from "next/server";

// Helper function to determine the correct base URL
const getBaseUrl = (request: NextRequest): string => {
  // First, try to get the origin from headers
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const xForwardedHost = request.headers.get("x-forwarded-host");
  const xForwardedProto = request.headers.get("x-forwarded-proto");

  // Check if we're in a localhost environment
  const isLocalhost =
    origin?.includes("localhost") ||
    origin?.includes("127.0.0.1") ||
    host?.includes("localhost") ||
    host?.includes("127.0.0.1");

  if (isLocalhost) {
    // For localhost, construct the URL from host
    const protocol = origin?.startsWith("https") ? "https" : "http";
    return `${protocol}://${host || origin?.replace(/^https?:\/\//, "")}`;
  }

  // For production, use the environment variable or construct from headers
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Fallback: construct from forwarded headers or host
  if (xForwardedHost && xForwardedProto) {
    return `${xForwardedProto}://${xForwardedHost}`;
  }

  if (host) {
    // Assume HTTPS for production
    return `https://${host}`;
  }

  // Final fallback
  return "https://www.attensys.xyz";
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get("redirectTo") || "/Home";

    // Generate state parameter for security
    const state = Buffer.from(JSON.stringify({ redirectTo })).toString(
      "base64",
    );

    // Get the correct base URL
    const baseUrl = getBaseUrl(request);

    // Construct Google OAuth URL
    const googleAuthUrl = new URL(
      "https://accounts.google.com/o/oauth2/v2/auth",
    );
    googleAuthUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
    googleAuthUrl.searchParams.set(
      "redirect_uri",
      `${baseUrl}/api/auth/google/callback`,
    );
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("state", state);
    googleAuthUrl.searchParams.set("access_type", "offline");
    googleAuthUrl.searchParams.set("prompt", "select_account");

    return NextResponse.redirect(googleAuthUrl.toString());
  } catch (error) {
    const baseUrl = getBaseUrl(request);
    return NextResponse.redirect(`${baseUrl}/?error=initiation_failed`);
  }
}
