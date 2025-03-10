import React from "react";
import { Button } from "@headlessui/react";
import Image from "next/image";
import Logo from "@/assets/Logo.svg";

const Footer = () => {
  return (
    <div className="px-4 sm:px-8 md:px-12 xl:px-16 flex items-start lg:items-stretch flex-col space-y-0 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-8 justify-between py-8 w-[100%]">
      <div className="bg-[#161313] rounded-t-lg lg:rounded-lg w-full h-auto flex items-start lg:items-center justify-start lg:justify-center text-white py-8 lg:py-16 px-8">
        <div className="w-full space-y-2 lg:max-w-[400px]">
          <h1 className="font-semibold text-xl sm:text-3xl flex text-left">
            Built by Geniuses, for Geniuses.
          </h1>
          <p className="font-normal text-sm sm:text-sm flex text-left w-full lg:max-w-[80%]">
            Join 1000+ designers, innovators, and creators who have embraced
            excellence, innovation, and creativity.
          </p>
          <div className="pt-6"></div>
          <Button className="flex rounded-lg bg-gradient-to-r from-[#9B51E0] to-[#4A90E2] py-4 px-8 items-center text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
            <div className="flex space-x-2 items-center font-semibold text-[16px]">
              <div>Get Started</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </div>
          </Button>
        </div>
      </div>

      <div className="bg-[#F4E8FF] rounded-b-lg lg:rounded-lg w-full h-auto flex flex-col items-start justify-start px-4 sm:px-8 xl:px-16 py-6">
        <div className="w-full grid grid-cols-12 gap-y-12 gap-x-4 items-start py-10">
          <div className="space-y-4 hidden lg:flex lg:flex-col w-full col-span-12 sm:col-span-4 md:col-span-3">
            <h1 className="text-md text-[#8D8484] font-medium w-full">
              Product
            </h1>
            <div className="space-y-4 text-sm font-medium w-full">
              <h1>Join Attensys</h1>
              <h1>Verify certificates</h1>
              <h1>Events</h1>
              <h1>Certifcations</h1>
            </div>
          </div>
          <div className="space-y-4 hidden lg:flex lg:flex-col w-full col-span-12 sm:col-span-4 md:col-span-3">
            <h1 className="text-md text-[#8D8484] font-medium w-full">Learn</h1>
            <div className="space-y-4 text-sm font-medium w-full">
              <h1>Courses</h1>
              <h1>Bootcamps</h1>
              <h1>Registeration</h1>
              <h1>Game Design</h1>
            </div>
          </div>
          <div className="space-y-4 hidden lg:flex lg:flex-col w-full col-span-12 sm:col-span-4 md:col-span-3">
            <h1 className="text-md text-[#8D8484] font-medium w-full">
              Community
            </h1>
            <div className="space-y-4 text-sm font-medium w-full">
              <h1>Attensys Community</h1>
              <h1>Discord</h1>
              <h1>Organizations</h1>
              <h1>Get Support</h1>
            </div>
          </div>
          <Image
            alt="Logo"
            src={Logo}
            className="col-span-12 md:col-span-3 md h-8 w-auto mx-auto md:mx-0 -mb-16 md:mb-0"
          />
          <div className="col-span-12 py-4 w-full flex justify-center items-center flex-col md:flex-row md:justify-between font-normal text-gray-600 text-xs">
            <div className="flex space-x-4 pb-4">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
            </div>
            <div>© 2024 with Attensys</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
