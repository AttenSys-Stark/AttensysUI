"use client";
import React, { useState } from "react";
import { auth } from "@/lib/firebase/client";
import { getUserProfile } from "@/lib/userutils";
import { decryptPrivateKey } from "@/helpers/encrypt";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  X,
  Shield,
  AlertTriangle,
} from "lucide-react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

interface PrivateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

const PrivateKeyModal: React.FC<PrivateKeyModalProps> = ({
  isOpen,
  onClose,
  address,
}) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [copied, setCopied] = useState(false);

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError("");

    try {
      const currentUser = auth.currentUser;
      if (!currentUser?.email) {
        throw new Error("No email found for current user");
      }

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password,
      );

      await reauthenticateWithCredential(currentUser, credential);

      const profile = await getUserProfile(currentUser.uid);
      if (profile?.starknetPrivateKey) {
        const encryptionSecret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;
        if (!encryptionSecret) {
          throw new Error("Encryption secret not configured");
        }

        const decryptedKey = decryptPrivateKey(
          profile.starknetPrivateKey,
          encryptionSecret,
        );
        setPrivateKey(decryptedKey);
        setIsAuthenticated(true);
      } else {
        throw new Error("No private key found for this account");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else if (error.message.includes("No private key found")) {
        setError("No private key found for this account.");
      } else if (error.message.includes("Encryption secret")) {
        setError("System configuration error. Please contact support.");
      } else {
        setError(
          "Authentication failed. Please check your password and try again.",
        );
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    setError("");

    try {
      const currentUser = auth.currentUser;
      if (!currentUser?.email) {
        throw new Error("No email found for current user");
      }

      const originalEmail = currentUser.email;
      const originalUid = currentUser.uid;

      // Check if the current user is already signed in with Google
      const providers = currentUser.providerData;
      const googleProvider = providers.find(
        (provider) => provider.providerId === "google.com",
      );

      if (!googleProvider) {
        setError(
          "Your account is not linked to Google. Please use password authentication instead.",
        );
        return;
      }

      // Create a completely isolated Firebase app instance for verification
      // This ensures the main auth state is never affected
      const { initializeApp } = await import("firebase/app");
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import(
        "firebase/auth"
      );

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      // Create a new Firebase app instance with a unique name
      const isolatedApp = initializeApp(
        firebaseConfig,
        "private-key-verification",
      );
      const isolatedAuth = getAuth(isolatedApp);

      // Configure Google provider for the isolated auth
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      // Use the isolated auth instance for verification
      const result = await signInWithPopup(isolatedAuth, provider);

      // Verify that the authenticated Google account matches the original user's email
      if (result.user.email !== originalEmail) {
        // Sign out from the isolated auth instance only
        await signOut(isolatedAuth);
        throw new Error(
          "Email mismatch - please use the same Google account that was originally used to sign in",
        );
      }

      // If email matches, proceed with private key access
      const userProfile = await getUserProfile(originalUid);
      if (userProfile?.starknetPrivateKey) {
        const encryptionSecret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;
        if (!encryptionSecret) {
          throw new Error("Encryption secret not configured");
        }

        const decryptedKey = decryptPrivateKey(
          userProfile.starknetPrivateKey,
          encryptionSecret,
        );
        setPrivateKey(decryptedKey);
        setIsAuthenticated(true);
      } else {
        throw new Error("No private key found for this account");
      }

      // Clean up the isolated auth instance
      await signOut(isolatedAuth);
    } catch (error: any) {
      console.error("Google authentication error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        setError("Authentication cancelled. Please try again.");
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        setError(
          "This email is associated with a different sign-in method. Please use password authentication instead.",
        );
      } else if (error.message.includes("not linked to Google")) {
        setError(
          "Your account is not linked to Google. Please use password authentication instead.",
        );
      } else if (error.message.includes("Email mismatch")) {
        setError(
          "Please use the same Google account that you originally signed in with. Different Google accounts cannot access this private key.",
        );
      } else if (error.message.includes("No private key found")) {
        setError("No private key found for this account.");
      } else if (error.message.includes("Encryption secret")) {
        setError("System configuration error. Please contact support.");
      } else {
        setError("Google authentication failed. Please try again.");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleCopyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClose = () => {
    setShowPrivateKey(false);
    setIsAuthenticated(false);
    setPassword("");
    setError("");
    setPrivateKey("");
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-2 mb-4">
          <Shield className="text-purple-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">
            Private Key Security
          </h2>
        </div>

        {!isAuthenticated ? (
          <div>
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="text-yellow-600 mt-0.5" size={16} />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">
                    Security Verification Required
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Please re-authenticate to view your private key.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Wallet Address:{" "}
                <span className="font-mono text-xs">{address}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <form onSubmit={handlePasswordAuth} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your account password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {isAuthenticating ? "Verifying..." : "Verify with Password"}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={handleGoogleAuth}
                disabled={isAuthenticating}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>
                  {isAuthenticating ? "Verifying..." : "Verify with Google"}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="text-green-600 mt-0.5" size={16} />
                <div>
                  <p className="text-sm text-green-800 font-medium">
                    Authentication Successful
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Your identity has been verified.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Private Key
              </label>
              <div className="relative">
                <input
                  type={showPrivateKey ? "text" : "password"}
                  value={privateKey}
                  readOnly
                  className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title={
                      showPrivateKey ? "Hide private key" : "Show private key"
                    }
                  >
                    {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={handleCopyPrivateKey}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title="Copy private key"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="text-red-600 mt-0.5" size={16} />
                <div>
                  <p className="text-sm text-red-800 font-medium">
                    ⚠️ Security Warning
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Never share your private key with anyone.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateKeyModal;
