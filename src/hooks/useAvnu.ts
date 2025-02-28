"use client";

import { useCallback, useEffect, useState } from "react";
import {
  executeCalls,
  fetchAccountCompatibility,
  fetchAccountsRewards,
  fetchGasTokenPrices,
  getGasFeesInGasToken,
  type GaslessCompatibility,
  type PaymasterReward,
  type GasTokenPrice,
} from "@avnu/gasless-sdk";
import type { AccountInterface, Call, EstimateFeeResponse } from "starknet";
import { provider, Provider, stark, transaction } from "starknet";
import { formatUnits } from "ethers";

const AVNU_BASE_URL =
  process.env.NEXT_PUBLIC_AVNU_API_URL || "https://sepolia.api.avnu.fi";
const NODE_URL =
  process.env.NEXT_PUBLIC_NODE_URL ||
  "https://starknet-sepolia.public.blastapi.io";

export function useAvnu(account: AccountInterface | null) {
  const [loading, setLoading] = useState(false);
  const [compatibility, setCompatibility] =
    useState<GaslessCompatibility | null>(null);
  const [paymasterRewards, setPaymasterRewards] = useState<PaymasterReward[]>(
    [],
  );
  const [gasTokenPrices, setGasTokenPrices] = useState<GasTokenPrice[]>([]);
  const [selectedGasToken, setSelectedGasToken] =
    useState<GasTokenPrice | null>(null);
  const [maxGasTokenAmount, setMaxGasTokenAmount] = useState<
    bigint | undefined
  >(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  const [activeCalls, setActiveCalls] = useState<Call[]>([]);

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

  // Custom estimate function since account.estimateInvokeFee may not work reliably
  const estimateCalls = useCallback(
    async (calls: Call[]): Promise<EstimateFeeResponse | null> => {
      if (!account) return null;

      try {
        const provider = new Provider({ nodeUrl: NODE_URL });
        const contractVersion = await provider.getContractVersion(
          account.address,
        );
        const nonce = await provider.getNonceForAddress(account.address);
        const details = stark.v3Details({ skipValidate: true });

        const invocation = {
          ...details,
          contractAddress: account.address,
          calldata: transaction.getExecuteCalldata(
            calls,
            contractVersion.cairo,
          ),
          signature: [],
        };

        return provider.getInvokeEstimateFee(
          invocation,
          { ...details, nonce, version: 1 },
          "pending",
          true,
        );
      } catch (err) {
        console.error("Failed to estimate fees:", err);
        return null;
      }
    },
    [account],
  );

  // Initialize gasless components
  useEffect(() => {
    if (!account?.address) return;

    const initializePaymaster = async () => {
      const isAvailable = await checkApiAvailability();
      if (!isAvailable) return;

      try {
        // Fetch all necessary data in parallel
        const [compatibilityResult, rewards, tokens] = await Promise.all([
          fetchAccountCompatibility(account.address, {
            baseUrl: AVNU_BASE_URL,
          }),
          fetchAccountsRewards(account.address, {
            baseUrl: AVNU_BASE_URL,
            protocol: "gasless-sdk",
          }),
          fetchGasTokenPrices({ baseUrl: AVNU_BASE_URL }),
        ]);

        setCompatibility(compatibilityResult);
        setPaymasterRewards(rewards);
        setGasTokenPrices(tokens);

        // If we have rewards, we don't need to select a gas token
        // Otherwise, select the first available gas token by default
        if (rewards.length === 0 && tokens.length > 0) {
          setSelectedGasToken(tokens[0]);
        }
      } catch (err) {
        console.error("Failed to initialize paymaster:", err);
        setError("Failed to initialize paymaster services");
        setIsApiAvailable(false);
      }
    };

    initializePaymaster();
  }, [account?.address, checkApiAvailability]);

  // Add refetch function for gas token prices
  const refetchGasTokenPrices = useCallback(async (): Promise<void> => {
    try {
      const tokens = await fetchGasTokenPrices({ baseUrl: AVNU_BASE_URL });
      setGasTokenPrices(tokens);

      // If we have no rewards and tokens are available, select the first one
      if (paymasterRewards.length === 0 && tokens.length > 0) {
        setSelectedGasToken(tokens[0]);
      }
    } catch (err) {
      console.error("Failed to fetch gas token prices:", err);
    }
  }, [paymasterRewards.length]);

  // Update gas estimation when dependencies change
  useEffect(() => {
    const estimateGas = async () => {
      if (
        !account ||
        !selectedGasToken ||
        !compatibility ||
        activeCalls.length === 0
      ) {
        setMaxGasTokenAmount(undefined);
        return;
      }

      try {
        const fees = await estimateCalls(activeCalls);
        if (!fees) return;

        const estimatedGasFees = getGasFeesInGasToken(
          BigInt(fees.overall_fee),
          selectedGasToken,
          BigInt(fees.gas_price!),
          BigInt(fees.data_gas_price ?? "0x1"),
          compatibility.gasConsumedOverhead,
          compatibility.dataGasConsumedOverhead,
        );

        // Multiply by 2 for safety margin
        setMaxGasTokenAmount(estimatedGasFees * BigInt(2));
      } catch (err) {
        console.error("Failed to estimate gas fees:", err);
        setMaxGasTokenAmount(undefined);
      }
    };

    estimateGas();
  }, [account, selectedGasToken, compatibility, activeCalls, estimateCalls]);

  const executeGaslessCalls = async (calls: Call[]) => {
    if (!account) {
      throw new Error("Account not connected");
    }

    setLoading(true);
    setError(null);
    setActiveCalls(calls);

    try {
      // If API is not available, fallback to regular transaction
      if (!isApiAvailable) {
        const response = await account.execute(calls);
        setLoading(false);
        return response;
      }

      // Execute the calls
      const response = await executeCalls(
        account,
        calls,
        paymasterRewards.length > 0
          ? {}
          : {
              gasTokenAddress: selectedGasToken?.tokenAddress,
              maxGasTokenAmount,
            },
        { baseUrl: AVNU_BASE_URL },
      );

      setLoading(false);
      return response;
    } catch (err) {
      console.error("Failed to execute transaction:", err);
      setError(
        `Failed to execute transaction: ${err instanceof Error ? err.message : String(err)}`,
      );
      setLoading(false);
      throw err;
    }
  };

  // Function to select a different gas token
  const selectGasToken = useCallback(
    (tokenAddress: string) => {
      const token = gasTokenPrices.find((t) => t.tokenAddress === tokenAddress);
      if (token) {
        setSelectedGasToken(token);
      }
    },
    [gasTokenPrices],
  );

  // Format the max gas amount for display
  const formattedMaxGasAmount = useCallback(() => {
    if (!maxGasTokenAmount || !selectedGasToken) return null;
    return formatUnits(maxGasTokenAmount, selectedGasToken.decimals);
  }, [maxGasTokenAmount, selectedGasToken]);

  return {
    loading,
    error,
    executeGaslessCalls,
    isApiAvailable,
    hasRewards: paymasterRewards.length > 0,
    paymasterRewards,
    gasTokenPrices,
    selectedGasToken,
    selectGasToken,
    maxGasTokenAmount,
    formattedMaxGasAmount: formattedMaxGasAmount(),
    compatibility,
    activeCalls,
    refetchGasTokenPrices,
  };
}
