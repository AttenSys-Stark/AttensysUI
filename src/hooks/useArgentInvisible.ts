import { useCallback, useEffect, useState } from "react";
import { ArgentWebWallet, SessionAccountInterface } from "@argent/invisible-sdk";
import { provider } from "@/constants";
import { atom, useAtom } from "jotai";

// Atom to store the account state
export const argentInvisibleAccountAtom = atom<SessionAccountInterface | undefined>(undefined);

// Contract constants
const ATTENSYS_CONTRACT_ADDRESS = "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7";
const ATTENSYS_CONTRACT_ENTRYPOINT = "increase_number";

export type ConnectStatus = "Connect" | "Disconnect" | "Connecting";

export const useArgentInvisible = () => {
  const [account, setAccount] = useAtom(argentInvisibleAccountAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>("Disconnect");
  const [txHash, setTxHash] = useState<string | undefined>();

  // Initialize Argent Web Wallet
  const argentWebWallet = ArgentWebWallet.init({
    appName: "AttensysUI",
    environment: "sepolia",
    sessionParams: {
      allowedMethods: [
        {
          contract: ATTENSYS_CONTRACT_ADDRESS,
          selector: ATTENSYS_CONTRACT_ENTRYPOINT,
        },
      ],
      validityDays: Number("15") || undefined, // DEFAULT 30 DAYS VALIDITY
    },
  });

  useEffect(() => {
    if (!argentWebWallet) {
      return;
    }

    argentWebWallet
      .connect()
      .then(async (res) => {
        if (!res) {
          console.log("Not connected");
          return;
        }

        console.log("Connected to ArgentWebWallet", res);
        const { account, callbackData, approvalTransactionHash } = res;

        if (account.getSessionStatus() !== "VALID") {
          console.log("Session is not valid");
          setConnectStatus("Disconnect");
          return;
        }

        console.log("Approval transaction hash", approvalTransactionHash);
        console.log("Callback data", callbackData);

        if (approvalTransactionHash && provider) {
          console.log("Waiting for approval");
          await provider.waitForTransaction(approvalTransactionHash);
        }

        setAccount(account);
        setConnectStatus("Connect");
      })
      .catch((err) => {
        console.error("Failed to connect to ArgentWebWallet", err);
      });
  }, [argentWebWallet]);

  // Connect function
  const connect = useCallback(async () => {
    try {
      console.log("Start connect, with approval requests");

      if (!provider) {
        throw new Error("No provider provided");
      }

      setConnectStatus("Connecting");

      const response = await argentWebWallet?.requestConnection({
        callbackData: "custom_callback_data",
        approvalRequests: [
          {
            tokenAddress: "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7",
            amount: BigInt("100000000000000000").toString(),
            // Attensys dapp contract address should be here
            spender: "0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a",
          },
        ],
      });

      if (!response) {
        throw new Error('No response from Argent WebWallet');
      }

      if (response) {
        const { account: sessionAccount } = response;

        setAccount(sessionAccount);
        setConnectStatus("Connect");
        console.log('response: ', response);
        return sessionAccount;
      } else {
        console.log("requestConnection response is undefined");
        return null;
      }
    } catch (err: any) {
      console.error("Connect button error: ", err);
      setConnectStatus("Disconnect");
      return null;
    }
  }, [argentWebWallet, provider]);

// Simulate disconnect session account for user
  const disconnect = useCallback(async () => {
    if (argentWebWallet) {
      await argentWebWallet.clearSession();
      setAccount(undefined);
      setConnectStatus("Disconnect");
    }
  }, [argentWebWallet]);

  return {
    account,
    isLoading,
    connectStatus,
    txHash,
    connect,
    disconnect,
  };
}; 