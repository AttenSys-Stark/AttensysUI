import React, { useState } from "react"
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack"
import Dropdown from "../Dropdown"
import CourseSideBar from "./SideBar"
// import { handleCreateCourse } from "@/utils/helpers"
import { useRouter } from "next/navigation"

const MainFormView2 = () => {
  const router = useRouter()

  const [errors, setErrors] = useState({
    studentRequirements: "",
    learningObjectives: "",
    targetAudience: "",
  })

  const [formValues, setFormValues] = useState({
    studentRequirements: "",
    learningObjectives: "",
    targetAudience: "",
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

    if (!formValues.studentRequirements) {
      newErrors.studentRequirements = "Student Requirements is required"
    } else {
      newErrors.studentRequirements = ""
    }

    if (!formValues.learningObjectives) {
      newErrors.learningObjectives = "Learning Objectives is required"
    } else {
      newErrors.learningObjectives = ""
    }

    if (!formValues.targetAudience) {
      newErrors.targetAudience = "Target Audience is required"
    } else {
      newErrors.targetAudience = ""
    }

    setErrors(newErrors)
  }
  return (
    <div className="flex">
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

        <div className="">
          <div className="block sm:flex justify-between py-2 my-5 border-t border-b border-[#d1d1d1] px-5 items-center">
            <div className="flex items-center">
              <div className="px-4 sm:px-8 border-r border-blue-100">
                <IoMdArrowBack
                  onClick={() => history.back()}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-[#4A90E2] text-xl font-bold">
                Learning Outcomes
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
                  htmlFor="studentRequirements"
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Student requirements
                </label>
                <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px]">
                  What will users taking this course need to get the best out of
                  it.
                </p>
                <div className="flex items-start my-4">
                  <input
                    type="text"
                    name="studentRequirements"
                    value={formValues.studentRequirements}
                    onChange={handleInputChange}
                    className="w-[50%] sm:w-[70%] h-[55px] py-2 px-6 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400"
                    placeholder="e.g A laptop."
                    required
                  />
                </div>
                {errors.studentRequirements && (
                  <p className="text-red-500 text-xs">
                    {errors.studentRequirements}
                  </p>
                )}
              </div>

              <div className="my-12">
                <label
                  htmlFor="learningObjectives"
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Learning Objectives
                </label>
                <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px]">
                  Please outline the key skills and knowledge that students will
                  gain by completing your course.
                </p>
                <div className="flex items-start my-4">
                  <textarea
                    id="learningObjectives"
                    name="learningObjectives"
                    value={formValues.learningObjectives}
                    onChange={handleInputChange}
                    className="block px-6 pb-64 py-3 w-[80%] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="E.g When this course is done, students will gain skills in [Subject/Field]"
                    required
                  ></textarea>
                </div>
                {errors.learningObjectives && (
                  <p className="text-red-500 text-xs">
                    {errors.learningObjectives}
                  </p>
                )}
              </div>

              <div className="my-12">
                <label
                  htmlFor="targetAudience"
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Target Audience
                </label>
                <p className="font-normal text-[14px] text-[#2D3A4B] leading-[21px]">
                  In this section, describe who your course is intended for.
                </p>
                <div className="flex items-start my-4">
                  <textarea
                    id="targetAudience"
                    name="targetAudience"
                    value={formValues.targetAudience}
                    onChange={handleInputChange}
                    className="block px-6 pb-64 py-3 w-[80%] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="E.g This course is ideal for beginners or professionals looking to enhance skills."
                    required
                  ></textarea>
                </div>
                {errors.targetAudience && (
                  <p className="text-red-500 text-xs">
                    {errors.targetAudience}
                  </p>
                )}
              </div>

              <div className="my-12">
                <div className="mt-12">
                  <button
                    className="bg-[#4A90E2] px-28 sm:px-48 py-3 rounded-xl text-white"
                    type="submit"
                  >
                    Next
                  </button>
                </div>

                <div className="mt-6 mb-24">
                  <button className="block sm:hidden bg-[#c5d322] text-xs px-12 py-3 rounded text-black">
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

export default MainFormView2
