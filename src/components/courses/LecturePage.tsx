import React from "react";
import ReactPlayer from "react-player/lazy";
import { CardWithLink } from "./Cards";
import { Button } from "@material-tailwind/react";
import { IoIosStar } from "@react-icons/all-files/io/IoIosStar";
import Image from "next/image";
import stream_video from "@/assets/stream_video.svg";
import graduate from "@/assets/grad.svg";
import profile_pic from "@/assets/profile_pic.png";
import { HiBadgeCheck } from "@react-icons/all-files/hi/HiBadgeCheck";
import { GrDiamond } from "@react-icons/all-files/gr/GrDiamond";
import youtube from "@/assets/youtube.svg";
import podcast from "@/assets/Podcast.svg";
import rich from "@/assets/Richin2024.svg";
import attensys_logo from "@/assets/attensys_logo.svg";
import { LuBadgeCheck } from "react-icons/lu";
import StarRating from "../bootcamp/StarRating";

const LecturePage = (props: any) => {
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
    {
      img: podcast,
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
    <div className="pt-6  pb-36 w-full">
      {/* Video and Title */}
      <div className="flex text-sm space-x-3 items-center px-12">
        <div className="flex space-x-2 items-center">
          <Image
            src={graduate}
            className="h-[25px] w-[25px]"
            alt="stream_video"
          />
          <p className="text-[16px] text-[#2D3A4B] leading-[19px] font-semibold">
            My Courses
          </p>
        </div>
        <p className="text-[16px] text-[#2D3A4B] leading-[19px] font-semibold">
          <span className="mr-2 text-[#9B51E0]">|</span> Course Name
        </p>
      </div>

      {/* ReactPlayer & lecture*/}
      <div className="w-[100%] mx-auto flex justify-between items-center px-12 mt-5">
        <div className="w-[67%] h-[543px] rounded-xl overflow-hidden">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=lEF4ccMlQB8"
            width="100%" // Ensures the player takes up full width
            height="543px"
            className="rounded-xl"
          />
        </div>

        <div className="w-[30%] h-[543px] space-y-4">
          <div className="flex space-x-2  justify-center bg-gradient-to-r from-[#5801a9] to-[#4a90e2] text-white items-center text-sm py-3 px-7 rounded-xl">
            <HiBadgeCheck color="#fff" />
            <p>Attensys Certified Course</p>
          </div>
          <h1 className="text-[16px] text-[#2D3A4B] leading-[22px] font-semibold">
            Lecture (4)
          </h1>

          <div className="h-[440px] w-[100%] bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-xl overflow-scroll scrollbar-hide">
            {lectures.map((item, i) => (
              <div
                key={i}
                className="flex w-full space-y-1 items-center p-3 space-x-6 justify-center"
              >
                <p className="font-bold text-[#5801a9]">{i + 1}</p>
                <div className="w-[131px] h-[84px] rounded-xl">
                  <Image
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[14px] font-semibold leading-[30px] text-[#333333]">
                    {item.title}
                  </p>
                  <h1 className="text-[8px] text-[#333333] leading-[14px] font-medium">
                    Creator address
                  </h1>
                  <div className="rounded-lg bg-[#9B51E052] w-[40%] flex items-center justify-center">
                    <p className="text-xs px-4 py-1">{item.timing}: 01</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-[100%] mx-auto flex justify-between items-center px-12 mt-5">
        <div className="w-[67%] space-y-3">
          <div className="flex space-x-14">
            <h1 className="font-bold text-[24px] text-[#2D3A4B] leading-[31px]">
              Introduction to Web Development
            </h1>
            <div className="flex sm:ml-5 space-x-2 items-center">
              <GrDiamond color="#2D3A4B" className="h-[20px] w-[20px]" />
              <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                Difficulty level: Elementary
              </p>
            </div>
            <div className="flex space-x-2 items-center">
              <div>
                <LuBadgeCheck className="h-[20px] w-[20px] text-[#5801A9]" />
              </div>
              <p className="text-[14px] text-[#2D3A4B] leading-[22px] font-medium">
                Certificate of Completion
              </p>
            </div>
          </div>
          <div>
            <p className="text-[14px] text-[#2D3A4B] leading-[18px] font-medium">
              Created by{" "}
              <span className="underline text-[#5801A9]">Akinbola Kehinde</span>
            </p>
          </div>
        </div>

        <div className="bg-[url('/hero_asset.png')] text-white p-10 rounded-xl w-[30%] flex items-center justify-center h-[85px]">
          <Image src={attensys_logo} alt="logo" />
        </div>
      </div>

      <div className="w-[100%] mx-auto flex justify-between px-12 mt-5">
        <div className="w-[67%] h-auto space-y-12">
          <div className="h-auto w-full rounded-xl bg-[#FFFFFF] border-[1px] border-[#D9D9D9] p-10">
            <div className="pb-4">
              <p className="font-bold py-2 text-[14px] text-[#333333] leading-[22px]">
                About this course
              </p>
              <p className="text-[14px] text-[#333333] leading-[22px] font-light">
                {`This course provides a foundational understanding of web
                              development. You'll learn essential skills in HTML and CSS,
                              enabling you to create and style your own web pages. No prior
                              experience is necessary!`}
              </p>
            </div>
            <div className="py-4">
              <p className="font-bold py-2 text-[14px] text-[#333333] leading-[22px]">
                {" "}
                Student Requirements
              </p>
              <ul className="text-[14px] text-[#333333] leading-[22px] font-light list-disc">
                <li>A computer with internet access</li>
                <li>Basic computer skills</li>
                <li>Willingness to learn and experiment</li>
              </ul>
            </div>
            <div className="py-6">
              <p className="font-bold py-2 text-[14px] text-[#333333] leading-[22px]">
                {" "}
                Target Audience
              </p>
              <ul className="text-[14px] text-[#333333] leading-[22px] font-light list-disc">
                <li> Beginners interested in web development </li>
                <li>Aspiring web developers looking to start their journey</li>
                <li>Anyone wanting to create their own websites</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-[16px] font-bold text-[#2D3A4B] leading-[22px]">
              Leave a review
            </h1>
            <div className="h-[610px] pb-10 w-full rounded-xl bg-[#FFFFFF] border-[1px] border-[#D9D9D9]">
              <div className="flex justify-between items-center h-[100px] w-full border-b-[1px] border-b-[#EBECEE] px-10">
                <div className="h-full w-[30%] flex items-center justify-center border-r-[1px] border-r-[#EBECEE]">
                  <div className="flex items-center w-full space-x-3">
                    <Image src={profile_pic} alt="pic" width={60} />
                    <div className="space-y-1">
                      <h4 className="text-[16px] text-[#333333] leading-[22px] font-semibold">
                        0xRavenclaw
                      </h4>
                      <p className="text-[#9b51e0] text-[12px] font-medium leading-[14px]">
                        0x5c956e61...de5232dc11
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-full w-[30%] space-x-3 flex items-center border-r-[1px] border-r-[#EBECEE]">
                  <h1 className="text-[14px] text-[#333333] leading-[16px] font-medium">
                    Tap to rate:
                  </h1>
                  <StarRating totalStars={5} starnumber={0} />
                </div>
                <div className="h-full w-[30%] flex items-center space-x-3">
                  <StarRating totalStars={5} starnumber={4} />
                  <h1 className="text-[14px] text-[#333333] leading-[16px] font-medium">
                    <span className="text-[#A01B9B]">1,245</span> students
                  </h1>
                </div>
              </div>
              <div className="px-10 mt-8 flex items-center space-x-4">
                {/* input and button */}
                <input
                  type="text"
                  placeholder="What do you think about this course?"
                  className="w-[75%] h-[45px] border shadow-dm p-6 rounded-xl text-[14px] font-medium leading-[16px]"
                />
                <Button
                  size="md"
                  variant="text"
                  className="bg-[#9b51e0] text-white"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Send review
                </Button>
              </div>

              <div className="px-10 mt-10 space-y-10 h-[380px] overflow-y-scroll pb-10 ">
                <div className="space-y-6">
                  <div className="flex space-x-3 items-center">
                    <div className="h-[64px] w-[64px] bg-[#9B51E01A] text-[20px] text-[#101928] leading-[24px] rounded-full flex items-center justify-center">
                      OM
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-[14px] text-[#333333] font-semibold leading-[22px]">
                        Olivia
                      </h1>
                      <StarRating totalStars={5} starnumber={4} />
                    </div>
                  </div>
                  <p className="w-[730px] text-[14px] text-[#333333] font-medium leading-[22px]">
                    Halfway through the course and lots of information given in
                    every chapter. Concise and easy to understand, very useful
                    to apply to any Web design journey!
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex space-x-3 items-center">
                    <div className="h-[64px] w-[64px] bg-[#9B51E01A] text-[20px] text-[#101928] leading-[24px] rounded-full flex items-center justify-center">
                      OM
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-[14px] text-[#333333] font-semibold leading-[22px]">
                        Olivia
                      </h1>
                      <StarRating totalStars={5} starnumber={4} />
                    </div>
                  </div>
                  <p className="w-[730px] text-[14px] text-[#333333] font-medium leading-[22px]">
                    Halfway through the course and lots of information given in
                    every chapter. Concise and easy to understand, very useful
                    to apply to any Web design journey!
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex space-x-3 items-center">
                    <div className="h-[64px] w-[64px] bg-[#9B51E01A] text-[20px] text-[#101928] leading-[24px] rounded-full flex items-center justify-center">
                      OM
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-[14px] text-[#333333] font-semibold leading-[22px]">
                        Olivia
                      </h1>
                      <StarRating totalStars={5} starnumber={4} />
                    </div>
                  </div>
                  <p className="w-[730px] text-[14px] text-[#333333] font-medium leading-[22px]">
                    Halfway through the course and lots of information given in
                    every chapter. Concise and easy to understand, very useful
                    to apply to any Web design journey!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[30%] h-[1020px]">
          <h1>Courses you might like</h1>
          <div className="space-y-10">
            <CardWithLink />
            <CardWithLink />
            <CardWithLink />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturePage;
