"use client";

import { RESET } from "jotai/utils";
import { useEffect } from "react";
import { useAtom } from "jotai";
import Landing from "@/components/homepage/Landing";
import { useWallet } from "@/hooks/useWallet";
import {
  walletStarknetkitNextAtom,
  universalloadingstatus,
  accountloadstate,
} from "@/state/connectedWalletStarknetkitNext";
import HomePage from "@/components/Home";
import RootLayout from "@/app/layout";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/lib/userutils";
import { AuthHandler } from "@/components/auth/AuthHandler";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [wallet, setWallet] = useAtom(walletStarknetkitNextAtom);
  const { autoConnectWallet } = useWallet();
  const [universalLoad, setuniversalLoad] = useAtom(universalloadingstatus);
  const [accountloadProgress, setAccountloadProgress] =
    useAtom(accountloadstate);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (wallet) return;
    autoConnectWallet();
  }, [wallet]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("wallet_disconnected", async () => {
        setWallet(RESET);
      });
    }
  }, []);

  useEffect(() => {
    setuniversalLoad(false);
  });

  // Check for authentication errors and reset loading state
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      console.error("Authentication error detected:", error);
      setAccountloadProgress(false);
    }
  }, [searchParams, setAccountloadProgress]);

  // Check if user is authenticated and redirect to Home
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if there's a redirectPath in the URL (from OAuth flow)
        const redirectPath = searchParams.get("redirectPath");
        const customToken = searchParams.get("customToken");
        const authType = searchParams.get("authType");

        // If we're in the middle of an OAuth flow, don't redirect - let AuthHandler handle it
        if (customToken && authType === "google") {
          return;
        }

        // Check if user has a Starknet address before redirecting
        try {
          const userProfile = await getUserProfile(user.uid);
          if (userProfile && userProfile.starknetAddress) {
            // Only redirect to /Home if there's no specific redirect path
            if (!redirectPath) {
              router.push("/Home");
            }
          }
          // If no Starknet address, don't redirect - let the account creation process complete
        } catch (error) {
          console.error("Error checking user profile:", error);
          // Don't redirect on error - let the account creation process complete
        }
      }
    });

    return () => unsubscribe();
  }, [router, searchParams]);

  return (
    <div>
      <AuthHandler />
      <HomePage />
    </div>
  );
}
