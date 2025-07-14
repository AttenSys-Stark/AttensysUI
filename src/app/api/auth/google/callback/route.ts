import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin
const initializeFirebaseAdmin = () => {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Determine the base URL dynamically
    const origin = request.headers.get("origin") || request.headers.get("host");
    const isLocalhost =
      origin?.includes("localhost") || origin?.includes("127.0.0.1");
    const baseUrl = isLocalhost
      ? `http://${origin}`
      : process.env.NEXT_PUBLIC_APP_URL || "https://www.attensys.xyz";

    if (error) {
      return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/?error=no_code`);
    }

    // Exchange code for tokens using Google OAuth API
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", await tokenResponse.text());
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
    } catch (error) {
      // User doesn't exist, create new user
      firebaseUser = await getAuth().createUser({
        email: userInfo.email,
        displayName: userInfo.name,
        photoURL: userInfo.picture,
        emailVerified: userInfo.verified_email,
      });
    }

    // Create custom token
    const customToken = await getAuth().createCustomToken(firebaseUser.uid);

    // Redirect to frontend with custom token
    const redirectUrl = new URL(baseUrl);
    redirectUrl.searchParams.set("customToken", customToken);
    redirectUrl.searchParams.set("authType", "google");

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Google callback error:", error);
    const origin = request.headers.get("origin") || request.headers.get("host");
    const isLocalhost =
      origin?.includes("localhost") || origin?.includes("127.0.0.1");
    const baseUrl = isLocalhost
      ? `http://${origin}`
      : process.env.NEXT_PUBLIC_APP_URL || "https://www.attensys.xyz";

    return NextResponse.redirect(`${baseUrl}/?error=callback_failed`);
  }
}
