import React from "react"
import { GiBookshelf } from "react-icons/gi"

const Notifycard = () => {
  return (
    <div className="h-[100px] px-4 border-b-[1px] border-b-[#CACBCB] flex space-x-3 items-center">
      <GiBookshelf className="h-[32px] w-[32px] flex-none text-[#A01B9B]" />
      <h1 className="text-[14px] font-light leading-[22px] text-[#333333]">
        You have a new assignment from{" "}
        <span className="text-[#A01B9B] underline">Web3 Afrika bootcamp</span> |
        Deadline is 5th Nov, 2024 - 12am
      </h1>
    </div>
  )
}

export default Notifycard
