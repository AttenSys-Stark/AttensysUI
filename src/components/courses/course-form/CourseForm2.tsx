import React, { useState } from "react"
import Previous from "./previous"

const CourseForm2 = () => {
  const [selectedOption, setSelectedOption] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedOption) {
      setError("Please select an option")
      return
    }
    setError("")
    // Form submission logic here
  }

  const options = [
    "Beginners with no experience",
    "People with some basic knowledge",
    "Intermediate learners looking to grow",
    "Advanced learners or professionals",
  ]

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
      <form onSubmit={handleSubmit}>
        <div className="bg-white px-12 py-16 rounded-2xl flex flex-col justify-center w-[524px] mx-auto">
          {options.map((option, index) => (
            <div key={index} className="flex">
              <input
                type="checkbox"
                id={`option-${index}`}
                name="courseLevel"
                value={option}
                checked={selectedOption === option}
                onChange={(e) => {
                  setSelectedOption(e.target.value)
                  setError("")
                }}
                className="required:border-red-500"
              />
              <label
                htmlFor={`option-${index}`}
                className="block my-5 ml-3 text-[#333333] text-[18px] font-medium leading-[22px]"
              >
                {option}
              </label>
            </div>
          ))}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="text-center">
          <button className="w-[350px] rounded-xl bg-[#4A90E2] py-3 mt-12 mb-44 text-white">
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
