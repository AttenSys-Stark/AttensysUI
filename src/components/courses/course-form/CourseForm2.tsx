import React, { useState } from "react"
import Previous from "./previous"

const CourseForm2 = () => {
  const [selectedOption, setSelectedOption] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate form
    if (!selectedOption) {
      setError("Please select an option")
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      // Example API call - replace with your actual endpoint
      const response = await fetch("/api/course-audience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseAudience: selectedOption,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      // Handle successful submission
      // You can redirect to next page or handle success as needed
      window.location.href = "/create-a-course-2"
    } catch (err) {
      setError("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOptionChange = (value: string) => {
    setSelectedOption(value)
    setError("")
  }

  return (
    <div className="relative mx-10 md:mx-auto w-auto md:w-3/4 lg:w-5/12 pt-16">
      <div className="hidden lg:block">
        <Previous />
      </div>
      <div className="flex items-center w-full justify-center">
        <h1 className="mb-12 font-semibold text-[17px] md:text-[26px] text-[#333333] text-center w-[266px] md:w-full">
          Who is your course for, and what should they know before starting?
        </h1>
      </div>
      <form onSubmit={handleSubmit} action="create-a-course-2">
        <div className="bg-white px-5 md:px-12 py-9 md:py-16 rounded-2xl flex flex-col gap-5 md:gap-6 justify-center w-full max-w-[524px] mx-auto">
          <div className="flex flex-col">
            <div className="flex">
              <input
                type="radio"
                required
                className="required:border-red-500"
                id="beginners"
                name="courseAudience"
                value="beginners"
                checked={selectedOption === "beginners"}
                onChange={() => handleOptionChange("beginners")}
              />
              <label className="block my-2 md:my-3 ml-3 text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]">
                Beginners with no experience
              </label>
            </div>
            <div className="flex">
              <input
                type="radio"
                required
                className="required:border-red-500"
                id="basic-knowledge"
                name="courseAudience"
                value="basic-knowledge"
                checked={selectedOption === "basic-knowledge"}
                onChange={() => handleOptionChange("basic-knowledge")}
              />
              <label className="block my-2 md:my-3 ml-3 text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]">
                People with some basic knowledge
              </label>
            </div>
            <div className="flex">
              <input
                type="radio"
                required
                className="required:border-red-500"
                id="intermediate"
                name="courseAudience"
                value="intermediate"
                checked={selectedOption === "intermediate"}
                onChange={() => handleOptionChange("intermediate")}
              />
              <label className="block my-2 md:my-3 ml-3 text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]">
                Intermediate learners looking to grow
              </label>
            </div>
            <div className="flex">
              <input
                type="radio"
                required
                className="required:border-red-500"
                id="advanced"
                name="courseAudience"
                value="advanced"
                checked={selectedOption === "advanced"}
                onChange={() => handleOptionChange("advanced")}
              />
              <label className="block my-2 md:my-3 ml-3 text-[#333333] text-xs md:text-[18px] font-medium md:leading-[22px]">
                Advanced learners or professionals
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm -mt-2">{error}</p>}
        </div>

        <div className="text-center">
          <button
            className="w-full max-w-[350px] rounded-xl bg-[#4A90E2] py-3 mt-12 mb-44 text-white disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Next"}
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
