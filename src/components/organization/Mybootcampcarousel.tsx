import React from "react"
import Image from "next/image"
import { Button } from "@headlessui/react"
import { IoSettingsSharp } from "react-icons/io5"

interface CarousellCardProp {
  name: string
  time: string
  flier: any
  logo: any
  action: string
  height: string
  width: string
  onClick?: () => void
}

const Mybootcampcarousel: React.FC<CarousellCardProp> = (props) => {
  return (
    <>
      <div
        className={`relative ${`h-[${props.height}] w-[${props.width}]`} rounded-2xl mx-auto cursor-pointer`}
        onClick={props.onClick}
      >
        <div className="h-[200px] w-full">
          <Image
            src={props.flier}
            alt="eventimage"
            className="h-full w-full object-cover rounded-2xl"
          />
        </div>
        <Button className="hidden absolute top-3 right-6 justify-center lg:flex rounded-lg bg-[#9B51E0] text-[#FFFCFC] py-2 px-4 lg:h-[23px] items-center lg:w-[50px] text-sm data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
          <div className="text-[7px]">{props.action}</div>
        </Button>
        <div className="absolute bottom-0 z-20 w-full flex items-center justify-center text-center bg-carousell-gradient pb-4">
          <div className="flex space-x-3 mt-20">
            <div className="rounded-full h-[24px] w-[24px]">
              <Image src={props.logo} alt="logo" className="object-cover" />
            </div>
            <div>
              <h1 className="text-[#FFFFFF] text-[10px] font-bold leading-[22px]">
                {props.name}
              </h1>
              <h1 className="text-[#FFFFFF] text-[8px] font-medium leading-[8px]">
                {props.time}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[80%] mx-auto mt-3 flex items-center space-x-2">
        <IoSettingsSharp className="text-[#2D3A4B]" />
        <h1 className="text-[14px] leading-[22px] font-medium text-[#333333]">
          Manage bootcamp
        </h1>
      </div>
    </>
  )
}

export default Mybootcampcarousel
