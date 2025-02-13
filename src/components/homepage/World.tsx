import React from "react";
import plane from "@/assets/plane.svg";
import thoughts from "@/assets/thoughts.png";
import group10 from "@/assets/Group 10.png";
import cloud from "@/assets/3d-techny-international-transportation-and-delivery-logistics 1.png";
import Image from "next/image";

const World = () => {
  return (
    <div className="w-[90%] mx-auto my-4 lg:flex lg:justify-between lg:items-center sm:h-[450px]">
      {/* 📌 Text Section */}
      <div className="sm:w-[100%] flex items-center">
        <div className="w-[90%] sm:w-[80%] mx-auto">
          {/* 📌 Title */}
          <h1 className="text-[24px] sm:text-[30px] lg:text-[36px] font-bold text-[#2D3A4B] mb-5">
            Atten<span className="text-[#A666E3]">sys</span> Courses
          </h1>

          {/* 📌 Description */}
          <p className="text-[14px] sm:text-[16px] lg:text-[18px] font-light text-[#2D3A4B] leading-[20px] sm:leading-[24px] lg:leading-[28px] mb-8">
            Simplifying certificate issuance, attendance tracking, and online
            course management for schools, organizations, and event managers.
          </p>

          {/* 📌 List */}
          <ul className="space-y-4">
            <li className="text-[14px] sm:text-[16px] lg:text-[18px] font-light text-[#9B51E0] leading-[20px] sm:leading-[24px] lg:leading-[28px]">
              <span className="text-[#2D3A4B]">Take and get Certified in</span>{" "}
              professional courses & Top-tier skillsets from all over the world.
            </li>
            <li className="text-[14px] sm:text-[16px] lg:text-[18px] font-light text-[#9B51E0] leading-[20px] sm:leading-[24px] lg:leading-[28px]">
              AttenSys{" "}
              <span className="text-[#2D3A4B]">
                is built with top-tier security protocols, including encryption
                and blockchain technology, to ensure that your data and
                certificates are safe.
              </span>
            </li>
          </ul>

          {/* 📌 Button */}
          <div className="mt-6">
            <button className="bg-[#4A90E2] text-white font-medium text-[14px] sm:text-[16px] lg:text-[18px] py-2 px-4 sm:py-3 sm:px-6 lg:py-4 lg:px-8 rounded-lg shadow-md hover:bg-[#357ABD] transition-all">
              Get Started Today!
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Images */}
      <div className="w-full sm:w-[40%] relative">
        {/* 📌 Images for small screens */}
        <div className="sm:hidden relative mb-[350px]">
          {/* Planet Image */}
          <Image
            alt="planet"
            src={plane}
            className="absolute top-[-320px] left-[50px] w-[280px] h-[280px]"
          />
          {/* Speech Bubble Image */}
          <Image
            alt="speech"
            src={thoughts}
            className="absolute top-[-370px] left-[-10px] w-[233px] h-[150px]"
          />
        </div>

        {/* 📌 Images for medium screens */}
        <div className="hidden sm:hidden md:flex lg:hidden relative h-[400px]">
          {/* Planet Image */}
          <Image
            alt="planet"
            src={plane}
            className="absolute top-[-300px] left-[450px] w-[320px] h-[320px]"
          />
          {/* Speech Bubble Image */}
          <Image
            alt="speech"
            src={thoughts}
            className="absolute top-[-350px] left-[370px] w-[240px] h-[140px]"
          />
        </div>

        {/* 📌 Images for larger screens */}
        <div className="hidden lg:flex items-center relative">
          {/* 🌍 Planet */}
          <Image
            alt="planet"
            src={plane}
            className="absolute top-[-80px] left-[40px] w-[380px] h-[380px]"
          />
          {/* 💬 Speech Bubble */}
          <Image
            alt="speech"
            src={thoughts}
            className="absolute top-[-180px] left-[-90px] w-[290px] h-[190px]"
          />
        </div>
      </div>
    </div>
  );
};

export default World;
