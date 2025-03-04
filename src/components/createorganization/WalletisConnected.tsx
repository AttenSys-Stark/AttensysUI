import React from "react";
import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";
import TrueFocus from "./TrueFocus";
import { useWallet } from "@/hooks/useWallet";

const WalletisConnected = () => {
  const router = useRouter();
  const { wallet } = useWallet();
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
    <div className="flex flex-col items-center justify-center w-full h-auto space-y-8">
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
