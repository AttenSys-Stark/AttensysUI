import React from "react";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";

const Coursepricing = () => {
  return (
    <div>
      <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
        <p className="text-sm text-white text-center py-2">
          Your course creation progress saves automatically, but feel free to
          also save your progress manually
        </p>
      </div>

      <div className="min-w-full w-[100%] ">
        <div className="flex justify-between py-2 my-5 border-t border-b border-[#d1d1d1] px-5 items-center">
          <div className="flex items-center">
            <div className="px-8 border-r border-blue-100">
              <IoMdArrowBack />
            </div>
            <p className="text-[#4A90E2] text-xl font-bold">
              Course Setup (Basic info)
            </p>
          </div>

          <button className="bg-[#C5D322] px-7 py-3 rounded text-white">
            Save progress
          </button>
          {/* background: #C5D322; */}
        </div>

        <div className="ml-24 mt-12">
          <form action="">
            <div className="my-12">
              <label htmlFor="" className="font-bold">
                Course Name
              </label>
              <p className="text-sm">
                {`If you are unsure of the perfect title now, don't worry—you can
                always update it later.`}
              </p>
              <div className="flex items-start my-4">
                <input
                  type="input"
                  className="w-[80%]  clg:w-[70%] lclg:w-[90%] p-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400"
                  placeholder="Course name e.g DApp development, Design basics..."
                />
                <input type="checkbox" className="ml-5" />
              </div>
            </div>

            <div className="my-12">
              <label htmlFor="" className="font-bold">
                Course Description
              </label>
              <p>Let your students know a little bit about your course</p>
              <div className="flex items-start my-4">
                <textarea
                  id="message"
                  className="block p-2.5 w-3/5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="a little bit about your course......"
                ></textarea>
                <input type="checkbox" className="ml-5" />
              </div>
            </div>

            <div className="my-12">
              <label htmlFor="" className="font-bold">
                Course category
              </label>
              <div className="my-4 flex items-start">
                <input type="checkbox" className="flex-1" />
              </div>
            </div>

            <div className="my-12">
              <label htmlFor="">
                Select the difficulty level (Beginner, Intermediate, Advanced,
                All levels)
              </label>
              <div className="my-4 flex items-start">
                <input type="checkbox" className="flex-1" />
              </div>

              <div className="mt-12 mb-24">
                <button
                  className="rounded bg-[#4A90E2] px-24py-3 text-white"
                  type="submit"
                >
                  Next
                </button>
              </div>
              {/* <div className="mt-12 mb-24">hel</div> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Coursepricing;
