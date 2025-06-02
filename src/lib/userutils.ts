// userUtils.js
import {
  db,
  sendPasswordReset,
  signInWithEmail,
  signUpWithEmail,
  waitForEmailVerification,
} from "./firebase/client";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string | null;
  emailVerified: boolean;
  createdAt?: Date;
  lastLogin?: Date;
  updatedAt?: Date;
}

export const createUserProfile = async (user: UserProfile) => {
  if (!user || !user.uid) return null;

  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || "",
    photoURL: user.photoURL || null,
    emailVerified: user.emailVerified,
    lastLogin: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...(!userSnapshot.exists() && { createdAt: serverTimestamp() }),
  };

  try {
    await setDoc(userRef, userData, { merge: true });
    return userData;
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (uid: string) => {
  if (!uid) return null;
  const userRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userRef);
  if (userSnapshot.exists()) {
    return userSnapshot.data();
  }
  return null;
};

export const signUpUserWithEmail = async (
  email: string,
  password: string,
  displayName: string,
): Promise<any | null> => {
  try {
    const user = await signUpWithEmail(email, password, displayName);
    return user;
  } catch (error) {
    console.error("Email sign up error:", error);
    throw error;
  }
};

export const signInUserWithEmail = async (
  email: string,
  password: string,
): Promise<any | null> => {
  try {
    const user = await signInWithEmail(email, password);
    return user;
  } catch (error: any) {
    if (
      error.code === "auth/user-not-found" ||
      error.message === "No account found"
    ) {
      console.log("No account found for this user");
    }
    console.error("Email sign in error:", error);
    throw error;
  }
};

export const checkEmailVerification = async (userdata: any) => {
  try {
    const user = await waitForEmailVerification(userdata);
    return user;
  } catch (error) {
    console.error("Email verification error:", error);
    throw error;
  }
};

export const loginUserWithEmail = async (email: string, password: string) => {
  try {
    const user = await signInWithEmail(email, password);
    return user;
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      throw new Error("No account found with this email");
    } else if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect password");
    } else if (error.code === "auth/email-not-verified") {
      throw error; // Already has user-friendly message
    }
    throw new Error("Login failed. Please try again.");
  }
};

export const resetUserPassword = async (email: string) => {
  try {
    await sendPasswordReset(email);
    return true;
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      throw new Error("No account found with this email");
    }
    throw new Error("Password reset failed. Please try again.");
  }
};
