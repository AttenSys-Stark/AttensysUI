import React from "react";
import walletimage from "@/assets/walletcrop.jpg";
import Image from "next/image";
import { ConnectButton } from "../connect/ConnectButton";
import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";
import backArrow from "../../../public/backArrow.svg";
import { useWallet } from "@/hooks/useWallet";

const Walletinfo = () => {
  const router = useRouter();
  const { setIsCorrectNetwork } = useWallet();

  const handlerouting = (prop: string) => {
    router.push(`/Createorganization/${prop}`);
  };

  return (
    <div className="lg:min-h-screen w-full">
      <div className=" ml-4 lg:hidden text-start text-purple-500 flex space-x-3">
        <Image src={backArrow} alt="back arrow" />
        <p className="text-lg font-extrabold">Wallet Information</p>
      </div>
      <div className="lg:min-h-screen w-full px-4 sm:px-6 py-8 flex flex-col justify-center items-center space-y-6 sm:space-y-8">
        <div className="w-full max-w-[489px] rounded-xl bg-[#FFFFFF] flex flex-col items-center justify-center p-6 sm:p-12 space-y-6 sm:space-y-8">
          <div className="w-[100px] h-[120px] sm:w-[90px] sm:h-[110px] lg:w-[124px] lg:h-[146px] relative">
            <Image
              src={walletimage}
              alt="wallet"
              className="object-cover"
              layout="fill"
            />
          </div>

          <h1 className="text-[#5801A9] text-[18px] sm:text-[18px] leading-[20px] sm:leading-[22px] font-bold text-center">
            Connect Your wallet
          </h1>

          <p className="text-center w-full max-w-[398px] text-[#2D3A4B] text-[16px] sm:text-[14px] font-normal leading-[18px] sm:leading-[20px] px-4 sm:px-0">
            Connect your Web3 wallet and unlock all features. By connecting your
            wallet, you can:
          </p>

          <div className="text-center w-full max-w-[398px] text-[#5801A9] text-[15px] sm:text-[14px] font-normal leading-[18px] sm:leading-[20px] space-y-1 px-4 sm:px-0">
            <p>&bull; Create and manage your organization</p>
            <p>&bull; Register for courses and events</p>
            <p>&bull; Issue and receive NFT certifications</p>
          </div>

          <ConnectButton setIsCorrectNetwork={setIsCorrectNetwork} />
        </div>

        <Button
          onClick={() => handlerouting("admin-info")}
          className="w-full max-w-[342px] h-[47px] flex justify-center items-center text-[#FFFFFF] text-[13px] sm:text-[14px] font-bold leading-[16px] bg-[#4A90E2] rounded-xl"
        >
          Almost there
        </Button>
      </div>
    </div>
  );
};

export default Walletinfo;
