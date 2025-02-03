import React, { useState } from "react"
import story from "@/assets/story.svg"
import Image from "next/image"
import { Button } from "@headlessui/react"
import drop from "@/assets/drop.svg"
import Emailinput from "./Emailinput"
import cross from "@/assets/cross.svg"
import share from "@/assets/share.svg"
import del from "@/assets/delete.svg"
import ChartData from "./ChartData"

const Insight = () => {
  const [emailList, setEmailList] = useState<string[]>([])

  const handleEmailsChange = (emails: string[]) => {
    setEmailList(emails)
  }

  return (
    <div className="h-auto pb-32">
      <div className="w-[992px] h-[100%] mx-auto">
        <div className="w-[196px] h-[184px] rounded-lg overflow-hidden relative">
          <Image src={story} alt="story" objectFit="cover" layout="fill" />
        </div>
        <h1 className="mt-3 text-[#ABADBA] text-[29.7px] font-bold leading-[68px]">
          Event Name
        </h1>
        <div>
          <div className="flex justify-between items-center">
            <h1 className="font-medium text-[16px] text-[#2D3A4B] leading-[18.15px]">
              Event Registration
            </h1>
            <Button className="bg-[#2D3A4B91] text-[#FFFFFF] font-light text-[14px] rounded-lg h-[39px] w-[155px] items-center flex justify-center">
              <Image src={drop} alt="drop" className="mr-2" />
              Past Week
            </Button>
          </div>
          <div className="flex justify-between mt-3">
            <div className="w-[582px] bg-[#FFFFFF] h-[272px] rounded-lg">
              <ChartData />
            </div>
            <div className="w-[396px] h-[272px] bg-[#2D3A4B] rounded-lg shadow-sm">
              <div className="flex justify-between px-14 pt-10 pb-6">
                <div className="space-y-3">
                  <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                    Total Registration
                  </h1>
                  <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                    36
                  </h1>
                </div>
                <div className="space-y-3">
                  <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                    Highest Daily Reg
                  </h1>
                  <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                    Saturday
                  </h1>
                </div>
              </div>

              <div className="flex justify-between px-14 pb-6">
                <div className="space-y-3">
                  <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                    Event Managers/hosts
                  </h1>
                  <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                    5
                  </h1>
                </div>
                <div className="space-y-3">
                  <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                    Approvals Granted
                  </h1>
                  <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                    31
                  </h1>
                </div>
              </div>
              <div className="flex justify-between px-14 pb-4">
                <div className="space-y-3">
                  <h1 className="text-[#FFFFFF] text-[13.2px] font-light leading-[18.15px]">
                    Disapprovals
                  </h1>
                  <h1 className="text-[#FFFFFF] font-semibold text-[19.8px] leading-[18.15px]">
                    3
                  </h1>
                </div>
                <div className="space-y-3"></div>
              </div>
            </div>
          </div>
          <div className="w-[992px] bg-[#FFFFFF] h-[362px] rounded-lg mt-4 shadow-sm">
            <div className="w-[80%] mx-auto pt-12">
              <h1>Event Registeration URL</h1>
              <div className="w-[626px] h-[60px] border-[2px] rounded-2xl mt-5 flex items-center justify-between px-5">
                <h1 className="border-r-[2px] h-[60px] flex items-center pr-4">
                  https://attensys.io
                </h1>
                <Button className="bg-[#53545C45] text-[#333333] font-semibold text-[12px] rounded-lg h-[36px] w-[130px] items-center flex justify-center">
                  Share Link
                  <Image src={share} alt="drop" className="ml-2" />
                </Button>
              </div>
            </div>

            <div className="w-[80%] mx-auto pt-12">
              <h1>Assigned Managers</h1>
              <div className="flex space-x-3 items-center">
                <div className="w-[590px] h-[60px] border-[2px] rounded-2xl mt-5">
                  <Emailinput onEmailsChange={handleEmailsChange} />
                </div>
                <Button className="bg-[#4A90E21F] text-[#5801A9] font-normal text-[14px] rounded-lg h-[48px] w-[155px] items-center flex justify-center mt-5">
                  <Image src={cross} alt="drop" className="mr-2" />
                  Assign manager
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-[#E0515152] text-[#730404] font-normal text-[14px] rounded-lg h-[48px] w-[155px] items-center flex justify-center mt-5">
              <Image src={del} alt="drop" className="mr-2" />
              Cancel Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insight
