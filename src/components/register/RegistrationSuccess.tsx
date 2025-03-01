import React from "react";
import Image from "next/image";
import exclaim from "@/assets/exclaim.svg";
import Logo from "@/assets/Logo.svg";
import success from "@/assets/succeded.svg";

const RegistrationSuccess = (prop: any) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-28 h-full">
      <div className="space-y-5 flex flex-col justify-center items-center">
        <Image src={success} alt="success" />
        <h1 className="text-[18px] text-[#5801A9] font-semibold text-center">
          You have successfully Registered for <br />
          {prop.bootcamp_name}
        </h1>
      </div>

      <div className="flex flex-col justify-center items-center space-y-8">
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

export default RegistrationSuccess;
