import React, { useRef, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import Image from "next/image";
import classvid from "@/assets/classtsest.svg";
import { IoMdCalendar } from "react-icons/io";
import { GoEye } from "react-icons/go";
import { MdOutlineAssignment } from "react-icons/md";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import ReactPlayer from "react-player/lazy";
import screenfull from "screenfull";

const OutlineCard = (props: any) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const TruncatedText = ({
    text,
    maxLength = 50,
  }: {
    text: string;
    maxLength?: number;
  }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <span>
        {expanded
          ? text
          : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "")}
        {text.length > maxLength && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-500 underline ml-1"
          >
            {expanded ? "See Less" : "See More"}
          </button>
        )}
      </span>
    );
  };

  const handleClick = () => {
    if (screenfull.isEnabled && playerRef.current) {
      screenfull.request(playerRef.current);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row h-auto  xl:justify-between xl:h-auto md:items-start md:space-y-4 xl:space-y-0 w-full mt-2 border-b-[1px] border-b-[#ABABAB52] pb-12 xl:pb-6">
      <div className="flex flex-col md:flex-row gap-4 md:space-x-1 xl:space-x-6 md:items-center">
        {/* <div className="flex space-x-1 md:hidden">
          <div className="h-[33px] w-[85px] rounded-lg space-x-1 flex items-center justify-center bg-[#2D3A4B]">
            <IoMdCalendar className="h-[15px] w-[14px] text-[#FFFFFF]" />
            <h1 className="text-[#FFFFFF] text-[11px] leading-[17px] font-medium">
              Day 1
            </h1>
          </div>

          <div className="flex space-x-2 items-center justify-center h-[33px] w-[85px]">
            <GoEye className="w-[21px] h-[21px] text-[#2D3A4B]" />
            <h1 className="text-[15px] text-[#2D3A4B] font-medium leading-[21px]">
              301
            </h1>
          </div>
        </div> */}
        <div className="flex items-center  space-x-6 border-[1px] border-[#B8B9BA] rounded-xl">
          <div
            className="lg:h-[126px] lg:w-[188px] rounded-xl cursor-pointer overflow-hidden"
            onClick={handleClick}
            ref={playerRef}
          >
            <ReactPlayer
              url={`https://${props.videolink}`}
              width="100%"
              height="100%"
              className="rounded-xl"
              controls={true} // Adds play/pause controls
              muted={false} // Mute initially to prevent autoplay blocking
              light={props.thumbnail}
              playing={false}
            />
          </div>
        </div>

        <div className="space-y-3">
          {/* <div className="hidden md:flex space-x-1">
            <div className="h-[33px] w-[85px] rounded-lg space-x-1 flex items-center justify-center bg-[#2D3A4B]">
              <IoMdCalendar className="h-[15px] w-[14px] text-[#FFFFFF]" />
              <h1 className="text-[#FFFFFF] text-[11px] leading-[17px] font-medium">
                Day 1
              </h1>
            </div>

            <div className="flex space-x-2 items-center justify-center h-[33px] w-[85px]">
              <GoEye className="w-[21px] h-[21px] text-[#2D3A4B]" />
              <h1 className="text-[15px] text-[#2D3A4B] font-medium leading-[21px]">
                301
              </h1>
            </div>
          </div> */}
          <h1 className="text-[#2D3A4B] text-[14px] leading-[22px] font-bold">
            Topic : {props.topic}
          </h1>
          <h1 className="text-[#2D3A4B] text-[12px] leading-[22px] font-medium">
            <span className="font-bold text-[14px]">Description</span> :{" "}
            <TruncatedText text={props.description} maxLength={220} />
          </h1>
          <h1 className="text-[#2D3A4B] text-[12px] leading-[22px] font-medium">
            <span className="font-bold text-[14px]">Assignment</span> :{" "}
            <TruncatedText text={props.assignment} maxLength={220} />
          </h1>
          {/* <div className="flex flex-col space-y-3 md:space-y-0  md:flex-row sm:space-x-2 md:space-x-4 lg:space-x-6">
            <div className="flex  md:space-x-4 lg:space-x-6">
              <div className="space-x-1 flex items-center justify-center">
                <MdOutlineAssignment className="text-[#9747FF] h-[20px] w-[20px]" />
                <h1 className="text-[#9B51E0] text-[16px] leading-[22px] font-medium underline">
                  1 assignment
                </h1>
              </div>
              <div className="space-x-1 flex items-center justify-center">
                <BsFillFileEarmarkSpreadsheetFill className="text-[#9747FF] h-[20px] w-[20px]" />
                <h1 className="text-[#9B51E0] text-[16px] leading-[22px] font-medium underline">
                  1 resource
                </h1>
              </div>
            </div>

            <div className="space-x-1 flex items-center justify-start md:justify-center">
              <IoIosPeople className="text-[#2D3A4B] h-[25px] w-[25px]" />
              <h1 className="text-[#2D3A4B] text-[16px] leading-[22px] font-medium underline">
                201 of 210 attendance
              </h1>
            </div>
          </div> */}
        </div>
      </div>

      {/* <div className="space-y-3 flex flex-col md:items-start justify-center mt-3">
        <div className="flex space-x-2 md:justify-center items-center">
          <IoMdCalendar className="h-[25px] w-[25px] text-[#2D3A4B]" />
          <h1 className="text-[15px] text-[#2D3A4B] font-medium leading-[21px]">
            23rd Nov, 2024 | 9:00am GMT
          </h1>
        </div>
        <h1 className="text-[15px] text-[#2D3A4B] font-light leading-[21px]">
          <span className="text-[#5801A9] font-semibold">Lead tutor</span> - @
          vladamirocks@gmail.com
        </h1>
        <h1 className="text-[15px] font-medium text-[#8176766E] leading-[22px]">
          Meeting - https://us05web.zoom.us/j/...
        </h1>
      </div> */}
    </div>
  );
};

export default OutlineCard;
