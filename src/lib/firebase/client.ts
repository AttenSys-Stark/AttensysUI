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
} from "firebase/auth";
import { createUserProfile, getUserProfile } from "../userutils";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
auth.setPersistence(browserLocalPersistence);

// Initialize Google provider
const googleProvider = new GoogleAuthProvider();

// Initialize anonymous auth immediately
// signInAnonymously(auth).catch((error) => {
//   console.error("Anonymous sign-in failed:", error);
// });
// Function to handle Google Sign-In
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Create/update user profile in Firestore
    await createUserProfile({
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || null,
      emailVerified: user.emailVerified,
    });

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
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Create user profile in Firestore
    await createUserProfile({
      uid: user.uid,
      email: user.email || email,
      displayName: displayName,
      photoURL: null,
      emailVerified: false,
    });

    // Send verification email
    await sendEmailVerification(user);

    return {
      user,
      requiresVerification: true,
      message: "Check your email to complete sign up",
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

    // Check if email is verified
    if (!user.emailVerified) {
      await sendEmailVerification(user);
      throw {
        code: "auth/email-not-verified",
        message:
          "Please verify your email first. A new verification link has been sent.",
      };
    }

    // Update last login time in Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true },
    );

    return user;
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
};
