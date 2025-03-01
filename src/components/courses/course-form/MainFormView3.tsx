import React, { useRef, useState } from "react";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";
import Dropdown from "../Dropdown";
import Image from "next/image";
import upload from "@/assets/upload.svg";
import upload_other from "@/assets/upload_other.svg";
import tick_circle from "@/assets/tick-circle.svg";
import trash from "@/assets/trash.svg";
import film from "@/assets/film.svg";
import { IoMdCheckmark } from "@react-icons/all-files/io/IoMdCheckmark";
import CourseSideBar from "./SideBar";
import { handleCreateCourse } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { Button } from "@headlessui/react";
import Stepper from "@/components/Stepper";

interface Lecture {
  id: string;
  title: string;
  description: string;
  file: File | null;
  titleError: string;
  fileError: string;
}
const MainFormView3 = () => {
  const router = useRouter();
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureTitleError, setLectureTitleError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setLectureTitleError("");

    let hasError = false;

    // Validate lecture title only
    if (!lectureTitle.trim()) {
      setLectureTitleError("Lecture title is required");
      hasError = true;
    }

    if (hasError) return;

    // Proceed to next step
    handleCreateCourse(e, "courseSetup4", router);
  };
  const handleBrowsefiles = () => {
    //@todo handle file upload logic
    console.info("click");
  };
  return (
    <div className="flex items-stretch">
      <div className="hidden lg:block">
        <CourseSideBar />
      </div>

      <div className="flex-1 w-full">
        <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="py-2 text-sm text-center text-white">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
        </div>

        <div className="lg:hidden w-full flex justify-center mt-[58px] mb-[79px]">
          <Stepper currentStep={3} />
        </div>
        <div className="w-full">
          <div className="block sm:flex justify-between py-2 my-5 border-t border-b border-[#d1d1d1] px-5 items-center">
            <div className="flex items-center">
              <div className="px-4 border-r border-blue-100 sm:px-8">
                <IoMdArrowBack
                  onClick={() => history.back()}
                  className="cursor-pointer text-[#4A90E2]"
                />
              </div>
              <p className="text-[#4A90E2] text-xl font-bold">
                Course & Curriculum
              </p>
            </div>

            <button className="hidden sm:block bg-[#c5d322] px-7 py-3 rounded text-black">
              Save progress
            </button>
          </div>

          <div className="mx-5 mt-12 md:mx-10">
            <form onSubmit={handleSubmit}>
              <div className="w-full my-12">
                <label
                  htmlFor=""
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course Image
                </label>
                <p className="font-normal mt-2 text-[13px]/[145%] md:text-[14px] text-[#2D3A4B] md:leading-[21px]">
                  {`This is the creative section of your course creation. Your course landing page is crucial to your success on Attensys. 
You want to make sure your creative is very catchy.`}
                </p>
                <div className="flex-col items-start block my-4 sm:flex lg:flex-row">
                  <div className="bg-[#DCDCDC] flex-1 p-4 sm:p-16 rounded-xl">
                    <div className="bg-white p-2 sm:p-14 text-center border-dotted rounded border-2 border-[#D0D5DD]  content-center text-xs ">
                      <div className="mx-auto w-[15%]">
                        <Image src={upload} alt="uplaod" />
                      </div>

                      <div className="my-3 text-base md:text-sm">
                        <p>
                          <span className="text-[#4A90E2]">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-[13px] text-[#98A2B3]">
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center w-full gap-2">
                          <div className="h-px w-full bg-[#F0F2F5]" />
                          <p className="text-[10.65px] md:text-[8px]">OR</p>
                          <div className="h-px w-full bg-[#F0F2F5]" />
                        </div>

                        <Button
                          className="rounded-[6px] bg-[#9B51E0] px-4 md:px-12 py-2 md:py-3 text-white my-3"
                          onClick={handleBrowsefiles}
                        >
                          Browse Files
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-sm sm:mx-6 ">
                    <p className="font-semibold lg:hidden text-[18px] leading-[31px] text-[#333333] mt-[38px] mb-[18px]">
                      Upload thumbnail
                    </p>
                    <div className="bg-white w-full md:w-[350px] p-8 text-center border-dotted rounded-xl border-2 border-[#D0D5DD] flex flex-col justify-center content-center">
                      <div className="w-auto mx-auto">
                        <Image src={upload} alt="uplaod" width={30} />
                      </div>

                      <div className="my-4">
                        <p className="text-xs md:text-[8px]">
                          <span className="text-[#4A90E2]">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-[10.6px] md:text-[7.5px] text-[#98A2B3]">
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                      </div>

                      <div className="my-2">
                        <div className="flex items-center w-full gap-2">
                          <div className="h-px w-full bg-[#F0F2F5]" />
                          <p className="text-[10.65px] md:text-[8px]">OR</p>
                          <div className="h-px w-full bg-[#F0F2F5]" />
                        </div>

                        <Button className="rounded-[6px] bg-[#9B51E0] px-4 md:px-12 text-xs py-2 md:py-3 text-white my-3">
                          Browse Files
                        </Button>
                      </div>
                    </div>
                    <div className="hidden lg:block py-5 w-full sm:w-1/2 lg:w-[350px]">
                      <p className="font-semibold text-[18px] leading-[31px] text-[#333333] py-3">
                        Upload thumbnail
                      </p>
                      <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px]">
                        Upload your course image here. It must meet our course
                        image quality standards to be accepted. Important
                        guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png.
                        no text on the image.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-12">
                <p className="font-semibold text-[18px] leading-[31px] text-[#333333] my-3">
                  Course Curriculum
                </p>
                <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px]">
                  AttenSys allows you to structure your course with multiple
                  videos under one course. Each section can include several
                  videos, helping you break down complex topics into easily
                  digestible lessons. This makes it simple for students to
                  follow along, step by step, as they progress through your
                  course.
                </p>
                <div className="my-12">
                  <p className="font-semibold text-[18px] leading-[31px] text-[#333333] my-3 pl-5">
                    Tips
                  </p>
                  <ul className="list-disc text-[14px] text-[#2D3A4B] leading-[21px] w-full max-w-[800px] px-8">
                    <li className="py-2">
                      Aim to keep each video between 5 to 10 minutes. Shorter
                      videos are easier for students to follow and help them
                      stay focused. For complex topics, break the content into
                      multiple shorter videos instead of one long video.
                    </li>
                    <li className="py-3">
                      Start each video with a brief introduction of the key
                      points that will be covered. This helps students know what
                      to expect and primes them for learning.
                    </li>
                    <li className="py-3">
                      Include activities or prompts within your videos, like
                      asking students to pause and think about a question or to
                      try something on their own before moving on to the next
                      video.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="my-10 md:my-12">
                <Button className="rounded-xl bg-[#9b51e052] px-7 py-2.5 text-sm  text-[#2d3a4b]">
                  <span className="text-2xl/[0px]">+</span> Add New Lecture
                </Button>

                {/* Upload page */}
                <div className="my-4 bg-[#9b51e01a] py-9 md:py-12 px-5 md:px-12 border md:rounded-xl mt-[71px] -mx-5 md:mx-0">
                  <div className="flex bg-white p-5 rounded-[5px] my-3">
                    <p className="font-medium mr-3 text-[16px]">Lecture 3:</p>
                    <input
                      placeholder="Class Title e.g UI/UX Basics"
                      className="w-auto lg:w-[80%]"
                      onChange={(e) => {
                        setLectureTitle(e.target.value);
                        setLectureTitleError("");
                      }}
                    />
                  </div>
                  {lectureTitleError && (
                    <p className="mt-1 text-xs text-red-500">
                      {lectureTitleError}
                    </p>
                  )}

                  <div className="flex bg-white p-5 rounded-[5px] my-3">
                    <p className="font-medium mr-3 text-[16px]">Description:</p>
                    <textarea
                      name=""
                      id=""
                      className="w-[100%]"
                      placeholder="Class description (optional)"
                    ></textarea>
                  </div>
                  <div className="bg-white p-5 rounded-[5px] my-3 text-center content-center w-[100%] flex flex-col justify-center">
                    <div className="w-[15%] mx-auto flex justify-center">
                      <Image src={upload_other} alt="uplaod" />
                    </div>
                    <p className="text-[14px] font-normal text-[#353535] mt-2 leading-[22px]">
                      <span className="text-[#A020F0]">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-[14px] font-normal text-[#353535] leading-[22px] mt-1">
                      (Max. File size: 500 MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="my-12">
                {/* Item section */}
                <div className="my-4 bg-[#9b51e01a] py-9 md:py-12 px-5 md:px-12 border -mx-5 md:mx-0 md:rounded-xl">
                  <div className="flex justify-between bg-white p-5 rounded-[5px] my-3">
                    <div className="flex items-center">
                      <p className="font-medium mr-3 text-[16px]">Lecture 3:</p>
                      <p className="text-[16px] font-normal text-[#353535] leading-[31px]">
                        UI/UX Introductory Concepts
                      </p>
                    </div>

                    <div className="flex items-center bg-green">
                      <Image src={tick_circle} alt="tick" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white p-5 rounded-[5px] my-3">
                    <div className="flex items-center">
                      <p className="font-medium mr-3 text-[16px]">
                        Description:
                      </p>
                      <p className="text-[16px] font-normal text-[#353535] leading-[31px]">
                        {`Figma class - It’s uses, function, extraction, export etc..`}
                        .
                      </p>
                    </div>

                    <div className="flex items-center">
                      <Image src={tick_circle} alt="tick" />
                    </div>
                  </div>

                  <div className=" bg-white p-5 rounded-[5px] my-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div>
                          <Image src={film} alt="film" />
                        </div>

                        <div className="mx-3">
                          <p className="text-[16px] font-medium text-[#353535] leading-[20px]">
                            Figma
                          </p>
                          <p className="text-[11px] font-normal text-[#353535] leading-[20px]">
                            200mb
                          </p>
                        </div>
                      </div>

                      <div className="bg-red">
                        <Image src={trash} alt="trash" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between flex-1">
                      <div className="p-1.5 my-2 bg-green-500 w-[100%] rounded-xl  mr-3"></div>
                      <p>100%</p>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-12 mb-4">
                  <button
                    className="rounded-lg bg-[#4A90E2] px-8 py-[15px] text-white w-full md:max-w-[350px]"
                    type="submit"
                  >
                    Almost there!
                  </button>
                </div>

                <div className="w-full flex justify-center pb-[74px]">
                  <button className="block sm:hidden bg-[#c5d322] text-sm px-12 py-[15px] rounded-lg text-black">
                    Save progress
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFormView3;
