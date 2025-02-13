import React from "react";
import { MoonLoader } from "react-spinners";
import Image from "next/image";
import exclaim from "@/assets/exclaim.svg";
import Logo from "@/assets/Logo.svg";

const DetailsLoading = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-12 h-[80%]">
      <div className="space-y-5 flex flex-col justify-center items-center">
        <MoonLoader color="#9B51E0" />
        <h1 className="text-[18px] text-[#2D3A4B] font-semibold">
          Registration in Progress
        </h1>
      </div>

      <div className="flex flex-col justify-center items-center space-y-2">
        <div className="flex space-x-4">
          <Image src={exclaim} alt="disclaim" />
          <p className="text-[#5801A9] text-[13px] font-medium leading-[20px]">
            All registration will undergo a confirmation process before being
            reflected on the platform.
          </p>
        </div>

        <div className="flex flex-col justify-center items-center">
          <h1 className="text-[18px] text-[#2D3A4B] font-semibold">
            Powered by{" "}
          </h1>
          <Image src={Logo} alt="logo" className="h-[31px] w-[117px]" />
        </div>
      </div>
    </div>
  );
};

export default DetailsLoading;
