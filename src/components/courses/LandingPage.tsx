import React from "react"
import video from "@/assets/video.png"
import Image from "next/image"
import Lectures from "./Lectures"
import youtube from "@/assets/youtube.svg"
import podcast from "@/assets/Podcast.svg"
import rich from "@/assets/Richin2024.svg"
import { IoIosStar } from "@react-icons/all-files/io/IoIosStar"
import { GiBackwardTime } from "@react-icons/all-files/gi/GiBackwardTime"
import { FaPlay } from "@react-icons/all-files/fa/FaPlay"
import { GrDiamond } from "@react-icons/all-files/gr/GrDiamond"
import CarouselComp from "./Carousel"
import { handleCourse } from "@/utils/helpers"
import { useRouter } from "next/navigation"
import StarRating from "../bootcamp/StarRating"
import { HiOutlineCheckBadge } from "react-icons/hi2"
import { LuBadgeCheck } from "react-icons/lu"

const LandingPage = () => {
  const router = useRouter()
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
  ]

  return (
    <div className="pb-14 bg-[#F5F8FA] overflow-x-hidden">
      <div className="md:bg-[url('/hero_asset.png')] text-white   md:py-12 from-orange-400 via-red-500 to-pink-500 lg:h-64">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 md:px-2 lg:px-5 mx-auto max-w-screen-xl">
          <div className="p-6 md:p-0 bg-[url('/hero_asset.png')] md:bg-none">
            <p className="font-bold mb-2">Technology | Web development</p>

            <div className="w-full h-[228px] lg:w-[464px] lg:h-[300px]">
              <Image
                src={video}
                alt="hero"
                className="w-full h-full object-fill"
              />
            </div>
          </div>

          <div className="text-sm px-5 md:mx-0 hidden lg:block">
            <button
              onClick={(e) =>
                handleCourse(e, e.currentTarget.textContent, router)
              }
              className="hidden md:block bg-white px-6 py-2 rounded text-gray-800 font-bold"
            >
              Get course
            </button>

            <h4
              className="text-2xl md:text-3xl font-bold text-black md:text-white my-4 cursor-pointer"
              onClick={(e) =>
                handleCourse(e, e.currentTarget.textContent, router)
              }
            >
              Introduction to Web Development
            </h4>

            <div className="flex justify-between">
              <button className="bg-[#5801A9] text-white py-1  px-2 rounded-lg text-center w-fit md:w-auto">
                Tech Innovators Academy
              </button>
              <button className="md:hidden bg-[#9B51E0] px-6 py-2 rounded text-white font-bold">
                Get course
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center my-4 space-y-4 md:space-y-0 md:space-x-3">
              <div className="flex items-center space-x-2">
                <StarRating totalStars={5} starnumber={4} />
                <p className="font-bold text-black md:text-white">(281)</p>
              </div>
              <div className="flex items-center text-black md:text-white">
                <HiOutlineCheckBadge className="h-5 w-5 text-white" />
                <p className="font-bold">291 certification</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-2 lg:gap-y-4 md:items-center space-y-4 md:space-y-0 md:space-x-3 lg:pt-28">
              <p className="text-sm text-[#2D3A4B]">
                Created by <span className="underline">Akinbola Kehinde</span>
              </p>

              <div className="flex  gap-x-1 items-center">
                <GiBackwardTime className="text-xl text-purple-700" />
                <p className="text-sm  text-[#2D3A4B]">Last updated 10|10|24</p>
              </div>

              <div className="flex gap-x-1 items-center">
                <FaPlay className="text-sm text-purple-700" />
                <p className="text-sm  text-[#2D3A4B]">
                  Total play time : 2 hrs 35 mins
                </p>
              </div>

              <div className="flex gap-x-1 items-center">
                <GrDiamond className="text-xl text-purple-700" />
                <p className="text-sm  text-[#2D3A4B]">
                  Difficulty level : Elementary
                </p>
              </div>

              <div className="flex gap-x-1 items-center">
                <LuBadgeCheck className="text-xl text-purple-700" />
                <p className="text-sm  text-[#2D3A4B]">
                  Certificate of completion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-0  mx-auto max-w-screen-xl  lg:py-20  lg:mt-28">
        <div className="text-sm mx-5 md:mx-0 lg:hidden py-5">
          <button
            onClick={(e) =>
              handleCourse(e, e.currentTarget.textContent, router)
            }
            className="hidden md:block bg-white px-6 py-2 rounded text-gray-800 font-bold"
          >
            Get course
          </button>

          <h4
            className="text-2xl md:text-3xl font-bold text-black my-4 cursor-pointer"
            onClick={(e) =>
              handleCourse(e, e.currentTarget.textContent, router)
            }
          >
            Introduction to Web Development
          </h4>

          <div className="flex justify-between">
            <button className="bg-[#5801A9] text-white py-1  px-2 rounded-lg text-center w-fit md:w-auto">
              Tech Innovators Academy
            </button>
            <button className="md:hidden bg-[#9B51E0] px-6 py-2 rounded text-white font-bold">
              Get course
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center my-4 space-y-4 md:space-y-0 md:space-x-3">
            <div className="flex items-center space-x-2">
              <StarRating totalStars={5} starnumber={4} />
              <p className="font-bold text-black md:text-white">(281)</p>
            </div>
            <div className="flex items-center text-black md:text-white">
              <HiOutlineCheckBadge className="h-5 w-5 text-white" />
              <p className="font-bold">291 certification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-2 lg:gap-y-4 md:items-center space-y-4 md:space-y-0 md:space-x-3 lg:pt-28">
            <p className="text-sm text-[#2D3A4B]">
              Created by <span className="underline">Akinbola Kehinde</span>
            </p>

            <div className="flex  gap-x-1 items-center">
              <GiBackwardTime className="text-xl text-purple-700" />
              <p className="text-sm  text-[#2D3A4B]">Last updated 10|10|24</p>
            </div>

            <div className="flex gap-x-1 items-center">
              <FaPlay className="text-sm text-purple-700" />
              <p className="text-sm  text-[#2D3A4B]">
                Total play time : 2 hrs 35 mins
              </p>
            </div>

            <div className="flex gap-x-1 items-center">
              <GrDiamond className="text-xl text-purple-700" />
              <p className="text-sm  text-[#2D3A4B]">
                Difficulty level : Elementary
              </p>
            </div>

            <div className="flex gap-x-1 items-center">
              <LuBadgeCheck className="text-xl text-purple-700" />
              <p className="text-sm  text-[#2D3A4B]">
                Certificate of completion
              </p>
            </div>
          </div>
        </div>

        <Lectures lectures={lectures} />
      </div>

      <div className=" px-5 lg:px-0 border-b flex items-center h-12 mx-auto max-w-screen-xl">
        <IoIosStar className="text-yellow-500 h-6 w-6" />
        <p className="text-lg text-gray-800 font-semibold">
          4.9 Rating | (281 reviews)
        </p>
      </div>

      <div className="px-5 lg:px-0 block md:flex py-10   text-sm space-y-6 md:space-y-0 md:space-x-6 mx-auto max-w-screen-xl">
        {[1, 2].map((_, idx) => (
          <div key={idx} className="w-full md:w-1/2">
            <div className="flex items-center">
              <p className="p-4 bg-purple-100 font-bold rounded-full">OM</p>
              <div className="ml-4 space-y-2">
                <p>Olivia. M</p>
                <StarRating totalStars={5} starnumber={4} />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-800">
              Halfway through the course and lots of information given in every
              chapter. Concise and easy to understand, very useful to apply to
              any Web design journey!
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-500 py-2 px-4 lg:px-20 text-white">
        <p>Students also bought</p>
      </div>
      <div className="mx-4 lg:mx-20 my-6">
        <CarouselComp />
      </div>
    </div>
  )
}

export default LandingPage

