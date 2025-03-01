import React from "react";
import Image from "next/image";
import exclaim from "@/assets/exclaim.svg";
import Logo from "@/assets/Logo.svg";
import success from "@/assets/succeded.svg";

const Success = () => {
  return (
    <div className="flex flex-col justify-center items-center md:space-y-28 space-y-12 h-full">
      <div className="space-y-5 flex flex-col justify-center items-center">
        <Image src={success} alt="success" />
        <h1 className="text-[18px] text-[#5801A9] font-semibold text-center">
          You’ve successfully sent <br />
          1,000 USDT to Afrika 2.0 Convention
        </h1>
      </div>

      <div className="flex flex-col justify-center items-center space-y-8 w-[90%] md:w-full">
        <div className="flex space-x-4">
          <Image src={exclaim} alt="disclaim" />
          <p className="text-[#5801A9] text-[13px] font-medium leading-[20px]">
            All sponsorship funds will undergo a verification process before
            being reflected on the platform.
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

export default Success;
