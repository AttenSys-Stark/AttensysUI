import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin
const initializeFirebaseAdmin = () => {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, "\n");
    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Firebase Admin environment variables are not properly configured",
      );
    }
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
};

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
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Get the correct base URL
    const baseUrl = getBaseUrl(request);

    if (error) {
      return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/?error=no_code`);
    }

    // Decode the state parameter to get the original redirect path
    let originalRedirectPath = "/Home";
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, "base64").toString());
        originalRedirectPath = stateData.redirectTo || "/Home";
      } catch (error) {
        // Fallback to default redirect
        originalRedirectPath = "/Home";
      }
    }

    // Exchange code for tokens using Google OAuth API
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Validate that we have the required environment variables
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.redirect(`${baseUrl}/?error=config_error`);
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();

      // Check for specific OAuth errors
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error === "redirect_uri_mismatch") {
          return NextResponse.redirect(
            `${baseUrl}/?error=redirect_uri_mismatch`,
          );
        }
      } catch (parseError) {
        // If we can't parse the error, continue with generic error
      }

      return NextResponse.redirect(`${baseUrl}/?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, id_token } = tokenData;

    // Get user info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(`${baseUrl}/?error=user_info_failed`);
    }

    const userInfo = await userInfoResponse.json();

    // Initialize Firebase Admin
    initializeFirebaseAdmin();

    // Create or get Firebase user
    let firebaseUser;
    try {
      // Try to get existing user by email
      firebaseUser = await getAuth().getUserByEmail(userInfo.email);
    } catch (error: any) {
      // Check if the error is because user doesn't exist
      if (error.code === "auth/user-not-found") {
        try {
          // User doesn't exist, create new user
          firebaseUser = await getAuth().createUser({
            email: userInfo.email,
            displayName: userInfo.name,
            photoURL: userInfo.picture,
            emailVerified: userInfo.verified_email,
          });
        } catch (createError: any) {
          if (createError.code === "auth/email-already-exists") {
            // User was created by another process, try to get them again
            firebaseUser = await getAuth().getUserByEmail(userInfo.email);
          } else {
            throw createError;
          }
        }
      } else {
        throw error;
      }
    }

    // Create custom token
    let customToken;
    customToken = await getAuth().createCustomToken(firebaseUser.uid);

    // Redirect to frontend with custom token and original redirect path
    const redirectUrl = new URL(baseUrl);
    redirectUrl.searchParams.set("customToken", customToken);
    redirectUrl.searchParams.set("authType", "google");
    redirectUrl.searchParams.set("redirectPath", originalRedirectPath);

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    const baseUrl = getBaseUrl(request);
    return NextResponse.redirect(`${baseUrl}/?error=callback_failed`);
  }
}
