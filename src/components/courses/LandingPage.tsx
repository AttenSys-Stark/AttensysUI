import React, { useEffect, useState, useRef } from "react";
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
import { FileObject } from "pinata";
import { clearCourseDraft } from "@/state/connectedWalletStarknetkitNext";

interface ChildComponentProps {
  courseData: any;
  setCourseData: any;
  wallet: any;
}

// file setup
const emptyData: FileObject = {
  name: "",
  type: "",
  size: 0,
  lastModified: 0,
  arrayBuffer: async () => {
    return new ArrayBuffer(0);
  },
};
interface Lecture {
  name: string;
  description: string;
  video: File | null;
}

const ResetCourseRegistrationData = {
  primaryGoal: "",
  targetAudience: "",
  courseArea: "",
  courseName: "",
  courseCreator: "",
  courseDescription: "",
  courseCategory: "",
  difficultyLevel: "",
  studentRequirements: "",
  learningObjectives: "",
  targetAudienceDesc: "",
  courseImage: emptyData,
  courseCurriculum: [] as Lecture[],
  coursePricing: "",
  promoAndDiscount: "",
  publishWithCertificate: false,
};

const LandingPage: React.FC<ChildComponentProps> = ({
  courseData,
  setCourseData,
  wallet,
}) => {
  const dataRef = useRef(courseData);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  console.log("The data hooked", dataRef.current);
  console.log("The data hooked", dataRef.current.courseData?.courseCreator);
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

  useEffect(() => {
    // dataRef.current = data;
    setCourseData(ResetCourseRegistrationData);

    // Check if we have course data with an image
    if (dataRef.current?.courseImage?.url) {
      setImageSrc(dataRef.current.courseImage.url);
    } else if (dataRef.current?.courseImage?.IpfsHash) {
      // If we have an IPFS hash, construct the URL
      setImageSrc(
        `https://gateway.pinata.cloud/ipfs/${dataRef.current.courseImage.IpfsHash}`,
      );
    }
  }, [dataRef.current?.courseImage]);

  const handleGetCourse = (e: any) => {
    // Store the current course data in localStorage before clearing
    localStorage.setItem("courseData", JSON.stringify(dataRef.current));

    // Clear the course data
    clearCourseDraft();
    setCourseData(ResetCourseRegistrationData);

    // Handle the course navigation
    handleCourse(
      e,
      e.currentTarget.textContent,
      router,
      dataRef.current?.course_identifier,
    );
  };

  return (
    <div className="pb-14 bg-[#F5F8FA]">
      <div
        className={`bg-[url('/hero_asset.png')] text-white xl:h-[322px] px-12 xl:px-28 py-16 from-orange-400 via-red-500 to-pink-500 sm:h-96  `}
      >
        <div className="flex justify-center xl:grid xl:grid-cols-2 gap-4 sm:mx-20">
          {/* Course Image */}
          <div className="text-sm">
            <p className="font-bold mb-2">
              {dataRef.current.courseCategory} | Web development
            </p>
            <div className="relative h-[338px] w-[338px]">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Course Image"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
            </div>
          </div>

          {/* Course information */}
          <div className="text-sm hidden xl:block">
            {/* field */}
            <div className="">
              <button
                onClick={handleGetCourse}
                className="hidden sm:block bg-[#fff] px-7 py-2 rounded text-[#333333] font-bold"
              >
                Get course
              </button>
            </div>

            <h4
              className="text-[39px] leading-[39px] h-[78px] my-5 font-bold text-black xl:text-white cursor-pointer"
              onClick={(e) =>
                handleCourse(
                  e,
                  e.currentTarget.textContent,
                  router,
                  dataRef.current?.course_identifier,
                )
              }
            >
              {dataRef.current.courseName}
            </h4>

            <div className="flex">
              <div className="bg-[#5801A9] py-2 text-white w-[200px] mb-4 text-center Sm:w-[50%] rounded-xl">
                <p className="text-[14px] font-extrabold leading-[22px]">
                  {dataRef.current.courseCreator}
                </p>
              </div>

              <div className="">
                <button
                  onClick={(e) => {
                    localStorage.setItem(
                      "courseData",
                      JSON.stringify(dataRef.current),
                    );
                    handleCourse(
                      e,
                      e.currentTarget.textContent,
                      router,
                      dataRef.current?.course_identifier,
                    );
                  }}
                  className="sm:hidden block bg-[#9b51e0] px-7 py-2 rounded-xl text-[#333333] font-bold"
                >
                  Get course
                </button>
              </div>
            </div>

            {/* rating and num of students
            <div className="flex items-center justify-center mb-3 space-x-16">
              <div className="flex items-center space-x-3">
                <StarRating totalStars={5} starnumber={4} />
                <p className="font-bold text-black xl:text-white">(281)</p>
              </div>

              <div className="flex space-x-2 items-center text-black xl:text-white">
                <HiOutlineCheckBadge
                  color="#fff"
                  className="h-[22px] w-[20px]"
                />
                <p className="font-bold">291 certification</p>
              </div>

            </div> */}
            {/* creator and last update */}
            {/* <div className="flex space-x-14 sm:flex sm:text-center mt-12 mb-4">
              <div className="">
                <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                  Created by{" "}
                  <span className="underline">
                    {dataRef.current.courseCreator}
                  </span>
                </p>
              </div>

              <div className="flex ml-0 sm:ml-5 items-center  space-x-1">
                <GiBackwardTime />
                <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                  Last updated 10|10|24
                </p>
              </div>
            </div> */}

            {/* video prop */}
            {/* <div className="block sm:flex space-x-10 mb-4">
              <div className="flex my-1 space-x-2 items-center">
                <FaPlay className="h-[14px] w-[14px] text-[#5801A9]" />
                <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                  Total play time: 2 hrs 35 mins
                </p>
              </div>
              <div className="flex sm:ml-5 space-x-2 items-center">
                <GrDiamond color="#2D3A4B" className="h-[14px] w-[14px]" />
                <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                  Difficulty level: {dataRef.current.difficultyLevel}
                </p>
              </div>
            </div> */}

            {/* <div className="flex space-x-2 items-center mb-4">
              <div>
                <LuBadgeCheck className="h-[14px] w-[14px] text-[#5801A9]" />
              </div>
              <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                Certificate of Completion
              </p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Course information */}
      <div className="text-sm block xl:hidden p-4">
        {/* field */}
        <div className="">
          <button
            onClick={(e) => {
              localStorage.setItem(
                "courseData",
                JSON.stringify(dataRef.current),
              );
              handleCourse(
                e,
                e.currentTarget.textContent,
                router,
                dataRef.current?.course_identifier,
              );
            }}
            className="hidden xl:block bg-[#fff] px-7 py-2 rounded text-[#333333] font-bold"
          >
            Get course
          </button>
        </div>

        <h4
          className="text-[39px] leading-[39px] w-[393px] h-[40px] my-2 font-bold text-black xl:text-white cursor-pointer"
          onClick={(e) =>
            handleCourse(
              e,
              e.currentTarget.textContent,
              router,
              dataRef.current?.course_identifier,
            )
          }
        >
          {dataRef.current.courseName}
        </h4>

        <div className="flex">
          <div className="bg-[#5801A9] py-2 text-white w-[200px] mb-4 text-center Sm:w-[50%] rounded-xl ">
            <p className="text-[14px] font-extrabold leading-[22px]">
              {dataRef.current.courseCreator}
            </p>
          </div>

          <div className="ml-4 xl:ml-0 ">
            <button
              onClick={(e) => {
                localStorage.setItem(
                  "courseData",
                  JSON.stringify(dataRef.current),
                );
                handleCourse(
                  e,
                  e.currentTarget.textContent,
                  router,
                  dataRef.current?.course_identifier,
                );
              }}
              className="sm:hidden block bg-[#9b51e0] px-7 py-2 rounded text-[#fff] font-bold"
            >
              Get course
            </button>
          </div>
        </div>

        {/* rating and num of students */}
        {/* <div className="flex flex-col xl:flex-row  xl:items-center mb-3 space-x-16">
          <div className="flex items-center space-x-3">
            <StarRating totalStars={5} starnumber={4} />
            <p className="font-bold text-black xl:text-white">(281)</p>
          </div>

          <div className="flex items-center space-x-3 text-black xl:text-white">
            <HiOutlineCheckBadge color="#333" className="h-[22px] w-[20px]" />
            <p className="font-bold">291 certification</p>
          </div>
        </div> */}

        {/* creator and last update */}
        {/* <div className="flex flex-col xl:flex-row items-start space-x-0 xl:space-x-14 sm:flex sm:text-center mt-12">
          <div>
            <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
              Created by{" "}
              <span className="underline">{dataRef.current.courseCreator}</span>
            </p>
          </div>

          <div className="flex ml-0 xl:ml-5 items-center space-x-1">
            <GiBackwardTime />
            <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
              Last updated 10|10|24
            </p>
          </div>
        </div> */}

        {/* video prop */}
        {/* <div className="flex flex-col xl:flex-row items-start xl:space-x-10 mb-4">
          <div className="flex my-1 space-x-2 items-center">
            <FaPlay className="h-[14px] w-[14px] text-[#5801A9]" />
            <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
              Total play time: 2 hrs 35 mins
            </p>
          </div>
          <div className="flex mt-2 xl:mt-0 xl:ml-5 space-x-2 items-center">
            <GrDiamond color="#2D3A4B" className="h-[14px] w-[14px]" />
            <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
              Difficulty level: Elementary
            </p>
          </div>
        </div> */}

        {/* <div className="flex space-x-2 items-center mb-4">
          <div>
            <LuBadgeCheck className="h-[14px] w-[14px] text-[#5801A9]" />
          </div>
          <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
            Certificate of Completion
          </p>
        </div> */}
      </div>

      <div className="mt-12 block px-4 xl:hidden">
        <div className="  text-[#333333] text-[14px] font-light leading-[22px]">
          <p>
            {`  This course provides a foundational understanding of web
            development. You'll learn essential skills in HTML and CSS, enabling
            you to create and style your own web pages. No prior experience is
            necessary!`}
          </p>
        </div>

        <div className="py-5">
          <h4 className="font-semibold text-[14px] text-[#333333] leading-[22px]">
            Student Requirements
          </h4>

          <ul className="list-disc mx-6 mt-4 text-[#333333] text-[14px] font-light leading-[22px]">
            <li>A computer with internet access</li>
            <li>Basic computer skills</li>
            <li>Willingness to learn and experiment</li>
          </ul>
          <div>
            <p>{dataRef.current.studentRequirements}</p>
          </div>
        </div>

        <div className="py-5">
          <h4 className="font-semibold text-[14px] text-[#333333] leading-[22px]">
            {" "}
            Target Audience
          </h4>

          <div>
            <p>{dataRef.current.targetAudience}</p>
          </div>
        </div>
      </div>

      <div className="px-6 lg:mx-48 sm:mt-4 xl:mt-32 mb-10">
        <Lectures
          lectures={lectures}
          courseData={dataRef.current}
          learningObj={dataRef.current.learningObjectives}
          isActivated={false}
          handleSwitch={() => {}}
        />
      </div>

      {/* rating */}
      <div>
        {/* <div className="border-b-[1px] border-b-[#949494] mx-24 sm:mx-48 flex space-x-2 items-center h-[50px]">
          <IoIosStar color="#F6A61C" className="h-[20px] w-[20px]" />
          <p className="text-[20px] text-[#333333] font-semibold leading-[22px]">
            4.9 Rating | (281 reviews)
          </p>
        </div> */}

        {/* comments */}
        {/* <div className="block xl:flex py-12 mx-12 sm:mx-48 items-center content-center justify-around text-sm">
          <div className="w-[100%] xl:w-[30%]">
            <div className="flex items-center">
              <p className="p-5 bg-[#9b51e01a] font-bold rounded-full">OM</p>
              <div className="ml-6 space-y-2">
                <p>Olivia. M</p>
                <StarRating totalStars={5} starnumber={4} />
              </div>
            </div> */}

        {/* <p className="mt-6 text-[14px] font-medium text-[#333333] leading-[22px]">
              Halfway through the course and lots of information given in every
              chapter. Concise and easy to understand, very useful to apply to
              any Web design journey!
            </p>
          </div> */}

        {/* <div className="border-[1px] border-[#B8B9BA] h-28 hidden xl:block"></div>

          <div className="w-[100%] xl:w-[30%] mt-8 xl:mt-0">
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
        </div>*/}
      </div>

      <div>
        <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-sm text-white py-2 px-48">Students also bought</p>
        </div>

        {/* <div className="mx-24 sm:mx-48 my-6">
          <CarouselComp wallet={wallet} />
        </div> */}
      </div>
    </div>
  );
};

export default LandingPage;
