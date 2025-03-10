import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Dispatch, FC, SetStateAction } from "react";
import { connect } from "starknetkit";
import { Button } from "@headlessui/react";
import World from "@/assets/Vector.svg";
import { useWallet } from "@/hooks/useWallet";
import LoadingSpinner from "../ui/LoadingSpinner";
import { DEFAULT_NETWORK } from "@/config";

type ConnectButtonProps = {
  setIsCorrectNetwork: Dispatch<SetStateAction<boolean | null>>;
};

const ConnectButton = ({ setIsCorrectNetwork }: ConnectButtonProps) => {
  const setWallet = useSetAtom(walletStarknetkit);
  const navigate = useRouter();
  const { connectWallet, isConnecting } = useWallet();

  const handleConnectWallet = async () => {
    const res = await connectWallet();
    // @ts-expect-error not recognizing wallet for some reason
    const { connectedWallet } = res;
    setIsCorrectNetwork(connectedWallet?.chainId === DEFAULT_NETWORK);
  };

  /*   const connectFn = async () => {
    try {
      const { wallet } = await connect({
        provider,
        modalMode: "alwaysAsk",
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Attensys",
          url: window.location.hostname,
          chainId: CHAIN_ID,
          icons: [],
        },
      });

      setWallet(wallet);
    } catch (e) {
      console.error(e);
      alert((e as any).message);
    }
  }; */

  return (
    <div>
      <Button
        onClick={() => {
          handleConnectWallet();
        }}
        disabled={isConnecting}
        className="flex rounded-md xl:rounded-lg bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] py-2 px-2 xl:px-3 data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
      >
        <div className="flex items-center space-x-2 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
          <div className="flex flex-row flex-none space-x-1 text-sm font-semibold md:text-md">
            <span className="flex">
              {isConnecting ? (
                <LoadingSpinner
                  variant="button"
                  size="sm"
                  colorVariant="white"
                />
              ) : (
                "Connect"
              )}
            </span>
            <span className="flex lg:hidden xl:flex">Wallet</span>
          </div>
        </div>
      </Button>
    </div>
  );
};

export { ConnectButton };
