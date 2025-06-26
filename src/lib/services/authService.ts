import { authClient } from "../auth.client";
import { auth, signInWithGoogle } from "../firebase/client";
import {
  signInAnonymously,
  onAuthStateChanged,
  User,
  AuthError,
  User as FirebaseUser,
} from "firebase/auth";
import { createUserProfile, getUserProfile } from "../userutils";

interface IUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type AuthData =
  | { user: IUser; token: string; redirect: false; url?: undefined }
  | { url: string; redirect: true; user?: never };

export const signInUser = async (
  onAccountProgress?: (status: string) => void,
): Promise<FirebaseUser | null> => {
  try {
    // Sign in with Google
    const user = await signInWithGoogle(onAccountProgress);
    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  if (!auth) {
    console.warn("Firebase auth is not available");
    return null;
  }
  return auth.currentUser;
};

export const authStateListener = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.warn("Firebase auth is not available");
    return () => {}; // Return empty unsubscribe function
  }
  return onAuthStateChanged(auth, callback);
};
