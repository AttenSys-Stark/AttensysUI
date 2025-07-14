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

export async function POST(request: NextRequest) {
  try {
    initializeFirebaseAdmin();

    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "No ID token provided" },
        { status: 400 },
      );
    }

    // Verify the ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);

    // Create a custom token for the user
    const customToken = await getAuth().createCustomToken(decodedToken.uid);

    return NextResponse.json({
      success: true,
      customToken,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
        photoURL: decodedToken.picture,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 },
    );
  }
}
