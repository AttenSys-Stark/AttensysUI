import React, { useState } from "react"
import Image from "next/image"
import { FaUserGraduate } from "@react-icons/all-files/fa/FaUserGraduate"
import Switch from "react-switch"
import StarRating from "../bootcamp/StarRating"
import play from "@/assets/play.svg"
import replay from "@/assets/replay.svg"
import bdot from "@/assets/Bdot.svg"
import diamond from "@/assets/diamond.svg"
import certificationBadge from "@/assets/certification_badge.svg"

interface ItemProps {
  no: number
  title: string
  tag: string
  playTime: string
  level: string
  stars: number
  url: string
  certificate: number
}

interface CoursesCreatedProps {
  item: ItemProps // or another type like `number` or a union type
  selected: string
}

const CoursesCreated: React.FC<CoursesCreatedProps> = ({ item, selected }) => {
  const [isActivated, setIsActivated] = useState(false)

  const handleSwitch = () => {
    setIsActivated(!isActivated)
  }

  return (
    <div
      className="bg-white  sm:my-12 rounded-xl border-[1px] border-[#BCBCBC] h-auto pb-8"
      // onClick={(e) =>
      //   handleMyCourseSubComp(e, "sample-profile", router, item.title)
      // }
    >
      {/* courses created */}
      <div>
        <div className="flex justify-between border-b-[1px] border-b-[#CACBCB] my-3 px-16">
          {/* activate */}
          <div className="flex items-center text-[#A01B9B]  my-5 space-x-3">
            <h4 className="font-bold text-lg text-[#A01B9B]">{selected}</h4>
            <FaUserGraduate color="#A01B9B" />
          </div>
          <div className="hidden sm:flex items-center  my-5">
            <p className={`${!isActivated ? "text-[#4A90E2]" : "text-black"} `}>
              Deactivate
            </p>

            <Switch
              onChange={handleSwitch}
              checked={isActivated}
              onColor="#9B51E0"
              offColor="#4A90E2"
              uncheckedHandleIcon={<div />}
              checkedHandleIcon={<div />}
              checkedIcon={<div />}
              uncheckedIcon={<div />}
              className="mx-2"
            />
            <p className={`${isActivated ? "text-[#9B51E0]" : "text-black"} `}>
              Activate
            </p>
          </div>
        </div>

        <div>
          <div className="block sm:flex justify-top ">
            <div className="flex sm:hidden items-center mx-8 my-5 text-xs">
              <p
                className={`${!isActivated ? "text-[#4A90E2]" : "text-black"} `}
              >
                Deactivate
              </p>
              <Switch
                onChange={handleSwitch}
                checked={isActivated}
                onColor="#9B51E0"
                offColor="#4A90E2"
                uncheckedHandleIcon={<div />}
                checkedHandleIcon={<div />}
                checkedIcon={<div />}
                uncheckedIcon={<div />}
                className="mx-2"
              />
              <p
                className={`${isActivated ? "text-[#9B51E0]" : "text-black"} `}
              >
                Activate
              </p>
            </div>
            
            <div className="px-5 xl:px-12 flex gap-8 xl:gap-0 flex-col w-full xl:flex-row xl:space-x-12 items-center">
            <div className="w-full h-auto xl:h-[164px] xl:w-[254px] rounded-xl">
              <Image
                src={item.url}
                alt="video"
                height={250}
                className="object-cover h-full w-full rounded-xl"
              />
            </div>
            <div className="flex-1 w-full lg:mx-6 sm:mx-0">
              <div>
                <h4 className="text-[20px] font-medium leading-[22px] text-[#2D3A4B]">{item.title}</h4>

                {/* video prop */}
                <div className="text-[#2D3A4B] flex flex-wrap items-center gap-3 my-3">
                  <div className="flex items-center gap-x-2">
                    <Image src={play} alt="" height={12} width={12} />
                    <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">Total play time: {item.playTime}</p>
                  </div>
                  <div className="flex items-center gap-x-2 ">
                    <p className="hidden sm:block">|</p>
                    <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px] mx-0">
                      Created by: <span className="text-[#A01B9B]">you</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Image src={bdot} alt="" height={12} width={12} />
                    <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px] mx-0">
                      <span className="text-[#A01B9B]">4</span> Lectures
                    </p>
                  </div>
                </div>

                <div className="text-[#2D3A4B] flex flex-wrap gap-4 items-center my-3">
                  <div className="flex items-center gap-x-2">
                    <Image src={replay} alt="time" width={16} height={16} className="" />
                    <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">Last updated 10|10|2024</p>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Image src={diamond} alt="" height={18} width={18} />
                    <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">Difficulty level: {item.level}</p>
                  </div>
                </div>


                {/* rating and num of students */}
                <div className="text-[#2D3A4B] flex flex-wrap gap-5 items-center my-3">
                  <div className="flex items-center gap-x-2">
                    <StarRating totalStars={5}  starnumber={4} />
                    <p className="font-medium text-[13px] text-[#2D3A4B] leading-[16px]">{item.stars} students</p>
                  </div>

                  <div className="flex items-center gap-2 mx-0 sm:my-0">
                    <Image src={certificationBadge} alt="" height={18} width={18} />
                    <p className="font-medium text-[13px] mr-1 text-[#2D3A4B] leading-[16px]">Certificate issued:</p>
                    <p className="font-medium text-[13px] text-[#2D3A4B] leading-[16px]">
                      <span className="text-[#A01B9B]">
                        {item.certificate}{" "}
                      </span>
                      certificates
                    </p>
                  </div>
                </div>
              </div>
            </div>

            </div>
         
         
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursesCreated
