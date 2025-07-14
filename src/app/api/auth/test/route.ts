import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the base URL using the same logic as the callback
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    const xForwardedHost = request.headers.get("x-forwarded-host");
    const xForwardedProto = request.headers.get("x-forwarded-proto");

    const isLocalhost =
      origin?.includes("localhost") ||
      origin?.includes("127.0.0.1") ||
      host?.includes("localhost") ||
      host?.includes("127.0.0.1");

    let baseUrl;
    if (isLocalhost) {
      const protocol = origin?.startsWith("https") ? "https" : "http";
      baseUrl = `${protocol}://${host || origin?.replace(/^https?:\/\//, "")}`;
    } else {
      baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.attensys.xyz";
    }

    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    return NextResponse.json({
      success: true,
      environment: {
        baseUrl,
        redirectUri,
        isLocalhost,
        headers: {
          origin,
          host,
          xForwardedHost,
          xForwardedProto,
        },
        env: {
          NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT_SET",
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
            ? "SET"
            : "NOT_SET",
          FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        },
      },
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
