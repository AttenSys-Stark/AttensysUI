import React from "react";
import Previous from "./previous";

const CourseForm = (props: any) => {
  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <div className="relative mx-10 md:mx-auto w-auto md:w-3/4 lg:w-5/12 pt-16 ">
      <div className="hidden lg:block">
        <Previous />
      </div>
      <div className="flex items-center w-full justify-center">
        <h1 className="mb-12 font-semibold text-[17px] md:text-[26px] text-[#333333] text-center w-[266px] md:w-full">
          What is the primary goal of your course?
        </h1>
      </div>
      <form action="create-a-course">
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
            />
            <label className="block my-2 md:my-3 ml-3 text-[#333333] text-xs md:text-[18px] font-medium leading-[22px]">
              Helping people build skills for their job
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
            <label className="block my-2 md:my-3 ml-3 text-[#333333] text-xs md:text-[18px] font-medium leading-[22px]">
              Giving a certificate for completing the course
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
            <label className="block my-2 md:my-3 ml-3 text-[#333333] text-xs md:text-[18px] font-medium leading-[22px]">
              Sharing knowledge about a hobby or interest
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
            <label className="block my-2 md:my-3 ml-3 text-[#333333] text-xs md:text-[18px] font-medium leading-[22px]">
              Teaching new ideas or concepts in a field
            </label>
          </div>
        </div>

        <div className="text-center w-full">
          <button
            onSubmit={handleNext}
            className="bg-[#4A90E2] w-full max-w-[350px] rounded-xl  py-3 mt-12 mb-44 text-white"
            type="submit"
          >
            Next
          </button>
        </div>
      </form>

      <div className="block absolute left-[35%] bottom-36 lg:hidden">
        <Previous />
      </div>
    </div>
  );
};

export default CourseForm;
