import React from "react";
import Image from "next/image";
import { Button } from "@headlessui/react";

// Image imports
import combinedHero from "@/assets/combined-hero.png";
import combinedHeroBig from "@/assets/combined-heroBig.png";
import line from "@/assets/line.svg";

import model from "@/assets/model.svg";
import rectangle from "@/assets/rectangle.svg";
import bg from "@/assets/bg.svg";
import star from "@/assets/star.svg";
import circle from "@/assets/circle.svg";
import leftrectangle from "@/assets/leftrectangle.svg";
import ship from "@/assets/ship.svg";
import kite from "@/assets/kite.svg";
import splitline from "@/assets/splitline.svg";
import bluesplit from "@/assets/bluesplit.svg";

const Herosection = () => {
  return (
    <div className="lg:flex h-auto sm:w-[80%] mx-auto pt-6 items-center justify-between relative">
      {/* 📌 Text Container */}
      <div
        className="w-[100%] space-y-6 sm:space-y-8 md:space-y-6 lg:space-y-8 xl:space-y-10 
                      sm:h-[55%] my-auto px-6 md:px-10 lg:px-14 xl:px-16 
                      lg:w-[60%] xl:w-[55%] 2xl:w-[50%]"
      >
        {/* 📌 Responsive Title */}
        <h1
          className="relative w-[90%] sm:w-[80%] md:w-[85%] lg:w-[100%] xl:w-[95%] 
                      text-[26px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[38px] 
                      leading-[35px] sm:leading-[42px] md:leading-[44px] lg:leading-[46px] 
                      font-bold text-[#2D3A4B]"
        >
          One <span className="text-[#9B51E0]">Platform</span>, Infinite
          Possibilities—Track, Stream, and Secure Your Certifications
          {/* 📌 Decorative line below the title */}
          <Image
            alt="line"
            src={line}
            className="absolute bottom-[-8px] left-0 w-[80px] sm:w-[100px] md:w-[120px] lg:w-[130px] h-[10px]"
          />
        </h1>

        {/* 📌 Descriptive Paragraph */}
        <p
          className="break-words text-[#2D3A4B] font-light text-[16px] sm:text-[17px] md:text-[18px] 
                      leading-[22px] sm:leading-[24px] md:leading-[26px] lg:leading-[28px]
                      w-[100%] sm:w-[80%] md:w-[85%] lg:w-[90%] xl:w-[85%]"
        >
          Simplifying certificate issuance, attendance tracking, and online
          course management for schools, organizations, and event managers.
        </p>

        {/* 📌 Responsive Buttons */}
        <div className="flex space-x-3 sm:w-[60%] md:w-[70%] lg:w-[75%] xl:w-[70%]">
          <Button
            className="flex rounded-lg bg-[#2D3A4B] py-2 px-4 h-[45px] sm:h-[50px] 
                              md:h-[52px] lg:h-[50px] items-center 
                              w-[150px] md:w-[180px] lg:w-[160px] 
                              text-xs sm:text-sm md:text-md text-white 
                              hover:bg-[#1B2936]"
          >
            Verify Certificate
          </Button>

          <Button
            className="border border-[#2D3A4B] flex rounded-lg py-2 px-4 
                              h-[45px] sm:h-[50px] md:h-[52px] lg:h-[50px] items-center 
                              w-[180px] md:w-[220px] lg:w-[210px] 
                              text-xs sm:text-sm md:text-md 
                              text-[#2D3A4B] hover:bg-[#F5F5F5]"
          >
            Get Started on Attensys
          </Button>
        </div>
      </div>

      {/* 📌 Grouped Image for Small and Medium Screens */}
      <div className="block md:block lg:hidden mt-6">
        <Image
          alt="Combined Hero"
          src={combinedHeroBig}
          className="mx-auto"
          width={400} // 🔹 Adjusting the width slightly for md
          height={320}
        />
      </div>

      {/* 📌 Grouped Image for Large Screens (lg and above) */}
      <div className="hidden lg:flex justify-center w-full lg:w-[50%] xl:w-[45%]">
        <Image
          alt="Combined Hero Big"
          src={combinedHeroBig}
          className="max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] mr-[-30px]"
          width={600}
          height={500}
        />
      </div>

      {/* 📌 Decorative Elements */}
      <div className="hidden sm:block">
        <Image
          alt="bluesplit"
          src={bluesplit}
          className="absolute left-[-4%] top-[-2%] mt-[2rem] lg:mt-[3rem]"
        />
      </div>
    </div>
  );
};

export default Herosection;
