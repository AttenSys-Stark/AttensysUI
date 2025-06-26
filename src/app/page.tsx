"use client";

import { RESET } from "jotai/utils";
import { useEffect } from "react";
import { useAtom } from "jotai";
import Landing from "@/components/homepage/Landing";
import { useWallet } from "@/hooks/useWallet";
import {
  walletStarknetkitNextAtom,
  universalloadingstatus,
} from "@/state/connectedWalletStarknetkitNext";
import HomePage from "@/components/Home";
import RootLayout from "@/app/layout";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [wallet, setWallet] = useAtom(walletStarknetkitNextAtom);
  const { autoConnectWallet } = useWallet();
  const [universalLoad, setuniversalLoad] = useAtom(universalloadingstatus);
  const router = useRouter();

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

  // Check if user is authenticated and redirect to Home
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated, redirect to Home
        router.push("/Home");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div>
      <HomePage />
    </div>
  );
}
