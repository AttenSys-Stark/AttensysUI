import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

const BootcampHero = () => {
  return (
    <div className="relative mb-10 w-full">
      <div
        className={`bg-[url('/bootcampbg.png')] pt-24 pb-32 w-full px-6 sm:px-24 lg:px-48 xl:px-64 flex justify-start items-center`}
      >
        <div className="w-[95%] sm:max-w-lg 2xl:max-w-2xl">
          <span className="text-[#FFFFFF] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-5xl leading-[2rem]">
            Join amazing bootcamps from your favourite organizations
          </span>
        </div>
      </div>
      <div className="h-[100px] rounded-lg xl:rounded-none w-[90%] max-w-[1260px] mx-auto bg-[#2D3A4B] absolute z-30 bottom-[-15%] left-1/2 transform -translate-x-1/2 flex items-center mb-4">
        <div className="flex items-center mx-auto justify-center xl:hidden absolute w-8 h-8 rounded-full p-2 bg-white border border-gray-800 top-[5] left-3">
          <ChevronLeftIcon className="w-8 h-8 text-gray-800" />
        </div>
        <div className="pl-16 w-full flex flex-row justify-around space-x-6 items-center pr-8 scrollbar-hide overflow-auto">
          <div className="font-medium text-white text-sm flex flex-none">
            Design
          </div>
          <div className="font-medium text-white text-sm flex flex-none">
            Development
          </div>
          <div className="font-medium text-white text-sm flex flex-none">
            Marketing
          </div>
          <div className="font-medium text-white text-sm flex flex-none">
            Health & Fitness
          </div>
          <div className="font-medium text-white text-sm flex flex-none">
            Business
          </div>
          <div className="font-medium text-white text-sm flex flex-none">
            IT & Software
          </div>
          <div className="font-medium text-white text-sm flex flex-none">
            Crypto
          </div>
          <div className="font-medium text-white text-sm flex flex-none">
            Artificial Intelligence
          </div>
          <div className="font-medium text-white text-sm flex flex-none">
            Product Management
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootcampHero;
