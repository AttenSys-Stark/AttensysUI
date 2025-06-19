// userUtils.js
import {
  db,
  sendPasswordReset,
  signInWithEmail,
  signUpWithEmail,
  waitForEmailVerification,
} from "./firebase/client";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { AccountHandler } from "@/helpers/accounthandler";
import { encryptPrivateKey } from "@/helpers/encrypt";

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

export const createUserProfile = async (
  user: UserProfile,
  onAccountProgress?: (status: string) => void,
) => {
  if (!user || !user.uid) return null;
  const encryptionSecret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;
  if (!encryptionSecret) {
    throw new Error("Encryption secret is not set");
  }

  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  let accountData = {};
  let accountCreated = false;

  // Check if user needs a Starknet account
  const needsStarknetAccount =
    !userSnapshot.exists() ||
    !userSnapshot.data()?.starknetPrivateKey ||
    !userSnapshot.data()?.starknetAddress;

  if (needsStarknetAccount) {
    try {
      onAccountProgress?.("Creating Starknet account...");
      const { privateKeyAX, AXcontractFinalAddress } =
        await AccountHandler(onAccountProgress);
      const encryptedPrivateKey = encryptPrivateKey(
        privateKeyAX,
        encryptionSecret,
      );
      accountData = {
        starknetPrivateKey: encryptedPrivateKey,
        starknetAddress: AXcontractFinalAddress,
      };
      accountCreated = true;
    } catch (err) {
      onAccountProgress?.("Error creating Starknet account");
      console.error("Error creating Starknet account:", err);
      throw err;
    }
  }

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || "",
    photoURL: user.photoURL || null,
    emailVerified: user.emailVerified,
    lastLogin: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...accountData,
    ...(!userSnapshot.exists() && { createdAt: serverTimestamp() }),
  };

  try {
    await setDoc(userRef, userData, { merge: true });

    // Send welcome email only for new users
    if (!userSnapshot.exists()) {
      try {
        console.log("Attempting to send welcome email to:", user.email);
        const response = await fetch(
          "https://attensys-1a184d8bebe7.herokuapp.com/api/welcome-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              username: user.displayName || user.email,
            }),
          },
        );

        const responseData = await response.text();
        console.log("Welcome email response:", response.status, responseData);

        if (!response.ok) {
          console.warn("Welcome email could not be sent:", responseData);
        }
      } catch (emailError) {
        // Log the error but don't fail the profile creation process
        console.warn("Error sending welcome email:", emailError);
      }
    }

    return userData;
  } catch (error) {
    onAccountProgress?.("Error saving user profile");
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
  onAccountProgress?: (status: string) => void,
): Promise<any | null> => {
  try {
    const user = await signUpWithEmail(
      email,
      password,
      displayName,
      onAccountProgress,
    );
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
