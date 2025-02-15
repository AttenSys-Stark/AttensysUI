import React, { useState } from "react";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";
import Dropdown from "../Dropdown";
import { skills, levelOptions } from "@/constants/data";
import CourseSideBar from "./SideBar";
import { handleCreateCourse } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import Stepper from "@/components/Stepper";

const MainFormView = () => {
  const router = useRouter();
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseNameError, setCourseNameError] = useState("");
  const [courseDescriptionError, setCourseDescriptionError] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [skillError, setSkillError] = useState("");
  const [levelError, setLevelError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCourseNameError("");
    setCourseDescriptionError("");
    setSkillError("");
    setLevelError("");

    let hasError = false;

    if (!courseName.trim()) {
      setCourseNameError("Course Name is required.");
      hasError = true;
    }

    if (!courseDescription.trim()) {
      setCourseDescriptionError("Course Description is required.");
      hasError = true;
    }

    if (!selectedSkill) {
      setSkillError("Please select a course category.");
      hasError = true;
    }

    if (!selectedLevel) {
      setLevelError("Please select a level.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    handleCreateCourse(e, "courseSetup2", router);
  };

  return (
    <div className="block sm:flex">
      <div className="hidden lg:block">
        <CourseSideBar />
      </div>

      <div className="mb-10 flex-1">
        <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-xs sm:text-sm text-white text-center py-2">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
        </div>
        <div className="lg:hidden w-full flex justify-center mt-[58px] mb-[79px]">
          <Stepper currentStep={1} />
        </div>
        <div>
          <div className="block sm:flex justify-between py-2 my-5 border-t border-b border-[#d1d1d1] px-5 items-center">
            <div className="flex items-center">
              <div className="px-4 sm:px-8 border-r border-blue-100">
                <IoMdArrowBack
                  onClick={() => history.back()}
                  className="cursor-pointer text-[#4A90E2]"
                />
              </div>
              <p className="text-[#4A90E2] md:text-xl font-bold">
                Course Setup (Basic info)
              </p>
            </div>

            <button className="hidden sm:block bg-[#c5d322] px-7 py-3 rounded text-black">
              Save progress
            </button>
          </div>

          <div className="mx-6 sm:ml-24 mt-12">
            <form onSubmit={handleSubmit}>
              <div className="my-12">
                <label
                  htmlFor=""
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course Name
                </label>
                <p className="font-normal mt-1 text-xs/[145%] md:text-sm text-[#2D3A4B] md:leading-[21px]">
                  {` If you are unsure of the perfect title now, don't worry—you can
                always update it later.`}
                </p>
                <div className="flex items-center my-4 space-x-4">
                  <input
                    type="input"
                    className="w-[100%] h-[55px] sm:w-[80%] px-6 border border-gray-300 rounded-[6px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400"
                    placeholder="Course name e.g DApp development, Design basics..."
                    onChange={(e) => {
                      setCourseName(e.target.value);
                      setCourseNameError("");
                    }}
                  />
                  <input
                    type="checkbox"
                    className="appearance-none w-[23px] h-[23px] hidden md:block rounded-full border-[1px] border-[#C5D322] checked:bg-[#C5D322] checked:border-[#C5D322] required:border-red-500 checked:before:content-['✔'] checked:before:absolute checked:before:top-[3px] checked:before:left-[6px] checked:before:text-white checked:before:text-[10px] relative"
                  />
                </div>
                {courseNameError && (
                  <p className="text-red-500 text-xs mt-1">{courseNameError}</p>
                )}
              </div>

              <div className="my-12">
                <label
                  htmlFor=""
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course Description
                </label>
                <p className="font-normal mt-1 text-xs/[145%] md:text-sm text-[#2D3A4B] md:leading-[21px]">
                  Let your students know a little bit about your course
                </p>
                <div className="flex items-start my-4 space-x-4">
                  <textarea
                    id="message"
                    className="block px-2.5 pb-64 py-3 w-[100%] sm:w-[80%] text-sm text-gray-900 bg-gray-50 rounded-[6px] border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="a little bit about your course......"
                    onChange={(e) => {
                      setCourseDescription(e.target.value);
                      setCourseDescriptionError("");
                    }}
                  ></textarea>
                  <input
                    type="checkbox"
                    className="appearance-none w-[23px] h-[23px] hidden md:block rounded-full border-[1px] border-[#C5D322] checked:bg-[#C5D322] checked:border-[#C5D322] required:border-red-500 checked:before:content-['✔'] checked:before:absolute checked:before:top-[3px] checked:before:left-[6px] checked:before:text-white checked:before:text-[10px] relative"
                  />
                </div>
                {courseDescriptionError && (
                  <p className="text-red-500 text-xs mt-1">
                    {courseDescriptionError}
                  </p>
                )}
              </div>

              <div className="my-12">
                <label
                  htmlFor=""
                  className="font-semibold text-[18px] leading-[31px] text-[#333333]"
                >
                  Course category
                </label>
                <div className="my-4 flex items-start w-full max-w-[556px] h-[55px]">
                  <Dropdown
                    options={skills}
                    selectedOption={selectedSkill}
                    onSelect={(option: string) => {
                      setSelectedSkill(option);
                      setSkillError("");
                    }}
                    required
                    errorMessage={skillError}
                  />
                </div>
              </div>

              <div className="my-12 w-full">
                <label
                  htmlFor=""
                  className="font-medium text-[18px] leading-[31px] text-[#333333]"
                >
                  Select the difficulty level (Beginner, Intermediate, Advanced,
                  All levels)
                </label>
                <div className="my-4 flex items-start w-full max-w-[556px] h-[55px]">
                  <Dropdown
                    options={levelOptions}
                    selectedOption={selectedLevel}
                    onSelect={(option: string) => {
                      setSelectedLevel(option);
                      setLevelError("");
                    }}
                    required
                    errorMessage={levelError}
                  />
                </div>

                <div className="mt-12 mb-5 w-full">
                  <button
                    className="bg-[#4A90E2] px-48 rounded-lg py-[15px] text-white w-full max-w-[350px]"
                    type="submit"
                  >
                    Next
                  </button>
                </div>

                <div className="w-full flex justify-center pb-[74px]">
                  <button className="block sm:hidden bg-[#c5d322] text-sm px-12 py-[15px] rounded-lg text-black">
                    Save progress
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFormView;
