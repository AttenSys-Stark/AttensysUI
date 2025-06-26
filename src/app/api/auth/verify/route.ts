import { NextRequest, NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin only when needed
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
    // Initialize Firebase Admin only when the API is called
    initializeFirebaseAdmin();

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // Verify the Firebase ID token
    const decodedToken = await auth().verifyIdToken(token);

    return NextResponse.json({
      valid: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
