import React, { useState } from "react"
import Previous from "./previous"

const CourseForm3 = () => {
  const [selected, setSelected] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate form
    if (!selected) {
      setError("Please select one option")
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      // You can replace this with your actual API endpoint
      const response = await fetch("/api/course/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coursePlanType: selected,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      const data = await response.json()

      // Handle successful submission
      // You can replace this with your desired navigation logic
      window.location.href = "/course/next-step"
    } catch (err) {
      setError("Failed to submit form. Please try again.")
      console.error("Form submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelect = (value: string) => {
    setSelected(value)
    setError("")
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
              id="complete"
              name="coursePlan"
              value="complete"
              checked={selected === "complete"}
              onChange={(e) => handleSelect(e.target.value)}
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
              id="rough"
              name="coursePlan"
              value="rough"
              checked={selected === "rough"}
              onChange={(e) => handleSelect(e.target.value)}
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
              id="ideas"
              name="coursePlan"
              value="ideas"
              checked={selected === "ideas"}
              onChange={(e) => handleSelect(e.target.value)}
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
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="help"
              name="coursePlan"
              value="help"
              checked={selected === "help"}
              onChange={(e) => handleSelect(e.target.value)}
            />
            <label className="block my-2 md:my-3 ml-3  text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]">
              I need help organizing the course
            </label>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="text-center">
          <button
            className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] w-full max-w-[350px] rounded-xl  py-3 text-xs md:text-base mt-12 mb-44 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Setting up..." : "Setup my course"}
          </button>
        </div>
      </form>

      <div className="block absolute left-[35%] bottom-36 sm:hidden">
        <Previous />
      </div>
    </div>
  )
}

export default CourseForm3
