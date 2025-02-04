import React, { useState } from "react"
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack"
import Dropdown from "../Dropdown"
import CourseSideBar from "./SideBar"
import { handleCreateCourse } from "@/utils/helpers"
import { useRouter } from "next/navigation"

interface FormErrors {
  studentRequirements: string
  learningObjectives: string
  targetAudience: string
}

const MainFormView2 = () => {
  const router = useRouter()

  // State for form fields and errors
  const [studentRequirements, setStudentRequirements] = useState("")
  const [learningObjectives, setLearningObjectives] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [studentRequirementsList, setStudentRequirementsList] = useState<
    string[]
  >([])
  const [errors, setErrors] = useState<FormErrors>({
    studentRequirements: "",
    learningObjectives: "",
    targetAudience: "",
  })

  // Handle form submission
  // In MainFormView2.tsx, update the handleSubmit function:
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate fields
    const newErrors = {
      studentRequirements:
        !studentRequirements.trim() && studentRequirementsList.length === 0
          ? "Student requirements are required"
          : "",
      learningObjectives: !learningObjectives.trim()
        ? "Learning objectives are required"
        : "",
      targetAudience: !targetAudience.trim()
        ? "Target audience description is required"
        : "",
    }

    setErrors(newErrors)

    // Check if any errors exist
    const hasErrors = Object.values(newErrors).some((error) => error !== "")

    // Proceed only if no errors
    if (!hasErrors) {
      // Store form data in localStorage before navigation
      localStorage.setItem(
        "courseFormData",
        JSON.stringify({
          studentRequirements: studentRequirementsList,
          learningObjectives,
          targetAudience,
        }),
      )

      handleCreateCourse(
        e as unknown as React.MouseEvent<HTMLFormElement>,
        "courseSetup3".trim(), // Make sure to call trim() on the section
        router,
      )
    }
  }
  const handleGoBack = () => {
    window.history.back()
  }

  const handleStudentRequirementsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setStudentRequirements(e.target.value)
    setErrors((prev) => ({ ...prev, studentRequirements: "" }))
  }

  const handleLearningObjectivesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setLearningObjectives(e.target.value)
    setErrors((prev) => ({ ...prev, learningObjectives: "" }))
  }

  const handleTargetAudienceChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTargetAudience(e.target.value)
    setErrors((prev) => ({ ...prev, targetAudience: "" }))
  }

  const handleAddItem = () => {
    if (studentRequirements.trim()) {
      setStudentRequirementsList((prev) => [...prev, studentRequirements])
      setStudentRequirements("") // Reset input field after adding item
    }
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
                  onClick={handleGoBack}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-[#4A90E2] text-xl font-bold">
                Learning Outcomes
              </p>
            </div>

            <button
              type="button"
              className="hidden sm:block bg-[#c5d322] px-7 py-3 rounded text-black"
            >
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
                    id="studentRequirements"
                    type="text"
                    value={studentRequirements}
                    onChange={handleStudentRequirementsChange}
                    className={`w-[50%] sm:w-[70%] h-[55px] py-2 px-6 border ${
                      errors.studentRequirements
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400`}
                    placeholder="e.g A laptop."
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="rounded-xl py-2 px-4 h-[55px] font-normal text-[18px] w-[155px] text-[#2D3A4B] leading-[21px] border-2 p-1 ml-5 text-xs sm:text-base bg-white"
                  >
                    <span>+</span> Add Item
                  </button>
                </div>
                {errors.studentRequirements && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.studentRequirements}
                  </p>
                )}
                <ul className="mt-2">
                  {studentRequirementsList.map((item, index) => (
                    <li key={index} className="text-sm text-[#333333]">
                      {item}
                    </li>
                  ))}
                </ul>
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
                    value={learningObjectives}
                    onChange={handleLearningObjectivesChange}
                    className={`block px-6 pb-64 py-3 w-[80%] text-sm text-gray-900 ${
                      errors.learningObjectives
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-gray-50 rounded-lg border focus:ring-blue-500 focus:border-blue-500`}
                    placeholder={`E.g When this course is done, students will:

Understand fundamental concepts in [Subject/Field]
Create and implement strategies for [Specific Outcome]`}
                  />
                </div>
                {errors.learningObjectives && (
                  <p className="text-red-500 text-sm mt-1">
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
                    value={targetAudience}
                    onChange={handleTargetAudienceChange}
                    className={`block px-6 pb-64 py-3 w-[80%] text-sm text-gray-900 ${
                      errors.targetAudience
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-gray-50 rounded-lg border focus:ring-blue-500 focus:border-blue-500`}
                    placeholder={`Example:
This course is ideal for:
Beginners with no prior experience in [Subject/Field].
Professionals looking to enhance their skills in [Specific Area].`}
                  />
                </div>
                {errors.targetAudience && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.targetAudience}
                  </p>
                )}
              </div>

              <div className="my-12">
                <div className="mt-12">
                  <button
                    type="submit"
                    className="bg-[#4A90E2] px-28 sm:px-48 py-3 rounded-xl text-white"
                  >
                    Next
                  </button>
                </div>

                <div className="mt-6 mb-24">
                  <button
                    type="button"
                    className="block sm:hidden bg-[#c5d322] text-xs px-12 py-3 rounded text-black"
                  >
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
