"use client";

import { useCallback, useEffect, useState } from "react";
import {
  executeCalls,
  fetchAccountCompatibility,
  type GaslessCompatibility,
} from "@avnu/gasless-sdk";
import type { AccountInterface, Call } from "starknet";

const AVNU_BASE_URL =
  process.env.NEXT_PUBLIC_AVNU_API_URL || "https://sepolia.api.avnu.fi";

export function useAvnu(account: AccountInterface | null) {
  const [loading, setLoading] = useState(false);
  const [compatibility, setCompatibility] =
    useState<GaslessCompatibility | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState(true);

  const checkApiAvailability = useCallback(async () => {
    try {
      const response = await fetch(`${AVNU_BASE_URL}/paymaster/v1/status`);
      setIsApiAvailable(response.ok);
      return response.ok;
    } catch (err) {
      console.error("Avnu API unavailable:", err);
      setIsApiAvailable(false);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!account?.address) return;

    const initializePaymaster = async () => {
      const isAvailable = await checkApiAvailability();
      if (!isAvailable) {
        return;
      }

      try {
        const compatibilityResult = await fetchAccountCompatibility(
          account.address,
          {
            baseUrl: AVNU_BASE_URL,
          },
        );
        setCompatibility(compatibilityResult);
      } catch (err) {
        console.error("Failed to initialize paymaster:", err);
        setError("Failed to initialize paymaster services");
        setIsApiAvailable(false);
      }
    };

    initializePaymaster();
  }, [account?.address, checkApiAvailability]);

  const executeGaslessCalls = async (calls: Call[]) => {
    if (!account) {
      throw new Error("Account not connected");
    }

    setLoading(true);
    setError(null);

    try {
      if (!isApiAvailable) {
        const response = await account.execute(calls);
        setLoading(false);
        return response;
      }

      const response = await executeCalls(
        account,
        calls,
        {},
        { baseUrl: AVNU_BASE_URL },
      );

      setLoading(false);
      return response;
    } catch (err) {
      setError("Failed to execute transaction");
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    executeGaslessCalls,
    isApiAvailable,
  };
}
