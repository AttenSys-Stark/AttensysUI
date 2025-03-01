"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { useWallet } from "@/hooks/useWallet";
import { walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext";

export function AutoConnect() {
  const pathname = usePathname();
  const [wallet, setWallet] = useAtom(walletStarknetkitNextAtom);
  const { isConnecting, autoConnectWallet, clearWalletInfo } = useWallet();

  useEffect(() => {
    if (isConnecting || wallet) return;
    autoConnectWallet();
  }, [pathname, wallet, isConnecting]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("wallet_disconnected", async () => {
        clearWalletInfo();
      });
    }
  }, []);

  return null;
}
