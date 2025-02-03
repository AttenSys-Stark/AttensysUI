import React, { useState } from "react"
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack"
import Dropdown from "../Dropdown"
import video from "@/assets/video.png"
import youtube from "@/assets/youtube.svg"
import podcast from "@/assets/Podcast.svg"
import rich from "@/assets/Richin2024.svg"
import Image from "next/image"
import Switch from "react-switch"
import Lectures from "../Lectures"
import CourseSideBar from "./SideBar"
import { MdOutlineDiamond } from "react-icons/md"

const MainFormView5 = () => {
  const [isActivated, setIsActivated] = useState(false)

  const handleSwitch = () => {
    setIsActivated(!isActivated)
  }

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
    <div className="lg:flex">
      <div className="hidden lg:block">
        <CourseSideBar />
      </div>

      <div className="flex-1">
        <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-sm text-white text-center py-2">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
        </div>

        <div className=" ">
          <div className="block sm:flex justify-between  my-5 border-t border-b border-[#d1d1d1] lg:px-5 md:px-0  px-5 items-center">
            <div className="flex items-center">
              <div className="md:px-6   border-blue-700">
                <IoMdArrowBack
                  onClick={() => history.back()}
                  className="cursor-pointer text-[#4A90E2] text-2xl "
                />
              </div>

              <div className="bg-[#4A90E2] h-14 w-1 mr-4 md:mr-8 md:ml-0 ml-2"></div>

              <p className="text-[#4A90E2] text-xl font-bold">
                Preview & Publish
              </p>
            </div>

            <form
              action="course-landing-page"
              method="post"
              className="md:mr-5 lg:mr-0"
            >
              <button className="hidden sm:block bg-[#C5D322] px-7 py-3  rounded text-white">
                Publish
              </button>
            </form>
          </div>

          <div className="mx-5 lg:mx-8 mt-12">
            <div className="mb-5 order-first lg:hidden">
              <p className="text-[#5801A9] text-[16px] font-medium leading-[22px] m">
                Technology | Web Development
              </p>
            </div>
            <div className="block xl:grid grid-cols-2 gap-4">
              {/* Course Image */}
              <div className="lg:w-[368px] h-[238px] rounded-xl md:mb-0 mb-14  ">
                <Image
                  src={video}
                  alt="hero"
                  className="h-full w-full object-cover rounded-xl border-4 border-[#4A90E2] "
                />
              </div>

              {/* Course information */}
              <div>
                {/* field */}
                <div className="mb-3 order-first hidden lg:block">
                  <p className="text-[#5801A9] text-[16px] font-medium leading-[22px]">
                    Technology | Web Development
                  </p>
                </div>

                <h4 className="text-[19px] text-[#333333] leading-[34px] font-bold my-2 ">
                  Introduction to Web Development
                </h4>
                <div className="my-3">
                  <p className="  text-[#333333] text-[14px] font-light leading-[22px]">
                    {`This course provides a foundational understanding of web
                development. You'll learn essential skills in HTML and CSS,
                enabling you to create and style your own web pages. No prior
                experience is necessary!`}
                  </p>
                </div>

                <div className="bg-[#5801A9] md:py-2 py-1 text-white w-[200px]  text-center mt-6 md:mb-3 mb-7 Sm:w-[50%] rounded-lg">
                  <p className="text-[14px] font-extrabold leading-[22px]">
                    Tech Innovators Academy
                  </p>
                </div>

                <div className="flex space-x-3 items-center">
                  <MdOutlineDiamond color="#333333" />
                  <p className="text-[#333333] text-[14px] font-medium leading-[22px]">
                    Difficulty level : Elementary
                  </p>
                </div>
              </div>
            </div>

            <div className="">
              {/* lectures in course */}
              <Lectures lectures={lectures} />
              {/* course desc & student req */}

              <div className="">
                <div>
                  <div className="flex justify-between xl:w-[30%] mt-5">
                    <h4 className="font-semibold text-[18px] leading-[31px] text-[#333333]">
                      Certification for this course
                    </h4>

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
                  </div>
                  <p className="text-[#333333] text-[14px] font-normal leading-[22px]">
                    After completion students will be issued certification
                  </p>
                </div>
                <div className="mt-12 mb-24 flex md:justify-start justify-center">
                  <form action="course-landing-page" method="post">
                    <button
                      className="rounded-xl bg-[#4A90E2] md:px-24 px-16  py-3 text-white"
                      type="submit"
                    >
                      Save and Publish Course
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFormView5
