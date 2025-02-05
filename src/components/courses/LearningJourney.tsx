import React from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import Image from "next/image"
import play from "@/assets/play.svg"


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

interface LearningJourneyProps {
  item: ItemProps // or another type like `number` or a union type
  selected: string // Replace with appropriate type
}

const LearningJourney: React.FC<LearningJourneyProps> = ({
  item,
  selected,
}) => {
  return (
    <div
      className="bg-white my-0 sm:my-12 rounded-xl  border-[1px] border-[#BCBCBC] h-auto pb-8"
      // onClick={(e) =>
      //   handleMyCourseSubComp(e, "sample-profile", router, item.title)
      // }
    >
      <div>
        <div>
          {item.no == 1 ? (
            <div className="flex justify-between  border-b-[1px] border-b-[#CACBCB] my-3 px-10">
              <div className="flex text-gradient-to-r from-purple-400 via-purple-30 mx-8 my-5">
                <h4 className="font-bold text-lg text-[#A01B9B]">{selected}</h4>
              </div>
              <div className="hidden sm:flex mx-8 my-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
                  />
                </svg>

                <p className="underline">All</p>
              </div>
            </div>
          ) : null}

          <div>
            <div className="px-5 xl:px-12 flex flex-col xl:flex-row space-x-12 items-center">
              <div  className="xl:h-[164px] xl:w-[254px] w-full h-auto rounded-xl">
                <Image
                  src={item.url}
                  alt="video"
                  height={250}
                  className="object-cover h-full w-full rounded-xl"
                />
              </div>

              <div className="!ml-0 px-3 xl:px-0 mt-5 xl:!mx-8 flex-1 w-full">
                <div>
                  <h4 className="text-2xl font-medium leading-[22px] text-[#2D3A4B]">
                    Elementary Crypto Trading
                  </h4>

                  <div className="flex flex-wrap xl:flex-nowrap gap-y-2 gap-4 xl:gap-0 items-center my-3 ">
                    <div className="flex items-center gap-2">
                      <Image src={play} alt="" height={12} width={12} />
                      <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                        Total play time: 2 hrs 35 mins
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="hidden sm:block">|</p>
                      <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px] mx-0">
                        Created by:{" "}
                        <span className="underline"> Akinbola Kehinde </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-3">
                  <ProgressBar completed={"58"} height="13px" bgColor="#9B51E0" />
                </div>

                <div className="my-3 flex justify-between">
                  <p className="text-[13px] text-[#2D3A4B] font-medium leading-[21px]">3/6 Lectures completed</p>
                  <p className="underline text-[13px] text-[#2D3A4B] font-medium leading-[21px]">
                    (8:03 mins)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearningJourney
