import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { GasTokenPrice } from "@avnu/gasless-sdk";
import { tokenAddressToInfo } from "@/types/avnu";
import { Contract } from "starknet";
import { formatUnits } from "ethers";
import { ERC20_ABI } from "@/constants";
import { useAtom } from "jotai";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";

interface GasTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  gasTokenPrices: GasTokenPrice[];
  selectedGasToken: GasTokenPrice | null;
  selectGasToken: (tokenAddress: string) => void;
  formattedMaxGasAmount: string | null;
  refetchGasTokenPrices?: () => Promise<void>;
}

interface TokenWithBalance extends GasTokenPrice {
  balance: string;
  formattedBalance: string;
  hasBalance: boolean;
}

const GasTokenModal: React.FC<GasTokenModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  gasTokenPrices,
  selectedGasToken,
  selectGasToken,
  formattedMaxGasAmount,
  refetchGasTokenPrices,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [tokensWithBalances, setTokensWithBalances] = useState<
    TokenWithBalance[]
  >([]);
  const [wallet] = useAtom(walletStarknetkit);

  // Get address and provider from StarknetKit wallet
  const address = wallet?.account?.address;
  const provider = wallet?.provider;

  // Debug logging for initial props
  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened with props:", {
        address,
        hasProvider: !!provider,
        hasWallet: !!wallet,
        isWalletConnected: wallet?.isConnected,
        gasTokenPricesCount: gasTokenPrices?.length || 0,
        selectedGasToken,
      });
    }
  }, [isOpen, address, provider, wallet, gasTokenPrices, selectedGasToken]);

  async function getTokenBalance(
    tokenAddress: string,
    accountAddress: string,
  ): Promise<string> {
    if (!provider) {
      console.error("Provider is not available");
      throw new Error("Provider is not available");
    }

    try {
      const contract = new Contract(ERC20_ABI, tokenAddress, provider);
      const response = await contract.balanceOf(accountAddress);
      console.log(`Balance response for ${tokenAddress}:`, response);
      const balance =
        typeof response === "string"
          ? response
          : response.balance?.low?.toString() || "0";
      return balance;
    } catch (error) {
      console.error(`Error fetching balance for token ${tokenAddress}:`, error);
      return "0";
    }
  }

  // Function to get token decimals with better error handling
  async function getTokenDecimals(tokenAddress: string): Promise<number> {
    if (!provider) {
      console.error("Provider is not available for decimals fetch");
      return 18; // Default as fallback
    }

    try {
      const contract = new Contract(ERC20_ABI, tokenAddress, provider);
      const response = await contract.call("decimals", []);
      console.log(`Decimals response for ${tokenAddress}:`, response);
      if (Array.isArray(response) && response.length > 0) {
        return Number(response[0]);
      } else if (typeof response === "object" && response !== null) {
        return Number(18);
      } else if (typeof response === "string" || typeof response === "number") {
        return Number(response);
      }

      return 18;
    } catch (error) {
      console.error(
        `Error fetching decimals for token ${tokenAddress}:`,
        error,
      );
      return 18;
    }
  }

  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    console.log("Checking gas token prices:", gasTokenPrices);

    if (!gasTokenPrices || gasTokenPrices.length === 0) {
      console.log("No gas token prices available, attempting to fetch");
      if (refetchGasTokenPrices) {
        refetchGasTokenPrices()
          .then(() => {
            console.log("Gas token prices fetched successfully");
            // Don't fetch balances here, let the other useEffect handle it
          })
          .catch((error) => {
            console.error("Failed to fetch gas token prices:", error);
            setHasError(true);
            setErrorMessage("Failed to fetch gas token prices");
            setIsLoading(false);
          });
      } else {
        console.error("No refetchGasTokenPrices function provided");
        setHasError(true);
        setErrorMessage("Unable to fetch gas token data");
        setIsLoading(false);
      }
    }
  }, [isOpen, refetchGasTokenPrices]);

  // 2. Handle balance fetching separately
  useEffect(() => {
    if (!isOpen || !gasTokenPrices || gasTokenPrices.length === 0) return;

    if (!address) {
      console.error("No wallet address available");
      setHasError(true);
      setErrorMessage("No wallet connected");
      setIsLoading(false);
      return;
    }

    if (!provider) {
      console.error("No provider available");
      setHasError(true);
      setErrorMessage("Provider not available");
      setIsLoading(false);
      return;
    }

    console.log("Starting balance fetch for", gasTokenPrices.length, "tokens");
    fetchBalances();
  }, [isOpen, gasTokenPrices, address, provider]);

  const fetchBalances = async () => {
    if (
      !isOpen ||
      !address ||
      !provider ||
      !gasTokenPrices ||
      gasTokenPrices.length === 0
    ) {
      console.log("Skipping balance fetch due to missing dependencies");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching balances for", gasTokenPrices.length, "tokens");

      const tokensWithBalancesData = await Promise.all(
        gasTokenPrices.map(async (token) => {
          try {
            console.log(`Fetching balance for ${token.tokenAddress}`);
            const rawBalance = await getTokenBalance(
              token.tokenAddress,
              address,
            );
            const decimals = await getTokenDecimals(token.tokenAddress);
            const formattedBalance = formatUnits(rawBalance, decimals);
            const numericBalance = parseFloat(formattedBalance);

            console.log(
              `Token ${token.tokenAddress}: balance=${rawBalance}, decimals=${decimals}, formatted=${formattedBalance}`,
            );

            return {
              ...token,
              balance: rawBalance,
              formattedBalance: numericBalance.toFixed(4),
              hasBalance: numericBalance > 0,
            };
          } catch (tokenError) {
            console.error(
              `Error processing token ${token.tokenAddress}:`,
              tokenError,
            );
            return {
              ...token,
              balance: "0",
              formattedBalance: "0.0000",
              hasBalance: false,
            };
          }
        }),
      );

      console.log("Balances fetched successfully:", tokensWithBalancesData);

      // Sort tokens by balance (highest first)
      const sortedTokens = tokensWithBalancesData.sort(
        (a, b) =>
          parseFloat(b.formattedBalance) - parseFloat(a.formattedBalance),
      );

      setTokensWithBalances(sortedTokens);

      // If no token is selected yet, select the one with highest balance
      if (!selectedGasToken && sortedTokens.length > 0) {
        // Find the first token with a balance
        const tokenWithBalance = sortedTokens.find((token) => token.hasBalance);
        if (tokenWithBalance) {
          selectGasToken(tokenWithBalance.tokenAddress);
        }
      }
    } catch (error) {
      console.error("Error fetching token balances:", error);
      setHasError(true);
      setErrorMessage("Failed to fetch token balances");
    } finally {
      setIsLoading(false);
    }
  };

  // Error state display with more detailed message
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-sm font-medium text-gray-800 mb-1">
        Unable to load gas tokens
      </p>
      <p className="text-xs text-gray-500 mb-4">
        {errorMessage || "Please try again later or refresh your browser"}
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          setIsLoading(true);
          setHasError(false);
          setErrorMessage("");

          try {
            if (refetchGasTokenPrices) {
              await refetchGasTokenPrices();
            }
            await fetchBalances();
          } catch (error) {
            console.error("Error during retry:", error);
            setHasError(true);
            setErrorMessage("Retry failed");
          } finally {
            setIsLoading(false);
          }
        }}
      >
        Retry
      </Button>
    </div>
  );

  // Fallback to show tokens without balances if balance fetching fails
  const renderTokensList = () => {
    const tokensToShow =
      tokensWithBalances.length > 0 ? tokensWithBalances : gasTokenPrices;

    if (tokensToShow.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No gas tokens available</p>
        </div>
      );
    }

    return (
      <RadioGroup
        value={selectedGasToken?.tokenAddress || ""}
        onValueChange={(value) => selectGasToken(value)}
        className="space-y-3"
      >
        {tokensToShow.map((token) => {
          const tokenInfo = tokenAddressToInfo[token.tokenAddress] || {
            name: "Unknown Token",
            symbol: "???",
            logoUrl: "/placeholder.svg",
          };

          // Get formatted balance if available
          const formattedBalance =
            "formattedBalance" in token ? token.formattedBalance : "0.0000";

          // Check if token has balance
          const hasBalance = "hasBalance" in token ? token.hasBalance : false;

          return (
            <div
              key={token.tokenAddress}
              className={`flex items-center space-x-3 border p-3 rounded-md ${
                !hasBalance ? "opacity-50" : ""
              }`}
            >
              <RadioGroupItem
                value={token.tokenAddress}
                id={token.tokenAddress}
                disabled={!hasBalance}
              />
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={tokenInfo.logoUrl || "/placeholder.svg"}
                  alt={tokenInfo.symbol}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              <Label
                htmlFor={token.tokenAddress}
                className={`flex-1 ${!hasBalance ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">{tokenInfo.name}</div>
                    <div className="text-xs text-gray-500">
                      {tokenInfo.symbol}
                    </div>
                  </div>
                  <div className="text-sm font-medium tabular-nums">
                    {String(formattedBalance)}
                  </div>
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    );
  };

  // Check if there are any tokens with balance
  const hasAnyTokensWithBalance = tokensWithBalances.some(
    (token) => token.hasBalance,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select a token to pay for gas fees</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-4 break-words">
            You don't have any rewards to cover gas fees. Please select a token
            to pay for transaction fees:
          </p>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-gray-500">
                Fetching gas tokens and balances...
              </p>
            </div>
          ) : hasError ? (
            renderErrorState()
          ) : (
            <div className="max-h-64 overflow-y-auto pr-1">
              {renderTokensList()}
            </div>
          )}

          {!hasAnyTokensWithBalance && !isLoading && !hasError && (
            <p className="text-sm text-red-500 mt-4">
              You don't have any tokens with sufficient balance to pay for gas.
            </p>
          )}

          {selectedGasToken &&
            formattedMaxGasAmount &&
            !isLoading &&
            !hasError && (
              <p className="text-sm mt-4 break-words">
                Estimated max gas:{" "}
                <span className="font-medium">
                  {formattedMaxGasAmount} {selectedGasToken.priceInUSD}
                </span>
              </p>
            )}

          <div className="flex justify-end mt-6 space-x-2">
            <Button variant="outline" onClick={onClose} className="px-4">
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={
                !selectedGasToken ||
                isLoading ||
                hasError ||
                !hasAnyTokensWithBalance
              }
              className="px-4"
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GasTokenModal;
