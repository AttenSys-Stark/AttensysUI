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

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);

      // Remove the setTimeout and directly check gasTokenPrices
      if (!gasTokenPrices || gasTokenPrices.length === 0) {
        // If we don't have gas token prices, fetch them
        if (refetchGasTokenPrices) {
          refetchGasTokenPrices()
            .then(() => {
              setIsLoading(false);
            })
            .catch(() => {
              setHasError(true);
              setIsLoading(false);
            });
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      } else {
        // If we already have gas token prices, just stop loading
        setIsLoading(false);
      }
    }
  }, [isOpen, gasTokenPrices, refetchGasTokenPrices]);

  // Error state display
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-sm font-medium text-gray-800 mb-1">
        Unable to load gas tokens
      </p>
      <p className="text-xs text-gray-500 mb-4">
        Please try again later or refresh your browser
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          setIsLoading(true);
          if (refetchGasTokenPrices) {
            await refetchGasTokenPrices();
          }
          setIsLoading(false);
          setHasError(false);
        }}
      >
        Retry
      </Button>
    </div>
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
              <p className="text-sm text-gray-500">Fetching gas tokens...</p>
            </div>
          ) : hasError ? (
            renderErrorState()
          ) : (
            <div className="max-h-64 overflow-y-auto pr-1">
              <RadioGroup
                value={selectedGasToken?.tokenAddress || ""}
                onValueChange={(value) => selectGasToken(value)}
                className="space-y-3"
              >
                {gasTokenPrices.map((token) => {
                  const tokenInfo = tokenAddressToInfo[token.tokenAddress] || {
                    name: "Unknown Token",
                    symbol: "???",
                    logoUrl: "/placeholder.svg",
                  };

                  return (
                    <div
                      key={token.tokenAddress}
                      className="flex items-center space-x-3 border p-3 rounded-md"
                    >
                      <RadioGroupItem
                        value={token.tokenAddress}
                        id={token.tokenAddress}
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
                        className="flex-1 cursor-pointer truncate"
                      >
                        <div className="text-sm font-medium">
                          {tokenInfo.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {tokenInfo.symbol}
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
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
              disabled={!selectedGasToken || isLoading || hasError}
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
