"use client";
import React, { useState, useEffect } from "react";
import Coursedropdown from "@/components/courses/Coursedropdown";
import { useParams, useRouter } from "next/navigation";
import {
  coursestatusAtom,
  bootcampdropdownstatus,
  connectorAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import Bootcampdropdown from "@/components/bootcamp/Bootcampdropdown";
import { useAtom } from "jotai";
import Basicinfo from "@/components/createorganization/Basicinfo";
import Walletinfo from "@/components/createorganization/Walletinfo";
import Admininfo from "@/components/createorganization/Admininfo";
import Addinstructor from "@/components/createorganization/Addinstructor";
import Congratulations from "@/components/createorganization/Congratulations";
import WalletisConnected from "@/components/createorganization/WalletisConnected";
import Image from "next/image";
import backArrow from "../../../../public/backArrow.svg";

const Index = () => {
  const [status, setstatus] = useAtom(coursestatusAtom);
  const [bootcampdropstat, setbootcampdropstat] = useAtom(
    bootcampdropdownstatus,
  );
  const router = useRouter();
  const params = useParams();
  const section = params.info;

  const [wallet] = useAtom(walletStarknetkit);
  const [connector] = useAtom(connectorAtom);

  const [connectorDataAccount] = useState<null | any>(
    connector?.wallet.account,
  );

  const handlePageClick = () => {
    setbootcampdropstat(false);
    setstatus(false);
  };

  const handlerouting = (prop: string) => {
    router.push(`/Createorganization/${prop}`);
  };

  const renderContent = () => {
    switch (section) {
      case "basic-info":
        return (
          <>
            <Basicinfo />
          </>
        );

      case "wallet-info":
        return <>{!wallet ? <Walletinfo /> : <WalletisConnected />} </>;
      case "admin-info":
        return (
          <>
            <Admininfo />
          </>
        );

      case "add-instructors":
        return (
          <>
            <Addinstructor connectorDataAccount={connectorDataAccount} />
          </>
        );

      case "create-a-bootcamp":
        return (
          <>
            <Congratulations />
          </>
        );

      default:
        return <p>Error 404</p>;
    }
  };

  const renderHeader = () => {
    switch (section) {
      case "basic-info":
        return (
          <>
            <h1 className="text-[18px] font-bold text-[#5801A9] leading-[22px] mb-6">
              Getting you ready in 5 easy steps
            </h1>
            <div className="flex items-center gap-2 px-4">
              {[1, 2, 3, 4, 5].map((step, index) => (
                <React.Fragment key={step}>
                  <div
                    className={`flex flex-none items-center justify-center h-6 w-6 md:h-[38px] md:w-[38px] rounded-full border border-[#9B51E0] text-sm
         ${step === 1 ? "bg-[#9B51E0] text-white" : ""}`}
                  >
                    {step}
                  </div>
                  {index < 4 && (
                    <div className="h-[1px] w-[24px] sm:w-[32px] md:w-[48px] border-t border-[#5801A9]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        );

      case "wallet-info":
        return (
          <>
            <div className="flex flex-col items-center w-full px-4 space-y-4 sm:px-6 sm:space-y-6">
              <h1 className="text-[16px] sm:text-[18px] font-bold text-[#5801A9] leading-[20px] sm:leading-[22px] text-center">
                Great Job!!, you&apos;re almost there
              </h1>

              {/* Desktop Progress Stepper - Hidden on mobile */}
              <div className="items-center justify-center hidden space-x-4 sm:flex">
                <div className="border-[1px] rounded-full border-[#9B51E0] bg-[#9B51E0] text-[#FFFFFF] h-[38px] w-[38px] flex items-center justify-center">
                  1
                </div>
                <div className="h-[1px] w-[54px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] rounded-full border-[#9B51E0] h-[38px] w-[38px] bg-[#9B51E0] text-[#FFFFFF] flex items-center justify-center">
                  2
                </div>
                <div className="h-[1px] w-[54px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] rounded-full border-[#9B51E0] h-[38px] w-[38px] flex items-center justify-center">
                  3
                </div>
                <div className="h-[1px] w-[54px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] rounded-full border-[#9B51E0] h-[38px] w-[38px] flex items-center justify-center">
                  4
                </div>
                <div className="h-[1px] w-[54px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] rounded-full border-[#9B51E0] h-[38px] w-[38px] flex items-center justify-center">
                  5
                </div>
              </div>

              {/* Mobile Progress Stepper - Hidden on desktop */}
              <div className="flex sm:hidden space-x-2 justify-center items-center w-full max-w-[300px]">
                <div className="border-[1px] flex-none rounded-full border-[#9B51E0] bg-[#9B51E0] text-[#FFFFFF] h-[30px] w-[30px] flex items-center justify-center text-sm">
                  1
                </div>
                <div className="h-[1px] w-[20px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] flex-none rounded-full border-[#9B51E0] h-[30px] w-[30px] bg-[#9B51E0] text-[#FFFFFF] flex items-center justify-center text-sm">
                  2
                </div>
                <div className="h-[1px] w-[20px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] flex-none rounded-full border-[#9B51E0] h-[30px] w-[30px] flex items-center justify-center text-sm">
                  3
                </div>
                <div className="h-[1px] w-[20px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] flex-none rounded-full border-[#9B51E0] h-[30px] w-[30px] flex items-center justify-center text-sm">
                  4
                </div>
                <div className="h-[1px] w-[20px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] flex-none rounded-full border-[#9B51E0] h-[30px] w-[30px] flex items-center justify-center text-sm">
                  5
                </div>
              </div>
            </div>
          </>
        );

      case "admin-info":
        return (
          <>
            <div className="flex flex-col items-center w-full px-4 space-y-6 sm:px-6 sm:space-y-8">
              <h1 className="text-[16px] sm:text-[18px] font-bold text-[#5801A9] leading-[20px] sm:leading-[22px] text-center">
                Now, let&apos;s know the{" "}
                <span className="text-[#4A90E2]">brains</span> behind your
                organization
              </h1>

              {/* Desktop Progress Stepper - Hidden on mobile */}
              <div className="items-center justify-center hidden space-x-4 sm:flex">
                <div className="border-[1px] rounded-full border-[#9B51E0] bg-[#9B51E0] text-[#FFFFFF] h-[38px] w-[38px] flex items-center justify-center">
                  1
                </div>
                <div className="h-[1px] w-[54px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] rounded-full border-[#9B51E0] bg-[#9B51E0] text-[#FFFFFF] h-[38px] w-[38px] flex items-center justify-center">
                  2
                </div>
                <div className="h-[1px] w-[54px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] rounded-full border-[#9B51E0] bg-[#9B51E0] text-[#FFFFFF] h-[38px] w-[38px] flex items-center justify-center">
                  3
                </div>
                <div className="h-[1px] w-[54px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] rounded-full border-[#9B51E0] h-[38px] w-[38px] flex items-center justify-center">
                  4
                </div>
                <div className="h-[1px] w-[54px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] rounded-full border-[#9B51E0] h-[38px] w-[38px] flex items-center justify-center">
                  5
                </div>
              </div>

              {/* Mobile Progress Stepper - Hidden on desktop */}
              <div className="flex sm:hidden space-x-2 justify-center items-center w-full max-w-[300px]">
                <div className="border-[1px] flex-none rounded-full border-[#9B51E0] bg-[#9B51E0] text-[#FFFFFF] h-[30px] w-[30px] flex items-center justify-center text-sm">
                  1
                </div>
                <div className="h-[1px] w-[20px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] flex-none rounded-full border-[#9B51E0] bg-[#9B51E0] text-[#FFFFFF] h-[30px] w-[30px] flex items-center justify-center text-sm">
                  2
                </div>
                <div className="h-[1px] w-[20px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] flex-none rounded-full border-[#9B51E0] bg-[#9B51E0] text-[#FFFFFF] h-[30px] w-[30px] flex items-center justify-center text-sm">
                  3
                </div>
                <div className="h-[1px] w-[20px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] flex-none rounded-full border-[#9B51E0] h-[30px] w-[30px] flex items-center justify-center text-sm">
                  4
                </div>
                <div className="h-[1px] w-[20px] border-[1px] border-[#5801A9]"></div>
                <div className="border-[1px] flex-none rounded-full border-[#9B51E0] h-[30px] w-[30px] flex items-center justify-center text-sm">
                  5
                </div>
              </div>

              <div className="flex float-left w-full ml-4 space-x-3 text-purple-500 lg:hidden">
                <Image src={backArrow} alt="back arrow" />
                <p className="text-lg font-extrabold">Basic Info</p>
              </div>

              <p className="w-full max-w-[580px] lg:text-center text-left text-[14px] sm:text-[15px] font-light leading-[18px] sm:leading-[20px] px-4 sm:px-0">
                As an organization admin{" "}
                <span className="text-[#4A90E2]">
                  you reserve full access to add instructors, issue
                  certificates, access control and sole management rights to
                  your organization.
                </span>{" "}
                This information help us verify it&apos;s you whenever we
                suspect inconsistent activity
              </p>
            </div>
          </>
        );

      case "add-instructors":
        return (
          <>
            <h1 className="text-[16px] sm:text-[18px] font-bold text-[#5801A9] leading-[20px] sm:leading-[22px] text-center px-4 sm:px-0">
              <span className="text-[#4A90E2]">Worthy mentions:</span> Only
              Instructors can create courses
            </h1>

            {/* Progress Steps - Adjusts size on mobile */}
            <div className="flex items-center justify-center px-4 space-x-1 sm:space-x-2 sm:px-0">
              <div className="border-[1px] flex-none rounded-full border-[#9B51E0] bg-[#9B51E0] text-[#FFFFFF] h-[30px] w-[30px] sm:h-[38px] sm:w-[38px] flex items-center justify-center text-sm sm:text-base">
                1
              </div>
              <div className="h-[1px] w-[12px] sm:w-[32px] border-[1px] border-[#5801A9]"></div>
              <div className="border-[1px] flex-none rounded-full border-[#9B51E0] bg-[#9B51E0] text-[#FFFFFF] h-[30px] w-[30px] sm:h-[38px] sm:w-[38px] flex items-center justify-center text-sm sm:text-base">
                2
              </div>
              <div className="h-[1px] w-[12px] sm:w-[32px] border-[1px] border-[#5801A9]"></div>
              <div className="border-[1px] flex-none rounded-full border-[#9B51E0] bg-[#9B51E0] text-[#FFFFFF] h-[30px] w-[30px] sm:h-[38px] sm:w-[38px] flex items-center justify-center text-sm sm:text-base">
                3
              </div>
              <div className="h-[1px] w-[12px] sm:w-[32px] border-[1px] border-[#5801A9]"></div>
              <div className="border-[1px] flex-none rounded-full border-[#9B51E0] bg-[#9B51E0] text-[#FFFFFF] h-[30px] w-[30px] sm:h-[38px] sm:w-[38px] flex items-center justify-center text-sm sm:text-base">
                4
              </div>
              <div className="h-[1px] w-[12px] sm:w-[32px] border-[1px] border-[#5801A9]"></div>
              <div className="border-[1px] flex-none rounded-full border-[#9B51E0] h-[30px] w-[30px] sm:h-[38px] sm:w-[38px] flex items-center justify-center text-sm sm:text-base">
                5
              </div>
            </div>

            <p className="w-full sm:w-[580px] text-center text-[15px] sm:text-[14px] font-light leading-[18px] sm:leading-[20px] px-4 sm:px-0">
              As your first order of business add your first instructor. If you
              would like to create a course yourself, kindly go ahead and add
              your admin email.
            </p>
          </>
        );

      case "create-a-bootcamp":
        return (
          <>
            <h1 className="text-[20px] font-bold text-[#4A90E2] leading-[22px] text-center flex justify-center items-center">
              Congratulations your Organization is all setup!!
            </h1>
          </>
        );

      default:
        return <p>Error 404</p>;
    }
  };

  return (
    <div onClick={handlePageClick} className="h-auto">
      {status && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      {bootcampdropstat && (
        <div className="fixed inset-0 bg-black opacity-5 backdrop-blur-sm"></div>
      )}
      <div onClick={(e) => e.stopPropagation()}>
        <Coursedropdown />
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <Bootcampdropdown />
      </div>

      <div className="flex justify-center w-full lg:justify-start ">
        <div className="w-[30%] xl:w-[20%] bg-create-gradient lg:flex hidden justify-end">
          <div className="mt-20 bg-[#F5F8FA]0 space-y-2 md:space-y-5">
            <div
              className={`cursor-pointer h-[67px] w-[278px] text-[16px]  rounded-tl-xl rounded-bl-xl py-5 pl-10 ${section == "basic-info" ? "bg-[#F5F8FA] text-[#5801A9]" : "bg-none text-[#FFFFFF]"} leading-[22px] font-bold`}
              onClick={() => {
                handlerouting("basic-info");
              }}
            >
              Basic Info
            </div>
            {/* @todo all these items on the panel should be clickable if and only if the details has already been filled, the idea if for it to be more like a way to go back to previously filled items */}
            <div
              className={`cursor-pointer h-[67px] w-[278px] text-[16px]  rounded-tl-xl rounded-bl-xl py-5 pl-10 ${section == "wallet-info" ? "bg-[#F5F8FA] text-[#5801A9]" : "bg-none text-[#FFFFFF]"} leading-[22px] font-bold`}
              onClick={() => {
                handlerouting("wallet-info");
              }}
            >
              Wallet Information
            </div>
            <div
              className={`cursor-pointer h-[67px] w-[278px] text-[16px]  rounded-tl-xl rounded-bl-xl py-5 pl-10 ${section == "admin-info" ? "bg-[#F5F8FA] text-[#5801A9]" : "bg-none text-[#FFFFFF]"} leading-[22px] font-bold`}
              onClick={() => {
                handlerouting("admin-info");
              }}
            >
              Admin information
            </div>
            <div
              className={`cursor-pointer h-[67px] w-[278px] text-[16px]  rounded-tl-xl rounded-bl-xl py-5 pl-10 ${section == "add-instructors" ? "bg-[#F5F8FA] text-[#5801A9]" : "bg-none text-[#FFFFFF]"} leading-[22px] font-bold`}
              onClick={() => {
                handlerouting("add-instructors");
              }}
            >
              Add Instructors
            </div>
            <div
              className={`cursor-pointer h-[67px] w-[278px] text-[16px]  rounded-tl-xl rounded-bl-xl py-5 pl-10 ${section == "create-a-bootcamp" ? "bg-[#F5F8FA] text-[#5801A9]" : "bg-none text-[#FFFFFF]"} leading-[22px] font-bold`}
              onClick={() => {
                handlerouting("create-a-bootcamp");
              }}
            >
              Create bootcamp
            </div>
          </div>
        </div>

        <div className="lg:w-[70%] xl:w-[80%] w-full bg-[#f5f8fa] px-6 pb-12 lg:px-16 lg:pb-32">
          <div className="flex flex-col items-center justify-center w-full h-auto pt-24 pb-8 space-y-5">
            {renderHeader()}
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
