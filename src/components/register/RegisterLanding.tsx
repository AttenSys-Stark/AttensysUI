import React, { useState } from "react"
import Image from "next/image"
import largeflier from "@/assets/largeflier.svg"
import { FaTags } from "react-icons/fa"
import { CiCalendarDate } from "react-icons/ci"
import { IoTimeSharp } from "react-icons/io5"
import { IoPeopleSharp } from "react-icons/io5"
import { FaRegHourglass } from "react-icons/fa"
import Sponsors from "./Sponsors"
import Descriptionsupport from "./Descriptionsupport"
import Ongoingcarousell from "./Ongoingcarousell"
import { useRouter } from "next/navigation"
import RegisterModal from "./RegisterModal"
import { registerModal } from "@/state/connectedWalletStarknetkitNext"
import { useAtom } from "jotai"

const RegisterLanding = (props: any) => {
  const [regModal, setRegModal] = useAtom(registerModal)
  const decodedName = decodeURIComponent(props.regname)
  const router = useRouter()

  const handleExplore = () => {
    router.push("/Bootcamps")
  }
  const handleRegister = () => {
    setRegModal(true)
  }
  return (
    <>
      {regModal && <RegisterModal status={regModal} />}
      <div className="bg-[#f4f7f9] w-full h-auto py-4">
        <div className="flex flex-wrap justify-start space-x-0 px-4 md:px-8 items-center text-md text-[#5801A9] font-medium">
          <div onClick={handleExplore} className="cursor-pointer">
            Explore Bootcamp
          </div>
          <div className="px-4">
            <div className="h-[18px] w-[1px] border-[1px] border-[#5801A9]"></div>
          </div>
          <div className="truncate">{decodedName}</div>
        </div>

        <div className="h-auto w-full py-4 px-4 lg:px-8 flex flex-col items-start justify-start space-y-8 space-x-0 md:flex-row md:space-x-6 md:space-y-0 md:justify-between md:items-stretch mt-8">
          <div className="h-auto w-full md:w-[50%] lg:w-[40%] rounded-lg">
            <Image
              src={largeflier}
              alt="flier"
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          <div className="w-full h-auto rounded-lg bg-[#FFFFFF] border-[1px] border-[#B8B9BA]">
            <div className="px-4 lg:px-8 py-6 flex flex-col space-y-4 space-x-0 sm:space-y-0 sm:space-x-4 sm:flex-row sm:justify-between h-auto sm:items-center border-b-[1px] border-b-[#B8B9BA]">
              <h1 className="text-[#5801A9] text-md lg:texl-lg font-semibold">
                XCODE Launch
              </h1>
              <div className="flex items-end justify-end ml-auto">
                <div
                  onClick={handleRegister}
                  className="flex items-center space-x-2 cursor-pointer bg-[#4A90E2] py-4 px-4 lg:px-8 rounded-lg"
                >
                  <FaTags className="h-[16px] w-[16px] text-[#FFFFFF]" />
                  <h1 className="text-sm lg:text-md text-[#FFFFFF] font-semibold">
                    Register Now (23USDT)
                  </h1>
                </div>
              </div>
            </div>
            <div className="px-4 lg:px-8 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start mt-8 w-full">
              <div className="space-y-2 w-full col-span-1 flex flex-none flex-col pb-4">
                <div className="flex space-x-2 items-center">
                  <CiCalendarDate className="h-[20px] w-[20px]" />
                  <h1 className="text-xs text-[#2D3A4B] font-light">
                    Bootcamp Date{" "}
                  </h1>
                </div>
                <h1 className="text-sm text-[#2D3A4B] font-medium">
                  27th - 30th Nov, 2024
                </h1>
              </div>

              <div className="space-y-2 w-full col-span-1 flex flex-none flex-col pb-4">
                <div className="flex space-x-2 items-center">
                  <CiCalendarDate className="h-[20px] w-[20px]" />
                  <h1 className="text-[14px] text-[#2D3A4B] font-light">
                    Lead Instructor{" "}
                  </h1>
                </div>
                <h1 className="text-[16px] text-[#2D3A4B] font-medium">
                  David Kehinde{" "}
                </h1>
              </div>

              <div className="space-y-2 w-full col-span-1 flex flex-none flex-col pb-4">
                <div className="flex space-x-2 items-center">
                  <IoTimeSharp className="h-[20px] w-[20px]" />
                  <h1 className="text-[14px] text-[#2D3A4B] font-light">
                    Time
                  </h1>
                </div>
                <h1 className="text-[16px] text-[#2D3A4B] font-medium">
                  9:00am daily
                </h1>
              </div>

              <div className="space-y-2 w-full col-span-1 flex flex-none flex-col pb-4">
                <div className="flex space-x-2 items-center">
                  <IoPeopleSharp className="h-[20px] w-[20px]" />
                  <h1 className="text-[14px] text-[#2D3A4B] font-light">
                    Bootcamp capacity
                  </h1>
                </div>
                <h1 className="text-[16px] text-[#5801A9] font-medium">
                  120/200
                </h1>
              </div>

              <div className="space-y-2 w-full col-span-1 flex flex-none flex-col pb-4">
                <div className="flex space-x-2 items-center">
                  <FaRegHourglass className="h-[20px] w-[20px]" />
                  <h1 className="text-[14px] text-[#2D3A4B] font-light">
                    Registeration Deadline
                  </h1>
                </div>
                <h1 className="text-[32px] text-[#5801A9] leading-[48px] font-bold">
                  2:59:59
                </h1>
              </div>

              <div className="space-y-2 w-full col-span-1 flex flex-none flex-col pb-4">
                <h1 className="text-[#2D3A4B] text-md font-semibold">
                  Certification requirements
                </h1>
                <div className="flex flex-wrap items-center">
                  <div className="mr-2.5 mb-1.5 h-[30px] w-auto flex justify-center rounded-xl items-center bg-[#9B51E078] text-[#5801A9] text-xs font-light px-3">
                    85% attendance
                  </div>
                  <div className="mr-2.5 mb-1.5 h-[30px] w-auto flex justify-center rounded-xl items-center bg-[#9B51E078] text-[#5801A9] text-xs font-light px-3">
                    85% attendance
                  </div>
                  <div className="mr-2.5 mb-1.5 h-[30px] w-auto flex justify-center rounded-xl items-center bg-[#9B51E078] text-[#5801A9] text-xs font-light px-3">
                    85% attendance
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <Sponsors />
        <Descriptionsupport />
        <Ongoingcarousell />
      </div>
    </>
  )
}

export default RegisterLanding
