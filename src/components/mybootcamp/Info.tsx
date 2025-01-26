import React from "react"
import Image from "next/image"
import avatar from "@/assets/profile_pic.png"
import { RiShieldUserLine } from "react-icons/ri"

const Info = () => {
  return (
    <div className="h-auto py-6 w-ful">
      <div className="h-[100px] w-[90%] sm:w-[80%] mx-auto flex flex-col space-x-0 space-y-4 items-start justify-start lg:flex-row lg:space-x-4 lg:space-y-0 lg:items-center lg:justify-between">
        <div className="flex space-x-3 items-center">
          <div className="h-[40px] w-[40px] sm:h-[77px] sm:w-[77px] rounded-full border-[1px]">
            <Image
              src={avatar}
              alt="profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <h1 className="font-semibold text-[#5801A9] text-md sm:text-xl leading-[22px]">
              vladanirocks@gmail.com
            </h1>
            <p className="font-light text-xs sm:text-sm text-[#2D3A4B] leading-[16px]">
              vladanirocks@gmail.com
            </p>
          </div>
        </div>

        <div className="py-2.5 w-full max-w-[380px] border-[1px] border-[#6B6D6E] flex items-center space-x-1 justify-center rounded-xl">
          <RiShieldUserLine />
          <h1 className="text-[12px] sm:text-[14px] text-[#2D3A4B] font-medium">
            Status : Student{" "}
            <span className="text-[#5801A9]"> 0x5c956e61...de5232dc11</span>
          </h1>
        </div>
      </div>
    </div>
  )
}

export default Info
