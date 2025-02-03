import React, { useState } from "react"
import OutlineCard from "./OutlineCard"
import { FaPlus } from "react-icons/fa6"
import { addclassmodal } from "@/state/connectedWalletStarknetkitNext"
import { useAtom } from "jotai"

const Outline = () => {
  const [dataStat, setDataStat] = useState(false)
  const [addClass, setAddclass] = useAtom(addclassmodal)

  const handleAddclass = () => {
    setAddclass(true)
  }

  return (
    <div className="relative w-full md:w-[90%] h-[721px] bg-transparent md:bg-[#FFFFFF]  md:mx-auto md:rounded-xl md:border-[#D2D2D2] md:border-[1px] px-6 md:px-7 ">
      {dataStat && (
        <div className="h-[600px] w-full flex items-center justify-center">
          <h1>No Video upload</h1>
        </div>
      )}
      {!dataStat && (
        <div className="h-[600px] w-full overflow-y-scroll">
          <OutlineCard />
          <OutlineCard />
          <OutlineCard />
        </div>
      )}
      <div
        className="hidden sticky bottom-0 w-[100%] bg-white md:flex items-center justify-center space-x-4 border-b-[1px] mt-2 h-[80px] cursor-pointer border-[1px] rounded-lg border-[#C2C2C2]"
        onClick={handleAddclass}
      >
        <FaPlus />
        <h1 className="font-medium text-[16px] leading-[22px] underline">
          Upload new class recording{" "}
        </h1>
      </div>
    </div>
  )
}

export default Outline
