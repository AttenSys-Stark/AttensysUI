"use client";
import { useState } from "react";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";
import video from "@/assets/video.png";
import youtube from "@/assets/youtube.svg";
import podcast from "@/assets/Podcast.svg";
import rich from "@/assets/Richin2024.svg";
import Image from "next/image";
import Switch from "react-switch";
import Lectures from "../Lectures";
import CourseSideBar from "./SideBar";
import { MdOutlineDiamond } from "react-icons/md";
import { IoSearchOutline, IoMenuOutline } from "react-icons/io5";

const MainFormView5 = () => {
  const [isActivated, setIsActivated] = useState(false);

  const handleSwitch = () => {
    setIsActivated(!isActivated);
  };

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
    <div className="lg:flex">
      <div className="hidden xl:block">
        <CourseSideBar />
      </div>

      <div className="flex-1">
        <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-sm text-white text-center py-2">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
        </div>

        <div className="p-4 lg:p-0 lg:px-4 xl:px-0">
          <div className="block lg:flex justify-between py-2 my-5 border-t border-b border-[#d1d1d1] lg:px-5 items-center">
            <div className="flex items-center">
              <div className="px-8 border-r border-blue-100">
                <IoMdArrowBack
                  onClick={() => history.back()}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-[#4A90E2] text-xl font-bold">
                Preview & Publish
              </p>
            </div>

            <form action="course-landing-page" method="post">
              <button className="hidden xl:block bg-[#C5D322] px-7 py-3 rounded text-white">
                Publish
              </button>
            </form>
          </div>

          <div className="lg:mx-4 xl:mx-24 mt-12">
            {/* field */}
            <div className="mb-3 order-first block lg:hidden">
              <p className="text-[#5801A9] text-[16px] font-medium leading-[22px]">
                Technology | Web Development
              </p>
            </div>
            <div className="block lg:grid lg:grid-cols-2 gap-4">
              {/* Course Image */}
              <div className="w-full lg:w-[368px] h-[238px] rounded-xl mb-4 lg:mb-0 p-3">
                <Image
                  src={video || "/placeholder.svg"}
                  alt="hero"
                  className="h-full w-full object-cover rounded-xl border-4 border-[#4A90E2]"
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
                  <p className="text-[#333333] text-[14px] font-light leading-[22px]">
                    {`This course provides a foundational understanding of web
                development. You'll learn essential skills in HTML and CSS,
                enabling you to create and style your own web pages. No prior
                experience is necessary!`}
                  </p>
                </div>

                <div className="bg-[#5801A9] py-2 text-white w-fit p-2 text-center mt-6 mb-3 lg:w-[50%] rounded-lg">
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
            <div className="  text-[#333333] text-[14px] font-light leading-[22px]">
              <p>
                {`  This course provides a foundational understanding of web
            development. You'll learn essential skills in HTML and CSS, enabling
            you to create and style your own web pages. No prior experience is
            necessary!`}
              </p>
            </div>

            <div className="mt-8">
              {/* Student Requirements */}
              <div className="mb-6 block lg:hidden">
                <h2 className="font-semibold text-[18px] leading-[31px] text-[#333333] mb-2">
                  Student Requirements
                </h2>
                <ul className="text-sm text-[#333333] list-disc pl-5 space-y-1">
                  <li>A computer with internet access</li>
                  <li>Basic computer skills</li>
                  <li>Willingness to learn and experiment</li>
                </ul>
              </div>

              {/* Target Audience */}
              <div className="mb-6 block lg:hidden">
                <h2 className="font-semibold text-[18px] leading-[31px] text-[#333333] mb-2">
                  Target Audience
                </h2>
                <ul className="text-sm text-[#333333] list-disc pl-5 space-y-1">
                  <li>Beginners interested in web development</li>
                  <li>
                    Aspiring web developers looking to start their journey
                  </li>
                  <li>Anyone wanting to create their own websites</li>
                </ul>
              </div>

              {/* lectures in course */}
              <Lectures lectures={lectures} />
              {/* course desc & student req */}

              <div className="">
                <div>
                  <div className="flex justify-between lg:w-[30%] mt-5">
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
                <div className="mt-12 mb-24 p-10">
                  <form action="course-landing-page" method="post">
                    <button
                      className="w-full lg:w-auto rounded-xl bg-[#4A90E2] px-8 lg:px-24 py-3 text-white"
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
  );
};

export default MainFormView5;
