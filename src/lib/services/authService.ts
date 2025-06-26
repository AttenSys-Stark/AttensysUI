import { auth, signInWithGoogle } from "../firebase/client";
import {
  signInAnonymously,
  onAuthStateChanged,
  User,
  AuthError,
  User as FirebaseUser,
} from "firebase/auth";
import { createUserProfile, getUserProfile } from "../userutils";

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
  return auth.currentUser;
};

export const authStateListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
