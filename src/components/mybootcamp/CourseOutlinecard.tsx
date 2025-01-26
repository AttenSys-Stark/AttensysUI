import React from "react"
import { HiMiniCheckBadge } from "react-icons/hi2"
import Image from "next/image"
import classvid from "@/assets/classtsest.svg"
import { IoMdCalendar } from "react-icons/io"
import { GoEye } from "react-icons/go"
import { MdOutlineAssignment } from "react-icons/md"
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs"
import { IoIosPeople } from "react-icons/io"
import { MdOutlinePending } from "react-icons/md"
import { AiFillSignature } from "react-icons/ai"
import { PiVideo } from "react-icons/pi"

const CourseOutlinecard = (props: any) => {
  return (
    <div className="py-6 flex flex-col space-x-0 space-y-2 items-start justify-start md:flex-row md:space-y-0 md:space-x-16 md:items-center md:justify-between h-auto md:h-[175px] w-full mt-2 border-b-[1px] border-b-[#ABABAB52]">
      <div className="flex flex-col space-y-2 space-x-0 md:flex-row md:space-x-4 md:space-y-0 items-center">
        <div className="w-full flex items-center justify-between space-x-6">
          {props.status ? (
            <HiMiniCheckBadge className="h-[25px] w-[25px] flex flex-none text-[#1BA74C]" />
          ) : (
            <MdOutlinePending className="h-[25px] w-[25px] flex flex-none text-[#D86D6A]" />
          )}

          <div className="h-auto w-full md:h-[120px] md:w-[180px]">
            <Image
              src={classvid}
              alt="classvid"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="space-y-6 md:space-y-4">
          <div className="w-full flex flex-none space-x-1">
            <div className="py-2 px-2.5 rounded-lg space-x-1 flex items-center justify-center bg-[#2D3A4B]">
              <IoMdCalendar className="h-[14px] w-[14px] md:h-xs md:text-sm md:w-[14px] text-[#FFFFFF]" />
              <h1 className="text-[#FFFFFF] text-sm font-medium">
                Day 1
              </h1>
            </div>
            <div className="flex space-x-2 items-center justify-center h-[33px] w-[85px]">
              <GoEye className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] text-[#2D3A4B]" />
              <h1 className="text-xs text-[#2D3A4B] font-medium">
                301
              </h1>
            </div>
          </div>
          <h1 className="w-full flex flex-none text-[#2D3A4B] text-md font-medium">
            Class 1 : Introduction to Xcode database
          </h1>
          <div className="w-full flex flex-wrap md:flex-nowrap md:flex-none md:space-x-4">
            <div className="space-x-1 mr-3 md:mr-0 mb-2 flex items-center justify-center flex-none">
              <PiVideo className="text-[#4A90E2] h-[22px] w-[22px]" />
              <h1 className="text-[#4A90E2] text-sm font-medium underline">
                Watch class
              </h1>
            </div>
            <div className="space-x-1 mr-3 md:mr-0 mb-2 flex items-center justify-center flex-none">
              <MdOutlineAssignment className="text-[#9747FF] h-[20px] w-[20px]" />
              <h1 className="text-[#9B51E0] text-sm font-medium underline">
                1 assignment
              </h1>
            </div>
            <div className="space-x-1 mr-3 md:mr-0 mb-2 flex items-center justify-center flex-none">
              <BsFillFileEarmarkSpreadsheetFill className="text-[#9747FF] h-[20px] w-[20px]" />
              <h1 className="text-[#9B51E0] text-sm font-medium underline">
                1 resource
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 flex-none flex flex-col items-start justify-start md:items-end md:justify-end">
        <div className="flex space-x-2 justify-center items-center">
          <IoMdCalendar className="h-[22px] w-[22px] text-[#2D3A4B]" />
          <h1 className="text-sm text-[#2D3A4B] font-medium">
            23rd Nov, 2024 | 9:00am GMT
          </h1>
        </div>
        <h1 className="text-sm text-[#2D3A4B] font-light">
          {" "}
          <span className="text-[#5801A9] font-semibold">Lead tutor</span> - @
          vladamirocks@gmail.com
        </h1>
        <h1 className="text-sm font-medium text-[#8176766E]">
          Meeting - https://us05web.zoom.us/j/...
        </h1>
        {props.status ? (
          <div className="flex space-x-2 items-center">
            <HiMiniCheckBadge className="h-[22px] w-[22px] text-[#1BA74C]" />
            <h1 className="text-[12px] font-medium text-[#1BA74C]">
              Attendance signed
            </h1>
          </div>
        ) : (
          <div className="py-2 px-4 rounded-xl bg-[#4A90E21F] border-[1px] border-[#4A90E2] space-x-2 flex items-center justify-center">
            <AiFillSignature />
            <h1 className="text-xs font-medium text-[#2D3A4B]">
              Sign attendance
            </h1>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseOutlinecard
