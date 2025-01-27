import React, { useState } from "react"
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack"
import Dropdown from "../Dropdown"
import Image from "next/image"
import upload from "@/assets/upload.svg"
import upload_other from "@/assets/upload_other.svg"
import tick_circle from "@/assets/tick-circle.svg"
import trash from "@/assets/trash.svg"
import film from "@/assets/film.svg"
import { IoMdCheckmark } from "@react-icons/all-files/io/IoMdCheckmark"
import CourseSideBar from "./SideBar"
import { handleCreateCourse } from "@/utils/helpers"
import { useRouter } from "next/navigation"
import { Button } from "@headlessui/react"

const MainFormView3 = () => {
  const router = useRouter()
  const [lectureTitle, setLectureTitle] = useState('')
  const [lectureDescription, setLectureDescription] = useState('')
  const [titleError, setTitleError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')

  const handleBrowsefiles = () => {
    //@todo handle file upload logic
    console.log("click")
  }

  const validateForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = true;

    // Validate Lecture Title
    if (!lectureTitle.trim()) {
      setTitleError('Lecture title is required');
      isValid = false;
    } else {
      setTitleError('');
    }

    // Validate Lecture Description
    if (!lectureDescription.trim()) {
      setDescriptionError('Lecture description is required');
      isValid = false;
    } else {
      setDescriptionError('');
    }

    // If form is not valid, prevent submission
    if (!isValid) {
      return false;
    }

    // Proceed with course creation if valid
    handleCreateCourse(e as unknown as React.MouseEvent<HTMLFormElement>, "courseSetup4", router);
  }

  return (
    <div className="flex items-stretch">
      <div className="hidden sm:block">
        <CourseSideBar />
      </div>

      <div className="flex-1">
        <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-sm text-white text-center py-2">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
        </div>

        <div className="min-w-full w-[100%] ">
          <div className="block sm:flex justify-between py-2 my-5 border-t border-b border-[#d1d1d1] px-5 items-center">
            <div className="flex items-center">
              <div className="px-4 sm:px-8 border-r border-blue-100">
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

          <div className="mx-10  mt-12">
            <form action="CourseSetup4" onSubmit={validateForm}>
              <div className="my-12 w-full">
                <label htmlFor="" className="font-semibold text-[18px] leading-[31px] text-[#333333]">
                  Course Image
                </label>
                <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px]">
                  {`This is the creative section of your course creation. Your course landing page is crucial to your success on Attensys. 
You want to make sure your creative is very catchy.`}
                </p>
                <div className="block sm:flex items-start my-4">
                  <div className="bg-[#DCDCDC] flex-1 p-4 sm:p-16 rounded-xl">
                    <div className="bg-white p-2 sm:p-14 text-center border-dotted rounded border-2 border-[#D0D5DD]  content-center text-xs ">
                      <div className="mx-auto w-[15%]">
                        <Image src={upload} alt="uplaod" />
                      </div>

                      <div className="my-3">
                        <p>
                          <span className="text-[#4A90E2]">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p>SVG, PNG, JPG or GIF (max. 800x400px)</p>
                      </div>

                      <div>
                        <p>OR</p>

                        <Button className="rounded bg-[#9B51E0] px-12 py-3 text-white my-3"   onClick={handleBrowsefiles}>
                          Browse Files
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm sm:mx-6 flex-1 ">
                    <div className="bg-white sm:w-[50%] lg:w-[350px] p-8 text-center border-dotted rounded-xl border-2 border-[#D0D5DD] flex flex-col justify-center content-center">
                      <div className="w-[15%] mx-auto">
                        <Image src={upload} alt="uplaod" width={30} />
                      </div>

                      <div className="my-4">
                        <p className="text-[8px]">
                          <span className="text-[#4A90E2]">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-[9px]">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                      </div>

                      <div className="my-2">
                        <p className="text-[8px]">OR</p>

                        <Button className="rounded bg-[#9B51E0] px-4 py-1 my-4 text-white text-[8px]">
                          Browse Files
                        </Button>
                      </div>
                    </div>
                    <div className="py-5 sm:w-1/2 lg:w-[350px]">
                      <p className="font-semibold text-[18px] leading-[31px] text-[#333333] py-3">Upload thumbnail</p>
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
                <p className="font-semibold text-[18px] leading-[31px] text-[#333333] my-3">Course Curriculum</p>
                <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px]">
                  AttenSys allows you to structure your course with multiple
                  videos under one course. Each section can include several
                  videos, helping you break down complex topics into easily
                  digestible lessons. This makes it simple for students to
                  follow along, step by step, as they progress through your
                  course.
                </p>
                <div className="my-12">
                  <p className="font-semibold text-[18px] leading-[31px] text-[#333333] my-3">Tips</p>
                  <ul className="list-disc text-[14px] text-[#2D3A4B] leading-[21px] w-[800px] ml-4">
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

              <div className="my-12">
                <Button className="rounded-xl bg-[#9b51e052] px-12 py-4  text-[#2d3a4b]">
                  + Add New Lecture
                </Button>

                <div className="my-4 bg-[#9b51e01a] p-12 border rounded-xl">
                  <div className="flex bg-white p-5 rounded-xl my-3">
                    <p className="font-medium mr-3 text-[16px]">Lecture 3:</p>
                    <div className="w-[90%]">
                      <input
                        placeholder="Class Title e.g UI/UX Basics"
                        className={`w-full ${titleError ? 'border-red-500 border-2' : ''}`}
                        value={lectureTitle}
                        onChange={(e) => {
                          setLectureTitle(e.target.value)
                          setTitleError('')
                        }}
                      />
                      {titleError && (
                        <p className="text-red-500 text-sm mt-1">{titleError}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex bg-white p-5 rounded-xl my-3">
                    <p className="font-medium mr-3 text-[16px]">Description:</p>
                    <div className="w-[100%]">
                      <textarea
                        className={`w-full ${descriptionError ? 'border-red-500 border-2' : ''}`}
                        placeholder="Class description (optional)"
                        value={lectureDescription}
                        onChange={(e) => {
                          setLectureDescription(e.target.value)
                          setDescriptionError('')
                        }}
                      ></textarea>
                      {descriptionError && (
                        <p className="text-red-500 text-sm mt-1">{descriptionError}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl my-3 text-center content-center w-[100%] flex flex-col justify-center">
                    <div className="w-[15%] mx-auto flex justify-center">
                      <Image src={upload_other} alt="uplaod" />
                    </div>
                    <p className="text-[14px] font-normal text-[#353535] leading-[22px]">
                      <span className="text-[#A020F0]">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-[14px] font-normal text-[#353535] leading-[22px]">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  </div>
                </div>
              </div>

              <div className="my-12">
                <div className="my-4 bg-[#9b51e01a] p-12 border rounded-xl">
                  <div className="flex justify-between bg-white p-5 rounded-xl my-3">
                    <div className="flex items-center">
                      <p className="font-medium mr-3 text-[16px]">Lecture 3:</p>
                      <p className="text-[16px] font-normal text-[#353535] leading-[31px]">UI/UX Introductory Concepts</p>
                    </div>

                    <div className="bg-green">
                      <Image src={tick_circle} alt="tick" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white p-5 rounded-xl my-3">
                    <div className="flex items-center">
                      <p className="font-medium mr-3 text-[16px]">Description:</p>
                      <p className="text-[16px] font-normal text-[#353535] leading-[31px]">
                        {`Figma class - It's uses, function, extraction, export etc..`}
                        .
                      </p>
                    </div>

                    <div className="">
                      <Image src={tick_circle} alt="tick" />
                    </div>
                  </div>

                  <div className=" bg-white p-5 rounded-xl my-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-start space-x-4">
                        <div>
                          <Image src={film} alt="film" />
                        </div>

                        <div className="mx-3">
                          <p className="text-[16px] font-medium text-[#353535] leading-[20px]">Figma</p>
                          <p className="text-[11px] font-normal text-[#353535] leading-[20px]">200mb</p>
                        </div>
                      </div>

                      <div className="bg-red">
                        <Image src={trash} alt="trash" />
                      </div>
                    </div>
                    <div className="flex justify-between flex-1 items-center">
                      <div className="p-3 my-2 bg-green-500 w-[100%] rounded-xl  mr-3"></div>
                      <p>100%</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 mb-24">
                  <button
                    className="rounded-xl bg-[#4A90E2] px-48 py-3 text-white"
                    type="submit"
                  >
                    Almost there
                  </button>
                </div>

                <div className="mt-6 mb-24">
                  <button className="block sm:hidden bg-[#c5d322]  text-xs px-12 py-3 rounded text-black">
                    Save progress
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFormView3