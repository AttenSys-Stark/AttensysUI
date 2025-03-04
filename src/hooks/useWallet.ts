import { useState } from "react";
import { connect, disconnect } from "starknetkit-next";
import { useAtom, useSetAtom } from "jotai";
import {
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext";
import {
  ARGENT_WEBWALLET_URL,
  CHAIN_ID,
  provider,
  ARGENT_SESSION_SERVICE_BASE_URL,
} from "@/constants";

import {
  sessionAtom,
  sessionAccountAtom,
  sessionKeyModeAtom,
} from "@/state/argentSessionState";

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
  const [wallet, setWallet] = useAtom(walletStarknetkitNextAtom);
  const setConnector = useSetAtom(connectorAtom);

  const [connectorData, setConnectorData] = useAtom(connectorDataAtom);
  const [session, setSession] = useAtom(sessionAtom);
  const [sessionAccount, setSessionAccount] = useAtom(sessionAccountAtom);
  const [sessionKeyMode, setSessionKeyMode] = useAtom(sessionKeyModeAtom);

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
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Attensys",
          url: window.location.hostname,
          chainId: CHAIN_ID,
          icons: [],
        },
      });

      const { wallet: connectedWallet, connectorData, connector } = res;

      const account = await connector?.account(provider);

      if (connectedWallet) {
        setWallet({
          ...connectedWallet,
          account: account,
          selectedAddress: connectorData?.account,
        });
      }

      setConnector(connector);
      setConnectorData(connectorData);

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
      const {
        wallet: connectedWallet,
        connector,
        connectorData,
      } = await connect({
        modalMode: "neverAsk",
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Attensys",
          url: window.location.hostname,
          chainId: CHAIN_ID,
          icons: [],
        },
      });

      const account = await connector?.account(provider);

      if (connectedWallet) {
        setWallet({
          ...connectedWallet,
          account: account,
          selectedAddress: connectorData?.account,
        });
      }

      setConnector(connector);
      setConnectorData(connectorData);
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
    wallet,
    session,
    sessionAccount,
    sessionKeyMode,
    isConnecting,
    connectWallet,
    autoConnectWallet,
    disconnectWallet,
    clearWalletInfo,
    createSessionKeys,
    clearSessionkeys,
  };
};
