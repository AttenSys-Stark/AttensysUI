import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin
const initializeFirebaseAdmin = () => {
  try {
    if (!getApps().length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n",
      );

      console.log(
        "Firebase Admin initialization - checking environment variables:",
      );
      console.log("Project ID:", projectId ? "SET" : "NOT_SET");
      console.log("Client Email:", clientEmail ? "SET" : "NOT_SET");
      console.log("Private Key:", privateKey ? "SET" : "NOT_SET");

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

      console.log("Firebase Admin initialized successfully");
    } else {
      console.log("Firebase Admin already initialized");
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    throw error;
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
    console.log("Callback base URL:", baseUrl);
    console.log(
      "Request headers:",
      Object.fromEntries(request.headers.entries()),
    );

    if (error) {
      console.error("OAuth error received:", error);
      return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
    }

    if (!code) {
      console.error("No authorization code received");
      return NextResponse.redirect(`${baseUrl}/?error=no_code`);
    }

    console.log("Authorization code received, proceeding with token exchange");

    // Decode the state parameter to get the original redirect path
    let originalRedirectPath = "/Home";
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, "base64").toString());
        originalRedirectPath = stateData.redirectTo || "/Home";
        console.log("Decoded redirect path:", originalRedirectPath);
      } catch (error) {
        console.error("Error decoding state parameter:", error);
        // Fallback to default redirect
        originalRedirectPath = "/Home";
      }
    }

    // Exchange code for tokens using Google OAuth API
    const redirectUri = `${baseUrl}/api/auth/google/callback`;
    console.log("Using redirect URI:", redirectUri);

    // Validate that we have the required environment variables
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error("Missing Google OAuth environment variables");
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
      console.error("Token exchange failed:", errorText);
      console.error("Token exchange status:", tokenResponse.status);
      console.error(
        "Token exchange headers:",
        Object.fromEntries(tokenResponse.headers.entries()),
      );

      // Check for specific OAuth errors
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error === "redirect_uri_mismatch") {
          console.error(
            "Redirect URI mismatch. Expected:",
            errorData.error_description,
          );
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
    console.log("Token exchange successful");

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
      console.error("Failed to get user info from Google");
      console.error("User info status:", userInfoResponse.status);
      return NextResponse.redirect(`${baseUrl}/?error=user_info_failed`);
    }

    const userInfo = await userInfoResponse.json();
    console.log("User info retrieved:", {
      email: userInfo.email,
      name: userInfo.name,
    });

    // Initialize Firebase Admin
    initializeFirebaseAdmin();

    // Create or get Firebase user
    let firebaseUser;
    try {
      // Try to get existing user by email
      firebaseUser = await getAuth().getUserByEmail(userInfo.email);
      console.log("Existing Firebase user found:", firebaseUser.uid);
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
          console.log("New Firebase user created:", firebaseUser.uid);
        } catch (createError: any) {
          console.error("Failed to create Firebase user:", createError);
          if (createError.code === "auth/email-already-exists") {
            // User was created by another process, try to get them again
            firebaseUser = await getAuth().getUserByEmail(userInfo.email);
            console.log(
              "Retrieved existing Firebase user after creation conflict:",
              firebaseUser.uid,
            );
          } else {
            throw createError;
          }
        }
      } else {
        console.error("Failed to get Firebase user:", error);
        throw error;
      }
    }

    // Create custom token
    let customToken;
    try {
      customToken = await getAuth().createCustomToken(firebaseUser.uid);
      console.log("Custom token created for user:", firebaseUser.uid);
    } catch (tokenError) {
      console.error("Failed to create custom token:", tokenError);
      throw tokenError;
    }

    // Redirect to frontend with custom token and original redirect path
    const redirectUrl = new URL(baseUrl);
    redirectUrl.searchParams.set("customToken", customToken);
    redirectUrl.searchParams.set("authType", "google");
    redirectUrl.searchParams.set("redirectPath", originalRedirectPath);

    console.log("Redirecting to:", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Google callback error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );
    const baseUrl = getBaseUrl(request);
    return NextResponse.redirect(`${baseUrl}/?error=callback_failed`);
  }
}
