"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";

export function AutoConnect() {
  const pathname = usePathname();
  const { wallet } = useWallet();
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
