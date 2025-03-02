import { useState } from "react";
import { connect, disconnect } from "starknetkit";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { connectorAtom } from "@/state/connectedWalletStarknetkitNext";
import {
  ARGENT_WEBWALLET_URL,
  CHAIN_ID,
  provider,
  ARGENT_SESSION_SERVICE_BASE_URL,
} from "@/constants";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";

import {
  sessionAtom,
  sessionAccountAtom,
  sessionKeyModeAtom,
} from "@/state/argentSessionState";
import { connectorDataAtom } from "@/state/connectedWalletStarknetkitNext";

import {
  allowedMethods,
  expiry,
  metaData,
  dappKey,
} from "@/helpers/openSession";
import {
  type CreateSessionParams,
  createSession,
  buildSessionAccount,
  verifySession,
} from "@argent/x-sessions";

export interface WalletConnectionInfo {
  connected: boolean;
  address?: string;
  chainId?: string;
}

export const useWallet = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const setConnector = useSetAtom(connectorAtom);

  const connectorData = useAtomValue(connectorDataAtom);
  const setSession = useSetAtom(sessionAtom);
  const setSessionAccount = useSetAtom(sessionAccountAtom);
  const setSessionKeyMode = useSetAtom(sessionKeyModeAtom);

  const createSessionKeys = async () => {
    try {
      if (!connectorData || !connectorData.account) {
        throw new Error("No connector data");
      }

      const sessionParams: CreateSessionParams = {
        allowedMethods,
        expiry,
        metaData: metaData(false),
        sessionKey: dappKey,
      };
      const chainId = await provider.getChainId();
      const session = await createSession({
        address: connectorData.account,
        chainId: chainId,
        wallet: wallet as any,
        sessionParams,
      });

      const sessionAccount = await buildSessionAccount({
        session,
        sessionKey: dappKey,
        provider: provider,
        argentSessionServiceBaseUrl: ARGENT_SESSION_SERVICE_BASE_URL,
      });

      if (!sessionAccount) {
        console.error("Session account creation failed");
        return;
      }

      console.log("verify:", verifySession({ session, sessionKey: dappKey }));

      setSession(session);
      setSessionAccount(sessionAccount);
      setSessionKeyMode(true);
    } catch (e) {
      console.error("Session start failed:", e);
      alert((e as any).message);
    }
  };

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

  const clearSessionkeys = async () => {
    try {
      setSession(null);
      setSessionKeyMode(false);
      setSessionAccount(null);
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
      // console.log("res ato", connectedWallet, connector, connectorData);
      //@ts-ignore
      setWallet(connectedWallet);
      setConnector(connector);

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
    createSessionKeys,
    clearSessionkeys,
  };
};
