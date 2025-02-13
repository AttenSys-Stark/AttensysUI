import React from "react";
import video from "@/assets/video.png";
import Image from "next/image";
import Lectures from "./Lectures";
import youtube from "@/assets/youtube.svg";
import podcast from "@/assets/Podcast.svg";
import rich from "@/assets/Richin2024.svg";
import { IoIosStar } from "@react-icons/all-files/io/IoIosStar";
import { HiBadgeCheck } from "@react-icons/all-files/hi/HiBadgeCheck";
import { GiBackwardTime } from "@react-icons/all-files/gi/GiBackwardTime";
import { FaPlay } from "@react-icons/all-files/fa/FaPlay";
import { GrDiamond } from "@react-icons/all-files/gr/GrDiamond";
import CarouselComp from "./Carousel";
import { handleCourse } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import StarRating from "../bootcamp/StarRating";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { LuBadgeCheck } from "react-icons/lu";

const LandingPage = () => {
  const router = useRouter();
  const lectures = [
    {
      img: rich,
      title: "What is Web Development?",
      desc: "An introduction to the world of web development, covering the basics of how websites...",
      timing: 8,
    },
    {
      img: youtube,
      title: "What is Web Development?",
      desc: "An introduction to the world of web development, covering the basics of how websites...",
      timing: 8,
    },
    {
      img: podcast,
      title: "What is Web Development?",
      desc: "An introduction to the world of web development, covering the basics of how websites...",
      timing: 8,
    },
  ];
  return (
    <div className="pb-14 bg-[#F5F8FA]">
      <div
        className={`bg-[url('/hero_asset.png')] text-white lg:h-[322px] px-12 sm:px-28 py-16 from-orange-400 via-red-500 to-pink-500 sm:h-64  `}
      >
        <div className="block sm:grid grid-cols-2 gap-4 sm:mx-20">
          {/* Course Image */}
          <div className="col-2 text-sm">
            <p className="font-bold mb-2">Technology | Web development</p>
            <Image src={video} alt="hero" />
          </div>

          {/* Course information */}
          <div className="text-sm">
            {/* field */}
            <div className="">
              <button
                onClick={(e) =>
                  handleCourse(e, e.currentTarget.textContent, router)
                }
                className="hidden sm:block bg-[#fff] px-7 py-2 rounded text-[#333333] font-bold"
              >
                Get course
              </button>
            </div>

            <h4
              className="text-[39px] leading-[39px] w-[393px] h-[78px] my-5 font-bold text-black sm:text-white cursor-pointer"
              onClick={(e) =>
                handleCourse(e, e.currentTarget.textContent, router)
              }
            >
              Introduction to Web Development
            </h4>

            <div className="flex">
              <div className="bg-[#5801A9] py-2 text-white w-[200px] mb-4 text-center Sm:w-[50%] rounded-lg">
                <p className="text-[14px] font-extrabold leading-[22px]">
                  Tech Innovators Academy
                </p>
              </div>

              <div className="">
                <button className="sm:hidden block bg-[#9b51e0] px-7 py-2 rounded text-[#333333] font-bold">
                  Get course
                </button>
              </div>
            </div>

            {/* rating and num of students */}
            <div className="flex  items-center mb-3 space-x-16">
              <div className="flex items-center space-x-3">
                <StarRating totalStars={5} starnumber={4} />
                <p className="font-bold text-black sm:text-white">(281)</p>
              </div>

              <div className="flex space-x-2 items-center text-black sm:text-white">
                <HiOutlineCheckBadge
                  color="#fff"
                  className="h-[22px] w-[20px]"
                />
                <p className="font-bold">291 certification</p>
              </div>
            </div>

            {/* creator and last update */}
            <div className="flex space-x-14 sm:flex sm:text-center mt-12 mb-4">
              <div className="">
                <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                  Created by <span className="underline">Akinbola Kehinde</span>
                </p>
              </div>

              <div className="flex ml-0 sm:ml-5 items-center  space-x-1">
                <GiBackwardTime />
                <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                  Last updated 10|10|24
                </p>
              </div>
            </div>

            {/* video prop */}
            <div className="block sm:flex space-x-10 mb-4">
              <div className="flex my-1 space-x-2 items-center">
                <FaPlay className="h-[14px] w-[14px] text-[#5801A9]" />
                <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                  Total play time: 2 hrs 35 mins
                </p>
              </div>
              <div className="flex sm:ml-5 space-x-2 items-center">
                <GrDiamond color="#2D3A4B" className="h-[14px] w-[14px]" />
                <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                  Difficulty level: Elementary
                </p>
              </div>
            </div>

            <div className="flex space-x-2 items-center mb-4">
              <div>
                <LuBadgeCheck className="h-[14px] w-[14px] text-[#5801A9]" />
              </div>
              <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                Certificate of Completion
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-12 sm:mx-48 sm:mt-32 mt-96 mb-10">
        <Lectures lectures={lectures} />
      </div>

      {/* rating */}
      <div>
        <div className="border-b-[1px] border-b-[#949494] mx-24 sm:mx-48 flex space-x-2 items-center h-[50px]">
          <IoIosStar color="#F6A61C" className="h-[20px] w-[20px]" />
          <p className="text-[20px] text-[#333333] font-semibold leading-[22px]">
            4.9 Rating | (281 reviews)
          </p>
        </div>

        {/* comments */}
        <div className="block sm:flex py-12 mx-12 sm:mx-48 items-center content-center justify-around text-sm">
          <div className="w-[100%] sm:w-[30%]">
            <div className="flex items-center">
              <p className="p-5 bg-[#9b51e01a] font-bold rounded-full">OM</p>
              <div className="ml-6 space-y-2">
                <p>Olivia. M</p>
                <StarRating totalStars={5} starnumber={4} />
              </div>
            </div>

            <p className="mt-6 text-[14px] font-medium text-[#333333] leading-[22px]">
              Halfway through the course and lots of information given in every
              chapter. Concise and easy to understand, very useful to apply to
              any Web design journey!
            </p>
          </div>

          <div className="border-[1px] border-[#B8B9BA] h-28 hidden sm:block"></div>

          <div className="w-[100%] sm:w-[30%]">
            <div className="flex items-center">
              <p className="p-5 bg-[#9b51e01a] font-bold rounded-full">OM</p>
              <div className="ml-6 space-y-2">
                <p>Olivia. M</p>
                <StarRating totalStars={5} starnumber={4} />
              </div>
            </div>

            <p className="mt-6 text-[14px] font-medium text-[#333333] leading-[22px]">
              Halfway through the course and lots of information given in every
              chapter. Concise and easy to understand, very useful to apply to
              any Web design journey!
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-sm text-white py-2 px-48">Students also bought</p>
        </div>

        <div className="mx-24 sm:mx-48 my-6">
          <CarouselComp />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
