import React, { useState } from "react"
import Previous from "./previous"

const CourseForm2 = (props: any) => {
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
      setError("Please make a selection")
      return
    }

    props.onSubmit?.(selectedGoal)
  }

  return (
    <div className="relative mx-10 md:mx-auto w-auto md:w-5/12 pt-16">
      <div className="hidden sm:block">
        <Previous />
      </div>
      <div>
        <h1 className="mb-12 font-semibold text-[26px] text-[#333333] text-center">
          Who is your course for, and what should they know before starting?
        </h1>
      </div>
      <form onSubmit={handleSubmit} action="create-a-course-2">
        <div className=" bg-white px-12 py-16 rounded-2xl flex flex-col justify-center w-[524px] mx-auto">
          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="vehicle1"
              name="vehicle1"
              value="Bike"
              checked={selectedGoal === "vehicle1"}
              onChange={() => handleCheckboxChange("vehicle1")}
            />
            <label className="block my-5 ml-3  text-[#333333] text-[18px] font-medium leading-[22px]">
              Beginners with no experience
            </label>
          </div>
          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="vehicle2"
              name="vehicle2"
              value="Bike"
              checked={selectedGoal === "vehicle2"}
              onChange={() => handleCheckboxChange("vehicle2")}
            />
            <label className="block my-5 ml-3  text-[#333333] text-[18px] font-medium leading-[22px]">
              People with some basic knowledge
            </label>
          </div>
          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="vehicle3"
              name="vehicle3"
              value="Bike"
              checked={selectedGoal === "vehicle3"}
              onChange={() => handleCheckboxChange("vehicle3")}
            />
            <label className="block my-5 ml-3  text-[#333333] text-[18px] font-medium leading-[22px]">
              Intermediate learners looking to grow
            </label>
          </div>

          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="vehicle4"
              name="vehicle4"
              value="Bike"
              checked={selectedGoal === "vehicle4"}
              onChange={() => handleCheckboxChange("vehicle4")}
            />
            <label className="block my-5 ml-3  text-[#333333] text-[18px] font-medium leading-[22px]">
              Advanced learners or professionals
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className=" w-[350px] rounded-xl  bg-[#4A90E2] py-3 mt-12 mb-44 text-white"
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

export default CourseForm2
