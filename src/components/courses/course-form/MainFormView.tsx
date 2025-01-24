import React, { useState } from "react"
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack"
import Dropdown from "../Dropdown"
import { skills, levelOptions } from "@/constants/data"
import CourseSideBar from "./SideBar"
// import { handleCreateCourse } from "@/utils/helpers"
import { useRouter } from "next/navigation"

const MainFormView = () => {
  const router = useRouter()

  const [errors, setErrors] = useState({
    courseName: "",
    courseDescription: "",
    category: "",
    level: "",
  })

  const [formValues, setFormValues] = useState({
    courseName: "",
    courseDescription: "",
    category: "",
    level: "",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let newErrors = { ...errors }

    if (!formValues.courseName) {
      newErrors.courseName = "Course Name is required"
    } else {
      newErrors.courseName = ""
    }

    if (!formValues.courseDescription) {
      newErrors.courseDescription = "Course Description is required"
    } else {
      newErrors.courseDescription = ""
    }

    setErrors(newErrors)
  }

  return (
    <div className="block sm:flex">
      <div className="hidden sm:block">
        <CourseSideBar />
      </div>

      <div className="mb-10 flex-1">
        <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-xs sm:text-sm text-white text-center py-2">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
        </div>

        <div>
          <div className="block sm:flex justify-between py-2 my-5 border-t border-b border-[#d1d1d1] px-5 items-center">
            <div className="flex items-center">
              <div className="px-4 sm:px-8 border-r border-blue-100">
                <IoMdArrowBack
                  onClick={() => history.back()}
                  className="cursor-pointer text-[#4A90E2]"
                />
              </div>
              <p className="text-[#4A90E2] text-xl font-bold">
                Course Setup (Basic info)
              </p>
            </div>

            <button className="hidden sm:block bg-[#c5d322] px-7 py-3 rounded text-black">
              Save progress
            </button>
          </div>

          <div className="mx-6 sm:ml-24 mt-12">
            <form onSubmit={handleSubmit}>
              <div className="my-12">
                <label
                  htmlFor="courseName"
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course Name
                </label>
                <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px]">
                  {` If you are unsure of the perfect title now, don't worry—you can always update it later.`}
                </p>
                <div className="flex items-center my-4 space-x-4">
                  <input
                    type="input"
                    name="courseName"
                    value={formValues.courseName}
                    onChange={handleInputChange}
                    className="w-[100%] h-[55px] sm:w-[80%] px-6 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400"
                    placeholder="Course name e.g DApp development, Design basics..."
                  />
                </div>
                {errors.courseName && (
                  <p className="text-red-500 text-xs">{errors.courseName}</p>
                )}
              </div>

              <div className="my-12">
                <label
                  htmlFor="courseDescription"
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course Description
                </label>
                <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px]">
                  Let your students know a little bit about your course
                </p>
                <div className="flex items-start my-4 space-x-4">
                  <textarea
                    id="courseDescription"
                    name="courseDescription"
                    value={formValues.courseDescription}
                    onChange={handleInputChange}
                    className="block px-2.5 pb-64 py-3 w-[100%] sm:w-[80%] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="a little bit about your course......"
                  ></textarea>
                </div>
                {errors.courseDescription && (
                  <p className="text-red-500 text-xs">
                    {errors.courseDescription}
                  </p>
                )}
              </div>

              <div className="my-12">
                <label
                  htmlFor="category"
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course category
                </label>
                <div className="my-4 flex items-start w-[556px] h-[55px]">
                  <Dropdown options={skills} />
                </div>
              </div>

              <div className="my-12">
                <label
                  htmlFor="level"
                  className="font-medium text-[18px] leading-[31px] text-[#333333]"
                >
                  Select the difficulty level (Beginner, Intermediate, Advanced,
                  All levels)
                </label>
                <div className="my-4 flex items-start w-[556px] h-[55px]">
                  <Dropdown options={levelOptions} />
                </div>
              </div>

              <div className="mt-12 mb-24">
                <button
                  className="bg-[#4A90E2] px-48 rounded-xl py-3 text-white"
                  type="submit"
                >
                  Next
                </button>
              </div>

              <div className="mt-6 mb-24">
                <button className="block sm:hidden bg-[#c5d322]  text-xs px-12 py-3 rounded text-black">
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

export default MainFormView
