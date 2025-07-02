import { initializeApp, getApps } from "firebase/app";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  reload,
  sendPasswordResetEmail,
  signOut,
  setPersistence,
} from "firebase/auth";
import { createUserProfile, getUserProfile } from "../userutils";
import { AccountHandler } from "@/helpers/accounthandler";
import { Account } from "starknet";
import { encryptPrivateKey, decryptPrivateKey } from "@/helpers/encrypt";
import { provider } from "@/constants";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Google provider with custom configuration
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Initialize anonymous auth immediately
// signInAnonymously(auth).catch((error) => {
//   console.error("Anonymous sign-in failed:", error);
// });

// Function to set Firebase auth token in cookies
const setAuthTokenCookie = async (user: any) => {
  try {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    const token = await user.getIdToken();
    console.log("Setting auth token cookie for user:", user.uid);
    // Set cookie with token (expires in 1 hour)
    document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; secure; samesite=strict`;
    console.log("Auth token cookie set successfully");
  } catch (error) {
    console.error("Error setting auth token cookie:", error);
  }
};

// Function to clear auth token cookie
const clearAuthTokenCookie = () => {
  // Only run in browser environment
  if (typeof window === "undefined") return;

  document.cookie =
    "firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

// Function to handle Google Sign-In
const signInWithGoogle = async (
  onAccountProgress?: (status: string) => void,
) => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Set auth token in cookie
    await setAuthTokenCookie(user);

    // Create/update user profile in Firestore
    await createUserProfile(
      {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified,
      },
      onAccountProgress,
    );

    // Send login notification
    try {
      const response = await fetch(
        "https://attensys-1a184d8bebe7.herokuapp.com/api/login-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Origin: window.location.origin,
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify({
            email: user.email,
            username: user.displayName || user.email,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.warn("Login notification could not be sent:", errorText);
      }
    } catch (notificationError) {
      console.warn("Error sending login notification:", notificationError);
    }

    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string,
  onAccountProgress?: (status: string) => void,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Create user profile in Firestore
    await createUserProfile(
      {
        uid: user.uid,
        email: user.email || email,
        displayName: displayName,
        photoURL: null,
        emailVerified: false,
      },
      onAccountProgress,
    );

    // Send verification email
    await sendEmailVerification(user);

    return {
      user,
      requiresVerification: true,
      message: "Check your email to complete sign up",
      displayname: displayName,
    };
  } catch (error) {
    console.error("Email Sign Up Error:", error);
    throw error;
  }
};

const checkEmailVerification = async (user: any): Promise<boolean> => {
  // Reload user data to get latest verification status
  await reload(user);

  if (user.emailVerified) {
    // Update Firestore if verified
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        emailVerified: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return true;
  }
  return false;
};

// Add auth state listener for verification check
const waitForEmailVerification = (user: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.uid === user.uid) {
        const isVerified = await checkEmailVerification(currentUser);
        if (isVerified) {
          unsubscribe();
          resolve(currentUser);
        }
      }
    });

    // Also check periodically in case auth state doesn't change
    const interval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === user.uid) {
        const isVerified = await checkEmailVerification(currentUser);
        if (isVerified) {
          clearInterval(interval);
          unsubscribe();
          resolve(currentUser);
        }
      }
    }, 5000); // Check every 5 seconds

    // Timeout after 10 minutes
    setTimeout(() => {
      clearInterval(interval);
      unsubscribe();
      reject(new Error("Email verification timed out"));
    }, 600000);
  });
};

const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Set auth token in cookie
    await setAuthTokenCookie(user);

    // Check if email is verified
    if (!user.emailVerified) {
      await sendEmailVerification(user);
      throw {
        code: "auth/email-not-verified",
        message:
          "Please verify your email first. A new verification link has been sent.",
      };
    }

    // Get user profile to check if they have a Starknet account
    const userProfile = await getUserProfile(user.uid);
    const encryptionSecret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;

    if (!encryptionSecret) {
      throw new Error("Encryption secret is not set");
    }

    // Check if user needs a Starknet account
    const needsStarknetAccount =
      !userProfile ||
      !userProfile.starknetPrivateKey ||
      !userProfile.starknetAddress;

    if (needsStarknetAccount) {
      try {
        // Create Starknet account using AccountHandler
        const { privateKeyAX, AXcontractFinalAddress } = await AccountHandler();
        const encryptedPrivateKey = encryptPrivateKey(
          privateKeyAX,
          encryptionSecret,
        );

        // Update user profile with Starknet account details
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            starknetPrivateKey: encryptedPrivateKey,
            starknetAddress: AXcontractFinalAddress,
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );

        // Create new account instance with the generated credentials
        const newAccount = new Account(
          provider,
          AXcontractFinalAddress,
          privateKeyAX,
        );

        // Send login notification
        try {
          const response = await fetch(
            "https://attensys-1a184d8bebe7.herokuapp.com/api/login-notification",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Origin: window.location.origin,
              },
              credentials: "include",
              mode: "cors",
              body: JSON.stringify({
                email: user.email,
                username: user.displayName || user.email,
              }),
            },
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.warn("Login notification could not be sent:", errorText);
          }
        } catch (notificationError) {
          console.warn("Error sending login notification:", notificationError);
        }

        return {
          ...user,
          account: newAccount,
          starknetAddress: AXcontractFinalAddress,
        };
      } catch (err) {
        console.error("Error creating Starknet account:", err);
        throw err;
      }
    } else {
      // User already has a Starknet account, decrypt and create account instance
      const decryptedPrivateKey = decryptPrivateKey(
        userProfile.starknetPrivateKey,
        encryptionSecret,
      );

      if (!decryptedPrivateKey) {
        throw new Error("Failed to decrypt private key");
      }

      const existingAccount = new Account(
        provider,
        userProfile.starknetAddress,
        decryptedPrivateKey,
      );

      // Update last login time
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          lastLogin: serverTimestamp(),
        },
        { merge: true },
      );

      // Send login notification
      try {
        const response = await fetch(
          "https://attensys-1a184d8bebe7.herokuapp.com/api/login-notification",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Origin: window.location.origin,
            },
            credentials: "include",
            mode: "cors",
            body: JSON.stringify({
              email: user.email,
              username: user.displayName || user.email,
            }),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.warn("Login notification could not be sent:", errorText);
        }
      } catch (notificationError) {
        console.warn("Error sending login notification:", notificationError);
      }

      return {
        ...user,
        account: existingAccount,
        starknetAddress: userProfile.starknetAddress,
      };
    }
  } catch (error) {
    console.error("Email Sign In Error:", error);
    throw error;
  }
};

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Password Reset Error:", error);
    throw error;
  }
};

// Sign out all authenticated users (Google, email, etc.)
const signOutAll = async () => {
  try {
    await signOut(auth);
    // Clear auth token cookie
    clearAuthTokenCookie();
    return true;
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

// Initialize auth state listener to manage token cookies
const initializeAuthListener = () => {
  // Only run in browser environment
  if (typeof window === "undefined") return;

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, set/refresh token cookie
      await setAuthTokenCookie(user);
    } else {
      // User is signed out, clear token cookie
      clearAuthTokenCookie();
    }
  });
};

// Initialize the auth listener only in browser
if (typeof window !== "undefined") {
  initializeAuthListener();
  setPersistence(auth, browserLocalPersistence);
}

export {
  db,
  auth,
  app,
  googleProvider,
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
  waitForEmailVerification,
  sendPasswordReset,
  signOutAll,
  setAuthTokenCookie,
  clearAuthTokenCookie,
};
