import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get("redirectTo") || "/Home";

    // Generate state parameter for security
    const state = Buffer.from(JSON.stringify({ redirectTo })).toString(
      "base64",
    );

    // Determine the base URL dynamically
    const origin = request.headers.get("origin") || request.headers.get("host");
    const isLocalhost =
      origin?.includes("localhost") || origin?.includes("127.0.0.1");
    const baseUrl = isLocalhost
      ? `http://${origin}`
      : process.env.NEXT_PUBLIC_APP_URL || "https://www.attensys.xyz";

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
    console.error("Google auth initiation error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "https://www.attensys.xyz"}/?error=initiation_failed`,
    );
  }
}
