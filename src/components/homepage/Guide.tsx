import React from "react";
import thumbs from "@/assets/thumbs.svg";
import Image from "next/image";
import steps from "@/assets/steps.svg";

const Guide = () => {
  return (
    <div className=" w-[100%] py-12 sm:py-0 bg-[#2D3A4B] flex flex-col lg:flex-row items-center justify-center sm:pb-10">
      {/* Main Container */}
      <div className="w-[90%] mx-auto h-[100%] my-auto flex flex-col sm:flex-row md:flex-row md:items-center sm:items-center sm:justify-center md:justify-center lg:space-x-10">
        {/* 📌 Image Container */}
        <div className="relative flex flex-col sm:flex-row items-center justify-around">
          {/* 🔹 🔹 🔹 Small Screens */}
          <div className="flex sm:hidden flex-row items-center justify-center space-x-4 mt-4">
            {/* Step Icons */}
            <Image alt="steps" src={steps} className="w-[35px] h-[200px]" />

            {/* Main Image */}
            <Image alt="thumbs" src={thumbs} className="w-[260px] h-[230px]" />
          </div>

          {/* 🔹 🔹 🔹 Medium Screens */}
          <div className="hidden sm:hidden md:flex lg:hidden relative h-[400px] justify-center items-center">
            <Image
              alt="steps"
              src={steps}
              className="absolute top-[0px] left-[30px] w-[35px] h-[240px]"
            />
            <Image
              alt="thumbs"
              src={thumbs}
              className="absolute top-[40px] left-[80px] w-[290px] h-[250px]"
            />
          </div>

          {/* 🔹 🔹 🔹 Large Screens */}
          <div className="hidden lg:flex items-center relative">
            <Image
              alt="thumbs"
              src={thumbs}
              className="w-[480px] h-[250px] ml-2"
            />
            <Image alt="steps" src={steps} className="w-[40px] h-[230px]" />
          </div>
        </div>

        {/* 📌 Text Section */}
        <div className="w-full">
          {/* 📌 Small Screens (sm) */}
          <div className="block sm:block md:hidden lg:hidden px-6">
            <div className="space-y-10 w-full mx-auto">
              {/* First Section */}
              <div className="text-left mt-14">
                <h1 className="text-white font-bold leading-[37px]">Sign Up</h1>
                <p className="text-white text-[14px] font-light">
                  Create an account and get instant access to our dashboard.
                  Whether you&apos;re a school, organization, or event manager,
                  we have the tools for you.
                </p>
              </div>

              {/* Second Section */}
              <div className="text-left mt-14">
                <h1 className="text-white font-bold leading-[37px]">
                  Manage Attendance & Certifications
                </h1>
                <p className="text-white text-[14px] font-light">
                  Automatically track attendance and issue certificates upon
                  course or event completion. Manage everything from one central
                  platform.
                </p>
              </div>

              {/* Third Section */}
              <div className="text-left mt-6">
                <h1 className="text-white font-bold leading-[37px]">
                  Set Up Courses & Events
                </h1>
                <p className="text-white text-[14px] font-light">
                  Add your courses, events, or programs. Customize everything
                  from scheduling to certification rules.
                </p>
              </div>

              {/* Fourth Section */}
              <div className="text-left mt-6">
                <h1 className="text-white font-bold leading-[37px]">
                  Verify Certificate
                </h1>
                <p className="text-white text-[14px] font-light ">
                  You can now verify certification with as simple as a search
                  button click. Find out all you need with the{" "}
                  <span className="text-[#4A90E2] font-semibold cursor-pointer">
                    Attensys Explorer
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* 📌 Medium Screens (md) */}
          <div className="hidden md:flex lg:hidden flex-col items-center justify-center px-8 w-full">
            <div className="grid md:grid-cols-2 gap-6 w-full max-w-[900px]">
              {/* 📌 First Column */}
              <div className="text-left">
                <h1 className="text-white font-bold leading-[24px]">Sign Up</h1>
                <p className="text-white text-[16px] font-light">
                  Create an account and get instant access to our dashboard.
                  Whether you&apos;re a school, organization, or event manager,
                  we have the tools for you.
                </p>
              </div>

              <div className="text-left">
                <h1 className="text-white font-bold leading-[24px]">
                  Manage Attendance & Certifications
                </h1>
                <p className="text-white text-[16px] font-light">
                  Automatically track attendance and issue certificates upon
                  course or event completion. Manage everything from one central
                  platform.
                </p>
              </div>

              {/* 📌 Second Column */}
              <div className="text-left">
                <h1 className="text-white font-bold leading-[24px]">
                  Set Up Courses & Events
                </h1>
                <p className="text-white text-[16px] font-light">
                  Add your courses, events, or programs. Customize everything
                  from scheduling to certification rules.
                </p>
              </div>

              <div className="text-left">
                <h1 className="text-white font-bold leading-[24px]">
                  Verify Certificate
                </h1>
                <p className="text-white text-[16px] font-light">
                  You can now verify certification with as simple as a search
                  button click. Find out all you need with the{" "}
                  <span className="text-[#4A90E2] font-semibold cursor-pointer">
                    Attensys Explorer
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* 📌 Large Screens (lg) */}
          <div className="hidden lg:flex flex-col items-center justify-center px-8 w-full py-12">
            <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-8 w-full max-w-[1100px]">
              {/* 📌 First Column */}
              <div className="text-left">
                <h1 className="text-white font-bold leading-[28px] text-[20px]">
                  Sign Up
                </h1>
                <p className="text-white text-[16px] font-light max-w-[450px]">
                  Create an account and get instant access to our dashboard.
                  Whether you&apos;re a school, organization, or event manager,
                  we have the tools for you.
                </p>
              </div>

              <div className="text-left">
                <h1 className="text-white font-bold leading-[28px] text-[20px]">
                  Set Up Courses & Events
                </h1>
                <p className="text-white text-[16px] font-light max-w-[450px]">
                  Add your courses, events, or programs. Customize everything
                  from scheduling to certification rules.
                </p>
              </div>

              {/* 📌 Second Column */}
              <div className="text-left">
                <h1 className="text-white font-bold leading-[28px] text-[20px]">
                  Manage Attendance & Certifications
                </h1>
                <p className="text-white text-[16px] font-light max-w-[450px]">
                  Automatically track attendance and issue certificates upon
                  course or event completion. Manage everything from one central
                  platform.
                </p>
              </div>

              <div className="text-left">
                <h1 className="text-white font-bold leading-[28px] text-[20px]">
                  Verify Certificate
                </h1>
                <p className="text-white text-[16px] font-light max-w-[450px]">
                  You can now verify certification with as simple as a search
                  button click. Find out all you need with the{" "}
                  <span className="text-[#4A90E2] font-semibold cursor-pointer">
                    Attensys Explorer
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guide;
