import React, { useState } from "react";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";
import CourseSideBar from "./SideBar";
import { handleCreateCourse } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import Stepper from "@/components/Stepper";

interface ChildComponentProps {
  courseData: any;
  setCourseData: any;
  handleStudentReqChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLearningObjChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  handleTADescriptionChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
}

const MainFormView2: React.FC<ChildComponentProps> = ({
  courseData,
  setCourseData,
  handleStudentReqChange,
  handleLearningObjChange,
  handleTADescriptionChange,
}) => {
  const router = useRouter();
  const [requirements, setRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState("");
  const [learningObjectives, setLearningObjectives] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [requirementsError, setRequirementsError] = useState("");
  const [learningObjectivesError, setLearningObjectivesError] = useState("");
  const [targetAudienceError, setTargetAudienceError] = useState("");

  const handleAddRequirement = (e: React.MouseEvent) => {
    e.preventDefault();
    // Trim input and check if it's not empty
    const newRequirement = requirementInput.trim();
    if (newRequirement === "") {
      setRequirementsError("Requirement cannot be empty");
      return;
    }

    // Split current value into items and remove duplicates
    const currentItems = courseData.studentRequirements
      .split(",")
      .map((item: any) => item.trim())
      .filter((item: any) => item); // Remove empty items

    // Add new item if it doesn't already exist
    if (!currentItems.includes(newRequirement)) {
      currentItems.push(newRequirement);
    }

    // Update state with the updated list
    setCourseData({
      ...courseData,
      studentRequirements: currentItems.join(", "),
    });

    // Clear input field and error
    setRequirementInput("");
    setRequirementsError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setRequirementsError("");
    setLearningObjectivesError("");
    setTargetAudienceError("");

    let hasError = false;

    // Validate requirements
    if (courseData.studentRequirements.length === 0) {
      setRequirementsError("At least one student requirement is required");
      hasError = true;
    }

    // Validate learning objectives
    if (!courseData.learningObjectives.trim()) {
      setLearningObjectivesError("Learning objectives are required");
      hasError = true;
    }

    // Validate target audience
    if (!courseData.targetAudienceDesc.trim()) {
      setTargetAudienceError("Target audience description is required");
      hasError = true;
    }

    if (hasError) return;

    // Proceed to next step
    handleCreateCourse(e, "courseSetup3", router);
  };

  return (
    <div className="flex">
      <div className="hidden lg:block">
        <CourseSideBar courseData={courseData} />
      </div>

      <div className="flex-1 w-full">
        {/* <div className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
          <p className="text-sm text-white text-center py-2">
            Your course creation progress saves automatically, but feel free to
            also save your progress manually
          </p>
        </div> */}

        <div className="lg:hidden w-full flex justify-center mt-[58px] mb-[79px]">
          <Stepper currentStep={2} />
        </div>
        <div className="">
          <div className="block sm:flex justify-between py-2 my-5 border-t border-b border-[#d1d1d1] px-5 items-center">
            <div className="flex items-center">
              <div className="px-4 sm:px-8 border-r border-blue-100">
                <IoMdArrowBack
                  onClick={() => history.back()}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-[#4A90E2] text-xl font-bold">
                Learning Outcomes
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
                  Student requirements
                </label>
                <p className="font-normal text-xs md:text-[14px] mt-2 text-[#2D3A4B] leading-[21px]">
                  {` What will users taking this course need to get the best out of it.`}
                </p>
                <div className="flex items-stretch justify-between w-full md:w-[80%] flex-row space-x-2 my-4">
                  <input
                    type="input"
                    className="w-full h-[55px] py-2 px-6 border border-gray-300 rounded md:rounded-[6px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400"
                    placeholder="e.g A laptop."
                    value={courseData.studentRequirements}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleStudentReqChange(e);
                      setRequirementsError("");
                    }}
                  />
                </div>
                {requirementsError && (
                  <p className="text-red-500 text-xs mt-1">
                    {requirementsError}
                  </p>
                )}
                <div className="mt-2">
                  {requirements.map((req, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded mb-2">
                      {req}
                    </div>
                  ))}
                </div>
              </div>

              <div className="my-12">
                <label className="font-semibold text-[18px] leading-[31px] text-[#333333]">
                  Learning Objectives
                </label>
                <p className="font-normal mt-2 text-xs md:text-[14px] text-[#2D3A4B] leading-[21px]">
                  please outline the key skills and knowledge that students will
                  gain by completing your course.
                </p>
                <div className="flex items-start my-4">
                  <div className="w-full md:w-[80%]">
                    <textarea
                      id="message"
                      className="block px-6 pb-64 py-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
                      placeholder={`E.g When this course is done, students will :`}
                      value={courseData.learningObjectives}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        handleLearningObjChange(e);
                        setLearningObjectives(e.target.value);
                        setLearningObjectivesError("");
                      }}
                      maxLength={1000}
                    ></textarea>
                    <div className="mt-2 text-right">
                      <span
                        className={`text-xs ${
                          courseData.learningObjectives.length >= 900
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {1000 - courseData.learningObjectives.length} characters
                        remaining
                      </span>
                    </div>
                  </div>
                </div>
                {learningObjectivesError && (
                  <p className="text-red-500 text-xs mt-1">
                    {learningObjectivesError}
                  </p>
                )}
              </div>

              <div className="my-12">
                <label className="font-semibold text-[18px] leading-[31px] text-[#333333]">
                  Target Audience
                </label>
                <p className="font-normal text-xs md:text-[14px] mt-2 text-[#2D3A4B] leading-[21px]">
                  In this section, describe who your course is intended for.
                </p>
                <div className="flex items-start my-4">
                  <div className="w-full md:w-[80%]">
                    <textarea
                      id="message"
                      className="block px-6 pb-64 py-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
                      placeholder={`Example:`}
                      value={courseData.targetAudienceDesc}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        handleTADescriptionChange(e);
                        setTargetAudience(e.target.value);
                        setTargetAudienceError("");
                      }}
                      maxLength={1000}
                    ></textarea>
                    <div className="mt-2 text-right">
                      <span
                        className={`text-xs ${
                          courseData.targetAudienceDesc.length >= 900
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {1000 - courseData.targetAudienceDesc.length} characters
                        remaining
                      </span>
                    </div>
                  </div>
                </div>
                {targetAudienceError && (
                  <p className="text-red-500 text-xs mt-1">
                    {targetAudienceError}
                  </p>
                )}
              </div>

              <div className="my-12 w-full">
                <div className="mt-12 mb-5 w-full mx-auto flex justify-center md:justify-start">
                  <button
                    className="bg-[#4A90E2] rounded-lg py-[15px] text-white  sm:w-full w-[350px]"
                    type="submit"
                  >
                    Next
                  </button>
                </div>

                <div className="w-full mx-auto flex justify-center pb-[74px] px-4">
                  <button
                    type="button"
                    className="block sm:hidden bg-[#c5d322] text-sm px-12 py-[15px] w-full rounded-lg text-black"
                  >
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

export default MainFormView2;
