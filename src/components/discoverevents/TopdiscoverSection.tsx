import React, { useEffect } from "react";
import Image from "next/image";
import moon from "@/assets/material.svg";
import upcoming from "@/assets/discoverlight.svg";
import top from "@/assets/top.svg";
import { useRouter } from "next/navigation";
import { useCreatedEvents } from "@/hooks/useEvents";

const Discoversection = () => {
  const router = useRouter();

  const handlerouting = () => {
    router.push("/Events/createdevent");
  };

  return (
    <div className="h-[90px] clg:h-[80px] lg:[70px] lclg:[60px] flex justify-between w-[90%] mx-auto items-center">
      <div className="flex w-[300px] sm:w-[450px] clg:w-[500px] lclg:w-[500px] space-x-4 sm:space-x-8 items-center">
        <div
          className="flex space-x-1 sm:space-x-3 items-center cursor-pointer w-[120px]"
          onClick={handlerouting}
        >
          <Image src={moon} alt="moon" />
          <h1 className="text-[#FFFFFF] text-[12px] sm:text-[16px]">
            My Events
          </h1>
        </div>
        <div className="w-[1px] h-[24px] bg-[#9B51E0]"></div>

        <div className="flex space-x-1 sm:space-x-3 items-center cursor-pointer w-[160px]">
          <Image src={upcoming} alt="moon" />
          <h1 className="text-[#FFFFFF] text-[12px] sm:text-[16px]">
            Discover events
          </h1>
        </div>
      </div>
      <div className="hidden sm:block">
        <Image src={top} alt="moon" />
      </div>
    </div>
  );
};

export default Discoversection;
