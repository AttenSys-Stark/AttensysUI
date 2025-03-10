import React, { useState } from "react";
import threevert from "@/assets/threevert.svg";
import Image from "next/image";
import gridline from "@/assets/gridicons_create.svg";
import book from "@/assets/bookfall.svg";
import drop from "@/assets/droporg.svg";
import Mybootcamp from "./Mybootcamp";
import Permissions from "./Permissions";
import Registered from "./Registered";
import { FaPlus } from "react-icons/fa6";
import { createbootcampoverlay } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { ImBooks } from "react-icons/im";
import LoadingSpinner from "../ui/LoadingSpinner";

const Organizationtabs = (props: any) => {
  const [mybootcampStat, setMyBootcampStat] = useState(true);
  const [PermissionsStat, setPermissionscampStat] = useState(false);
  const [RegisteredStat, setRegisteredStat] = useState(false);
  const [createOverlayStat, setCreateOverlayStat] = useAtom(
    createbootcampoverlay,
  );

  const handlemybootcamp = () => {
    setMyBootcampStat(!mybootcampStat);
    // setPermissionscampStat(false);
    // setRegisteredStat(false)
  };

  const handlePermission = () => {
    // setMyBootcampStat(false)
    setPermissionscampStat(!PermissionsStat);
    // setRegisteredStat(false)
  };

  const handleregistered = () => {
    // setMyBootcampStat(false)
    // setPermissionscampStat(false);
    setRegisteredStat(!RegisteredStat);
  };
  const handleCreateOverlay = () => {
    setCreateOverlayStat(true);
    setRegisteredStat(false);
    setPermissionscampStat(false);
  };

  return (
    <div className="h-auto w-full md:w-[90%] mx-auto flex mt-8 space-x-10 pb-12">
      <div className="h-auto w-[30%] space-y-3 hidden lg:block">
        <div className="h-[62px] bg-[#FFFFFF] rounded-xl flex items-center border-[1px] border-[#BCBCBC] space-x-3 px-10">
          <Image src={threevert} alt="line" />
          <h1 className="text-[14px] leading-[19px] font-bold text-[#2D3A4B]">
            Bootcamps
          </h1>
        </div>
        <div className="h-[62px] bg-[#FFFFFF] rounded-xl flex items-center border-[1px] border-[#BCBCBC] space-x-3 px-10">
          <Image src={book} alt="line" />
          <h1 className="text-[14px] leading-[19px] font-bold text-[#2D3A4B]">
            Permissions and Access
          </h1>
        </div>
        <div className="h-[62px] bg-[#FFFFFF] rounded-xl flex items-center border-[1px] border-[#BCBCBC] space-x-3 px-10">
          <Image src={gridline} alt="line" />
          <h1 className="text-[14px] leading-[19px] font-bold text-[#2D3A4B]">
            Registered Students
          </h1>
        </div>
      </div>

      <div className="h-auto w-[90%] mx-auto lg:w-[70%] space-y-3">
        <div className="-ml-5">
          <div className="h-[78px] bg-[#FFFFFF] rounded-t-xl flex items-center border-[1px] border-[#BCBCBC] justify-between px-10">
            <h1 className="text-[14px] md:text-[18px] leading-[22px] text-[#333333] font-semibold hidden sm:block">
              My Bootcamps
            </h1>
            <h1 className="text-[14px] md:text-[18px] leading-[22px] text-[#333333] font-semibold sm:hidden">
              Bootcamps
            </h1>
            <div className="flex space-x-7 items-center">
              <div
                onClick={handleCreateOverlay}
                className="flex space-x-1 text-[#5801A9] items-center cursor-pointer"
              >
                <FaPlus className="h-[14px] w-[14px]" />
                <h1 className="text-[14px] md:text-[14px] font-medium leading-[19px] underline">
                  Create bootcamp
                </h1>
              </div>
              <Image
                src={drop}
                alt="drop"
                onClick={handlemybootcamp}
                className="cursor-pointer hidden sm:block"
              />
            </div>
          </div>
          {mybootcampStat &&
            (props.isLoading ? (
              <div className="flex justify-center items-center h-[200px] bg-white">
                <LoadingSpinner size="lg" colorVariant="primary" />
              </div>
            ) : (
              <Mybootcamp bootcampInfo={props.bootcampinfo} />
            ))}
        </div>

        <div className="-ml-5">
          <div
            onClick={handlePermission}
            className="h-[78px] sm:bg-[#FFFFFF] rounded-t-xl hidden md:flex items-center border-[1px] border-[#BCBCBC] justify-between px-10"
          >
            <h1 className="text-[18px] leading-[22px] text-[#333333] font-semibold">
              Permissions and Access
            </h1>
            <Image src={drop} alt="drop" />
          </div>
          <div
            className="text-[14px] py-3 text-[#5801A9] border-t border-b border-[#5801A9] md:hidden text-center"
            onClick={() => {
              handlePermission();
              handleregistered();
            }}
          >
            <p>
              Show More
              <span>&#8595;</span>
            </p>
          </div>
          {PermissionsStat && <Permissions />}
        </div>

        <div className="-ml-5">
          <div
            onClick={handleregistered}
            className="hidden h-[78px] bg-[#FFFFFF] rounded-t-xl md:flex items-center border-[1px] border-[#BCBCBC] justify-between px-10"
          >
            <h1 className="text-[18px] leading-[22px] text-[#333333] font-semibold">
              Registered students (3789)
            </h1>
            <Image src={drop} alt="drop" />
          </div>
          <div
            className="border border-b-[#5801A9] text-[#5801A9] flex md:hidden py-2 my-2 items-center gap-2 text-[11px] sm:text-[14px] md:text-[25px] leading-[31px] font-semibold border-b-2 border-[#4A90E2]"
            onClick={handleregistered}
          >
            <span>
              <ImBooks className="text-[#9B51E0] text-2xl" />
            </span>
            Registered students (3789)
          </div>
          {RegisteredStat && <Registered />}
        </div>
      </div>
    </div>
  );
};

export default Organizationtabs;
