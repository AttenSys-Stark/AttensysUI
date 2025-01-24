import React, { useState } from "react"
import Previous from "./previous"

const CourseForm = (props: any) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheckboxChange = (id: string) => {
    setSelectedGoal(id)
    setError(null)
  }

  const handleSubmit = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()

    if (!selectedGoal) {
      setError("Please select a course goal")
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
      <form onSubmit={handleSubmit} action="create-a-course">
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
            <label
              htmlFor="goal1"
              className="block my-5 ml-3 text-[#333333] text-[18px] font-medium leading-[22px]"
            >
              Helping people build skills for their job
            </label>
          </div>

          <div className="flex">
            <input
              type="checkbox"
              id="goal2"
              checked={selectedGoal === "goal2"}
              onChange={() => handleCheckboxChange("goal2")}
            />
            <label
              htmlFor="goal2"
              className="block my-5 ml-3 text-[#333333] text-[18px] font-medium leading-[22px]"
            >
              Giving a certificate for completing the course
            </label>
          </div>

          <div className="flex">
            <input
              type="checkbox"
              id="goal3"
              checked={selectedGoal === "goal3"}
              onChange={() => handleCheckboxChange("goal3")}
            />
            <label
              htmlFor="goal3"
              className="block my-5 ml-3 text-[#333333] text-[18px] font-medium leading-[22px]"
            >
              Sharing knowledge about a hobby or interest
            </label>
          </div>

          <div className="flex">
            <input
              type="checkbox"
              id="goal4"
              checked={selectedGoal === "goal4"}
              onChange={() => handleCheckboxChange("goal4")}
            />
            <label
              htmlFor="goal4"
              className="block my-5 ml-3 text-[#333333] text-[18px] font-medium leading-[22px]"
            >
              Teaching new ideas or concepts in a field
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
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
