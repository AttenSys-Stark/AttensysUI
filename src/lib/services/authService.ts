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

// export const signInUser = async (): Promise<any> => {
//   try {
//     // Always ensure Firestore profile is created/updated
//     let user = auth.currentUser;
//     if (user && typeof user === 'object' && 'uid' in user) {
//       // Log user object for debugging
//       console.log("auth.currentUser:", user);
//       // Check if user exists in Firestore
//       const existingUser = await getUserProfile((user as FirebaseUser).uid);
//       if (existingUser) {
//         console.log("User already exists in Firestore:", existingUser);
//         return existingUser;
//       } else {
//         // Map Firebase user fields to expected Firestore fields
//         await createUserProfile({
//           uid: (user as FirebaseUser).uid,
//           email: (user as FirebaseUser).email || '',
//           displayName: (user as FirebaseUser).displayName || '',
//           photoURL: (user as FirebaseUser).photoURL || null,
//         });
//         // Return object with Firebase User field names
//         return {
//           uid: (user as FirebaseUser).uid,
//           email: (user as FirebaseUser).email || '',
//           displayName: (user as FirebaseUser).displayName || '',
//           photoURL: (user as FirebaseUser).photoURL || null,
//           emailVerified: (user as FirebaseUser).emailVerified || false,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         };
//       }
//     }

//     const { data, error } = await authClient.signIn.social({
//       provider: "google",
//       callbackURL: "/Home",
//     });
//     if (error) throw error;

//     if (!data) return null;

//     // Type guard to check if data has user property
//     if ('user' in data) {
//       // Log user object for debugging
//       console.log("data.user:", data.user);
//       // Try to get user by id or email (if no uid, fallback to email)
//       let uid = data.user.id || null;
//       if (!uid && data.user.email) {
//         // fallback: use email as doc id (not ideal, but for demo)
//         uid = data.user.email;
//       }
//       const existingUser = uid ? await getUserProfile(uid) : null;
//       if (existingUser) {
//         console.log("User already exists in Firestore:", existingUser);
//         return existingUser;
//       } else {
//         await createUserProfile({
//           uid: uid,
//           email: data.user.email || '',
//           displayName: data.user.name || data.user.name || '',
//           photoURL: data.user.image || data.user.image || null,
//         });
//         console.log("user created in firestore");
//         // Return object with Firebase User field names
//         return {
//           uid: uid,
//           email: data.user.email || '',
//           displayName: data.user.name || data.user.name || '',
//           photoURL: data.user.image || data.user.image || null,
//           emailVerified: data.user.emailVerified || false,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         };
//       }
//     }

//     // Handle redirect case
//     if (data.redirect && data.url) {
//       window.location.href = data.url;
//       return null;
//     }

//     return null;
//   } catch (error) {
//     if (
//       error &&
//       typeof error === "object" &&
//       "code" in error &&
//       "message" in error
//     ) {
//       console.error("Authentication error details:", {
//         code: (error as { code: string }).code,
//         message: (error as { message: string }).message,
//         fullError: error,
//       });
//     } else {
//       console.error("Unknown authentication error:", error);
//     }
//     throw error;
//   }
// };
export const signInUser = async (): Promise<FirebaseUser | null> => {
  try {
    // Sign in with Google
    const user = await signInWithGoogle();
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
