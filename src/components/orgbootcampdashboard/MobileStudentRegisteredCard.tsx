import Image from "next/image";
import React from "react";
import book from "@/assets/book.svg";

const MobileStudentRegisteredCard = () => {
  return (
    <div className="w-full bg-white border border-[#DADADA] rounded-[15px] py-7 px-5 space-y-3 relative">
      <div className="flex items-center justify-between ">
        <p className="text-[14px] leading-[17px] font-medium">
          vladamirocks@gmail.com
        </p>
        <div className="bg-[#ADFFCA] rounded-[5px] px-[10px] py-[5px] text-[#115E2C] font-normal text-xs">
          Approved
        </div>
      </div>
      <div className="flex items-center justify-between  ">
        <p className="text-[14px] leading-[17px] text-[#9B51E0] font-medium">
          vladamirocks@gmail.com
        </p>
        <div className="flex items-center gap-3">
          <Image height={24} width={24} src={book} alt="progress" />
          <p className="text-[14px] leading-[17px] text-[#9B51E0] font-medium">
            100%
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between ">
        <p className="text-[14px] leading-[17px] text-[#9B51E0] font-medium">
          0x5c956e61...de5232dc11
        </p>
        <div className="flex items-center gap-3">
          <Image height={24} width={24} src={book} alt="progress" />
          <p className="text-[14px] leading-[17px] text-[#9B51E0] font-medium">
            100%
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileStudentRegisteredCard;
