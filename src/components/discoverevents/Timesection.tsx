import React from "react";
import arrow from "@/assets/arrowdown.svg";
import Image from "next/image";
import dot1 from "@/assets/dot1.svg";
import dot2 from "@/assets/dot2.svg";
import dot3 from "@/assets/dot3.svg";
import dot4 from "@/assets/dot4.svg";

const Timesection = () => {
  return (
    <div className="h-[305px] w-[87%] mx-auto mt-6">
      <Image src={arrow} alt="arrow" />
      <div className="ml-16 mt-3 space-y-3">
        <h1 className="text-[24px] text-[#FFFFFF] font-bold leading-[39px]">
          Discover Events
        </h1>
        <p className="text-[#FFFFFF] text-[16px] font-light leading-[22px]">
          Each week, we highlight some of our top events in cities like Lagos
          and the UAE.
          <br />
          You can also explore fantastic community-curated calendars.
        </p>
      </div>
      <div className="flex flex-none overflow-hidden space-x-1 mt-12">
        <Image src={dot1} alt="group" />
        <Image src={dot2} alt="group" />
        <Image src={dot3} alt="group" />
        <Image src={dot4} alt="group" />
        <Image src={dot1} alt="group" />
        <Image src={dot2} alt="group" />
        <Image src={dot3} alt="group" />
        <Image src={dot4} alt="group" />
        <Image src={dot1} alt="group" />
        <Image src={dot2} alt="group" />
        <Image src={dot3} alt="group" />
        <Image src={dot4} alt="group" />
        <Image src={dot1} alt="group" />
        <Image src={dot2} alt="group" />
        <Image src={dot3} alt="group" />
        <Image src={dot4} alt="group" />
        <Image src={dot1} alt="group" />
        <Image src={dot2} alt="group" />
        <Image src={dot3} alt="group" />
        <Image src={dot4} alt="group" />
        <Image src={dot2} alt="group" />
        <Image src={dot3} alt="group" />
        <Image src={dot4} alt="group" />
        <Image src={dot2} alt="group" />
        <Image src={dot3} alt="group" />
        <Image src={dot4} alt="group" />
      </div>
      <div className="sm:h-[59px] w-[215px] rounded-xl mt-12 border-[#FFFFFF] border-[3px] flex items-center justify-center">
        <h1 className="text-[20px] font-bold text-[#FFFFFF] leading-[39px]">
          Highlighted Event
        </h1>
      </div>
    </div>
  );
};

export default Timesection;
