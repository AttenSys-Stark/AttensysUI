import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  CardProps,
} from "@material-tailwind/react"

import robotImg from "../../assets/robot.svg"
import Image from "next/image"
import { IoIosStar } from "@react-icons/all-files/io/IoIosStar"
import { handleCourse, handleCoursehome } from "@/utils/helpers"
import { useRouter } from "next/navigation"
import StarRating from "../bootcamp/StarRating"

export function CardWithLink() {
  const router = useRouter()
  return (
    <div
      className="mt-6 w-[100%] lg:w-[95%] border-2 rounded-xl pb-8"
      onClick={(e) => handleCoursehome(e, e.currentTarget.textContent, router)}
    >
      <div className="cursor-pointer">
        <div className="w-full h-[117px] rounded-t-xl">
        <Image className="object-cover h-full w-full rounded-t-xl" alt="robot" src={robotImg}/>
        </div>
        <div className="flex sm:flex-col md:flex-row justify-between mt-6 px-5 ">
          {/* course prop  */}
          <div className="">
            <p className="mb-2 font-bold lg:text-[14px] leading-[22px] text-[#333333]">Elementary UI</p>
            <p className="text-white text-[12px] font-extrabold items-center gap-2 w-fit  bg-[#5801A9] my-2 rounded p-1">
              Tech Innovators Academy
            </p>
          </div>

          <div>
            {/* go to course */}
            <button className="rounded-lg text-xs px-2 py-2 items-center bg-[#4A90E2] text-white text-[12px] font-semibold leading-[14px]">
              Go to course
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 mt-2">
        <div className="flex items-center space-x-3">
          {/* rating */}
          <StarRating totalStars={5} starnumber={4} />
          <p className="text-[14px] text-[#2D3A4B] font-medium leading-[16px]"> <span className="text-[#5801A9]">1220</span> students</p>
        </div>
        <div></div>
        <p className="mt-2 text-[14px] text-[#2D3A4B] leading-[19px] font-light">
          Created by <span className="underline ">Akinbola Kehinde</span>
        </p>
      </div>
      <div />
    </div>
  )
}
