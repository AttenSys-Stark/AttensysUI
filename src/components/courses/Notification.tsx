import React from "react"
import { notifCategory } from "@/constants/data"
import Image from "next/image"

const Notification = () => {
  return (
    <div className="bg-white py-6 my-0 sm:my-12 lg:mx-2 rounded-xl border-[1px] border-[#BCBCBC]">
      {/* header */}
      <div className="px-12 py-5">
        <h1 className="font-bold text-lg text-[#A01B9B]">Notifications (14)</h1>
      </div>

      {/* content */}
      <div className="border-t-[1px] border-t-[#BCBCBC] text-sm h-[1014px] overflow-y-scroll scrollbar-hide">
        {notifCategory.map((item, i) => (
          <div key={i} className="">
            <div className="h-[80px] flex items-center w-full">
            <h4 className="px-12 font-semibold text-[17px] leading-[25px]">{item.read}</h4>
            </div>
            {item.msgs.map((msgDisplay, j) => (
              <div className="py-3 px-5 gap-2 lg:gap-0 lg:px-12 min-h-[75px] border flex items-center" key={j}>
                <Image src={msgDisplay.icon} alt="name" />
                <p className="ml-3 mt-2 lg:mt-0">
                  {msgDisplay.msg}
                  <span className="text-[#A01B9B]">Click to preview</span>{" "}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notification
