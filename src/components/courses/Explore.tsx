import React from "react"

import videoHero from "../../assets/video.svg"
import CarouselComp from "./Carousel"
import Image from "next/image"
import { IoIosStar } from "@react-icons/all-files/io/IoIosStar"
import { HiBadgeCheck } from "@react-icons/all-files/hi/HiBadgeCheck"
import { GiBackwardTime } from "@react-icons/all-files/gi/GiBackwardTime"
import { FaPlay } from "@react-icons/all-files/fa/FaPlay"
import { GrDiamond } from "@react-icons/all-files/gr/GrDiamond"
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown"
import { useRouter } from "next/navigation"
import { handleCourse } from "@/utils/helpers"
import { skills, subLectures } from "@/constants/data"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import StarRating from "../bootcamp/StarRating"
import { LuBadgeCheck } from "react-icons/lu";
import { CardWithLink } from "./Cards"

const Explore = () => {
  const router = useRouter()

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 820 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 820, min: 0 },
      items: 1,
    },
  }

  return (
    <div>
      {/* Hero component */}
      <div className={`bg-[url('/hero_asset.png')] space-y-4 text-white px-8 lg:px-28 py-10 lg:py-20 from-orange-400 via-red-500 to-pink-500 h-80 flex items-center`}>
        <div className="w-full mx-auto max-w-screen-2xl">
          {/* Hero lettering */}
          <h1 className="w-[90%] xl:w-5/12 font-bold text-2xl sm:text-4xl mb-4">
            Continuous learning is the key to success - upskill with us
          </h1>
          <p className="w-[90%] sm:w-1/2">
            With Attensys, all you need is your address to prove your
            certification. Welcome to the future{" "}
          </p>
        </div>
      </div>

      {/* skills  */}
      <div className="ml-6 lg:mx-12 overflow-x-scroll xl:overflow-auto my-16 hidden xl:flex flex-row lg:justify-center">
        {skills.map((item, index) => (
          <p className="bg-[#2D3A4B] p-6 text-white" key={index}>
            {item}
          </p>
        ))}
      </div>

      <div className="block !mt-[-15px] lg:mt-0 xl:hidden text-center overflow-hidden rounded-[8px] lg:rounded-none mx-12 relative bottom-4">
        <Carousel responsive={responsive}>
          {skills.map((item, index) => (
            <p className="bg-[#2D3A4B] rounded-[8px] xl:rounded-none p-6 text-white" key={index}>
              {item}
            </p>
          ))}
        </Carousel>
      </div>

      {/* what to learn next */}
      <div className="mx-6 lg:mx-auto">
        <div className="mx-auto max-w-screen-2xl">
          {/* upper */}
          <div className="my-4 mx-6">
            {/* wording */}
            <h3 className="text-[25px] font-bold text-[#2D3A4B]">What to learn next</h3>
            <p className="font-light text-base lg:text-xl text-[#2D3A4B]">
              Because you viewed{" "}
              <span className="text-[#5801A9] font-bold underline">
                “Introduction to Web Dev Starknet”
              </span>
            </p>
          </div>

          {/* cards  */}
          {/* <div className="mx-12 sm:mx-0"> */}
          <CarouselComp />
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 lg:hidden flex-col w-full">
            <CardWithLink />
            <CardWithLink />
            <CardWithLink />
            <CardWithLink />
          </div>
          {/* </div> */}
        </div>

        {/* below */}
        <div className="sm:px-6 lg:mx-auto max-w-screen-2xl flex flex-col w-full lg:flex-row gap-6 justify-between my-24 lg:h-[307px]">
          <div className="my-4 lg:hidden">
              {/* wording */}
              <h3 className="text-[25px] font-bold text-[#2D3A4B]">Fan favourite</h3>
              <p className="font-light text-base lg:text-xl text-[#2D3A4B]">
                Because you viewed{" "}
                <span className="text-[#5801A9] font-bold underline">
                  “Introduction to Web Dev Starknet”
                </span>
              </p>
          </div>
          {/* left */}
          <div className="flex flex-col md:flex-row gap-x-5 space-x-10 sm:flex sm:mx-0 justify-top xl:w-[70%] max-w-full">
            <div className="h-full sm:w-full rounded-xl">
              <Image src={videoHero} alt="video" className="object-cover h-full w-full rounded-xl" />
            </div>
            <div className="my-4 sm:my-0 !ml-0 lg:!ml-8"> 
              <div className="">
                <div
                  onClick={(e) =>
                    handleCourse(e, e.currentTarget.textContent, router)
                  }
                >
                  <button className="bg-[#2D3A4B] hidden lg:block hover:bg-gray-500 text-white text-[11px] font-bold py-2 px-4 rounded cursor-pointer">
                    Get this course
                  </button>
                  <h2 className="font-bold lg:text-[32px] leading-5 tracking-tight lg:leading-[1.1] text-[23px] sm:text-4xl text-[#2D3A4B] lg:tracking-tight my-4 cursor-pointer">
                    Introduction to Web Development
                  </h2>
                  
                </div>
                <p className="text-white items-center font-semibold inline gap-2 text-sm bg-[#5801A9] rounded p-2">
                  Tech Innovators Academy
                </p>
                <button onClick={(e) =>
                    handleCourse(e, e.currentTarget.textContent, router)
                  } className="bg-[#9B51E0] ml-3 lg:hidden hover:bg-gray-500 text-white text-[14px] rounded-md font-bold py-[15px] px-[10px] cursor-pointer">
                    Get this course
                  </button>
                {/* rating and num of students */}
                <div className="flex flex-col sm:flex-row space-x-28 sm:gap-x-4 lg:gap-x-0  items-start justify-start my-4">
                  <div className="flex items-center space-x-4">
                    <StarRating totalStars={5} starnumber={4} />
                    <p className="font-bold text-[13px] text-[#2D3A4B] leading-[15px]">(281)</p>
                  </div>

                  <div className="flex items-center  mt-3 sm:mt-0 mx-0 sm:mx-8 !ml-0 lg:!ml-10">
                    <LuBadgeCheck color="#2D3A4B h-[19px] w-[19px]" />
                    <p className="font-bold text-[13px] text-[#2D3A4B] ml-1 leading-[15px]">291 certification</p>
                  </div>
                </div>

                <div className="flex flex-col gap-y-3 gap-x-4 lg:gap-x-6 sm:flex-row sm:flex-wrap">
                  {/* creator and last update */}
                    <div className="">
                      <p className="text-[11px] text-[#2D3A4B] leading-[18px] font-medium">
                        Created by:{" "}
                        <span className="underline inline">Akinbola Kehinde</span>
                      </p>
                    </div>
                    <span className="flex gap-2 items-center !ml-0 ">
                      <GiBackwardTime />
                      <p className="text-[11px] inline text-[#2D3A4B] leading-[18px] font-medium">Last updated 10|10|24</p>
                    </span>
                  {/* video prop */}
                    <span className="flex gap-2 items-center">
                      <FaPlay className="h-[11px] w-[11px] text-[#5801A9]"/>
                      <p className="text-[11px] inline text-[#2D3A4B] leading-[18px] font-medium">Total play time: 2 hrs 35 mins</p>
                    </span>
                    <span className="flex gap-2 items-center">
                      <GrDiamond color="#2D3A4B" className="h-[11px] w-[11px]" />
                      <p className="text-[11px] inline text-[#2D3A4B] leading-[18px] font-medium">Difficulty level: Elementary</p>
                    </span>
                    <span className="flex items-center gap-2">
                      <LuBadgeCheck className="h-[11px] w-[11px] text-[#5801A9]" />
                      <p className="text-[11px] inline text-[#2D3A4B] leading-[18px] font-medium">Certificate of Completion</p>
                    </span>
                </div>
              </div>
            </div>
          </div>

          {/* right */}
          <div className="hidden xl:block w-[32%] h-[307px] overflow-y-scroll ">
            <div className="flex justify-between border-b-2 pb-3">
              <h4>Lectures (4)</h4>
              <IoMdArrowDropdown />
            </div>

            <div>
              {subLectures.map((item, i) => (
                <div
                  key={i}
                  className="flex content-center text-sm my-3 cursor-pointer space-x-4"
                  onClick={(e) =>
                    handleCourse(e, e.currentTarget.textContent, router)
                  }
                >
                  <div className="h-full w-[160px] rounded-xl">
                    <Image
                      src={item.img}
                      alt="another course"
                      className="object-cover h-full w-full rounded-xl"
                    />
                  </div>
                  <div className="w-[230px]">
                    <h6 className="font-bold">
                      {item.title}
                      <span className="text-[#5801A9]">({item.time})</span>
                    </h6>
                    <p className="font-light mt-2">{item.desc}</p>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* recommended for you based on rating */}
      <div>
        <div className="bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 p-4 sm:p-8 my-4">
          <div className="mx-auto max-w-screen-2xl">
            <p className="text-white font-light text-sm sm:text-base sm:font-bold lg:ml-24">
              Recommended to you based on rating
            </p>
            {/* background: linear-gradient(90deg, #9B51E0 0%, #4A90E2 100%); */}
          </div>
        </div>
        <div className="mx-6 lg:mx-auto max-w-screen-2xl">
          <CarouselComp />

          <div className="mt-24 mx-auto max-w-screen-2xl">
            <div className="my-4 md:mx-6">
              {/* wording */}
              <h3 className="text-2xl font-bold">You will love this</h3>
              <p className="font-light text-base lg:text-xl text-[#2D3A4B]">
                Because you viewed{" "}
                <span className="text-[#5801A9] font-bold">
                  “Introduction to Web Dev Starknet”
                </span>
              </p>
            </div>

            {/* cards  */}
            <CarouselComp />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explore
