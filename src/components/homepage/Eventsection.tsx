import React from "react";
import Image from "next/image";
import ticket from "@/assets/ticket.svg";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { createEventClickAtom } from "@/state/connectedWalletStarknetkitNext";

const Eventsection = () => {
  const [CreateeventClickStat, setCreateeventClickStat] =
    useAtom(createEventClickAtom);
  const router = useRouter();

  return (
    <div className="sm:h-auto lg:h-[350px] lg:flex items-center justify-center">
      <div className="h-auto sm:h-[280px] bg-[#FFFFFF] flex flex-col lg:flex-row items-center justify-center rounded-lg shadow-custom-blue w-full max-w-[1370px] mx-auto p-6 lg:space-x-32 space-y-6 lg:space-y-0">
        {/* Title */}
        <h1 className="w-full lg:w-[450px] text-[24px] sm:text-[26px] md:text-[28px] lg:text-[30.19px] text-[#2D3A4B] leading-[30px] sm:leading-[34px] md:leading-[36px] lg:leading-[39px] font-bold text-center lg:text-left">
          Atten<span className="text-[#4A90E2]">sys</span> - Onchain
          infrastructure for verifiable learning and credentials.
        </h1>

        {/* Description and Info */}
        <div className="space-y-5 w-full lg:w-[600px] text-center lg:text-left">
          {/* Text visible only on lg screens or larger */}
          <div className="block">
            <h1 className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[17px] text-[#2D3A4B] font-light leading-[20px] sm:leading-[22px] lg:leading-[22px] mx-auto lg:mx-0 w-full lg:w-[485px] sm1275:w-[300px] ">
              Built on Starknet, AttenSys provides secure, transparent, and
              fraud-proof certification. All credentials are NFTs that can be
              verified publicly through our explorer.
            </h1>
          </div>

          {/* Info section always visible */}
          <div className="flex justify-center lg:justify-start items-center space-x-4 w-full">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#4A90E2] rounded-full"></div>
              <span className="text-[12px] sm:text-[14px] text-[#2D3A4B] font-medium">
                NFT Certificates
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#9B51E0] rounded-full"></div>
              <span className="text-[12px] sm:text-[14px] text-[#2D3A4B] font-medium">
                Public Verification
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#4A90E2] rounded-full"></div>
              <span className="text-[12px] sm:text-[14px] text-[#2D3A4B] font-medium">
                Onchain Security
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventsection;
