import { useState } from "react";
import { connect, disconnect } from "starknetkit";
import { useAtom, useSetAtom } from "jotai";
import {
  connectorAtom,
  connectorDataAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { DEFAULT_NETWORK } from "@/config";

export interface WalletConnectionInfo {
  connected: boolean;
  address?: string;
  chainId?: string;
}

export const useWallet = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const setConnector = useSetAtom(connectorAtom);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean | null>(
    false,
  );

  const connectWallet = async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);

      const res = await connect({
        modalMode: "alwaysAsk",
        provider,
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Attensys",
          url: window.location.hostname,
          chainId: CHAIN_ID,
          icons: [],
        },
      });

      const { wallet: connectedWallet, connector } = res;
      //@ts-ignore
      setWallet(connectedWallet);
      setIsCorrectNetwork(connectedWallet?.chainId === DEFAULT_NETWORK);
      setConnector(connector);
      return connectedWallet;
    } catch (error) {
      console.error("Wallet connection error:", error);
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      disconnect();
      await clearWalletInfo();
    } catch (error) {
      console.error("Wallet disconnection error:", error);
    }
  };

  const clearWalletInfo = async () => {
    try {
      setWallet(null);
      setConnector(null);
    } catch (error) {
      console.error("Wallet clear error:", error);
    }
  };

  const autoConnectWallet = async () => {
    if (isConnecting || wallet) return;
    try {
      const { wallet: connectedWallet, connector } = await connect({
        provider,
        modalMode: "neverAsk",
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Attensys",
          url: window.location.hostname,
          chainId: CHAIN_ID,
          icons: [],
        },
      });
      const isNetworkCorrect = connectedWallet?.chainId === DEFAULT_NETWORK;
      // console.log("res ato", connectedWallet, connector, connectorData);
      //@ts-ignore
      setWallet(connectedWallet);
      setConnector(connector);
      setIsCorrectNetwork(isNetworkCorrect);

      if (!connectedWallet) {
        console.warn("Wallet autoconnection failed");
      }
    } catch (e) {
      console.error(e);
      alert((e as any).message);
    }
  };

  return {
    isConnecting,
    connectWallet,
    autoConnectWallet,
    disconnectWallet,
    clearWalletInfo,
    isCorrectNetwork,
    setIsCorrectNetwork,
    wallet,
  };
};
