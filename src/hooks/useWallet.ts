import { useEffect, useState } from "react";
import { connect, disconnect, StarknetWindowObject } from "starknetkit";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";

export interface WalletConnectionInfo {
  connected: boolean;
  address?: string;
  chainId?: string;
}

// Store only connection info, not the full wallet object
const persistentWalletAtom = atomWithStorage<WalletConnectionInfo>(
  "wallet-connection-info",
  {
    connected: false,
  },
);

export const useWallet = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom);
  const [persistentWallet, setPersistentWallet] = useAtom(persistentWalletAtom);

  const connectWallet = async (reconnect = false) => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);

      const { wallet: connectedWallet } = await connect({
        modalMode: reconnect ? "neverAsk" : "alwaysAsk",
        provider,
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Attensys",
          url: window.location.hostname,
          chainId: CHAIN_ID,
          icons: [],
        },
      });

      if (connectedWallet) {
        setWallet(connectedWallet);
        setPersistentWallet({
          connected: true,
          address: connectedWallet.selectedAddress,
          chainId: connectedWallet.chainId,
        });
        return connectedWallet;
      }

      return null;
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
      setWallet(null);
      setPersistentWallet({ connected: false });
    } catch (error) {
      console.error("Wallet disconnection error:", error);
    }
  };

  // Restore wallet connection on page load
  useEffect(() => {
    const restoreConnection = async () => {
      if (!wallet && persistentWallet) {
        await connectWallet();
      }
    };

    restoreConnection();
  }, []);

  return {
    wallet,
    isConnecting,
    connectWallet,
    disconnectWallet,
  };
};
