import React, { useState } from "react"
import Previous from "./previous"

const CourseForm = (props: any) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

  const handleCheckboxChange = (id: string) => {
    setSelectedGoal(id)
  }

  const handleNext = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedGoal) {
      alert("Please select a course goal")
      return
    }
    props.onSubmit?.(selectedGoal)
  }

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (!selectedGoal) {
      alert("Please select a course goal")
      return
    }
    props.onSubmit?.(selectedGoal)
  }

  return (
    <div className="relative mx-10 md:mx-auto w-auto md:w-5/12 pt-16 ">
      <div className="hidden sm:block">
        <Previous />
      </div>
      <div>
        <h1 className="mb-12 font-semibold text-[26px] text-[#333333] text-center">
          What is the primary goal of your course?
        </h1>
      </div>
      <form onSubmit={handleNext} action="create-a-course">
        <div className="bg-white px-12 py-16 rounded-2xl flex flex-col justify-center w-[524px] mx-auto">
          <div className="flex">
            <input
              type="checkbox"
              id="goal1"
              name="courseGoal"
              aria-label="Helping people build skills for their job"
              checked={selectedGoal === "goal1"}
              onChange={() => handleCheckboxChange("goal1")}
            />
            <label className="block my-5 ml-3 text-[#333333] text-[18px] font-medium leading-[22px]">
              Helping people build skills for their job
            </label>
          </div>

          <div className="flex">
            <input
              type="checkbox"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="goal2"
              checked={selectedGoal === "goal2"}
              onChange={() => handleCheckboxChange("goal2")}
            />
            <label className="block my-5 ml-3 text-[#333333] text-[18px] font-medium leading-[22px]">
              Giving a certificate for completing the course
            </label>
          </div>

          <div className="flex">
            <input
              type="checkbox"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="goal3"
              checked={selectedGoal === "goal3"}
              onChange={() => handleCheckboxChange("goal3")}
            />
            <label className="block my-5 ml-3 text-[#333333] text-[18px] font-medium leading-[22px]">
              Sharing knowledge about a hobby or interest
            </label>
          </div>

          <div className="flex">
            <input
              type="checkbox"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="goal4"
              checked={selectedGoal === "goal4"}
              onChange={() => handleCheckboxChange("goal4")}
            />
            <label className="block my-5 ml-3 text-[#333333] text-[18px] font-medium leading-[22px]">
              Teaching new ideas or concepts in a field
            </label>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleButtonClick}
            className="bg-[#4A90E2] w-[350px] rounded-xl py-3 mt-12 mb-44 text-white"
            type="submit"
          >
            Next
          </button>
        </div>
      </form>

      <div className="block absolute left-[35%] bottom-36 sm:hidden">
        <Previous />
      </div>
    </div>
  )
}

export default CourseForm
