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

export default function Home() {
  const [wallet, setWallet] = useAtom(walletStarknetkitNextAtom);
  const { autoConnectWallet } = useWallet();
  const [universalLoad, setuniversalLoad] = useAtom(universalloadingstatus);

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

  return (
    <div>
      {/* <MockAboutus /> */}
      <Landing />
    </div>
  );
}
