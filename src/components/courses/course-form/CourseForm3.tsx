import React from "react"
import Previous from "./previous"

const CourseForm3 = () => {
  return (
    <div className="relative mx-10 md:mx-auto w-auto md:w-5/12 pt-16">
      <div className="hidden sm:block">
        <Previous />
      </div>
      <div>
        <h1 className="mb-12 font-bold text-[26px] text-[#333333] text-center">
          Do you already have a plan for what your course will cover?
        </h1>
      </div>
      <form action="CourseSetup">
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
            />
            <label className="block my-5 ml-3  text-[#333333] text-[18px] font-medium leading-[22px]">
              Yes, I have a complete course plan
            </label>
          </div>
          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="vehicle1"
              name="vehicle1"
              value="Bike"
            />
            <label className="block my-5 ml-3  text-[#333333] text-[18px] font-medium leading-[22px]">
              I have a rough plan, but it needs work
            </label>
          </div>
          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="vehicle1"
              name="vehicle1"
              value="Bike"
            />
            <label className="block my-5 ml-3  text-[#333333] text-[18px] font-medium leading-[22px]">
              I have some ideas but no clear plan yet
            </label>
          </div>

          <div className="flex">
            <input
              type="checkbox"
              min="2"
              max="5"
              className="required:border-red-500 indeterminate:bg-gray-300"
              id="vehicle1"
              name="vehicle1"
              value="Bike"
            />
            <label className="block my-5 ml-3  text-[#333333] text-[18px] font-medium leading-[22px]">
              I need help organizing the course
            </label>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] w-[350px] rounded-xl  py-3 text-xs md:text-base mt-12 mb-44 text-white">
            Setup my course
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
