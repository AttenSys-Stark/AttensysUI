import React, { ChangeEvent, useRef } from "react";
import walletimage from "@/assets/walletcrop.jpg";
import Image from "next/image";
import { ConnectButton } from "../connect/ConnectButton";
import { Button, Field, Input } from "@headlessui/react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import add from "@/assets/add.svg";
import TrueFocus from "./TrueFocus";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import {
  walletStarknetkitNextAtom,
  organzationInitState,
} from "@/state/connectedWalletStarknetkitNext";

import { useAtom } from "jotai";

const WalletisConnected = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [wallet, setWallet] = useAtom(walletStarknetkit);
  const [organizationData, setOrganizationData] = useAtom(organzationInitState);

  // console.dir(organizationData, {depth : null})

  const handlerouting = (prop: string) => {
    router.push(`/Createorganization/${prop}`);
  };

  function trimAddress(address: string | undefined): string {
    if (!address?.startsWith("0x") || address.length <= 12) {
      throw new Error("Invalid address format.");
    }

    // Extract the first 10 characters and the last 8 characters
    const start = address.slice(0, 10); // `0x5a679d1e`
    const end = address.slice(-8); // `eb7bfd154`

    // Combine with ellipsis
    return `${start}......${end}`;
  }

  return (
    <div className="h-auto w-full flex flex-col justify-center items-center space-y-8">
      <div className="w-[60%] h-[430px] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-[20px] text-[#2D3A4B] font-light leading-[23px]">
          Connected Address : {trimAddress(wallet?.selectedAddress)}{" "}
        </h1>
        <TrueFocus
          sentence="Connected, Proceed"
          manualMode={false}
          blurAmount={9}
          borderColor="#9B51E0"
          animationDuration={1}
          pauseBetweenAnimations={1}
        />
      </div>

      <Button
        onClick={() => {
          handlerouting("admin-info");
        }}
        className="w-[342px] h-[47px] flex justify-center items-center text-[#FFFFFF] text-[14px] font-bold leading-[16px] bg-[#9B51E0] rounded-xl"
      >
        Almost there
      </Button>
    </div>
  );
};

export default WalletisConnected;
