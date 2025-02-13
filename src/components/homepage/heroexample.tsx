import React from "react";
import Image from "next/image";
import { Button } from "@headlessui/react";

// Image imports
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
import line from "@/assets/line.svg";
import combinedHero from "@/assets/combined-hero.png";

const Herosection = () => {
  return (
    <div className="lg:flex h-auto sm:w-[80%] mx-auto pt-6 items-center justify-center relative">
      {/* Main Content */}
      <div className="block sm:flex h-[100%] justify-between">
        {/* 📌 Text and buttons */}
        <div className="w-[100%] space-y-8 sm:h-[55%] my-auto px-6 md:px-10 lg:px-12 relative">
          {/* 📌 Responsive Title */}
          <h1
            className="relative w-[90%] sm:w-[70%] md:w-[80%] lg:w-[70%] xl:w-[65%] 
                  text-[26px] sm:text-[26px] md:text-[30px] lg:text-[36px] xl:text-[38px] 
                  leading-[35px] sm:leading-[45px] md:leading-[48px] lg:leading-[50px] 
                  font-bold text-[#2D3A4B]"
          >
            One <span className="text-[#9B51E0]">Platform</span>, Infinite
            Possibilities—Track, Stream, and Secure Your Certifications
            {/* 📌 Decorative line below the title */}
            <Image
              alt="line"
              src={line}
              className="absolute bottom-[-8px] left-0 w-[80px] sm:w-[100px] md:w-[120px] h-[10px]"
            />
          </h1>

          {/* 📌 Descriptive Paragraph */}
          <p
            className="break-words text-[#2D3A4B] font-light text-[16px] sm:text-[17px] md:text-[18px] 
                  leading-[22px] sm:leading-[24px] md:leading-[26px] 
                  w-[100%] sm:w-[70%] md:w-[80%] lg:w-[70%] xl:w-[65%]"
          >
            Simplifying certificate issuance, attendance tracking, and online
            course management for schools, organizations, and event managers.
          </p>

          {/* 📌 Responsive Buttons */}
          <div className="flex space-x-3 sm:w-[60%] md:w-[70%] lg:w-[60%] xl:w-[50%]">
            <Button
              className="flex rounded-lg bg-[#2D3A4B] py-2 px-4 h-[45px] sm:h-[50px] 
                         md:h-[52px] lg:h-[47px] items-center w-[150px] md:w-[180px] 
                         lg:w-[154px] text-xs sm:text-sm md:text-md text-white 
                         hover:bg-[#1B2936]"
            >
              Verify Certificate
            </Button>

            <Button
              className="border border-[#2D3A4B] flex rounded-lg py-2 px-4 
                         h-[45px] sm:h-[50px] md:h-[52px] lg:h-[47px] items-center 
                         w-[180px] md:w-[220px] lg:w-[202px] text-xs sm:text-sm md:text-md 
                         text-[#2D3A4B] hover:bg-[#F5F5F5]"
            >
              Get Started on Attensys
            </Button>
          </div>

          {/* Grouped image for small screens, moved here */}
          <div className="block sm:hidden mt-6">
            <Image
              alt="Combined Hero"
              src={combinedHero}
              className="mx-auto"
              width={350}
              height={300}
            />
          </div>
        </div>

        {/* Main Image */}
        <div className="h-full sm:w-full lg:w-[45%] clg:w-[50%] flex justify-end relative">
          <Image
            alt="star"
            src={star}
            className="hidden sm:block absolute mt-[2rem] lg:mt-[3rem] w-[20px] lg:w-[25px]"
          />
          <Image
            alt="model"
            src={model}
            className="hidden sm:block h-full w-full z-10 clg:mr-[70px] lg:mr-[20px] mr-[-50px]"
          />
          <Image
            alt="rectangle"
            src={rectangle}
            className="hidden sm:block absolute mt-[10rem] sm:mt-[8rem] lg:mt-[10.5rem] mx-10 lg:mx-14"
          />
          <Image
            alt="bg"
            src={bg}
            className="hidden sm:block absolute mt-[6rem] lg:mt-[8rem] mr-3 w-[80px] lg:w-[100px]"
          />
          <Image
            alt="splitline"
            src={splitline}
            className="hidden sm:block absolute mt-[23rem] lg:mt-[27.3rem] mr-5 w-[40px] lg:w-[50px]"
          />
          <Image
            alt="circle"
            src={circle}
            className="hidden sm:block absolute mt-[7rem] sm:mt-[8rem] lg:mt-[9.5rem] mr-6 lg:mr-9 w-[50px] lg:w-[60px]"
          />
        </div>
      </div>

      {/* Individual elements for large screens */}
      <div className="hidden sm:block">
        {/* Decorative images */}
        <Image
          alt="bluesplit"
          src={bluesplit}
          className="absolute left-[-2%] top-[10%] mt-[2rem] lg:mt-[3rem]"
        />
        <Image
          alt="ship"
          src={ship}
          className="absolute z-[10] bottom-[-33%] right-[70%] sm:right-[20%] lg:right-[42%] w-[120px] sm:w-[160px] lg:w-[160px] sm:top-[10%]"
        />
        <Image
          alt="leftrectangle"
          src={leftrectangle}
          className="absolute mt-[2rem] lg:mt-[3rem] z-[5] bottom-[-60%] sm:bottom-[20%] right-[60%] sm:right-[22%] clg:right-[32%]"
        />
        <Image
          alt="circle"
          src={circle}
          className="absolute mt-[10rem] lg:mt-[15rem] z-[10] right-[27.5%] bottom-[15%] lclg:right-[33.8%] clg:right-[34.5%] w-[32px] lg:w-[42px]"
        />
        <Image
          alt="kite"
          src={kite}
          className="absolute z-[10] mt-[20rem] lg:mt-[22rem] bottom-[-84%] sm:bottom-0 right-[2] sm:right-[30%] lg:right-[46%] w-[40px] lg:w-[54px]"
        />
      </div>
    </div>
  );
};

export default Herosection;
