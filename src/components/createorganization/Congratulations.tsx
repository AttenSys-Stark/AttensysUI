import React from "react";
import dottedcircle from "@/assets/dottedcircle.svg";
import trophy from "@/assets/trophy.svg";
import Image from "next/image";
import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";
import rightArr from "../../../public/rightArr.svg";
import { specificOrgRoute } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";

const Congratulations = () => {
  const [specificOrg, setSpecificOrg] = useAtom(specificOrgRoute);

  const router = useRouter();

  const handlerouting = (prop: string) => {
    router.push(`/Organization/${prop}`);
  };

  return (
    <div className="h-[600px] w-full flex flex-col items-center space-y-12">
      <div className="flex justify-center items-center">
        <Image src={dottedcircle} alt="circle" />
        <Image src={trophy} alt="trophy" />
      </div>

      <div className="space-y-3 w-full flex flex-col items-center">
        <Button
          onClick={() => {
            handlerouting(specificOrg);
          }}
          className="lg:w-[342px] w-full h-[47px] flex justify-center items-center text-[#FFFFFF] text-[14px] font-bold leading-[16px] bg-[#4A90E2] rounded-xl"
        >
          Go to dashboard
        </Button>
        <div className="flex items-center">
          <p className="text-[14px] font-semibold mr-3 text-[#5801A9] cursor-pointer leading-[23px]">
            View public profile
          </p>
          <Image src={rightArr} alt="right arrow" />
        </div>
      </div>
    </div>
  );
};

export default Congratulations;
