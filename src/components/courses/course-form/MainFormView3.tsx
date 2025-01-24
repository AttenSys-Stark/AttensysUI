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
  const [formData, setFormData] = useState({
    courseImage: "",
    courseTitle: "",
    courseDescription: "",
    lectureTitle: "",
    lectureDescription: "",
  })
  const [errors, setErrors] = useState({
    courseImage: "",
    courseTitle: "",
    courseDescription: "",
    lectureTitle: "",
    lectureDescription: "",
  })

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setErrors({
      ...errors,
      [e.target.name]: "",
    })
  }

  const validate = () => {
    let valid = true
    let newErrors = {
      courseImage: "",
      courseTitle: "",
      courseDescription: "",
      lectureTitle: "",
      lectureDescription: "",
    }

    if (!formData.courseImage) {
      newErrors.courseImage = "Course image is required"
      valid = false
    }
    if (!formData.courseTitle.trim()) {
      newErrors.courseTitle = "Course title is required"
      valid = false
    }
    if (!formData.courseDescription.trim()) {
      newErrors.courseDescription = "Course description is required"
      valid = false
    }
    if (!formData.lectureTitle.trim()) {
      newErrors.lectureTitle = "Lecture title is required"
      valid = false
    }
    if (!formData.lectureDescription.trim()) {
      newErrors.lectureDescription = "Lecture description is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate()) {
      const syntheticEvent = {
        preventDefault: () => {},
        target: e.target,
      } as React.MouseEvent<HTMLFormElement>
      handleCreateCourse(syntheticEvent, "courseSetup4", router)
    }
  }

  const handleBrowsefiles = () => {
    // Handle file upload logic
    console.log("click")
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

          <div className="mx-10 mt-12">
            <form onSubmit={handleSubmit}>
              <div className="my-12 w-full">
                <label
                  htmlFor="courseImage"
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course Image
                </label>
                <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px]">
                  This is the creative section of your course creation. Your
                  course landing page is crucial to your success on Attensys.
                  You want to make sure your creative is very catchy.
                </p>
                <div className="block sm:flex items-start my-4">
                  <div className="bg-[#DCDCDC] flex-1 p-4 sm:p-16 rounded-xl">
                    <div className="bg-white p-2 sm:p-14 text-center border-dotted rounded border-2 border-[#D0D5DD] content-center text-xs">
                      <div className="mx-auto w-[15%]">
                        <Image src={upload} alt="upload" />
                      </div>

                      <div className="my-3">
                        <p>
                          <span className="text-[#4A90E2]">
                            Click to upload
                          </span>
                          or drag and drop
                        </p>
                        <p>SVG, PNG, JPG or GIF (max. 800x400px)</p>
                      </div>

                      <div>
                        <p>OR</p>

                        <Button
                          className="rounded bg-[#9B51E0] px-12 py-3 text-white my-3"
                          onClick={handleBrowsefiles}
                        >
                          Browse Files
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                {errors.courseImage && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.courseImage}
                  </p>
                )}
              </div>

              <div className="my-12">
                <label
                  htmlFor="courseTitle"
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course Title
                </label>
                <input
                  type="text"
                  name="courseTitle"
                  value={formData.courseTitle}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-xl"
                  placeholder="Enter Course Title"
                  required
                />
                {errors.courseTitle && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.courseTitle}
                  </p>
                )}
              </div>

              <div className="my-12">
                <label
                  htmlFor="courseDescription"
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course Description
                </label>
                <textarea
                  name="courseDescription"
                  value={formData.courseDescription}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-xl"
                  placeholder="Enter Course Description"
                  required
                ></textarea>
                {errors.courseDescription && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.courseDescription}
                  </p>
                )}
              </div>

              <div className="my-12">
                <Button
                  className="rounded-xl bg-[#9b51e052] px-12 py-4 text-[#2d3a4b]"
                  type="submit"
                >
                  + Add New Lecture
                </Button>

                {/* Upload page */}
                <div className="my-4 bg-[#9b51e01a] p-12 border rounded-xl">
                  <div className="flex bg-white p-5 rounded-xl my-3">
                    <p className="font-medium mr-3 text-[16px]">Lecture 3:</p>
                    <input
                      name="lectureTitle"
                      value={formData.lectureTitle}
                      onChange={handleChange}
                      placeholder="Class Title e.g UI/UX Basics"
                      className="w-[90%]"
                      required
                    />
                  </div>
                  {errors.lectureTitle && (
                    <p className="text-red-500 text-sm mt-2 ml-16">
                      {errors.lectureTitle}
                    </p>
                  )}
                  <div className="flex bg-white p-5 rounded-xl my-3">
                    <p className="font-medium mr-3 text-[16px]">Description:</p>
                    <textarea
                      name="lectureDescription"
                      value={formData.lectureDescription}
                      onChange={handleChange}
                      className="w-[100%]"
                      placeholder="Class description"
                      required
                    ></textarea>
                  </div>
                  {errors.lectureDescription && (
                    <p className="text-red-500 text-sm mt-2 ml-16">
                      {errors.lectureDescription}
                    </p>
                  )}
                  <div className="bg-white p-5 rounded-xl my-3 text-center content-center w-[100%] flex flex-col justify-center">
                    <div className="w-[15%] mx-auto flex justify-center">
                      <Image src={upload_other} alt="uplaod" />
                    </div>
                    <p className="text-[14px] font-normal text-[#353535] leading-[22px]">
                      <span className="text-[#A020F0]">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-[14px] font-normal text-[#353535] leading-[22px]">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </p>
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
                <button className="block sm:hidden bg-[#c5d322] text-xs px-12 py-3 rounded text-black">
                  Save progress
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFormView3
