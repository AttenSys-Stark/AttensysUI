import { useEffect, useState } from "react";
import robotImg from "../../assets/robot.svg";
import Image from "next/image";
import { IoIosStar } from "@react-icons/all-files/io/IoIosStar";
import {
  getAllCoursesInfo,
  handleCourse,
  handleCoursehome,
} from "@/utils/helpers";
import { useRouter } from "next/navigation";
import StarRating from "../bootcamp/StarRating";
import { attensysCourseAddress } from "@/deployments/contracts";
import { attensysCourseAbi } from "@/deployments/abi";
import { Contract } from "starknet";
import { provider } from "@/constants";
import { pinata } from "../../../utils/config";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { GetCIDResponse } from "pinata";

interface ChildComponentProps {
  wallet: any;
  data: any;
}

// get_all_courses_info
export function CardWithLink({ wallet, data }: ChildComponentProps) {
  const router = useRouter();

  return (
    <div
      className="mt-6 items-center align-middle justify-center w-[100%] lg:w-[95%] border-2 rounded-xl pb-8"
      onClick={(e) => {
        localStorage.setItem("courseData", JSON.stringify(data?.data));
        handleCourse(e, e.currentTarget.textContent, router);
      }}
    >
      <div className="cursor-pointer">
        <div className="w-full h-28 rounded-t-xl">
          <Image
            className="object-cover h-full w-full rounded-t-xl"
            alt={data?.data.courseImage}
            src={`https://ipfs.io/ipfs/${data?.data.courseImage}`}
            width={200}
            height={200}
          />
        </div>
        <div className="flex sm:flex-col h-24 md:flex-row justify-between mt-6 px-5 ">
          <div className="w-52">
            <p className="mb-2 font-bold lg:text-[14px] leading-[22px] text-[#333333]">
              {data?.data.courseName}
            </p>
            <p className="text-white text-[12px] font-extrabold items-center gap-2 w-fit  bg-[#5801A9] my-2 rounded p-1">
              {data?.data.courseCreator}
            </p>
          </div>

          <div>
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
          <p className="text-[14px] text-[#2D3A4B] font-medium leading-[16px]">
            {" "}
            <span className="text-[#5801A9]">1220</span> students
          </p>
        </div>
        <div></div>
        <p className="mt-2 text-[14px] text-[#2D3A4B] leading-[19px] font-light">
          Created by{" "}
          <span className="underline ">{data?.data.courseCreator}</span>
        </p>
      </div>
      <div />
    </div>
  );
}
