import React from "react"
import { bootcampdropdownstatus } from "@/state/connectedWalletStarknetkitNext"
import { useAtom, useSetAtom } from "jotai"
import { VscNewFile } from "react-icons/vsc"
import bootsearch from "@/assets/bootsearch.svg"
import bootcreate from "@/assets/bootcreate.svg"
import Image from "next/image"
import people from "@/assets/people.svg"
import { useRouter } from "next/navigation"

const Bootcampdropdown = () => {
  const [bootcampdropstat] = useAtom(bootcampdropdownstatus)
  const router = useRouter()

  // const handleBootcampExplore = () => {
  //   router.push('')
  // }

  return (
    <>
      {bootcampdropstat && (
        <div className=" bg-[#FFFFFF] h-[157px] w-[100%] absolute z-50 shadow-2xl">
          <div className="flex justify-between mx-auto w-[80%] h-[90%] items-center">
            <div className="space-y-4 w-[337px] text-[16px]">
              <a href="/Bootcamps" className=" cursor-pointer">
                <div className="flex space-x-3  my-3">
                  <Image src={bootsearch} alt="search" />

                  <h1 className="text-[16px] font-bold cursor-pointer">
                    Explore Bootcamps
                  </h1>
                </div>
                <p className="text-[13px] text-[#2D3A4B]">
                  Discover amazing organizations that have already been
                  established on attensys; and learn more about their courses.
                </p>
              </a>
            </div>
            <div className="space-y-2 w-[337px]">
              <a href="/Createorganization" className="cursor-pointer">
                <div className="flex space-x-3">
                  <Image src={bootcreate} alt="search" />
                  <h1 className="text-[16px] font-bold cursor-pointer">
                    Create Organization
                  </h1>
                </div>
                <p className="text-[13px] text-[#2D3A4B] ">
                  Create & Manage your organization profile, add or edit
                  instructors, create new courses, and track your organizations
                  performance.
                </p>
              </a>
            </div>

            <div className="space-y-2 w-[350px]">
              <a href="/Mybootcamps" className="cursor-pointer">
                <div className="flex space-x-3">
                  <Image src={people} alt="people" />
                  <h1 className="text-[16px] font-bold cursor-pointer">
                    <a>My Bootcamps</a>
                  </h1>
                </div>
                <p className="text-[13px] text-[#2D3A4B]">
                  Accelerate your learning journey with our intensive
                  bootcamps—designed to equip you with hands-on skills in record
                  time.
                </p>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Bootcampdropdown
