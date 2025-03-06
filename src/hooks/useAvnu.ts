"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchGaslessStatus,
  fetchAccountCompatibility,
  fetchGasTokenPrices,
  executeCalls,
  type GaslessOptions,
  type GaslessStatus,
  type GaslessCompatibility,
  type GasTokenPrice,
  type InvokeResponse,
  SEPOLIA_BASE_URL as TESTNET,
  BASE_URL as MAINNET,
} from "@avnu/gasless-sdk";
import { Call } from "starknet";

const isDevelopment = process.env.NODE_ENV === "development";
const BASE_URL = isDevelopment ? TESTNET : MAINNET;
const AVNU_API_KEY = process.env.NEXT_PUBLIC_AVNU_API_KEY;
export const useAvnuGasless = (connectorDataAccount: any) => {
  const [isPaymasterAvailable, setIsPaymasterAvailable] = useState<
    boolean | null
  >(null);
  const [compatibility, setCompatibility] =
    useState<GaslessCompatibility | null>(null);
  const [gasTokenPrices, setGasTokenPrices] = useState<GasTokenPrice[] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options: GaslessOptions = useMemo(
    () => ({
      baseUrl: BASE_URL,
      apiKey: AVNU_API_KEY,
    }),
    [],
  );

  const checkGaslessAvailability = useCallback(async () => {
    try {
      const status: GaslessStatus = await fetchGaslessStatus(options);
      setIsPaymasterAvailable(status.status);
    } catch (err) {
      console.error("Error checking gasless availability:", err);
      setIsPaymasterAvailable(false);
    }
  }, [options]);

  const checkAccountCompatibility = useCallback(async () => {
    if (connectorDataAccount?.address) {
      try {
        const accountCompatibility: GaslessCompatibility =
          await fetchAccountCompatibility(
            connectorDataAccount.address,
            options,
          );
        setCompatibility(accountCompatibility);
      } catch (err) {
        console.error("Error checking account compatibility:", err);
        setCompatibility(null);
      }
    }
  }, [connectorDataAccount?.address, options]);

  const fetchGasTokenPricesData = useCallback(async () => {
    try {
      const prices: GasTokenPrice[] = await fetchGasTokenPrices(options);
      setGasTokenPrices(prices);
    } catch (err) {
      console.error("Error fetching gas token prices:", err);
      setGasTokenPrices(null);
    }
  }, [options]);

  useEffect(() => {
    checkGaslessAvailability();
    checkAccountCompatibility();
    fetchGasTokenPricesData();
  }, [
    checkGaslessAvailability,
    checkAccountCompatibility,
    fetchGasTokenPricesData,
  ]);

  const executeGaslessCalls = async (
    calls: Call[],
  ): Promise<InvokeResponse> => {
    setLoading(true);
    setError(null);

    try {
      if (!connectorDataAccount) {
        throw new Error("Account not connected");
      }

      const response = await executeCalls(
        connectorDataAccount,
        calls,
        { gasTokenAddress: undefined, maxGasTokenAmount: undefined },
        options,
      );

      setLoading(false);
      return response;
    } catch (err) {
      console.error("Error executing gasless calls:", err);
      setError("Failed to execute gasless transaction");
      setLoading(false);
      throw err;
    }
  };

  return {
    isPaymasterAvailable,
    compatibility,
    gasTokenPrices,
    executeGaslessCalls,
    loading,
    error,
  };
};
