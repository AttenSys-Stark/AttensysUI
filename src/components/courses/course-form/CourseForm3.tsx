import { useState } from "react"
import Previous from "./previous"

const CourseForm3 = (props: any) => {
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
    <div className="relative mx-10 md:mx-auto w-auto md:w-3/4 lg:w-5/12 pt-16">
      <div className="hidden lg:block">
        <Previous />
      </div>
      <div className="flex items-center w-full justify-center">
        <h1 className="mb-12 font-semibold text-[17px] md:text-[26px] text-[#333333] text-center w-[266px] md:w-full">
          Do you already have a plan for what your course will cover?
        </h1>
      </div>
      <form action="CourseSetup">
        <div className=" bg-white px-5 md:px-12 py-9 md:py-16 rounded-2xl flex flex-col gap-5 md:gap-6 justify-center w-full max-w-[524px] mx-auto">
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
            <label className="block my-2 md:my-3 ml-3  text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]">
              Yes, I have a complete course plan
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
            <label className="block my-2 md:my-3 ml-3  text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]">
              I have a rough plan, but it needs work
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
            <label className="block my-2 md:my-3 ml-3  text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]">
              I have some ideas but no clear plan yet
            </label>
          </div>

          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required border-red-500 indeterminate:bg-gray-300"
              id="vehicle4"
              name="vehicle4"
              value="Bike"
              checked={selectedGoal === "vehicle4"}
              onChange={() => handleCheckboxChange("vehicle4")}
            />
            <label className="block my-2 md:my-3 ml-3  text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]">
              I need help organizing the course
            </label>
          </div>
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
        </div>

        <div className="text-center">
          <button className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] w-full max-w-[350px] rounded-xl  py-3 text-xs md:text-base mt-12 mb-44 text-white">
            Setup my course
          </button>
        </div>
      </form>

      <div className="block absolute left-[35%] bottom-36 lg:hidden">
        <Previous />
      </div>
    </div>
  )
}

export default CourseForm3
